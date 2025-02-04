import asyncio
import datetime
import os
import json
from dataclasses import dataclass, field
import random
from typing import List, Dict, Optional, Any, Tuple
from apify_client import ApifyClientAsync
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
    id: str  # Added tweet ID field
    content: str
    user: UserInfo
    search_match_type: str
    replies: List[TweetReply] = field(default_factory=list)
    parent_tweet: Optional[ParentTweetInfo] = None
    metrics: Dict[str, Any] = field(default_factory=dict)


class ApifyTwitterAnalyzer:
    api_key_last_used: Dict[str, datetime.datetime] = {}
    lock = asyncio.Lock()
    MIN_DELAY = datetime.timedelta(seconds=5)

    @staticmethod
    async def get_next_api_key():
        while True:
            async with ApifyTwitterAnalyzer.lock:
                current_time = datetime.datetime.now()
                keys = os.getenv("APIFY_KEY", "").split(",")
                random.shuffle(keys)
                for key in keys:
                    if (
                        key not in ApifyTwitterAnalyzer.api_key_last_used
                        or current_time - ApifyTwitterAnalyzer.api_key_last_used[key] >= ApifyTwitterAnalyzer.MIN_DELAY
                    ):
                        ApifyTwitterAnalyzer.api_key_last_used[key] = current_time
                        return key
            await asyncio.sleep(0.1)

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
        self.important_tweets_cache: Dict[str, TweetData] = {}
        self.processed_tweets: Dict[str, TweetData] = {}
        self.user_cache: Dict[str, UserInfo] = {}
        self.parent_cache: Dict[str, ParentTweetInfo] = {}

    def _translate_item(self, item: Dict) -> Dict:
        """Convert kaitoeasyapi scraper fields to our expected format"""
        translated = {
            "id": item["id"],
            "author": {
                "id": item["author"]["id"],
                "userName": item["author"]["userName"],
                "followers": item["author"].get("followers", 0),
                "isVerified": item["author"].get("isVerified", False),
                "isBlueVerified": item["author"].get("isBlueVerified", False),
            },
            "text": item["text"],
            "replyCount": item.get("replyCount", 0),
            "retweetCount": item.get("retweetCount", 0),
            "likeCount": item.get("likeCount", 0),
            "quoteCount": item.get("quoteCount", 0),
            "quote": None,  # Parent tweets not handled in this version
        }
        return translated

    def _create_user_info(self, user_data: Dict) -> UserInfo:
        cached_user = self.user_cache.get(user_data["id"])
        if cached_user:
            return cached_user

        notable_followers = []
        if user_data.get("isVerified"):
            notable_followers.append("Verified")
        if user_data.get("isBlueVerified"):
            notable_followers.append("BlueVerified")

        user_info = UserInfo(
            screen_name=user_data["userName"],
            follower_count=user_data.get("followers", 0),
            notable_followers=notable_followers,
            is_verified=user_data.get("isVerified", False),
            ca_mention_count=0,
            ticker_mention_count=0,
        )
        self.user_cache[user_data["id"]] = user_info
        return user_info

    def _analyze_text_mentions(self, text: str) -> Tuple[int, int]:
        text_lower = text.lower()
        return (text_lower.count(self.contract_address), text_lower.count(self.ticker))

    async def _process_parent_tweet(self, quote_data: Dict) -> Optional[ParentTweetInfo]:
        # Currently not implemented for new scraper format
        return None

    async def _process_tweet(self, raw_item: Dict) -> Optional[TweetData]:
        try:
            item = self._translate_item(raw_item)
            tweet_id = item["id"]
            if tweet_id in self.processed_tweets:
                return self.processed_tweets[tweet_id]

            user_info = self._create_user_info(item["author"])
            ca_mentions, ticker_mentions = self._analyze_text_mentions(item["text"])
            user_info.ca_mention_count = ca_mentions
            user_info.ticker_mention_count = ticker_mentions

            replies = []
            if item.get("replyCount", 0) > 0:
                replies = [
                    TweetReply(
                        user=self._create_user_info(item["author"]),
                        content=f"Simulated reply to {item['id']}",
                    )
                ][:5]

            tweet_data = TweetData(
                id=tweet_id,  # Include tweet ID
                content=item["text"],
                user=user_info,
                search_match_type=self._determine_search_match_type(item["text"]),
                replies=replies,
                metrics={
                    "reply_count": item.get("replyCount", 0),
                    "retweet_count": item.get("retweetCount", 0),
                    "like_count": item.get("likeCount", 0),
                    "quote_count": item.get("quoteCount", 0),
                    "has_large_parent": False,
                    "has_affiliated_parent": False,
                },
            )

            if tweet_data.metrics["reply_count"] > 5 or user_info.follower_count >= self.large_account_threshold:
                self.important_tweets_cache[tweet_id] = tweet_data

            self.processed_tweets[tweet_id] = tweet_data
            return tweet_data
        except KeyError as e:
            logger.warning(f"Skipping item due to missing field {e}")
            return None

    def _determine_search_match_type(self, text: str) -> str:
        text_lower = text.lower()
        has_ca = self.contract_address in text_lower
        has_ticker = self.ticker in text_lower
        return "BOTH" if has_ca and has_ticker else "CA" if has_ca else "TICKER"

    async def analyze_tweets(self, num_tweets: int = 50) -> List[TweetData]:
        run_input = {
            "searchTerms": [f'"{self.ticker}"', f'"{self.contract_address}"'],
            "maxItems": num_tweets // 2,
            "lang": "en",
            "queryType": "Latest",
            "filter:blue_verified": False,
            "filter:replies": False,
            "filter:hashtags": False,
            "filter:media": False,
            "include:nativeretweets": False,
        }

        api_key = await ApifyTwitterAnalyzer.get_next_api_key()
        client = ApifyClientAsync(api_key)

        try:
            actor_call = client.actor("kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest").call(run_input=run_input)
            run = await actor_call
            if run is None:
                raise Exception("Actor did not return a run")
        except Exception as e:
            logger.error(f"Scraper run failed: {e}")
            return []

        processed_tweets: List[TweetData] = []
        dataset = client.dataset(run["defaultDatasetId"])
        async for item in dataset.iterate_items():
            if len(processed_tweets) >= num_tweets:
                break
            processed = await self._process_tweet(item)
            if processed:
                processed_tweets.append(processed)

        # Deduplicate based on tweet ID (though processed_tweets should already be unique)
        seen_ids = set()
        deduped = []
        for tweet in processed_tweets:
            if tweet.id not in seen_ids:
                seen_ids.add(tweet.id)
                deduped.append(tweet)

        logger.info(f"Processed {len(deduped)} unique tweets")
        return deduped[:num_tweets]

    def save_analysis(self, filename: str = "twitter_analysis.json") -> None:
        output = {
            "tweets": [self._tweet_to_dict(t) for t in self.processed_tweets.values()],
            "important_tweets": {k: self._tweet_to_dict(v) for k, v in self.important_tweets_cache.items()},
        }
        with open(filename, "w") as f:
            json.dump(output, f, indent=2)

    def _tweet_to_dict(self, tweet: TweetData) -> Dict:
        return {
            "id": tweet.id,
            "content": tweet.content,
            "user": {
                "screen_name": tweet.user.screen_name,
                "followers": tweet.user.follower_count,
                "verified": tweet.user.is_verified,
                "ca_mentions": tweet.user.ca_mention_count,
                "ticker_mentions": tweet.user.ticker_mention_count,
            },
            "metrics": tweet.metrics,
            "parent_tweet": None,
        }


async def main():
    analyzer = ApifyTwitterAnalyzer(
        contract_address="0x6982508145454ce325ddbe47a25d4ec3d2311933",
        ticker="$pepe",
        large_account_threshold=10000,
        affiliated_mention_threshold=5,
    )

    tweets = await analyzer.analyze_tweets(15)
    analyzer.save_analysis()
    logger.info(f"Saved analysis with {len(tweets)} tweets")


if __name__ == "__main__":
    asyncio.run(main())
