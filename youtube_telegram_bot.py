from telegram import Update
from telegram.ext import Updater, MessageHandler, Filters, CallbackContext
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
import pandas as pd
from datasets import Dataset
import logging
import re

# 🔑 API KEYS - Replace with your own
YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY"
TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"

# 🛠️ Set up YouTube API
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

# 📜 Logging setup
logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)

# 📌 Function to extract video ID from YouTube URL
def extract_video_id(url):
    match = re.search(r"v=([^&]+)", url)
    if match:
        return match.group(1)
    return None

# 📌 Function to fetch video metadata
def get_video_details(video_id):
    request = youtube.videos().list(part="snippet,statistics", id=video_id)
    response = request.execute()
    
    if "items" in response and response["items"]:
        item = response["items"][0]
        return {
            "video_id": video_id,
            "title": item["snippet"]["title"],
            "channel_name": item["snippet"]["channelTitle"],
            "published_date": item["snippet"]["publishedAt"],
            "views": item["statistics"].get("viewCount", 0),
            "likes": item["statistics"].get("likeCount", 0),
            "comments": item["statistics"].get("commentCount", 0),
        }
    return None

# 📌 Function to get video transcript
def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([t["text"] for t in transcript])
    except:
        return None  # No transcript available

# 📌 Function to process YouTube link
def process_video(update: Update, context: CallbackContext):
    video_url = update.message.text.strip()
    video_id = extract_video_id(video_url)

    if not video_id:
        update.message.reply_text("❌ Invalid YouTube link. Please send a valid YouTube URL.")
        return

    update.message.reply_text("🔄 Processing video... Please wait.")

    # Get metadata & transcript
    metadata = get_video_details(video_id)
    transcript = get_transcript(video_id)

    if metadata and transcript:
        metadata["transcript"] = transcript
        df = pd.DataFrame([metadata])

        # Save locally
        dataset_file = "youtube_dataset.csv"
        df.to_csv(dataset_file, mode="a", index=False, header=False)

        # Upload to Hugging Face Dataset
        dataset = Dataset.from_pandas(df)
        dataset.push_to_hub("your_username/youtube_research_dataset", append=True)

        update.message.reply_text(f"✅ Video added!\n**Title:** {metadata['title']}\n**Channel:** {metadata['channel_name']}\n**Views:** {metadata['views']}")
    else:
        update.message.reply_text("❌ Failed to process video. It may not have a transcript.")

# 📌 Main bot function
def main():
    updater = Updater(TELEGRAM_BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    # Listen for YouTube links
    dp.add_handler(MessageHandler(Filters.text & Filters.regex(r"(https?://)?(www\.)?(youtube\.com|youtu\.be)"), process_video))

    # Start the bot
    updater.start_polling()
    logging.info("🤖 Bot is running...")
    updater.idle()

if __name__ == "__main__":
    main()
