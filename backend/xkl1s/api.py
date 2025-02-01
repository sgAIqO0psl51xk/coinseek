import asyncio
import datetime
import json
import logging
from typing import Any, Dict
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from xkl1s.deepseek_driver import DeepseekDriver, LLMProvider
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

active_requests: Dict[str, Any] = {}
active_requests_lock = asyncio.Lock()
COOLDOWN_PERIOD = datetime.timedelta(seconds=5)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze/")
async def analyze(request: Request, contract_address: str, ticker: str = ""):
    logging.info(f"Received analyze request for contract: {contract_address}, ticker: {ticker}")
    
    client_ip = "" if request.client is None else request.client.host
    current_time = datetime.datetime.now()
    logging.info(f"Client IP: {client_ip}")

    try:
        async with active_requests_lock:
            if client_ip in active_requests:
                entry = active_requests[client_ip]
                logging.info(f"Existing request found for IP: {client_ip}")

                if entry["active"]:
                    logging.warning("Request rejected: Another request is already in progress")
                    raise HTTPException(status_code=429, detail="Another request is already in progress")

                if entry["cooldown_until"] and current_time < entry["cooldown_until"]:
                    remaining = (entry["cooldown_until"] - current_time).total_seconds()
                    logging.warning(f"Request rejected: In cooldown period ({remaining} seconds remaining)")
                    raise HTTPException(status_code=429, detail=f"Wait {int(remaining)} seconds before requesting again")

                # Update entry for new request
                entry["active"] = True
            else:
                logging.info(f"New request entry created for IP: {client_ip}")
                active_requests[client_ip] = {"active": True, "cooldown_until": datetime.datetime.now()}

        # Add logging for environment variables
        logging.info("Checking API keys...")
        if not os.getenv("OPENROUTER_API_KEY"):
            logging.error("OPENROUTER_API_KEY not found")
        if not os.getenv("DEEPSEEK_API_KEY"):
            logging.error("DEEPSEEK_API_KEY not found")

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
                async with active_requests_lock:
                    if client_ip in active_requests:
                        active_requests[client_ip] = {
                            "active": False, 
                            "cooldown_until": datetime.datetime.now() + COOLDOWN_PERIOD,
                            "last_address": contract_address
                        }
                        logging.info(f"Request completed for IP: {client_ip}")
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
        logging.error(f"Unexpected error in analyze endpoint: {str(e)}", exc_info=True)
        raise
