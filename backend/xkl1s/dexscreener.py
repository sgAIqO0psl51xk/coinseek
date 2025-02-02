import asyncio
from dataclasses import dataclass
import httpx
import json


@dataclass
class DexScreenerTokenData:
    mcap: float
    volume: float
    liquidity: float

    def __str__(self):
        return f"- Market Cap: {self.mcap}\n- Volume: {self.volume}\n- Liquidity: {self.liquidity}"


async def get_token_mcap_volume(token_address: str) -> DexScreenerTokenData:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.dexscreener.com/tokens/v1/solana/{token_address}")
        if response.status_code != 200:
            raise ValueError(f"DexScreener API error: {response.status_code}")

        try:
            data = response.json()
            if not data:
                raise ValueError(f"No pairs found for token {token_address}")

            pair = data[0]
            return DexScreenerTokenData(
                mcap=float(pair.get("marketCap", 0)),
                volume=float(pair.get("volume", {}).get("h24", 0)),
                liquidity=float(pair.get("liquidity", {}).get("usd", 0)),
            )
        except (KeyError, ValueError, json.JSONDecodeError) as e:
            raise ValueError(f"Failed to parse DexScreener response: {str(e)}")


async def main():
    token_address = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump"
    ret = await get_token_mcap_volume(token_address)
    print(ret)


if __name__ == "__main__":
    asyncio.run(main())
