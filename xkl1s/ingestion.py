import asyncio
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set, Any, Tuple
from twikit import Client
from twikit.errors import TweetNotAvailable
from tqdm.asyncio import tqdm
import json
from dataclasses import asdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
    search_match_type: str
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
        max_history_tweets: int = 50,  # New parameter to limit history analysis
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
        self.max_history_tweets = max_history_tweets
        self.client: Optional[Client] = None
        self.important_tweets_cache: Dict[str, TweetData] = {}
        self.processed_tweets: Set[str] = set()
        self.user_cache: Dict[str, UserInfo] = {}  # User cache
        self.parent_cache: Dict[str, ParentTweetInfo] = {}  # Parent tweet cache

    async def initialize_client(self) -> None:
        if not self.client:
            self.client = Client("en-US")
            await self.client.login(auth_info_1=self.username, auth_info_2=self.email, password=self.password)

    async def with_retry(self, func: Any, *args: Any) -> Any:
        """Wrapper to retry API calls on rate limit with exponential backoff"""
        await self.initialize_client()

        for attempt in range(self.max_retries + 1):
            try:
                return await func(*args)
            except Exception as e:
                # Check if error message contains rate limit info
                if "rate limit" in str(e).lower() and attempt < self.max_retries:
                    delay = self.rate_limit_delay * (2**attempt)
                    logger.warning(f"Rate limit hit. Waiting {delay}s")
                    await asyncio.sleep(delay)
                    continue
                elif attempt < self.max_retries:
                    delay = self.rate_limit_delay * (2**attempt)
                    logger.warning(f"Error ({str(e)}). Retrying in {delay:.1f}s")
                    await asyncio.sleep(delay)
                    continue
                raise e
        raise Exception("Max retries exceeded")

    async def create_user_info(self, user: Any) -> UserInfo:
        """User creation with cache support"""
        if user.id in self.user_cache:
            return self.user_cache[user.id]

        user_info = UserInfo(
            screen_name=user.screen_name,
            follower_count=user.followers_count,
            notable_followers=await self.get_notable_followers(user),
            ca_mention_count=0,
            ticker_mention_count=0,
        )

        # Cache before history analysis to prevent redundant calls
        self.user_cache[user.id] = user_info

        # Only analyze history for users meeting certain criteria
        if user.followers_count >= self.large_account_threshold:
            ca, ticker = await self.analyze_user_history(user)
            user_info.ca_mention_count = ca
            user_info.ticker_mention_count = ticker

        return user_info

    async def get_notable_followers(self, user: Any) -> List[str]:
        """Get notable followers with limit"""
        try:
            followers = await self.with_retry(user.get_followers_you_know, 25)
            return [f.screen_name for f in followers][:10]  # Return top 10
        except Exception as e:
            logger.error(f"Error getting followers: {str(e)}")
            return []

    async def analyze_user_history(self, user: Any) -> Tuple[int, int]:
        """Optimized user history analysis with limited tweets"""
        try:
            ca_counter = 0
            ticker_counter = 0

            # Get combined tweets and replies with limit
            tweets = await self.with_retry(user.get_tweets, "Tweets", self.max_history_tweets)

            # Process in batches if needed
            for tweet in tweets[: self.max_history_tweets]:
                text = tweet.full_text.lower()
                ca_counter += text.count(self.contract_address)
                ticker_counter += text.count(self.ticker)

            return ca_counter, ticker_counter
        except Exception as e:
            logger.error(f"Error analyzing user history: {str(e)}")
            return 0, 0

    async def analyze_parent_tweet(self, tweet_id: str) -> Optional[ParentTweetInfo]:
        if tweet_id in self.parent_cache:
            return self.parent_cache[tweet_id]

        try:
            if not self.client:
                await self.initialize_client()
                if not self.client:  # Double check after initialization
                    return None

            parent_tweet = await self.with_retry(self.client.get_tweet_by_id, tweet_id)
            if not parent_tweet:
                return None

            parent_user = await self.create_user_info(parent_tweet.user)
            total_mentions = parent_user.ca_mention_count + parent_user.ticker_mention_count

            parent_info = ParentTweetInfo(
                user=parent_user,
                is_large_account=parent_user.follower_count >= self.large_account_threshold,
                is_affiliated=total_mentions >= self.affiliated_mention_threshold,
            )

            self.parent_cache[tweet_id] = parent_info
            return parent_info
        except TweetNotAvailable:
            logger.warning("Parent tweet not available")
            return None

    async def analyze_replies(self, tweet: Any) -> List[TweetReply]:
        replies = []
        seen_users: Set[str] = set()

        try:
            # Combine native replies and search replies
            reply_candidates = list(tweet.replies) if tweet.replies else []

            # Add search replies if needed
            if len(reply_candidates) < 10 and self.client:
                search_replies = await self.with_retry(self.client.search_tweet, f"conversation_id:{tweet.id}", "Latest", 15)
                if search_replies:
                    reply_candidates.extend(search_replies)

            for reply in reply_candidates:
                if reply.user.id in seen_users:
                    continue

                user_info = await self.create_user_info(reply.user)
                replies.append(TweetReply(user=user_info, content=reply.full_text[:280]))  # Store excerpt only
                seen_users.add(reply.user.id)

                # Early exit if we have enough replies
                if len(replies) >= 15:
                    break

            return replies
        except Exception as e:
            logger.error(f"Error analyzing replies: {str(e)}")
            return replies

    async def analyze_tweets(self, num_tweets: int = 15, search_type: str = "Top") -> List[TweetData]:
        await self.initialize_client()
        if not self.client:
            raise RuntimeError("Failed to initialize Twitter client")

        # Combined search query
        search_query = f"{self.contract_address} OR {self.ticker}"
        logger.info(f"Searching with combined query: {search_query}")

        result = await self.with_retry(self.client.search_tweet, search_query, search_type, num_tweets * 2)

        unique_tweets = []
        seen_ids: Set[str] = set()

        for tweet in result:
            if tweet.id not in seen_ids:
                seen_ids.add(tweet.id)  # Don't use the return value
                unique_tweets.append(tweet)
            if len(unique_tweets) >= num_tweets:
                break

        logger.info(f"Processing {len(unique_tweets)} unique tweets")
        tasks = [self.process_tweet(tweet) for tweet in unique_tweets]
        return await tqdm.gather(*tasks, desc="Processing tweets")

    async def process_tweet(self, tweet: Any) -> TweetData:
        if tweet.id in self.processed_tweets:
            cached_tweet = self.important_tweets_cache.get(tweet.id)
            if cached_tweet:
                return cached_tweet
            raise ValueError(f"Tweet {tweet.id} marked as processed but not in cache")

        user_info = await self.create_user_info(tweet.user)
        search_match_type = self.determine_search_match_type(tweet.full_text)

        # Parallelize reply and parent analysis
        replies_task = self.analyze_replies(tweet)
        parent_task = self.analyze_parent_tweet(tweet.in_reply_to) if tweet.in_reply_to else None

        tweet_data = TweetData(
            content=tweet.full_text,
            user=user_info,
            search_match_type=search_match_type,
            replies=await replies_task,
            parent_tweet=await parent_task if parent_task else None,
            metrics={
                "reply_count": 0,  # Updated after replies are processed
                "is_reply": bool(tweet.in_reply_to),
                "has_large_parent": False,
                "has_affiliated_parent": False,
            },
        )

        # Update metrics
        tweet_data.metrics.update(
            {
                "reply_count": len(tweet_data.replies),
                "has_large_parent": tweet_data.parent_tweet.is_large_account if tweet_data.parent_tweet else False,
                "has_affiliated_parent": tweet_data.parent_tweet.is_affiliated if tweet_data.parent_tweet else False,
            }
        )

        # Cache important tweets
        if (
            len(tweet_data.replies) > 2
            or user_info.follower_count >= self.large_account_threshold
            or (tweet_data.parent_tweet and tweet_data.parent_tweet.is_large_account)
        ):
            self.important_tweets_cache[tweet.id] = tweet_data

        self.processed_tweets.add(tweet.id)
        return tweet_data

    def determine_search_match_type(self, text: str) -> str:
        text = text.lower()
        has_ca = self.contract_address in text
        has_ticker = self.ticker in text
        return "BOTH" if has_ca and has_ticker else "CA" if has_ca else "TICKER"

    # async def analyze_tweets(self, num_tweets: int = 15, search_type: str = "Top") -> List[TweetData]:
    #     print("\nInitializing Twitter client...")
    #     self.client = Client("en-US")  # type: ignore
    #     await self.client.login(
    #         auth_info_1=self.username,
    #         auth_info_2=self.email,
    #         password=self.password,
    #     )

    #     print(f"\nSearching for tweets mentioning CA: {self.contract_address}")
    #     ca_result = await self.with_retry(
    #         self.client.search_tweet,  # type: ignore
    #         self.contract_address,
    #         search_type,
    #         num_tweets,
    #     )
    #     ca_tweets = list(ca_result) if ca_result else []
    #     print(f"Found {len(ca_tweets)} tweets for CA")

    #     await asyncio.sleep(self.rate_limit_delay)

    #     print(f"\nSearching for tweets mentioning ticker: {self.ticker}")
    #     ticker_result = await self.with_retry(
    #         self.client.search_tweet,  # type: ignore
    #         self.ticker,
    #         search_type,
    #         num_tweets,
    #     )
    #     ticker_tweets = list(ticker_result) if ticker_result else []
    #     print(f"Found {len(ticker_tweets)} tweets for ticker")

    #     all_tweets = []
    #     seen_ids: Set[str] = set()

    #     for tweet in ca_tweets + ticker_tweets:
    #         if tweet.id not in seen_ids:  # type: ignore
    #             seen_ids.add(tweet.id)  # type: ignore
    #             all_tweets.append(tweet)

    #     print(f"\nProcessing {len(all_tweets)} unique tweets...")
    #     tweet_data_list: List[TweetData] = []

    #     async for tweet in tqdm(
    #         asyncio.as_completed([self.process_tweet(tweet) for tweet in all_tweets]),
    #         total=len(all_tweets),
    #         desc="Processing tweets",
    #         unit="tweet",
    #     ):
    #         try:
    #             tweet_data = await tweet
    #             tweet_data_list.append(tweet_data)
    #             await asyncio.sleep(self.rate_limit_delay)
    #         except Exception as e:
    #             print(f"\nError processing tweet: {e}")
    #             continue

    #     return tweet_data_list


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