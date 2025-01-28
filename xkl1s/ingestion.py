import asyncio
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set, Any, Tuple
from twikit import Client  # type: ignore
from twikit.errors import TweetNotAvailable  # type: ignore
from tqdm.asyncio import tqdm  # type: ignore
import json
from dataclasses import asdict


@dataclass
class UserInfo:
    screen_name: str
    follower_count: int
    notable_followers: List[str] = field(default_factory=list)
    ca_mention_count: int = 0
    ticker_mention_count: int = 0


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
    search_match_type: str  # 'CA', 'TICKER', or 'BOTH'
    replies: List[TweetReply] = field(default_factory=list)
    parent_tweet: Optional[ParentTweetInfo] = None
    metrics: Dict[str, Any] = field(default_factory=dict)


class TwitterAnalyzer:
    def __init__(
        self,
        username: str,
        email: str,
        password: str,
        contract_address: str,
        ticker: str,
        large_account_threshold: int = 10000,
        affiliated_mention_threshold: int = 5,
        rate_limit_delay: float = 5.0,
        max_retries: int = 3,
    ) -> None:
        self.username = username
        self.email = email
        self.password = password
        self.contract_address = contract_address.lower()
        self.ticker = ticker.lower()
        self.large_account_threshold = large_account_threshold
        self.affiliated_mention_threshold = affiliated_mention_threshold
        self.rate_limit_delay = rate_limit_delay
        self.max_retries = max_retries
        self.client: Any = None
        self.important_tweets_cache: Dict[str, TweetData] = {}
        self.processed_tweets: Set[str] = set()

    async def with_retry(self, func: Any, *args: Any) -> Any:
        """Wrapper to retry API calls on rate limit with exponential backoff"""
        func_name = getattr(func, "__name__", "unknown_function")
        print(f"Making API call: {func_name}")
        for attempt in range(self.max_retries):
            try:
                if self.client is None:
                    self.client = Client("en-US")  # type: ignore
                    await self.client.login(
                        auth_info_1=self.username,
                        auth_info_2=self.email,
                        password=self.password,
                    )
                return await func(*args)
            except Exception as e:
                if "Rate limit exceeded" in str(e) and attempt < self.max_retries - 1:
                    delay = self.rate_limit_delay * (8**attempt)
                    print(f"Rate limit hit, waiting {delay}s before retry...")
                    await asyncio.sleep(delay)
                    continue
                raise e
        return None

    async def create_user_info(self, user: Any) -> UserInfo:
        notable_followers = await self.with_retry(user.get_followers_you_know, 100)
        follower_names = [f.screen_name for f in notable_followers] if notable_followers else []

        ca_mentions, ticker_mentions = await self.analyze_user_history(user)

        return UserInfo(
            screen_name=user.screen_name,
            follower_count=user.followers_count,
            notable_followers=follower_names,
            ca_mention_count=ca_mentions,
            ticker_mention_count=ticker_mentions,
        )

    async def analyze_user_history(self, user: Any) -> Tuple[int, int]:
        try:
            ca_counter = 0
            ticker_counter = 0

            user_tweets = await self.with_retry(user.get_tweets, "Tweets")
            await asyncio.sleep(self.rate_limit_delay)
            user_replies = await self.with_retry(user.get_tweets, "Replies")

            total_tweets = []
            if user_tweets:
                total_tweets.extend(user_tweets)
            if user_replies:
                total_tweets.extend(user_replies)

            for tweet in tqdm(
                total_tweets,
                desc=f"Analyzing @{user.screen_name}'s history",
                leave=False,
            ):
                text = tweet.full_text.lower()  # type: ignore
                if self.contract_address in text:
                    ca_counter += 1
                if self.ticker in text:
                    ticker_counter += 1

            return ca_counter, ticker_counter
        except Exception as e:
            print(f"\nError analyzing user history: {e}")
            return 0, 0

    async def analyze_parent_tweet(self, tweet_id: str) -> Optional[ParentTweetInfo]:
        try:
            parent_tweet = await self.with_retry(self.client.get_tweet_by_id, tweet_id)  # type: ignore
            if parent_tweet is None:
                return None
            parent_user_info = await self.create_user_info(parent_tweet.user)

            total_mentions = parent_user_info.ca_mention_count + parent_user_info.ticker_mention_count

            return ParentTweetInfo(
                user=parent_user_info,
                is_large_account=parent_user_info.follower_count >= self.large_account_threshold,
                is_affiliated=total_mentions >= self.affiliated_mention_threshold,
            )
        except TweetNotAvailable:
            print("Parent tweet not available")
            return None
        except Exception as e:
            print(f"Error analyzing parent tweet: {e}")
            return None

    async def analyze_replies(self, tweet: Any) -> List[TweetReply]:
        print(f"Analyzing replies for tweet from @{tweet.user.screen_name}")
        replies = []
        try:
            if tweet.replies:
                for reply in tweet.replies:
                    user_info = await self.create_user_info(reply.user)
                    replies.append(TweetReply(user=user_info, content=reply.full_text))  # type: ignore

            search_query = f"conversation_id:{tweet.id}"
            search_replies = await self.with_retry(
                self.client.search_tweet,  # type: ignore
                search_query,
                "Latest",
                20,
            )

            if search_replies:
                for reply in search_replies:
                    if reply.in_reply_to == tweet.id:  # type: ignore
                        user_info = await self.create_user_info(reply.user)
                        replies.append(TweetReply(user=user_info, content=reply.full_text))  # type: ignore

            return replies
        except Exception as e:
            print(f"Error analyzing replies: {e}")
            return replies

    def determine_search_match_type(self, tweet_text: str) -> str:
        text = tweet_text.lower()
        has_ca = self.contract_address in text
        has_ticker = self.ticker in text

        if has_ca and has_ticker:
            return "BOTH"
        elif has_ca:
            return "CA"
        else:
            return "TICKER"

    async def process_tweet(self, tweet: Any) -> TweetData:
        print(f"\nProcessing tweet from @{tweet.user.screen_name}")
        if tweet.id in self.processed_tweets:
            print("Tweet already processed, retrieving from cache")
            cached_tweet = self.important_tweets_cache.get(tweet.id)
            if cached_tweet is not None:
                return cached_tweet
            raise ValueError("Tweet was marked as processed but not found in cache")

        user_info = await self.create_user_info(tweet.user)
        replies = await self.analyze_replies(tweet)
        parent_tweet = await self.analyze_parent_tweet(tweet.in_reply_to) if tweet.in_reply_to else None  # type: ignore
        search_match_type = self.determine_search_match_type(tweet.full_text)  # type: ignore

        tweet_data = TweetData(
            content=tweet.full_text,  # type: ignore
            user=user_info,
            search_match_type=search_match_type,
            replies=replies,
            parent_tweet=parent_tweet,
            metrics={
                "reply_count": len(replies),
                "is_reply": bool(tweet.in_reply_to),  # type: ignore
                "has_large_parent": parent_tweet.is_large_account if parent_tweet else False,
                "has_affiliated_parent": parent_tweet.is_affiliated if parent_tweet else False,
            },
        )

        if len(replies) > 2 or user_info.follower_count >= self.large_account_threshold:
            self.important_tweets_cache[tweet.id] = tweet_data  # type: ignore

        self.processed_tweets.add(tweet.id)  # type: ignore
        return tweet_data

    async def analyze_tweets(self, num_tweets: int = 15, search_type: str = "Top") -> List[TweetData]:
        print("\nInitializing Twitter client...")
        self.client = Client("en-US")  # type: ignore
        await self.client.login(
            auth_info_1=self.username,
            auth_info_2=self.email,
            password=self.password,
        )

        print(f"\nSearching for tweets mentioning CA: {self.contract_address}")
        ca_result = await self.with_retry(
            self.client.search_tweet,  # type: ignore
            self.contract_address,
            search_type,
            num_tweets,
        )
        ca_tweets = list(ca_result) if ca_result else []
        print(f"Found {len(ca_tweets)} tweets for CA")

        await asyncio.sleep(self.rate_limit_delay)

        print(f"\nSearching for tweets mentioning ticker: {self.ticker}")
        ticker_result = await self.with_retry(
            self.client.search_tweet,  # type: ignore
            self.ticker,
            search_type,
            num_tweets,
        )
        ticker_tweets = list(ticker_result) if ticker_result else []
        print(f"Found {len(ticker_tweets)} tweets for ticker")

        all_tweets = []
        seen_ids: Set[str] = set()

        for tweet in ca_tweets + ticker_tweets:
            if tweet.id not in seen_ids:  # type: ignore
                seen_ids.add(tweet.id)  # type: ignore
                all_tweets.append(tweet)

        print(f"\nProcessing {len(all_tweets)} unique tweets...")
        tweet_data_list: List[TweetData] = []

        async for tweet in tqdm(
            asyncio.as_completed([self.process_tweet(tweet) for tweet in all_tweets]),
            total=len(all_tweets),
            desc="Processing tweets",
            unit="tweet",
        ):
            try:
                tweet_data = await tweet
                tweet_data_list.append(tweet_data)
                await asyncio.sleep(self.rate_limit_delay)
            except Exception as e:
                print(f"\nError processing tweet: {e}")
                continue

        return tweet_data_list


async def print_tweet_data(tweet_data: TweetData) -> None:
    """Helper function to print tweet data in a readable format"""
    print("\n" + "=" * 50)
    print("TWEET DETAILS")
    print("=" * 50)
    print(f"Content: {tweet_data.content}")
    print(f"Match Type: {tweet_data.search_match_type}")

    print("\nAUTHOR INFO:")
    print(f"Username: @{tweet_data.user.screen_name}")
    print(f"Follower Count: {tweet_data.user.follower_count:,}")
    print(f"CA Mentions: {tweet_data.user.ca_mention_count}")
    print(f"Ticker Mentions: {tweet_data.user.ticker_mention_count}")
    if tweet_data.user.notable_followers:
        print("\nNotable Followers:")
        for follower in tweet_data.user.notable_followers:
            print(f"- @{follower}")

    if tweet_data.replies:
        print("\nREPLIES:")
        for i, reply in enumerate(tweet_data.replies, 1):
            print(f"\n  Reply #{i}:")
            print(f"  From: @{reply.user.screen_name} ({reply.user.follower_count:,} followers)")
            print(f"  Content: {reply.content}")

    if tweet_data.parent_tweet:
        print("\nPARENT TWEET INFO:")
        parent = tweet_data.parent_tweet
        print(f"Author: @{parent.user.screen_name}")
        print(f"Follower Count: {parent.user.follower_count:,}")
        print(f"CA Mentions: {parent.user.ca_mention_count}")
        print(f"Ticker Mentions: {parent.user.ticker_mention_count}")
        print(f"Is Large Account: {'✓' if parent.is_large_account else '✗'}")
        print(f"Is Affiliated: {'✓' if parent.is_affiliated else '✗'}")

    print("\nMETRICS:")
    for key, value in tweet_data.metrics.items():
        print(f"- {key}: {value}")
    print("=" * 50)


async def main() -> None:
    print("\nInitializing Twitter Analysis...")

    analyzer = TwitterAnalyzer(
        username="9fStays",
        email="stays.tribute_9f@icloud.com",
        password="Ay3IsFromBritain1!",
        contract_address="0x6982508145454ce325ddbe47a25d4ec3d2311933",
        ticker="$PEPE",
        large_account_threshold=10000,
        affiliated_mention_threshold=5,
    )

    print("\nStarting tweet analysis...")
    tweet_data_list = await analyzer.analyze_tweets(num_tweets=15)

    print("\nPrinting detailed analysis for each tweet...")
    for tweet_data in tweet_data_list:
        await print_tweet_data(tweet_data)

    if analyzer.important_tweets_cache:
        print("\nIMPORTANT TWEETS IN CACHE:")
        for tweet_id, tweet_data in analyzer.important_tweets_cache.items():
            print(f"\nImportant Tweet ID: {tweet_id}")
            await print_tweet_data(tweet_data)
    else:
        print("\nNo important tweets cached.")

    print("\nSaving analysis to JSON file...")
    json_output = json.dumps(
        {
            "tweets": [asdict(tweet) for tweet in tweet_data_list],
            "important_tweets": {tweet_id: asdict(tweet_data) for tweet_id, tweet_data in analyzer.important_tweets_cache.items()},
        },
        indent=2,
    )

    with open("twitter_analysis_output.json", "w") as f:
        f.write(json_output)

    print("\nAnalysis complete! Results have been saved to 'twitter_analysis_output.json'")
    print(f"Total tweets analyzed: {len(tweet_data_list)}")
    print(f"Important tweets cached: {len(analyzer.important_tweets_cache)}")


if __name__ == "__main__":
    asyncio.run(main())
