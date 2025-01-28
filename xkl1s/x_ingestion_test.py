import asyncio
import json
from dataclasses import asdict
from ingestion import TwitterAnalyzer  # make sure the filename matches your saved file


async def print_tweet_data(tweet_data):
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


async def main():
    print("\nInitializing Twitter Analysis...")

    # Initialize the analyzer
    analyzer = TwitterAnalyzer(
        username="9fStays",
        email="stays.tribute_9f@icloud.com",
        password="Ay3IsFromBritain1!",
        contract_address="0x6982508145454ce325ddbe47a25d4ec3d2311933",  # Replace with actual CA
        ticker="$PEPE",  # Replace with actual ticker
        large_account_threshold=10000,
        affiliated_mention_threshold=5,
    )

    # Get tweet data
    print("\nStarting tweet analysis...")
    tweet_data_list = await analyzer.analyze_tweets(num_tweets=20)

    # Print detailed information for each tweet
    print("\nPrinting detailed analysis for each tweet...")
    for tweet_data in tweet_data_list:
        await print_tweet_data(tweet_data)

    # Print important tweets from cache
    if analyzer.important_tweets_cache:
        print("\nIMPORTANT TWEETS IN CACHE:")
        for tweet_id, tweet_data in analyzer.important_tweets_cache.items():
            print(f"\nImportant Tweet ID: {tweet_id}")
            await print_tweet_data(tweet_data)
    else:
        print("\nNo important tweets cached.")

    # Save complete analysis to JSON
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
