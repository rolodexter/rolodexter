import sys
import time
import random
import asyncio
from pyppeteer import launch

# NEW: Async function to scrape live market news using pyppeteer
async def live_market_news():
    browser = await launch(headless=True)
    page = await browser.newPage()
    url = ("https://www.google.com/search?num=10&newwindow=1&client=opera&hs=PKb&sca_esv=786443e18ae3204a"
           "&tbs=qdr:h&sxsrf=AHTn8zrTT-e_3XOnNBs1pTCgrJI4HRihIg:1739046021642&q=markets&tbm=nws")
    await page.goto(url)
    # Wait for the result elements—this selector may need adjustment for your locale.
    await page.waitForSelector('div.g')
    elements = await page.querySelectorAll('div.g')
    results = []
    # Extract text from each result element (for up to 10 results)
    for element in elements:
        text = await page.evaluate('(el) => el.innerText', element)
        if text:
            results.append(text)
    await browser.close()
    return results

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
            print("Scraping live market news... (this may take a moment)")
            try:
                results = asyncio.get_event_loop().run_until_complete(live_market_news())
            except Exception as e:
                print(f"Error during scraping: {e}")
                continue
            if not results:
                print("No data retrieved.")
                continue

            # Paginate results 5 at a time
            chunk_size = 5
            for i in range(0, len(results), chunk_size):
                chunk = results[i:i+chunk_size]
                print("\n--- Live News ---")
                for res in chunk:
                    print(res)
                    print("-" * 40)
                if i + chunk_size < len(results):
                    more = input("Press Enter to see more or type 'B' to stop: ").lower()
                    if more == "b":
                        break
            input("Live data stream completed. Press Enter to return to Market Intelligence menu.")
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