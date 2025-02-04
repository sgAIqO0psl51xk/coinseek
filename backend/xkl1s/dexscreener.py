import asyncio
from dataclasses import dataclass
import httpx
import json
from typing import Optional, List, Dict

@dataclass
class DexScreenerTokenData:
    mcap: float
    volume: float
    liquidity: float
    socials: Optional[List[Dict[str, str]]] = None

    def __str__(self):
        base_str = f"- Market Cap: {self.mcap}\n- Volume: {self.volume}\n- Liquidity: {self.liquidity}"
        if self.socials:
            social_urls = []
            for social in self.socials:
                if isinstance(social, dict):
                    if 'url' in social:
                        social_urls.append(social['url'])
                    elif isinstance(social, str):
                        social_urls.append(social)
            if social_urls:
                base_str += f"\n- Socials: {', '.join(social_urls)}"
        return base_str


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
            info = pair.get('info', {})
            
            socials = []
            
            if 'websites' in info:
                socials.extend(info['websites'])
            
            if 'socials' in info:
                socials.extend(info['socials'])

            return DexScreenerTokenData(
                mcap=float(pair.get("marketCap", 0)),
                volume=float(pair.get("volume", {}).get("h24", 0)),
                liquidity=float(pair.get("liquidity", {}).get("usd", 0)),
                socials=socials if socials else None
            )
        except (KeyError, ValueError, json.JSONDecodeError) as e:
            raise ValueError(f"Failed to parse DexScreener response: {str(e)}")


async def main():
    token_address = "FtBXDMyD4SvAa6keQPAGk4sgRVuUECsxGU1X2dLWpump"
    ret = await get_token_mcap_volume(token_address)
    print(ret)


if __name__ == "__main__":
    asyncio.run(main())