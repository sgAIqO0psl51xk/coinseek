import asyncio
import json
from dataclasses import dataclass
from typing import List, Dict, Any
from trench_bot import TrenchBotFetcher
from gmgn import GMGNTokenData
from openai import OpenAI
from ingestion import TwitterAnalyzer
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class LLMConfig:
    api_key: str
    model_name: str = "deepseek-reasoner"
    base_url: str = "https://api.deepseek.com"
    max_tokens: int = 2000


@dataclass
class TokenAnalysis:
    contract_address: str
    ticker: str
    twitter_data: Dict[str, Any]
    trenchbot_data: Dict[str, Any]
    gmgn_data: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "contract_address": self.contract_address,
            "ticker": self.ticker,
            "twitter_analysis": self.twitter_data,
            "trenchbot_analysis": self.trenchbot_data,
            "gmgn_analysis": self.gmgn_data,
        }


class DeepseekDriver:
    def __init__(self, contract_address: str, ticker: str, llm_config: LLMConfig, twitter_creds: Dict[str, str]):
        self.contract_address = contract_address
        self.ticker = ticker
        self.llm_config = llm_config
        self.twitter_creds = twitter_creds
        self.client = OpenAI(api_key=llm_config.api_key, base_url=llm_config.base_url)

    async def analyze_twitter_direct(self) -> Dict[str, Any]:
        """Gather Twitter analysis data directly from Twitter API"""
        print("\nStarting direct Twitter analysis...")
        analyzer = TwitterAnalyzer(
            username=self.twitter_creds["username"],
            email=self.twitter_creds["email"],
            password=self.twitter_creds["password"],
            contract_address=self.contract_address,
            ticker=self.ticker,
            large_account_threshold=10000,
            affiliated_mention_threshold=5,
        )

        tweet_data = await analyzer.analyze_tweets(num_tweets=20)

        analyzed_tweets = []
        for tweet in tweet_data:
            tweet_dict = {
                "content": tweet.content,
                "user": {
                    "screen_name": tweet.user.screen_name,
                    "follower_count": tweet.user.follower_count,
                    "notable_followers": tweet.user.notable_followers,
                    "ca_mention_count": tweet.user.ca_mention_count,
                    "ticker_mention_count": tweet.user.ticker_mention_count,
                },
                "search_match_type": tweet.search_match_type,
                "replies": [
                    {
                        "content": reply.content,
                        "user": {
                            "screen_name": reply.user.screen_name,
                            "follower_count": reply.user.follower_count,
                            "notable_followers": reply.user.notable_followers,
                            "ca_mention_count": reply.user.ca_mention_count,
                            "ticker_mention_count": reply.user.ticker_mention_count,
                        },
                    }
                    for reply in tweet.replies
                ],
                "metrics": tweet.metrics,
            }

            if tweet.parent_tweet:
                tweet_dict["parent_tweet"] = {
                    "user": {
                        "screen_name": tweet.parent_tweet.user.screen_name,
                        "follower_count": tweet.parent_tweet.user.follower_count,
                        "notable_followers": tweet.parent_tweet.user.notable_followers,
                        "ca_mention_count": tweet.parent_tweet.user.ca_mention_count,
                        "ticker_mention_count": tweet.parent_tweet.user.ticker_mention_count,
                    },
                    "is_large_account": tweet.parent_tweet.is_large_account,
                    "is_affiliated": tweet.parent_tweet.is_affiliated,
                }

            analyzed_tweets.append(tweet_dict)

        important_tweets = {}
        for tweet_id, tweet in analyzer.important_tweets_cache.items():
            important_tweets[tweet_id] = {
                "content": tweet.content,
                "user": {
                    "screen_name": tweet.user.screen_name,
                    "follower_count": tweet.user.follower_count,
                    "notable_followers": tweet.user.notable_followers,
                    "ca_mention_count": tweet.user.ca_mention_count,
                    "ticker_mention_count": tweet.user.ticker_mention_count,
                },
                "search_match_type": tweet.search_match_type,
                "metrics": tweet.metrics,
            }

        twitter_data = {"analyzed_tweets": analyzed_tweets, "important_tweets": important_tweets}

        return twitter_data

    async def analyze_trenchbot(self) -> Dict[str, Any]:
        """Gather TrenchBot analysis data"""
        print("\nStarting TrenchBot analysis...")
        fetcher = TrenchBotFetcher(self.contract_address)
        percent_bundled = await fetcher.get_total_percent_bundled()

        return {"percent_bundled": percent_bundled, "raw_data": fetcher.data}

    def analyze_gmgn(self) -> Dict[str, Any]:
        """Gather GMGN analysis data"""
        print("\nStarting GMGN analysis...")
        token_data = GMGNTokenData(self.contract_address)

        return {
            "top_holder_avg_holding_time": token_data.get_top_holder_average_holding_time(10),
            "top_holder_avg_score": token_data.get_average_wallet_score(10),
            "top_wallets": [
                {
                    "address": wallet.wallet,
                    "score": wallet.get_wallet_score(),
                    "win_rate": wallet.get_win_rate(),
                    "holding_time": wallet.get_holding_time(),
                    "pct_change_30d": wallet.get_30d_pctchange(),
                    "avg_trades_per_day": wallet.average_trades_per_day(),
                }
                for wallet in token_data.get_top_wallets()[:10]
            ],
        }

    async def run_analysis(self) -> TokenAnalysis:
        """Run all analyses and combine results"""
        twitter_task = asyncio.create_task(self.analyze_twitter_direct())
        trenchbot_task = asyncio.create_task(self.analyze_trenchbot())
        gmgn_data = self.analyze_gmgn()

        twitter_data = await twitter_task
        trenchbot_data = await trenchbot_task

        return TokenAnalysis(
            contract_address=self.contract_address,
            ticker=self.ticker,
            twitter_data=twitter_data,
            trenchbot_data=trenchbot_data,
            gmgn_data=gmgn_data,
        )

    async def generate_analysis_prompt(self, analysis: TokenAnalysis) -> List[Dict[str, str]]:
        """Generate the conversation structure for the LLM"""
        system_message = {
            "role": "system",
            "content": """You are a battle-hardened crypto analyst with the mouth of a sailor and the instincts of a wolf.
            Your thinking process should reflect these traits:

            1. Ruthlessly pragmatic analysis peppered with trader slang ("rekt", "ape in", "bags")
            2. Dark humor in risk assessment ("this could moon or leave us holding our dicks")
            3. Unfiltered takes on data patterns ("Top holders still holding? Bullish, they know something")
            4. Blunt analogies ("This chart looks like my ex's commitment issues - spike then ghost")
            5. Adaptive tone based on perceived risk (mock FOMO, roast suspicious patterns)

            Maintain this persona in your REASONING PROCESS, not just final output.
            Think through the lens of a cynical trader who's seen 100 rugs.""",
        }

        user_message = {
            "role": "user",
            "content": f"""You will ingests data and scores based off the following parameters given to you.

            Now, I explain each of the datapoins you will receive and how you're supposed to interpret and analyze them.

            firstly, we will scrape twitter for a multitude of different signals.

            twitter
            top tweets that mention the ticker or CA
            tweet content
            tweeters / users
            # of followers
            if any notable accounts follow them
            tweet metrics (replies)
            if tweet is a reply, is it a reply to a large account
            if tweet is a reply, does the parent mention the CA / Ticker often [specific # of mentions] (affiliated acc)
            does the parent have any notable followers
            cache tweets we find multiple replies to deem them important

            the tweet content should primarily be used for determining the sentiment/narrative of a token.
            higher numbers in metrics like replies, number of followers, notable people follow, should all be seen as positive
            signals in a token and this should be mentioned to the user.
            moreover, a big point that should be analyzed is if you notice that many replies mentioning the ticker/contract
            address are in response to a tweet by a user with a very large number of followers. in this case,
            it's possible that the parent tweet content is either related or has something to do with the narrative/reason behind the token.
            lastly, if we find that an account that has mentioned a ticker many times and has tweets generally explaining
            functionality or launches, you should try to determine if that's the account for the token and the details to the user.

            generally, these datapoints should be used to determine: credibility of those pushing the token, possible narratives around it,
            and important accounts or tweets that may provide more context.

            telegram
            searches telegram for the token telegram if not already added - example: token name is Bane, searches telegram for suffixes like
            baneportal, onsol, entry, prefixes like entry

            if a telegram portal exists for the coin, that's usually a positive signal, though it's also not too much of an issue if it doesn't

            Solscan
            looks at solscan for first block transaction, sees first block tx for how much been picked up from dev/sniper

            this should give information on how much of supply was bundled by the launcher of the coin which
            basically means how much they were able to purchase at a low price.
            we will also look at the amount the currently have left. obviously, the more they have left,
            the higher risk the coin would be as there's the eminent risk of the chart beind dumped

            holder ratings
            information regarding the average hold times of the top holders

            what this essentially means is that the top X amount of holders will be examined to see the
            average amount of time they hold coins. for reference, 20-30minutes could be considered 5/10, 30-40 as 6/10 etc.
            obviously this isn't a clear heuristic that you need to follow but just to give you a rough idea of how we should treat the times.
            just generally take a look and provide the average as well as a brief analysis

            Analyze this token like your bags depend on it:

            Contract: {self.contract_address}
            Ticker: {self.ticker}

            Twitter Analysis:
            {json.dumps(analysis.twitter_data, indent=2)}

            TrenchBot Analysis:
            {json.dumps(analysis.trenchbot_data, indent=2)}

            GMGN Analysis:
            {json.dumps(analysis.gmgn_data, indent=2)}

            Break down your analysis into:
            1. Overall sentiment (bullish/bearish/neutral with colorful metaphors)
            2. Key metrics evaluation (translate numbers to street terms)
            3. Risk assessment (using crime analogies)
            4. Notable patterns or concerns (what's making your degen senses tingle)
            5. Final recommendation (full send, avoid like herpes, or cautious degen play)""",
        }

        return [system_message, user_message]

    async def run_llm_analysis(self, messages: List[Dict[str, str]]) -> Dict[str, str]:
        """Run the LLM analysis using DeepSeek API"""
        response = self.client.chat.completions.create(
            model=self.llm_config.model_name,
            messages=messages,
            stream=True,
            temperature=0.75,  # can change depending on how excessive you want it
        )

        reasoning_content = ""
        content = ""

        print("\nAnalyzing data...")
        print("\nChain of Thought:")

        try:
            for chunk in response:
                if chunk.choices[0].delta.reasoning_content:
                    piece = chunk.choices[0].delta.reasoning_content
                    reasoning_content += piece
                    print(piece, end="", flush=True)
                elif hasattr(chunk.choices[0].delta, "content"):
                    piece = chunk.choices[0].delta.content
                    if piece:
                        content += piece

            print("\n\nFinal Analysis:")
            print(content)

            return {"reasoning": reasoning_content.strip(), "analysis": content.strip()}

        except Exception as e:
            print(f"Debug - Exception occurred: {str(e)}")
            raise

    async def analyze_and_report(self) -> Dict[str, Any]:
        """Run full analysis pipeline and generate report"""
        analysis = await self.run_analysis()

        messages = await self.generate_analysis_prompt(analysis)

        llm_output = await self.run_llm_analysis(messages)

        return {
            "raw_data": analysis.to_dict(),
            "messages": messages,
            "llm_analysis": llm_output["analysis"],
            "llm_reasoning": llm_output["reasoning"],
        }


async def main():
    llm_config = LLMConfig(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_name="deepseek-reasoner",
        base_url="https://api.deepseek.com",
    )

    twitter_creds = {
        "username": os.getenv("TWT_USERNAME"),
        "email": os.getenv("TWT_EMAIL"),
        "password": os.getenv("TWT_PASSWORD"),
    }

    driver = DeepseekDriver(
        contract_address="GkyZ3xtwoA35nTXE1t26uKGL6jjiC6zM9pGjvdtpump",
        ticker="$seek16z",
        llm_config=llm_config,
        twitter_creds=twitter_creds,
    )

    report = await driver.analyze_and_report()

    with open("full_analysis_report.json", "w") as f:
        json.dump(report, f, indent=2)

    print("\nAnalysis complete! Results saved to 'full_analysis_report.json'")


if __name__ == "__main__":
    asyncio.run(main())
