import logging
import time
from typing import Any, Dict
from curl_cffi import requests as c_requests


def fetch_data_retry(headers: Dict[str, str], url: str, max_attempts: int = 5) -> Dict[str, Any]:
    last_error = ""
    for attempt in range(max_attempts):
        try:
            response = c_requests.get(url, headers=headers, impersonate="chrome110")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            last_error = str(e)
            wait_time = 2**attempt
            logging.warning(f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time} seconds...")
            if attempt + 1 != max_attempts:
                time.sleep(wait_time)

    logging.error(f"Exceeded max attempts: {last_error}")
    return {}
