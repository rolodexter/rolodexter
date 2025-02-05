import json
import os
from datetime import datetime
from pathlib import Path

# Update import to work with npm run location
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pipeline.tweet_organizer import TweetOrganizer

def organize_existing_tweets():
    # Get today's date folder
    today = datetime.now().strftime("%Y-%m-%d")
    base_path = Path("pipeline/rolodexter6") / today
    
    print(f"🔍 Processing tweets from: {base_path}")
    
    # Initialize organizer
    organizer = TweetOrganizer(base_path)
    
    tweets_processed = 0
    tweets_replied = 0
    tweets_unreplied = 0

    # Read existing tweets from finetuning.jsonl
    tweets_file = base_path / "processed" / "finetuning.jsonl"
    urls_file = base_path / "raw" / "urls.txt"
    
    # Load URL list to check for replies
    replied_urls = set()
    if urls_file.exists():
        with open(urls_file, 'r', encoding='utf-8') as f:
            for line in f:
                if '/status/' in line:
                    replied_urls.add(line.strip())

    # Process each tweet
    if tweets_file.exists():
        with open(tweets_file, 'r', encoding='utf-8') as f:
            for line in f:
                tweets_processed += 1
                tweet = json.loads(line)
                text = tweet['text']
                
                # Check if this tweet has a reply by looking for its URL in the urls.txt file
                tweet_hash = organizer._hash_tweet(text)
                has_reply = any(tweet_hash[:6] in url for url in replied_urls)
                
                # Process the tweet
                if organizer.process_tweet(text, has_reply):
                    if has_reply:
                        tweets_replied += 1
                    else:
                        tweets_unreplied += 1
                
        print(f"\n✅ Organization complete!")
        print(f"📊 Results:")
        print(f"  • Total tweets processed: {tweets_processed}")
        print(f"  • Tweets with replies: {tweets_replied}")
        print(f"  • Tweets without replies: {tweets_unreplied}")
        print(f"\n📁 Output directories:")
        print(f"  • {organizer.replied_path}")
        print(f"  • {organizer.unreplied_path}")
    else:
        print("❌ No tweets file found to organize")

if __name__ == "__main__":
    organize_existing_tweets()
