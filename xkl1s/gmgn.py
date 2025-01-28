from typing import Dict
from humanfriendly import parse_size
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


def get_gmgn_info(token: str) -> Dict[str, int]:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    )

    driver = webdriver.Chrome(options=options)

    try:
        url = f"https://gmgn.ai/sol/token/{token}"
        driver.get(url)

        data = [
            (
                "Whale",
                "/html/body/div[1]/div/div/main/div[2]/div[2]/div[2]/div[1]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[1]/div/div[4]",
            ),
            (
                "Holders",
                "/html/body/div[1]/div/div/main/div[2]/div[2]/div[2]/div[1]/div/div/div[2]/div/div[2]/div[1]/button[3]/div",
            ),
            (
                "Snipers",
                "/html/body/div[1]/div/div/main/div[2]/div[2]/div[2]/div[1]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[1]/div/div[6]",
            ),
            (
                "KOL/VC",
                "/html/body/div[1]/div/div/main/div[2]/div[2]/div[2]/div[1]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[1]/div/div[3]",
            ),
        ]
        res = {}
        for name, xpath in data:
            element = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.XPATH, xpath)))
            value_text = element.text.strip().replace(",", "").split(" ")[1]
            if value_text == "":
                value_text = "0"
            res[name] = value_text

        ret = {}
        for key, value in res.items():
            try:
                ret[key] = parse_size(value)
            except ValueError:
                print(f"Error while parsing: {value}")
        return ret

    except TimeoutException:
        print("Timed out waiting for element to load")
        return {}
    finally:
        driver.quit()


if __name__ == "__main__":
    token = "9A2jUbgoDY97fruKHXvDd7eQiq4xvnW3By1BfH1Bwn9Y"
    value = get_gmgn_info(token)
    print(value)
