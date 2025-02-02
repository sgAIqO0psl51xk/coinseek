import asyncio
from typing import Any, Dict, Optional
import aiohttp
import ssl


class TrenchBotFetcher:
    """
    Used to fetch a single token_address from trenchbot. Calls asynchronously but due to possible rate-limits
    try to construct this class slowly.
    """

    def __init__(self, token_address: str):
        self.token_address = token_address
        self.data: Dict[str, Any] = {}
        self.fetch_task = asyncio.create_task(self.fetch_data())
        self.base_url = "https://trench.bot"
        # Create SSL context that doesn't verify certificates
        self.ssl_context = ssl.create_default_context()
        self.ssl_context.check_hostname = False
        self.ssl_context.verify_mode = ssl.CERT_NONE

    async def fetch_data(self) -> None:
        """Fetch data from Trench Bot API asynchronously"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/bundle/bundle_advanced/{self.token_address}", ssl=self.ssl_context) as response:
                    if response.status == 200:
                        self.data = await response.json()
                    else:
                        self.data = {"error": f"Failed to fetch data: {response.status}"}
        except Exception as e:
            self.data = {"error": f"Error fetching data: {str(e)}"}

    async def get_total_percent_bundled(self) -> Optional[float]:
        await self.fetch_task
        return self.data.get("total_percentage_bundled", None)

    async def get_current_held_as_percent_of_total_bundle(self) -> Optional[float]:
        await self.fetch_task
        hold_perc = self.data.get("total_holding_percentage", None)
        total_per = await self.get_total_percent_bundled()

        if hold_perc is None or total_per is None:
            return None
        return 0 if total_per == 0 else hold_perc / total_per

    async def get_ticker(self) -> str:
        await self.fetch_task
        return self.data.get("ticker", "")

    async def get_creator_analysis(self) -> Dict[str, Any]:
        await self.fetch_task
        creator_analysis = self.data.get("creator_analysis", {})
        # From the creator_analysis, count the number of 'is_rugs'
        is_rugs_count = sum(1 for coin in creator_analysis.get("history", {}).get("previous_coins", []) if coin.get("is_rugs", False))
        total_coins = len(creator_analysis.get("history", {}).get("previous_coins", []))
        is_high_risk = creator_analysis.get("high_risk", False)

        return {
            "number_of_rugs": is_rugs_count,
            "total_coins": total_coins,
            "is_high_risk": is_high_risk,
        }


async def main():
    token = "4eyTLdUxbAecMWCGHNfS8QnL4Bwv7b6G37oz7rrf5bVy"
    fetcher = TrenchBotFetcher(token)

    await fetcher.get_creator_analysis()

    # total_percent = await fetcher.get_total_percent_bundled()
    # print(f"Total % Bundled: {total_percent}")
    # percent_of_bundle = await fetcher.get_current_held_as_percent_of_total_bundle()
    # print(f"Percent of Bundle Held: {percent_of_bundle}")

    # await fetcher.fetch_task
    # with open("data.json", "w") as f:
    #     json.dump(fetcher.data, f, indent=4)


if __name__ == "__main__":
    asyncio.run(main())
