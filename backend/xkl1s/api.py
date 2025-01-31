import asyncio
import datetime
from typing import cast
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from xkl1s.deepseek_driver import DeepseekDriver, LLMConfig
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

active_requests = {}
active_requests_lock = asyncio.Lock()
COOLDOWN_PERIOD = datetime.timedelta(seconds=60)

@app.get("/analyze/{contract_address}/")
@app.get("/analyze/{contract_address}/{ticker}")
async def analyze(request: Request, contract_address: str, ticker: str = ""):
    client_ip = request.client.host
    current_time = datetime.datetime.now()

    async with active_requests_lock:
        if client_ip in active_requests:
            entry = active_requests[client_ip]
            
            if entry["active"]:
                raise HTTPException(
                    status_code=429,
                    detail="Another request is already in progress"
                )
                
            if entry["cooldown_until"] and current_time < entry["cooldown_until"]:
                remaining = (entry["cooldown_until"] - current_time).total_seconds()
                raise HTTPException(
                    status_code=429,
                    detail=f"Wait {int(remaining)} seconds before requesting again"
                )

            # Update entry for new request
            entry["active"] = True
        else:
            active_requests[client_ip] = {
                "active": True,
                "cooldown_until": datetime.datetime.now()
            }

    assert os.getenv("DEEPSEEK_API_KEY"), "APIkey for DEEPSEEK_API_KEY is not specified"
    llm_config = LLMConfig(
        api_key=cast(str, os.getenv("DEEPSEEK_API_KEY")),
        model_name="deepseek-reasoner",
        base_url="https://api.deepseek.com",
    )

    # twitter_creds = {
    #     "username": os.getenv("TWT_USERNAME"),
    #     "email": os.getenv("TWT_EMAIL"),
    #     "password": os.getenv("TWT_PASSWORD"),
    # }

    driver = DeepseekDriver(
        contract_address=contract_address,
        ticker=ticker,
        llm_config=llm_config,
    )

    async def generate():
        try:
            async for chunk in driver.stream_analysis():
                yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: {{'error': '{str(e)}'}}\n\n"
        finally:
            async with active_requests_lock:
                if client_ip in active_requests:
                    active_requests[client_ip] = {
                        "active": False,
                        "cooldown_until": datetime.datetime.now() + COOLDOWN_PERIOD
                    }
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )