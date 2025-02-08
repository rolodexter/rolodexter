import sys
import logging
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from .OpenRouterClient import OpenRouterClient  # Use relative import

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - DATA - %(message)s')

# Ensure the pipeline directory exists
pipeline_dir = os.path.join(os.path.dirname(__file__), '..', 'pipeline')
os.makedirs(pipeline_dir, exist_ok=True)

# Initialize OpenRouterClient
open_router_client = OpenRouterClient()

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