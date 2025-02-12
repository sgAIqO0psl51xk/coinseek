import asyncio
import json
from dataclasses import dataclass
import logging
from typing import AsyncGenerator, List, Dict, Any

import aiohttp

from xkl1s.dexscreener import DexScreenerTokenData, get_token_mcap_volume
from xkl1s.trench_bot import TrenchBotFetcher
from xkl1s.gmgn import GMGNTokenData
from xkl1s.ingestion_2 import ApifyTwitterAnalyzer
from dotenv import load_dotenv
from openai.types.chat import ChatCompletionMessageParam
import tiktoken

load_dotenv()


@dataclass
class LLMProvider:
    api_key: str
    model_name: str
    base_url: str
    max_tokens: int = 2000
    priority: int = 1  # Lower numbers get tried first
    provider_type: str = "deepseek"  # deepseek|openrouter


@dataclass
class TokenAnalysis:
    contract_address: str
    ticker: str
    twitter_data: Dict[str, Any]
    trenchbot_data: Dict[str, Any]
    gmgn_data: Dict[str, Any]
    dexscreener_data: DexScreenerTokenData

    def to_dict(self) -> Dict[str, Any]:
        return {
            "contract_address": self.contract_address,
            "ticker": self.ticker,
            "twitter_analysis": self.twitter_data,
            "trenchbot_analysis": self.trenchbot_data,
            "gmgn_analysis": self.gmgn_data,
        }


class DeepseekDriver:
    def __init__(self, contract_address: str, ticker: str, llm_providers: list[LLMProvider], chain_id: str):
        self.contract_address = contract_address
        self.ticker = ticker
        self.llm_providers = sorted(llm_providers, key=lambda x: x.priority)
        self.chain_id = chain_id

    async def analyze_twitter(self) -> Dict[str, Any]:
        """Twitter analysis using Apify"""
        print("\nStarting Twitter analysis with Apify...")
        analyzer = ApifyTwitterAnalyzer(
            contract_address=self.contract_address, ticker=self.ticker, large_account_threshold=10000, affiliated_mention_threshold=5
        )
        tweet_data = await analyzer.analyze_tweets(num_tweets=50)
        print(f"Found {len(tweet_data)} tweets")
        # Filter tweets by follower count, but ensure at least 10 tweets are kept
        tweet_data = sorted(tweet_data, key=lambda x: x.user.follower_count, reverse=True)[:10]

        important_tweets = dict(
            sorted(analyzer.important_tweets_cache.items(), key=lambda item: item[1].user.follower_count, reverse=True)[:10]
        )
        logging.info(f"Important tweets: {len(important_tweets)}")
        logging.info(f"Tweet data: {len(tweet_data)}")
        return self._process_twitter_results(tweet_data, important_tweets)

    def _process_twitter_results(self, tweet_data: List[Any], important_tweets_cache: Dict) -> Dict[str, Any]:
        """Process Twitter results from Apify"""
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

        important_tweets = {
            tweet_id: {
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
            for tweet_id, tweet in important_tweets_cache.items()
        }

        return {"analyzed_tweets": analyzed_tweets, "important_tweets": important_tweets}

    async def analyze_trenchbot(self) -> Dict[str, Any]:
        """Gather TrenchBot analysis data"""
        print("\nStarting TrenchBot analysis...")
        fetcher = TrenchBotFetcher(self.contract_address)
        percent_bundled = await fetcher.get_total_percent_bundled()
        percent_held = await fetcher.get_current_held_as_percent_of_total_bundle()
        creator_analysis = json.dumps(await fetcher.get_creator_analysis())
        if self.ticker == "":
            self.ticker = await fetcher.get_ticker()
        return {
            "percent_bundled": percent_bundled,
            "percent_held": percent_held,
            "creator_analysis": creator_analysis,
        }

    async def analyze_gmgn(self) -> Dict[str, Any]:
        """Gather GMGN analysis data"""
        print("\nStarting GMGN analysis...")
        token_data = GMGNTokenData(self.contract_address)
        wallets = await token_data.get_top_wallets()

        return {
            "top_holder_avg_holding_time": await token_data.get_top_holder_average_holding_time(10),
            "top_holder_avg_score": await token_data.get_average_wallet_score(10),
            "top_wallets": [
                {
                    "address": wallet.wallet,
                    "score": await wallet.get_wallet_score(),
                    "win_rate": await wallet.get_win_rate(),
                    "holding_time": await wallet.get_holding_time(),
                    "pct_change_30d": await wallet.get_30d_pctchange(),
                    "avg_trades_per_day": await wallet.average_trades_per_day(),
                }
                for wallet in wallets[:10]
            ],
        }

    async def run_analysis(self) -> TokenAnalysis:
        """Run all analyses and combine results"""
        twitter_task = asyncio.create_task(self.analyze_twitter())
        trenchbot_task = asyncio.create_task(self.analyze_trenchbot())
        gmgn_data = await self.analyze_gmgn()
        dexscreener_data = asyncio.create_task(get_token_mcap_volume(self.contract_address, self.chain_id))

        return TokenAnalysis(
            contract_address=self.contract_address,
            ticker=self.ticker,
            twitter_data=await twitter_task,
            trenchbot_data=await trenchbot_task,
            dexscreener_data=await dexscreener_data,
            gmgn_data=gmgn_data,
        )

    async def generate_analysis_prompt(self, analysis: TokenAnalysis) -> List[ChatCompletionMessageParam]:
        """Generate the conversation structure for the LLM"""
        system_message: ChatCompletionMessageParam = {
            "role": "system",
            "content": """You are a battle-hardened crypto analyst with the mouth of a sailor and the instincts of a wolf.
Your output should use proper formatting with clear line breaks between sections and points.
Each major point should be on its own line, preceded by a newline character.

Your thinking process should reflect these traits:

1. Ruthlessly pragmatic analysis peppered with trader slang ("rekt", "ape in", "bags")
2. Dark humor in risk assessment ("this could moon or leave us holding our dicks")
3. Unfiltered takes on data patterns ("Top holders still holding? Bullish, they know something")
4. Blunt analogies ("This chart looks like my ex's commitment issues - spike then ghost")
5. Adaptive tone based on perceived risk (mock FOMO, roast suspicious patterns)

NOTE THAT IF YOU MENTION CONTENT A TWEET(S), BE SURE TO HYPERLINK THE ACTUAL TWEET LINK.
INCLUDE THESE LINKS IN ALL PLACES YOU MENTION A TWEET AS A SOURCE, BE SURE TO BOLD AND
UNDERLINE THE HYPERLINKS VIA MARKDOWN.

Maintain this persona in your REASONING PROCESS, not just final output.
Think through the lens of a cynical trader who's seen 100 rugs.""",
        }

        user_message: ChatCompletionMessageParam = {
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

NOTE THAT IF YOU MENTION CONTENT A TWEET(S), BE SURE TO HYPERLINK THE ACTUAL TWEET LINK.
INCLUDE THESE LINKS IN ALL PLACES YOU MENTION A TWEET AS A SOURCE, BE SURE TO BOLD AND
UNDERLINE THE HYPERLINKS VIA MARKDOWN.

generally, these datapoints should be used to determine: credibility of those pushing the token, possible narratives around it,
and important accounts or tweets that may provide more context.

token metrics
you will also receive some data like price, 24h change, 24h volume, FDV etc. this will be good for giving context,
but it's considerably subjective to determine the quality of a token from these stats alone but you can do some
analysis on it and generally try to provide some further contex to the user and explain what they should care about
from here and how it POTENTIALLY may be a risk but i want you to weigh this less due to how arbitrary it can be.

telegram
dexscreener will provide all socials and if a telegram is present, it'll be in the form of a t.me link and that is how
 you'll know

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

Dexscreener Analysis:
{str(analysis.dexscreener_data)}

DO NOT output json or any data format that you have received above. You will use this data to generate your analysis.
DO NOT advise in exact sol amounts, if you want to advise amounts, simply advise on size but even then try to refrain.
You may and should quote information from the data above to help you generate your analysis. But do not output the data itself.
In general, you should lean skeptical, but if a token's fundamentals look good and the narrative seems strong,
you don't need to be excessively negative.
In your reasoning steps you must start your message with one of 'Alright,', 'Lets see', 'Given the following data', 'Lets start by looking at'.

Break down your analysis into:
1. Overall sentiment (bullish/bearish/neutral with colorful metaphors)
2. Key metrics evaluation (translate numbers to street terms)
3. Risk assessment (using crime analogies)
4. Notable patterns or concerns (what's making your degen senses tingle)
5. Final recommendation (full send, avoid like herpes, or cautious degen play)""",
        }

        return [system_message, user_message]

    async def run_llm_analysis(self, messages: List[ChatCompletionMessageParam]) -> AsyncGenerator[Dict[str, Any], None]:
        """Run the LLM analysis with automatic fallback between providers"""
        last_error = None
        CONNECTION_TIMEOUT = 2  # 5 seconds timeout
        RESPONSE_TIMEOUT = 10  # 5 seconds timeout for initial response

        for provider in self.llm_providers:
            yield {"type": "start", "message": f"Attempting analysis with {provider.provider_type}:{provider.model_name}..."}
            logging.info(f"Attempting analysis with {provider.provider_type}:{provider.model_name}...")

            # Prepare request parameters
            headers = {
                "Authorization": f"Bearer {provider.api_key}",
                "Content-Type": "application/json",
            }

            payload = {
                "model": provider.model_name,
                "messages": messages,
                "temperature": 0.75,
                "stream": True,
            }
            if provider.provider_type == "openrouter":
                payload["include_reasoning"] = True

            try:
                async with aiohttp.ClientSession() as session:
                    current_time = asyncio.get_event_loop().time()
                    try:
                        # Isolate timeout to just the connection establishment
                        async with asyncio.timeout(CONNECTION_TIMEOUT):
                            response = await session.post(
                                provider.base_url,
                                headers=headers,
                                json=payload,
                            )
                            # Immediately check if we got a valid response
                            if response.status != 200:
                                error_message = await response.text()
                                raise Exception(f"API error: {error_message}")

                    except asyncio.TimeoutError as e:
                        raise asyncio.TimeoutError(f"Connection timed out after {CONNECTION_TIMEOUT}s") from e
                    except aiohttp.ClientConnectionError as e:
                        raise Exception(f"Connection failed: {str(e)}") from e

                    logging.info(f"Connection response received in {asyncio.get_event_loop().time() - current_time}s")

                    # Now process the stream without timeout
                    got_data = False
                    last_valid_time = asyncio.get_event_loop().time()  # initialize last valid data time
                    content_iterator = response.content.__aiter__()

                    while True:
                        # Compute the remaining timeout based on time elapsed since the last valid data chunk
                        elapsed = asyncio.get_event_loop().time() - last_valid_time
                        remaining_timeout = RESPONSE_TIMEOUT - elapsed
                        if remaining_timeout <= 0:
                            error_msg = f"No {'initial' if not got_data else 'subsequent'} response within {RESPONSE_TIMEOUT}s"
                            raise asyncio.TimeoutError(error_msg)

                        try:
                            async with asyncio.timeout(remaining_timeout):
                                line = await content_iterator.__anext__()
                        except StopAsyncIteration:
                            break
                        except asyncio.TimeoutError as e:
                            error_msg = f"No {'initial' if not got_data else 'subsequent'} response within {RESPONSE_TIMEOUT}s"
                            raise asyncio.TimeoutError(error_msg) from e

                        decoded_line = line.decode("utf-8").strip()

                        logging.info(f"Decoded line: {decoded_line}")

                        if not decoded_line.startswith("data:"):
                            # Do not update last_valid_time if the line is not valid data.
                            continue
                        json_str = decoded_line[5:].strip()
                        if json_str == "[DONE]":
                            continue
                        try:
                            chunk = json.loads(json_str)
                        except json.JSONDecodeError as e:
                            logging.error(f"JSON decode error: {e} | Data: {json_str}")
                            raise

                        if "choices" not in chunk or not chunk["choices"]:
                            logging.error(f"Response missing 'choices' field: {chunk}")
                            raise Exception("Response missing 'choices' field")

                        delta = chunk["choices"][0].get("delta", {})

                        # Handle different content types, only yield if non-empty
                        if (content := delta.get("content")) is not None and content:
                            last_valid_time = asyncio.get_event_loop().time()
                            got_data = True  # Mark that we've received at least one valid chunk
                            yield {"type": "analysis", "content": content}

                        # Try to get reasoning from either key and yield it if it has non-whitespace content
                        if (resp_reasoning := (delta.get("reasoning_content") or delta.get("reasoning"))) is not None and resp_reasoning:
                            last_valid_time = asyncio.get_event_loop().time()
                            got_data = True  # Mark that we've received at least one valid chunk
                            yield {"type": "reasoning", "content": resp_reasoning}

                    if not got_data:
                        raise Exception("No data received from LLM stream")

                    yield {"type": "complete"}
                    logging.info("Analysis complete")
                    return  # Success - exit provider loop

            except (asyncio.TimeoutError, Exception) as e:
                logging.warning(f"Provider {provider.provider_type} error: {str(e)}")
                last_error = str(e)
                continue  # Try next provider

        # All providers failed
        yield {"type": "error", "message": f"All providers failed. Last error: {last_error}"}

    async def stream_analysis(self):
        """Stream the full analysis pipeline"""
        analysis = await self.run_analysis()
        messages = await self.generate_analysis_prompt(analysis)

        # save entire prompt to a file
        with open("prompt.txt", "w") as f:
            for message in messages:
                f.write(message["content"] + "\n")

        # log tokens used in the prompt using tiktoken
        enc = tiktoken.encoding_for_model("gpt-4o")
        logging.info(f"Tokens used in prompt: {sum([len(enc.encode(m['content'])) for m in messages])}")

        # dict = analysis.to_dict()
        # del dict["twitter_analysis"]

        # Yield initial data
        yield {"type": "metadata", "data": {}}

        async for chunk in self.run_llm_analysis(messages):
            yield chunk

    async def analyze_and_report(self) -> Dict[str, Any]:
        """Run full analysis pipeline and generate report"""
        analysis = await self.run_analysis()
        messages = await self.generate_analysis_prompt(analysis)

        reasoning_content = ""
        analysis_content = ""
        result: Dict[str, Any] = {
            "raw_data": analysis.to_dict(),
            "messages": messages,
            "llm_analysis": "",
            "llm_reasoning": "",
        }

        try:
            async for chunk in self.run_llm_analysis(messages):
                if chunk["type"] == "reasoning":
                    reasoning_content += chunk["content"]
                elif chunk["type"] == "analysis":
                    analysis_content += chunk["content"]
                elif chunk["type"] == "complete":
                    result.update({"llm_analysis": analysis_content.strip(), "llm_reasoning": reasoning_content.strip()})
        except Exception as e:
            result["error"] = str(e)

        return result


# async def main():
#     llm_config = LLMConfig(
#         api_key=os.getenv("DEEPSEEK_API_KEY"),
#         model_name="deepseek-reasoner",
#         base_url="https://api.deepseek.com",
#     )

#     driver = DeepseekDriver(
#         contract_address="7E448GypzBbahPkoUaATMBdYpeycnzyZ1g43myWogxAd",
#         ticker="$xyz",
#         llm_config=llm_config,
#     )

#     report = await driver.analyze_and_report()

#     with open("full_analysis_report.json", "w") as f:
#         json.dump(report, f, indent=2)

#     print("\nAnalysis complete! Results saved to 'full_analysis_report.json'")


# if __name__ == "__main__":
#     asyncio.run(main())
