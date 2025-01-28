from curl_cffi import requests as c_requests


class GMGNTokenData:
    def __init__(self, token: str):
        self.token = token
        self.top_holder_json = None

    def _pull_top_holders(self):
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
        json = response.json()
        self.top_holder_json = json

    def get_top_wallets(self):
        if self.top_holder_json is None:
            self._pull_top_holders()

        return [wallet["address"] for wallet in self.top_holder_json["data"]]

    def get_top_holder_average_holding_time(self, num_wallets=4):
        wallets = self.get_top_wallets()[:num_wallets]
        holding_times = []
        for wallet in wallets:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://gmgn.ai/",
            }

            url = f"https://gmgn.ai/defi/quotation/v1/smartmoney/sol/walletNew/{wallet}?app_lang=en&period=7d"

            response = c_requests.get(url, headers=headers, impersonate="chrome110")
            json = response.json()
            holding_times.append(json["data"]["avg_holding_peroid"])

        return holding_times


if __name__ == "__main__":
    data = GMGNTokenData("8FqXr6dw5NHA2TtwFeDz6q9p7y9uWyoEdZmpXqqUpump")
    holding_times = data.get_top_holder_average_holding_time(5)
    print(holding_times)
