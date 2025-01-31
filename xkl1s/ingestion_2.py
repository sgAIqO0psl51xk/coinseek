import asyncio
import os
import json
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any, Tuple
from apify_client import ApifyClient
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class UserInfo:
    screen_name: str
    follower_count: int
    notable_followers: List[str] = field(default_factory=list)
    ca_mention_count: int = 0
    ticker_mention_count: int = 0
    is_verified: bool = False


@dataclass
class TweetReply:
    user: UserInfo
    content: str


@dataclass
class ParentTweetInfo:
    user: UserInfo
    is_large_account: bool = False
    is_affiliated: bool = False


@dataclass
class TweetData:
    content: str
    user: UserInfo
    search_match_type: str
    replies: List[TweetReply] = field(default_factory=list)
    parent_tweet: Optional[ParentTweetInfo] = None
    metrics: Dict[str, Any] = field(default_factory=dict)


class ApifyTwitterAnalyzer:
    def __init__(
        self,
        contract_address: str,
        ticker: str,
        large_account_threshold: int = 10000,
        affiliated_mention_threshold: int = 5,
        max_history_tweets: int = 50,
    ) -> None:
        self.contract_address = contract_address.lower()
        self.ticker = ticker.lower()
        self.large_account_threshold = large_account_threshold
        self.affiliated_mention_threshold = affiliated_mention_threshold
        self.max_history_tweets = max_history_tweets
        self.client = ApifyClient(os.getenv("APIFY_KEY"))
        self.important_tweets_cache: Dict[str, TweetData] = {}
        self.processed_tweets: Dict[str, TweetData] = {}
        self.user_cache: Dict[str, UserInfo] = {}
        self.parent_cache: Dict[str, ParentTweetInfo] = {}

    def _create_user_info(self, user_data: Dict) -> UserInfo:
        cached_user = self.user_cache.get(user_data["id"])
        if cached_user:
            return cached_user

        user_info = UserInfo(
            screen_name=user_data["userName"],
            follower_count=user_data.get("followers", 0),
            notable_followers=["Verified"] if user_data.get("isVerified") else [],
            is_verified=user_data.get("isVerified", False),
            ca_mention_count=0,
            ticker_mention_count=0,
        )
        self.user_cache[user_data["id"]] = user_info
        return user_info

    def _analyze_text_mentions(self, text: str) -> Tuple[int, int]:
        text_lower = text.lower()
        return (text_lower.count(self.contract_address), text_lower.count(self.ticker))

    async def _process_parent_tweet(self, quote_data: Dict) -> ParentTweetInfo:
        if quote_data["id"] in self.parent_cache:
            return self.parent_cache[quote_data["id"]]

        parent_user = self._create_user_info(quote_data["author"])
        ca_mentions, ticker_mentions = self._analyze_text_mentions(quote_data["text"])

        parent_user.ca_mention_count = ca_mentions
        parent_user.ticker_mention_count = ticker_mentions

        parent_info = ParentTweetInfo(
            user=parent_user,
            is_large_account=parent_user.follower_count >= self.large_account_threshold,
            is_affiliated=(ca_mentions + ticker_mentions) >= self.affiliated_mention_threshold,
        )
        self.parent_cache[quote_data["id"]] = parent_info
        return parent_info

    async def _process_tweet(self, item: Dict) -> TweetData:
        tweet_id = item["id"]
        if tweet_id in self.processed_tweets:
            return self.processed_tweets[tweet_id]

        # Base user analysis
        user_info = self._create_user_info(item["author"])
        ca_mentions, ticker_mentions = self._analyze_text_mentions(item["text"])
        user_info.ca_mention_count = ca_mentions
        user_info.ticker_mention_count = ticker_mentions

        # Parent tweet analysis
        parent_info = None
        if item.get("quote"):
            parent_info = await self._process_parent_tweet(item["quote"])

        # Simulate reply analysis (Apify doesn't provide nested replies)
        replies = []
        if item.get("replyCount", 0) > 0:
            replies = [
                TweetReply(
                    user=self._create_user_info(item["author"]),
                    content=f"Simulated reply to {item['id']}",
                )
            ][
                :5
            ]  # Mock limited replies

        tweet_data = TweetData(
            content=item["text"],
            user=user_info,
            search_match_type=self._determine_search_match_type(item["text"]),
            replies=replies,
            parent_tweet=parent_info,
            metrics={
                "reply_count": item.get("replyCount", 0),
                "retweet_count": item.get("retweetCount", 0),
                "like_count": item.get("likeCount", 0),
                "quote_count": item.get("quoteCount", 0),
                "has_large_parent": parent_info.is_large_account if parent_info else False,
                "has_affiliated_parent": parent_info.is_affiliated if parent_info else False,
            },
        )

        # Cache important tweets
        if (
            tweet_data.metrics["reply_count"] > 5
            or user_info.follower_count >= self.large_account_threshold
            or (parent_info and parent_info.is_large_account)
        ):
            self.important_tweets_cache[item["id"]] = tweet_data

        self.processed_tweets[tweet_id] = tweet_data
        return tweet_data

    def _determine_search_match_type(self, text: str) -> str:
        text_lower = text.lower()
        has_ca = self.contract_address in text_lower
        has_ticker = self.ticker in text_lower
        return "BOTH" if has_ca and has_ticker else "CA" if has_ca else "TICKER"

    async def analyze_tweets(self, num_tweets: int = 15) -> List[TweetData]:
        run_input = {"searchTerms": [self.contract_address, self.ticker], "maxItems": num_tweets * 2, "sort": "Latest", "tweetLanguage": "en"}

        run = self.client.actor("apidojo/tweet-scraper").call(run_input=run_input)
        if run is None:
            return []
        dataset = self.client.dataset(run["defaultDatasetId"])

        processed_tweets: List[TweetData] = []
        for item in dataset.iterate_items():
            if len(processed_tweets) >= num_tweets:
                break
            processed = await self._process_tweet(item)
            processed_tweets.append(processed)

        return processed_tweets

    def save_analysis(self, filename: str = "twitter_analysis.json") -> None:
        output = {
            "tweets": [self._tweet_to_dict(t) for t in self.processed_tweets.values()],
            "important_tweets": {k: self._tweet_to_dict(v) for k, v in self.important_tweets_cache.items()},
        }
        with open(filename, "w") as f:
            json.dump(output, f, indent=2)

    def _tweet_to_dict(self, tweet: TweetData) -> Dict:
        return {
            "content": tweet.content,
            "user": {
                "screen_name": tweet.user.screen_name,
                "followers": tweet.user.follower_count,
                "verified": tweet.user.is_verified,
                "ca_mentions": tweet.user.ca_mention_count,
                "ticker_mentions": tweet.user.ticker_mention_count,
            },
            "metrics": tweet.metrics,
            "parent_tweet": (
                {
                    "screen_name": tweet.parent_tweet.user.screen_name,
                    "followers": tweet.parent_tweet.user.follower_count,
                    "is_affiliated": tweet.parent_tweet.is_affiliated,
                }
                if tweet.parent_tweet
                else None
            ),
        }


async def main():
    analyzer = ApifyTwitterAnalyzer(
        contract_address="0x6982508145454ce325ddbe47a25d4ec3d2311933",
        ticker="$pepe",
        large_account_threshold=10000,
        affiliated_mention_threshold=5,
    )

    print("Starting analysis...")

    print("\nTop 5 Important Tweets:")
    for tweet_id, tweet in list(analyzer.important_tweets_cache.items())[:5]:
        print(f"\nTweet ID: {tweet_id}")
        print(f"Content: {tweet.content[:80]}...")
        print(f"Author: @{tweet.user.screen_name} ({tweet.user.follower_count} followers)")
        print(f"Replies: {tweet.metrics['reply_count']}")

    analyzer.save_analysis()
    print("\nAnalysis saved to twitter_analysis_1.json")


if __name__ == "__main__":
    asyncio.run(main())
