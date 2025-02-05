import Logger from "./Logger.js";
import { format } from "date-fns";

class ResponseScheduler {
    constructor() {
        this.lastResponseTime = new Date();
        this.responseInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
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
        // Very basic response template - you can enhance this
        return `Thanks for mentioning RolodexterAI! We're actively monitoring conversations about AI development and digital identity. Would love to hear more about your thoughts on this topic.`;
    }

    // Cleanup old processed tweets to prevent memory bloat
    cleanup() {
        if (this.processedTweets.size > 1000) {
            this.processedTweets = new Set([...this.processedTweets].slice(-500));
        }
    }
}

export default ResponseScheduler;
