import Logger from "./Logger.js";
import { format } from "date-fns";

class ResponseScheduler {
    constructor() {
        this.lastResponseTime = new Date();
        // Reduce interval to 2 minutes for testing (from 30 minutes)
        this.responseInterval = 2 * 60 * 1000;
        this.processedTweets = new Set();
    }

    shouldRespondToTweet(tweet) {
        // Don't respond to tweets we've already processed
        if (this.processedTweets.has(tweet.id)) return false;

        const now = new Date();
        const timeSinceLastResponse = now - this.lastResponseTime;

        // Check if enough time has passed since last response
        if (timeSinceLastResponse >= this.responseInterval) {
            const tweetDate = new Date(tweet.time);
            const tweetAge = now - tweetDate;
            
            // Only respond to tweets less than 6 hours old
            if (tweetAge <= 6 * 60 * 60 * 1000) {
                this.lastResponseTime = now;
                this.processedTweets.add(tweet.id);
                return true;
            }
        }

        return false;
    }

    generateResponse(tweet) {
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        return `[INGEST] ${timestamp}\nTweet received for processing.`;
    }

    // Cleanup old processed tweets to prevent memory bloat
    cleanup() {
        if (this.processedTweets.size > 1000) {
            this.processedTweets = new Set([...this.processedTweets].slice(-500));
        }
    }
}

export default ResponseScheduler;
