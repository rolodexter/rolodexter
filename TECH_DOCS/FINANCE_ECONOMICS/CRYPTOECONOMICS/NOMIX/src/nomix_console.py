import sys
import time
import random
import asyncio
import logging
import os
import json
from datetime import datetime
from playwright.async_api import async_playwright
from dotenv import load_dotenv
from OpenRouterClient import OpenRouterClient

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - DATA - %(message)s')

# Ensure the pipeline directory exists
pipeline_dir = os.path.join(os.path.dirname(__file__), '..', 'pipeline')
os.makedirs(pipeline_dir, exist_ok=True)

# Use the provided Google News search URL
SEARCH_URL = ("https://www.google.com/search?num=10&newwindow=1&client=opera&hs=t1G&sca_esv=786443e18ae3204a"
              "&tbs=qdr:h&sxsrf=AHTn8zr10dmHjuKpQGteYGF3i-HmTdieRA:1739047434789&q=market%7Cmarkets&tbm=nws"
              "&source=lnms&fbs=ABzOT_BMFAjmf4MHFiC_aj19ExEe2K_iRnDax7zqM6ARHMmR-W83OTNTkuDIrxBsBC8BWQLc6HRAkQ96IUsCbaJf17LAgWIIUouZBQmsJYdJWoSgXC2nOMs45Y5HK5-OnwPPTac3gGuTKM-eWjIkfUibScrDzqSV2knHWn7GaXoZig75IPPHbgjVtQ9VSMTMkpi1qlAomBwU5UXCkTy9KPOrrPw2hSPx-A&sa=X&ved=2ahUKEwiYn-TE-LSLAxV8wzgGHThtGzMQ0pQJegQIJBAB&biw=1762&bih=1476&dpr=0.9")

# Initialize OpenRouterClient
open_router_client = OpenRouterClient()

# NEW: Async function to scrape live market news using Playwright
async def live_market_news():
    logging.info("Starting live market news scraping...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        logging.info("NOMIX launched.")
        page = await browser.new_page()
        
        await page.goto(SEARCH_URL, wait_until="load", timeout=120000)
        logging.info("Extracting data.")

        try:
            await page.wait_for_selector("h3", timeout=60000)
            logging.info("Selector found.")
        except Exception as e:
            logging.error(f"Error finding selector: {e}")
            await browser.close()
            return []

        articles = await page.locator("h3").all_text_contents()
        await browser.close()
        logging.info("NOMIX closed.")

        if not articles:
            logging.info("No market news found.")
            return []

        # Save results to JSON
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_path = os.path.join(pipeline_dir, f'market_news_{timestamp}.json')
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)
        logging.info(f"Results saved to {file_path}")

        return articles

# NEW: Function to read and process search results from a file
def read_search_results(file_path):
    logging.info(f"Reading search results from {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Process the content to extract relevant information
        results = content.split('\n\n')
        results = [result.strip() for result in results if result.strip()]
        logging.info(f"Extracted {len(results)} results from {file_path}")
        return results
    except Exception as e:
        logging.error(f"Error reading search results from {file_path}: {e}")
        return []

def list_available_topics(data_dir):
    topics = []
    for file_name in os.listdir(data_dir):
        if file_name.endswith('.md'):
            topic = file_name[:-3]  # Remove the .md extension
            topic = ' '.join(word.capitalize() for word in topic.split('_'))  # Capitalize each word
            topics.append(topic)
    return topics

def summarize_content(content):
    return open_router_client.summarizeContent(content)

def initialize_console():
    print("NOMIX")
    print("Developed by rolodexter.")

def login():
    username = input("Username: ")
    password = input("Password: ")
    if username == "joemaristela" and password == "rolodexter":
        return True
    else:
        print("Invalid credentials. Try again.")
        return False

def market_intelligence():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'demo', 'data')
    while True:
        print("\n[Market Intelligence]")
        print("D: Display live data")
        print("T: Display trends")
        print("A: Show alerts")
        print("B: Back to main menu")
        option = input("Select an option: ").lower()
        if option == "b":
            break
        elif option == "d":
            topics = list_available_topics(data_dir)
            if not topics:
                print("No topics available.")
                continue
            print("Available topics:")
            for idx, topic in enumerate(topics, start=1):
                print(f"{idx}. {topic}")
            try:
                topic_idx = int(input("Select a topic by number: ")) - 1
                if topic_idx < 0 or topic_idx >= len(topics):
                    raise ValueError("Invalid selection.")
            except ValueError as e:
                print(f"Error: {e}")
                continue
            file_path = os.path.join(data_dir, f"{topics[topic_idx].replace(' ', '_')}.md")
            print(f"Reading search results from {file_path}... (this may take a moment)")
            logging.info(f"Reading search results from {file_path}")
            try:
                results = read_search_results(file_path)
            except Exception as e:
                logging.error(f"Error during reading search results: {e}")
                print(f"Error during reading search results: {e}")
                continue
            if not results:
                logging.info("No data retrieved.")
                print("No data retrieved.")
                continue

            # Summarize the content
            content = '\n\n'.join(results)
            summary = summarize_content(content)
            print("\n--- Summary ---")
            print(summary)
            print("-" * 40)

            # Paginate results 5 at a time
            chunk_size = 5
            for i in range(0, len(results), chunk_size):
                chunk = results[i:i+chunk_size]
                print("\n--- Search Results ---")
                for res in chunk:
                    print(res)
                    print("-" * 40)
                if i + chunk_size < len(results):
                    more = input("Press Enter to see more or type 'B' to stop: ").lower()
                    if more == "b":
                        break
            input("Search results display completed. Press Enter to return to Market Intelligence menu.")
        elif option == "t":
            print("Displaying trends... (placeholder)")
        elif option == "a":
            print("Displaying alerts... (placeholder)")
        else:
            print("Unknown option. Please try again.")

def manage_watchlists():
    while True:
        print("\n[Watchlists]")
        print("A: Add a watchlist")
        print("R: Remove a watchlist")
        print("V: View watchlists")
        print("B: Back to main menu")
        option = input("Select an option: ")
        option = option.lower()
        if option == "b":
            break
        elif option == "a":
            print("Adding watchlist... (placeholder)")
        elif option == "r":
            print("Removing watchlist... (placeholder)")
        elif option == "v":
            print("Viewing watchlists... (placeholder)")
        else:
            print("Unknown option. Please try again.")

def manage_portfolios():
    while True:
        print("\n[Portfolios]")
        print("V: View portfolio")
        print("U: Update portfolio")
        print("B: Back to main menu")
        option = input("Select an option: ")
        option = option.lower()
        if option == "b":
            break
        elif option == "v":
            print("Viewing portfolio... (placeholder)")
        elif option == "u":
            print("Updating portfolio... (placeholder)")
        else:
            print("Unknown option. Please try again.")

def home_screen():
    print("\nNOMIX")
    while True:
        print("\nMain Menu:")
        print("1. Market Intelligence")
        print("2. Manage Watchlists")
        print("3. Manage Portfolios")
        print("L. Log out")
        option = input("Select an option: ")
        if option.lower() == "l":
            print("NOMIX logged out successfully.\n")
            break
        elif option == "1":
            market_intelligence()
        elif option == "2":
            manage_watchlists()
        elif option == "3":
            manage_portfolios()
        else:
            print("Unknown option. Please try again.")

def main():
    initialize_console()
    # Login loop
    while True:
        if login():
            home_screen()
        # After logout, loop back to login
    
if __name__ == "__main__":
    main()