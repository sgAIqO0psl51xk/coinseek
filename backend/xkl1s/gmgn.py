import json
import logging
import random
import time
import asyncio
from typing import Any, Dict, List

import requests
from curl_cffi import requests as c_requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

proxies_table: List[Dict[str, str]] | List[None] = []

# Global rate limiter state
_last_request_time = 0.0
_rate_limit_lock = asyncio.Lock()


def get_proxy():
    global proxies_table
    if not proxies_table:
        try:
            url = (
                "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=json&timeout=420"
            )
            response = requests.get(url)
            proxies = response.json()
            if not proxies:
                raise Exception("No proxies found")
            if proxies.get("proxies"):
                proxies = proxies["proxies"]
            else:
                raise Exception("No proxies found")
            for proxy in proxies:
                port = proxy.get("port")
                ip = proxy.get("ip")
                protocol = proxy.get("protocol")

                proxies_table.append({protocol: f"{protocol}://{ip}:{port}"})
        except Exception as e:
            logging.error(f"Error fetching proxies: {e}")
            proxies_table = [None]
    return proxies_table


async def fetch_data_retry(headers: Dict[str, str], url: str, max_attempts: int = 7) -> Dict[str, Any]:
    global _last_request_time
    last_error = ""
    wait_time = 2

    for attempt in range(max_attempts):
        proxies = random.choice(get_proxy())
        try:
            logging.debug(f"Using proxy: {proxies}")

            # Rate limiting logic
            async with _rate_limit_lock:
                current_time = time.time()
                time_since_last = current_time - _last_request_time
                if time_since_last < 0.5:  # Ensure 2 requests per second max
                    await asyncio.sleep(0.5 - time_since_last)
                _last_request_time = time.time()

                # Make the actual request
                response = c_requests.get(url, headers=headers, impersonate="chrome110", proxies=proxies)

            response.raise_for_status()
            return response.json()
        except Exception as e:
            last_error = str(e)
            logging.warning(f"Attempt {attempt + 1} failed: {e}. With proxy {proxies}. Retrying in {wait_time} seconds...")
            if attempt + 1 != max_attempts:
                await asyncio.sleep(wait_time)

    logging.error(f"Exceeded max attempts: {last_error}")
    return {}


class GMGNWalletData:
    def __init__(self, wallet: str):
        self.wallet = wallet
        self.data: Dict[str, Any] = {}

    async def _pull_data(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://gmgn.ai/",
        }

        url = f"https://gmgn.ai/defi/quotation/v1/smartmoney/sol/walletNew/{self.wallet}?app_lang=en&period=7d"

        self.data = await fetch_data_retry(headers, url)
        self.data = self.data.get("data", {})

    async def get_holding_time(self) -> float:
        if self.data == {}:
            await self._pull_data()
        return self.data.get("avg_holding_peroid", 0)

    async def get_win_rate(self) -> float:
        if self.data == {}:
            await self._pull_data()
        wr = self.data.get("winrate", 0)
        if wr is None:
            return 0
        return wr

    async def get_30d_pctchange(self) -> float:
        if self.data == {}:
            await self._pull_data()
        return self.data.get("pnl_30d", 0)

    async def average_trades_per_day(self) -> float:
        if self.data == {}:
            await self._pull_data()
        return (self.data.get("buy_30d", 0) + self.data.get("sell_30d", 0)) / 30

    async def get_wallet_score(self) -> float:
        cur_score = 0
        best_score = 0

        best_score += 300
        win_rate = await self.get_win_rate()
        if win_rate >= 0.7:
            cur_score += 300
        elif win_rate >= 0.55:
            cur_score += 150
        elif win_rate >= 0.25:
            cur_score += 50

        best_score += 200
        pctchange_30d = await self.get_30d_pctchange()
        if pctchange_30d >= 0.75:
            cur_score += 200
        elif pctchange_30d >= 0.50:
            cur_score += 150
        elif pctchange_30d >= 0.25:
            cur_score += 50

        best_score += 100
        avg_trades = await self.average_trades_per_day()
        if avg_trades <= 5:
            cur_score += 100
        elif avg_trades <= 10:
            cur_score += 80
        else:
            cur_score += 50

        return cur_score / best_score if best_score != 0 else 0


class GMGNTokenData:
    def __init__(self, token: str):
        self.token = token
        self.top_holder_json: Dict[str, Any] = {}  # Initialize empty, will be populated on first use
        self.top_wallets: List[GMGNWalletData] = []

    async def _pull_data(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://gmgn.ai/",
        }

        url = (
            f"https://gmgn.ai/defi/quotation/v1/tokens/top_holders/sol/{self.token}?"
            "app_lang=en&orderby=amount_percentage&direction=desc&limit=1000"
        )

        response = await fetch_data_retry(headers, url)
        self.top_holder_json = response.get("data", {})

    async def get_top_wallets(self) -> List[GMGNWalletData]:
        if not self.top_holder_json:
            await self._pull_data()
        if not self.top_wallets:
            # Handle the case where top_holder_json might be a list
            holders: List[Dict[str, Any]] = self.top_holder_json if isinstance(self.top_holder_json, list) else []
            self.top_wallets = [
                GMGNWalletData(wallet.get("address", "")) for wallet in holders if isinstance(wallet, dict) and wallet.get("address")
            ]
        return self.top_wallets

    async def get_top_holder_average_holding_time(self, num_wallets: int = 4) -> float:
        wallets = (await self.get_top_wallets())[:num_wallets]
        holding_times = [await wallet.get_holding_time() for wallet in wallets]

        filtered_holding_times = [time for time in holding_times if time is not None and time > 0]

        if filtered_holding_times:
            average_holding_time = sum(filtered_holding_times) / len(filtered_holding_times)
            return average_holding_time
        else:
            return 0

    async def get_average_wallet_score(self, num_wallets: int = 4) -> float:
        wallets = (await self.get_top_wallets())[:num_wallets]
        scores = [await wallet.get_wallet_score() for wallet in wallets]

        filtered_scores = [score for score in scores if score is not None and score > 0]

        if filtered_scores:
            average_score = sum(filtered_scores) / len(filtered_scores)
            return average_score
        else:
            return 0


if __name__ == "__main__":

    async def main():
        data = GMGNTokenData("8FqXr6dw5NHA2TtwFeDz6q9p7y9uWyoEdZmpXqqUpump")
        print(f"Top 10 avg holding: {await data.get_top_holder_average_holding_time(10)}")
        print(f"Top 10 avg score: {await data.get_average_wallet_score(10)}")
        wallet = GMGNWalletData("BJVHxVNDbBVx6Nv1zckuPyKuboy8xjvvoTRYr97pToie")
        print(await wallet.get_wallet_score())

        with open("data.json", "w") as f:
            json.dump(wallet.data, f, indent=4)

    asyncio.run(main())
