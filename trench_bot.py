import asyncio
import json
from typing import Any, Dict, Optional
import aiohttp


class TrenchBotFetcher:
    """
    Used to fetch a single token_address from trenchbot. Calls asynchronously but due to possible rate-limits
    try to construct this class slowly.
    """

    def __init__(self, token_address: str):
        self.token_address = token_address
        self.data: Dict[str, Any] = {}
        self.fetch_task = asyncio.create_task(self.fetch_data())

    async def fetch_data(self) -> None:
        """Fetch data from Trench Bot API asynchronously"""
        url = f"https://trench.bot/api/bundle/bundle_advanced/{self.token_address}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
            "Accept": "*/*",
            "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Referer": f"https://trench.bot/bundles/{self.token_address}?all=true",
            "Priority": "u=4",
        }
        async with aiohttp.ClientSession(headers=headers) as session:
            async with session.get(url) as response:
                response.raise_for_status()
                json = await response.json()
                self.data = json if json else {}

    async def get_total_percent_bundled(self) -> Optional[float]:
        await self.fetch_task
        return self.data.get("total_percentage_bundled", None)


async def main():
    token = "CnSYDcKcbSgrgwVBBiYZoU7trfbWCYo2v1YDVk6pump"
    fetcher = TrenchBotFetcher(token)

    total_percent = await fetcher.get_total_percent_bundled()
    print(f"Total % Bundled: {total_percent}")

    await fetcher.fetch_task
    with open("data.json", "w") as f:
        json.dump(fetcher.data, f, indent=4)


if __name__ == "__main__":
    asyncio.run(main())
