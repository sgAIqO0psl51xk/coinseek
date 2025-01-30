# from fastapi import FastAPI, Response
# from fastapi.responses import StreamingResponse
# import asyncio
# from xkl1s.deepseek_driver import DeepseekDriver, LLMConfig
# import os
# from dotenv import load_dotenv

# load_dotenv()

# app = FastAPI()


# @app.get("/analyze/{contract_address}/{ticker}")
# async def analyze(contract_address: str, ticker: str):
#     llm_config = LLMConfig(
#         api_key=os.getenv("DEEPSEEK_API_KEY"),
#         model_name="deepseek-reasoner",
#         base_url="https://api.deepseek.com",
#     )

#     twitter_creds = {
#         "username": os.getenv("TWT_USERNAME"),
#         "email": os.getenv("TWT_EMAIL"),
#         "password": os.getenv("TWT_PASSWORD"),
#     }

#     driver = DeepseekDriver(
#         contract_address=contract_address,
#         ticker=ticker,
#         llm_config=llm_config,
#         twitter_creds=twitter_creds,
#     )

#     async def generate():
#         try:
#             async for chunk in driver.stream_analysis():
#                 yield f"data: {chunk}\n\n"
#         except Exception as e:
#             yield f"data: {{'error': '{str(e)}'}}\n\n"
#         finally:
#             yield "data: [DONE]\n\n"

#     return StreamingResponse(
#         generate(),
#         media_type="text/event-stream",
#         headers={
#             "Cache-Control": "no-cache",
#             "Connection": "keep-alive",
#         },
#     )
