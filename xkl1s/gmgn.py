import json
from typing import Any, Dict, List
from curl_cffi import requests as c_requests


class GMGNWalletData:
    def __init__(self, wallet: str):
        self.wallet = wallet
        self.data: Dict[str, Any] = {}

    def _pull_data(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://gmgn.ai/",
        }

        url = f"https://gmgn.ai/defi/quotation/v1/smartmoney/sol/walletNew/{self.wallet}?app_lang=en&period=7d"

        response = c_requests.get(url, headers=headers, impersonate="chrome110")
        ret = response.json()

        self.data = ret

    def get_holding_time(self) -> float:
        if self.data == {}:
            self._pull_data()

        return self.data["data"]["avg_holding_peroid"]

    def get_win_rate(self) -> float:
        if self.data == {}:
            self._pull_data()

        wr = self.data["data"]["winrate"]
        if wr is None:
            return 0
        return wr

    def get_30d_pctchange(self) -> float:
        if self.data == {}:
            self._pull_data()

        return self.data["data"]["pnl_30d"]

    def average_trades_per_day(self) -> float:
        if self.data == {}:
            self._pull_data()

        return (self.data["data"].get("buy_30d", 0) + self.data["data"].get("sell_30d", 0)) / 30

    def get_wallet_score(self) -> float:
        cur_score = 0
        best_score = 0

        best_score += 300
        win_rate = self.get_win_rate()
        if win_rate >= 0.7:
            cur_score += 300
        elif win_rate >= 0.55:
            cur_score += 150
        elif win_rate >= 0.25:
            cur_score += 50

        best_score += 200
        pctchange_30d = self.get_30d_pctchange()
        if pctchange_30d >= 0.75:
            cur_score += 200
        elif pctchange_30d >= 0.50:
            cur_score += 150
        elif pctchange_30d >= 0.25:
            cur_score += 50

        best_score += 100

        avg_trades = self.average_trades_per_day()
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
        self.top_holder_json = self._pull_data()
        self.top_wallets: List[GMGNWalletData] = []

    def _pull_data(self):
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

        response = c_requests.get(url, headers=headers, impersonate="chrome110")
        return response.json()

    def get_top_wallets(self) -> List[GMGNWalletData]:
        if not self.top_wallets:
            self.top_wallets = [GMGNWalletData(wallet["address"]) for wallet in self.top_holder_json["data"]]
        return self.top_wallets

    def get_top_holder_average_holding_time(self, num_wallets: int = 4) -> float:
        wallets = self.get_top_wallets()[:num_wallets]
        holding_times = [wallet.get_holding_time() for wallet in wallets]

        filtered_holding_times = [time for time in holding_times if time is not None and time > 0]

        if filtered_holding_times:
            average_holding_time = sum(filtered_holding_times) / len(filtered_holding_times)
            return average_holding_time
        else:
            return 0

    def get_average_wallet_score(self, num_wallets: int = 4) -> float:
        wallets = self.get_top_wallets()[:num_wallets]
        scores = [wallet.get_wallet_score() for wallet in wallets]

        filtered_scores = [time for time in scores if time is not None and time > 0]

        if filtered_scores:
            average_score = sum(scores) / len(filtered_scores)
            return average_score
        else:
            return 0


if __name__ == "__main__":
    data = GMGNTokenData("8FqXr6dw5NHA2TtwFeDz6q9p7y9uWyoEdZmpXqqUpump")
    print(f"Top 10 avg holding: {data.get_top_holder_average_holding_time(10)}")
    print(f"Top 10 avg score: {data.get_average_wallet_score(10)}s")
    wallet = GMGNWalletData("BJVHxVNDbBVx6Nv1zckuPyKuboy8xjvvoTRYr97pToie")
    print(wallet.get_wallet_score())

    with open("data.json", "w") as f:
        json.dump(wallet.data, f, indent=4)
