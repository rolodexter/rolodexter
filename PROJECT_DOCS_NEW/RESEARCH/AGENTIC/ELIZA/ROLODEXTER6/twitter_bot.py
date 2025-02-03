import time
import tweepy

# Hardcoded Bearer Token and Twitter username
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAMrLygEAAAAAXfw56xlFRxVUf8lAgdOH%2Bp9qzHA%3D7Msb0LU9NxKAzhvlQVc6XvgWS3HVb5FOeh9wishhBa2g24HL37"
BOT_USERNAME = "rolodexter6"  # Replace with your bot's Twitter username

# Authenticate with Twitter
def authenticate():
    try:
        client = tweepy.Client(bearer_token=BEARER_TOKEN)
        print(f"Authentication successful! Logged in as: @{BOT_USERNAME}")
        return client
    except Exception as e:
        print(f"Error during authentication: {e}")
        exit()

# Fetch recent mentions
def fetch_mentions(client, since_id):
    print("Fetching mentions...")
    try:
        query = f"@{BOT_USERNAME}"
        mentions = client.search_recent_tweets(query=query, since_id=since_id, tweet_fields=["id", "text", "author_id"])
        return mentions.data if mentions and mentions.data else []
    except tweepy.TooManyRequests:
        print("Rate limit exceeded. Waiting 15 minutes before retrying...")
        time.sleep(15 * 60)  # Wait 15 minutes for rate limits to reset
        return []
    except Exception as e:
        print(f"Error fetching mentions: {e}")
        return []

# Respond to mentions
def respond_to_mentions(client, mentions):
    for mention in mentions:
        try:
            print(f"User ID {mention.author_id} said: {mention.text}")  # Debugging output
            response = f"Hello! How can I assist you today?"
            client.create_tweet(
                text=f"@{BOT_USERNAME} {response}",
                in_reply_to_tweet_id=mention.id
            )
            print(f"Replied to tweet ID {mention.id} with: {response}")
        except Exception as e:
            print(f"Error responding to tweet ID {mention.id}: {e}")

# Main bot loop
def main():
    client = authenticate()
    since_id = None  # Initialize since_id to None

    while True:
        mentions = fetch_mentions(client, since_id)

        if mentions:
            since_id = max(int(tweet.id) for tweet in mentions) if mentions else since_id  # Safeguard for empty mentions
            respond_to_mentions(client, mentions)

        print("Waiting before fetching new mentions...")
        time.sleep(60)  # Wait 1 minute before checking again

if __name__ == "__main__":
    main()
