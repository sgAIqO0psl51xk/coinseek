import asyncio
import datetime
import json
import logging
from typing import Any, Dict
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from xkl1s.deepseek_driver import DeepseekDriver, LLMProvider
import os
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

load_dotenv()

app = FastAPI()

COOLDOWN_PERIOD = datetime.timedelta(seconds=30)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.coinseek.fun",
        "http://www.coinseek.fun",
        "https://coinseek.fun",
        "http://coinseek.fun",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RateLimiter:
    def __init__(self):
        self.active_requests = {}
        self.lock = asyncio.Lock()

    async def check_rate_limit(self, ip: str) -> tuple[bool, str]:
        async with self.lock:
            current_time = datetime.datetime.now()
            
            if ip in self.active_requests:
                entry = self.active_requests[ip]
                
                # Check if request is active
                if entry["active"]:
                    return False, "Another request is already in progress"
                
                # Check cooldown period
                if entry["cooldown_until"] and current_time < entry["cooldown_until"]:
                    remaining = (entry["cooldown_until"] - current_time).total_seconds()
                    return False, f"Wait {int(remaining)} seconds before requesting again"
            
            # Either new IP or passed all checks - set active state
            self.active_requests[ip] = {
                "active": True,
                "cooldown_until": None,
                "last_request": current_time
            }
            return True, ""

    async def release_ip(self, ip: str):
        async with self.lock:
            if ip in self.active_requests:
                self.active_requests[ip] = {
                    "active": False,
                    "cooldown_until": datetime.datetime.now() + COOLDOWN_PERIOD,
                    "last_request": datetime.datetime.now()
                }

# Create global rate limiter instance
rate_limiter = RateLimiter()

@app.get("/analyze")
async def analyze(request: Request, contract_address: str, ticker: str = ""):
    logging.info(f"Received analyze request for contract: {contract_address}, ticker: {ticker}")
    
    client_ip = (
        request.headers.get("x-forwarded-for", "").split(",")[0].strip() or
        request.headers.get("x-real-ip", "") or
        request.client.host if request.client else ""
    )
    logging.info(f"Client IP: {client_ip}")

    async def error_response(message: str):
        # Format error as SSE event with both type and message
        error_data = f"event: error\ndata: {json.dumps({'type': 'error', 'message': message})}\n\n"
        return StreamingResponse(
            iter([error_data]),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
                "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
                "Access-Control-Allow-Credentials": "true",
            },
        )

    # Check rate limit
    is_allowed, error_message = await rate_limiter.check_rate_limit(client_ip)
    if not is_allowed:
        return await error_response(error_message)

    try:
        # Add logging for environment variables
        logging.info("Checking API keys...")
        if not os.getenv("OPENROUTER_API_KEY"):
            logging.error("OPENROUTER_API_KEY not found")
            return await error_response("Backend service configuration error: OPENROUTER_API_KEY missing", 500)
        if not os.getenv("DEEPSEEK_API_KEY"):
            logging.error("DEEPSEEK_API_KEY not found")
            return await error_response("Backend service configuration error: DEEPSEEK_API_KEY missing", 500)

        assert os.getenv("OPENROUTER_API_KEY"), "APIkey for OPENROUTER_API_KEY is not specified"
        assert os.getenv("DEEPSEEK_API_KEY"), "APIkey for DEEPSEEK_API_KEY is not specified"

        logging.info("Initializing DeepseekDriver...")
        llm_providers = [
            LLMProvider(
                api_key=os.getenv("DEEPSEEK_API_KEY", ""),  # Ensure this is set in your environment
                model_name="deepseek-reasoner",  # OpenRouter model name
                base_url="https://api.deepseek.com/chat/completions",  # OpenRouter's API endpoint
                provider_type="deepseek",
                priority=1,
            ),
            LLMProvider(
                api_key=os.getenv("OPENROUTER_API_KEY", ""),  # Ensure this is set in your environment
                model_name="deepseek/deepseek-r1:free",  # OpenRouter model name
                base_url="https://openrouter.ai/api/v1/chat/completions",  # OpenRouter's API endpoint
                provider_type="openrouter",
                priority=2,
            ),
            LLMProvider(
                api_key=os.getenv("OPENROUTER_API_KEY", ""),  # Ensure this is set in your environment
                model_name="deepseek/deepseek-r1:nitro",  # OpenRouter model name
                base_url="https://openrouter.ai/api/v1/chat/completions",  # OpenRouter's API endpoint
                provider_type="openrouter",
                priority=0,
            ),
            LLMProvider(
                api_key=os.getenv("OPENROUTER_API_KEY", ""),  # Ensure this is set in your environment
                model_name="deepseek/deepseek-r1-distill-qwen-1.5b",  # OpenRouter model name
                base_url="https://openrouter.ai/api/v1/chat/completions",  # OpenRouter's API endpoint
                provider_type="openrouter",
                priority=4,
            ),
        ]
        driver = DeepseekDriver(contract_address=contract_address, ticker=ticker, llm_providers=llm_providers)

        async def generate():
            try:
                logging.info(f"Starting analysis generation for {contract_address}")
                async for chunk in driver.stream_analysis():
                    event_type = chunk["type"]
                    payload = json.dumps(chunk)
                    event_data = f"event: {event_type}\ndata: {payload}\n\n"
                    yield event_data
            except Exception as e:
                logging.error(f"Error during analysis generation: {str(e)}", exc_info=True)
                error_data = f"event: error\ndata: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
                yield error_data
            finally:
                # Release the rate limit when done
                await rate_limiter.release_ip(client_ip)
                done_data = f"event: done\ndata: {{}}\n\n"
                yield done_data

        response = StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
                "Access-Control-Allow-Origin": "*",
            },
        )
        return response

    except Exception as e:
        # Make sure to release the rate limit on error
        await rate_limiter.release_ip(client_ip)
        logging.error(f"Unexpected error in analyze endpoint: {str(e)}", exc_info=True)
        return await error_response(f"An unexpected error occurred: {str(e)}")
