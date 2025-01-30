import logging
import re
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)

@dataclass
class User:
    username: str
    full_name: str
    followers: int
    verified: bool
    is_large: bool = field(init=False)

    def __post_init__(self):
        self.is_large = self.followers > 100_000

@dataclass
class Tweet:
    id: str
    url: str
    content: str
    user: 'User'
    metrics: Dict[str, int]
    replies: List['Tweet'] = field(default_factory=list)
    is_reply: bool = False
    parent_user: Optional['User'] = None

# Global cache for user profiles
user_cache: Dict[str, User] = {}

def parse_followers(text: str) -> int:
    """
    Convert follower text (e.g., "1.2K") to an integer.
    Example: "1.2K" -> 1200, "2M" -> 2,000,000
    """
    text = text.replace(",", "").upper().strip()
    match = re.match(r"([\d.]+)([KM]?)", text)
    if not match:
        return 0

    value, unit = match.groups()
    num = float(value)
    if unit == "K":
        return int(num * 1000)
    elif unit == "M":
        return int(num * 1_000_000)
    return int(num)

def get_user_profile(profile_driver: webdriver.Chrome, username: str) -> Optional[User]:
    """
    Get user profile from Nitter using the 'profile_driver'.
    Uses a global cache to avoid multiple requests for the same user.
    """
    if username in user_cache:
        return user_cache[username]

    try:
        profile_url = f"https://nitter.net/{username}"
        profile_driver.get(profile_url)

        # Wait for the profile's <nav> to load
        WebDriverWait(profile_driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "nav"))
        )

        # Extract profile info
        full_name = profile_driver.find_element(By.CSS_SELECTOR, ".profile-card-fullname").text
        followers_text = profile_driver.find_element(
            By.CSS_SELECTOR, "li.followers .profile-stat-num"
        ).text
        verified = len(profile_driver.find_elements(By.CSS_SELECTOR, ".verified-icon")) > 0

        user = User(
            username=username,
            full_name=full_name,
            followers=parse_followers(followers_text),
            verified=verified
        )
        user_cache[username] = user
        return user

    except Exception as e:
        logging.error(f"Failed to fetch user {username}: {e}")
        return None

def process_tweet_element(
    tweet_element,
    ticker: str,
    profile_driver: webdriver.Chrome
) -> Optional[Tweet]:
    """
    Process individual tweet element. Extracts main content, user info (via profile_driver),
    and basic engagement metrics.
    """
    try:
        content = tweet_element.find_element(By.CSS_SELECTOR, ".tweet-content").text
        # If you only want tweets mentioning the ticker:
        # TODO:Add a boolean or something to filter this its heavily reduces replies
        # if ticker and (ticker.lower() not in content.lower()):
        #     return None

        tweet_url = tweet_element.find_element(By.CSS_SELECTOR, ".tweet-link").get_attribute("href")
        tweet_id = tweet_url.split("/")[-1].split("#")[0]

        # Remove "@" from the username text
        username = tweet_element.find_element(By.CSS_SELECTOR, ".username").text.lstrip("@")

        # Fetch user profile with the separate driver
        user = get_user_profile(profile_driver, username)
        if not user:
            return None

        metrics = {
            "replies": 0,
            "retweets": 0,
            "quotes": 0,
            "likes": 0
        }

        for stat in tweet_element.find_elements(By.CSS_SELECTOR, ".tweet-stat"):
            stat_text = stat.text.strip()

            # Extract numeric value from text
            match = re.search(r"\d+", stat_text.replace(",", ""))
            value = int(match[0]) if match else 0

            # Check icon type
            html_snippet = stat.get_attribute("innerHTML")
            if "icon-comment" in html_snippet:
                metrics["replies"] = value
            elif "icon-retweet" in html_snippet:
                metrics["retweets"] = value
            elif "icon-quote" in html_snippet:
                metrics["quotes"] = value
            elif "icon-heart" in html_snippet:
                metrics["likes"] = value

        return Tweet(
            id=tweet_id,
            url=tweet_url,
            content=content,
            user=user,
            metrics=metrics
        )

    except Exception as e:
        logging.error(f"Error processing tweet element: {e}")
        logging.error(tweet_element.get_attribute("outerHTML"))
        return None

def search_tweets(search_driver: webdriver.Chrome, profile_driver: webdriver.Chrome, 
                  ticker: str, max_tweets=10) -> List[Tweet]:
    """
    Main search function:
    - Navigates 'search_driver' to Nitter's search page.
    - Collects tweets, extracts minimal data.
    - Uses 'profile_driver' to fetch user info (inside process_tweet_element).
    - Returns a list of Tweet objects up to 'max_tweets'.
    """
    # Navigate to the search URL
    search_driver.get(f"https://nitter.net/search?f=tweets&q={ticker}")

    # Wait until the <nav> is present to ensure page loaded
    WebDriverWait(search_driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "nav"))
    )

    collected_tweets = []

    while len(collected_tweets) < max_tweets:

        # Find visible tweets on the current page
        tweet_elements = search_driver.find_elements(By.CSS_SELECTOR, ".timeline-item")

        for tweet_element in tweet_elements:
            tweet = process_tweet_element(tweet_element, ticker, profile_driver)
            if tweet:
                collected_tweets.append(tweet)
                if len(collected_tweets) >= max_tweets:
                    break

        if len(collected_tweets) >= max_tweets:
            break

        # Attempt pagination ("Show more")
        try:
            show_more_link = search_driver.find_element(By.CSS_SELECTOR, ".show-more a")
            show_more_link.click()

            # Wait again for new tweets to load
            WebDriverWait(search_driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "nav"))
            )
        except NoSuchElementException:
            logging.info("No more 'show more' link found. Pagination ended.")
            break

    return collected_tweets[:max_tweets]

def fetch_one_level_replies(
    search_driver: webdriver.Chrome,
    profile_driver: webdriver.Chrome,
    tweets: List[Tweet],
    ticker: str,
    max_replies: int = 10
) -> None:
    """
    For each tweet in 'tweets':
      1) Navigate to the tweet's page in search_driver.
      2) Find .replies, parse replies (up to max_replies).
      3) If there is a "show more" link inside .replies, click it, wait, and parse again until
         no more link or until we've collected max_replies replies.
    """
    for tweet in tweets:
        # If we know there are 0 replies, skip
        if tweet.metrics.get('replies', 0) == 0:
            continue

        try:
            # Go to the tweet's permalink
            search_driver.get(tweet.url)

            # Wait briefly for replies container to load (if any)
            WebDriverWait(search_driver, 5).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".replies"))
            )
        except TimeoutException:
            logging.info(f"No replies found or took too long for tweet {tweet.id}")
            continue

        replies_collected = 0

        while replies_collected < max_replies:
            # Find all .reply containers
            reply_containers = search_driver.find_elements(By.CSS_SELECTOR, ".replies .reply")

            # Inside each .reply, there should be a .timeline-item
            for container in reply_containers:
                try:
                    reply_element = container.find_element(By.CSS_SELECTOR, ".timeline-item")
                except NoSuchElementException:
                    # Sometimes a .reply might be malformed or missing .timeline-item
                    continue

                # Parse the reply tweet
                reply_tweet = process_tweet_element(reply_element, ticker, profile_driver)
                if reply_tweet:
                    # Mark this tweet as a reply
                    reply_tweet.is_reply = True
                    tweet.replies.append(reply_tweet)
                    replies_collected += 1

                    if replies_collected >= max_replies:
                        break

            # If we've reached our limit, stop
            if replies_collected >= max_replies:
                break

            # Attempt to find "Show more" within .replies to load more replies
            try:
                show_more_link = search_driver.find_element(By.CSS_SELECTOR, ".replies .show-more a")
                show_more_link.click()
                
                # Wait again for new replies (or a short time for next batch to appear)
                WebDriverWait(search_driver, 2).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, ".show-more"))
                )
            except NoSuchElementException:
                # No more pagination link in replies
                logging.info(f"No more 'show more' link for replies in tweet {tweet.id}.")
                break
            except TimeoutException:
                logging.info(f"Timeout waiting for next batch of replies in tweet {tweet.id}.")
                break


if __name__ == "__main__":
    # 1) Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    # 2) Create two separate drivers
    #    - search_driver for scanning tweets & replies
    #    - profile_driver for fetching user profiles
    service = Service()
    search_driver = webdriver.Chrome(service=service, options=chrome_options)
    profile_driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        start_time = datetime.datetime.now()
        ticker = "elon"  # Ticker or CA to search

        # Step 1: Collect top-level tweets
        tweets = search_tweets(search_driver, profile_driver, ticker, max_tweets=2)

        # Step 2: For each top-level tweet, fetch replies one level deep
        fetch_one_level_replies(search_driver, profile_driver, tweets, ticker, max_replies=10)
        end_time = datetime.datetime.now()

        time_difference = (end_time - start_time).total_seconds()

        print(f"Time difference in seconds: {time_difference}")
              
        # Display final data
        for t in tweets:
            print("=== FINAL TWEET ===")
            print(f"ID: {t.id}")
            print(f"URL: {t.url}")
            print(f"Content: {t.content}")
            print(f"User: {t.user.username} ({t.user.full_name}) Followers: {t.user.followers}")
            print(f"Metrics: {t.metrics}")
            if t.replies:
                print("  -- REPLIES --")
                for r in t.replies:
                    print(f"    [REPLY] ID: {r.id} by {r.user.username} Followers: {r.user.followers}, content: {r.content}")
            print("---------------")

    finally:
        search_driver.quit()
        profile_driver.quit()
