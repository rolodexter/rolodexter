import Logger from "./Logger.js";
import { format } from "date-fns";
import OpenRouterClient from './OpenRouterClient.js';
import fs from 'fs/promises';
import path from 'path';

class ResponseScheduler {
    constructor() {
        this.lastResponseTime = new Date();
        // Reduce interval to 2 minutes for testing (from 30 minutes)
        this.responseInterval = 2 * 60 * 1000;
        this.processedTweets = new Set();
        this.llm = new OpenRouterClient();
        this.respondedTweetsFile = path.join(process.cwd(), 'data', 'responded_tweets.json');
        this.loadRespondedTweets();
    }

    async loadRespondedTweets() {
        try {
            await fs.mkdir(path.dirname(this.respondedTweetsFile), { recursive: true });
            const data = await fs.readFile(this.respondedTweetsFile, 'utf-8').catch(() => '[]');
            const tweetIds = JSON.parse(data);
            this.processedTweets = new Set(tweetIds);
            Logger.info(`Loaded ${this.processedTweets.size} previously responded tweets`);
        } catch (error) {
            Logger.warn(`Failed to load responded tweets: ${error.message}`);
            this.processedTweets = new Set();
        }
    }

    async saveRespondedTweets() {
        try {
            const tweetIds = Array.from(this.processedTweets);
            await fs.writeFile(this.respondedTweetsFile, JSON.stringify(tweetIds, null, 2));
        } catch (error) {
            Logger.warn(`Failed to save responded tweets: ${error.message}`);
        }
    }

    async shouldRespondToTweet(tweet) {
        // Don't respond to tweets we've already processed
        if (this.processedTweets.has(tweet.id)) {
            Logger.info(`Skipping tweet ${tweet.id} - already responded to`);
            return false;
        }
        
        // Don't respond if there's already a reply from rolodexter6
        if (tweet.hasRolodexterReply) return false;

        // Don't respond to our own tweets
        if (tweet.username.toLowerCase() === 'rolodexter6') return false;

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
                await this.saveRespondedTweets();
                return true;
            }
        }

        return false;
    }

    async generateResponse(tweet) {
        try {
            const llmResponse = await this.llm.generateResponse(tweet);
            return llmResponse;
        } catch (error) {
            Logger.error(`Failed to generate LLM response: ${error.message}`);
            // Fallback to default response
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            return `[INGEST] ${timestamp}\nTweet received for processing.`;
        }
    }

    // Cleanup old processed tweets to prevent memory bloat
    cleanup() {
        if (this.processedTweets.size > 1000) {
            // Remove the 'a' before 'new Set'
            this.processedTweets = new Set([...this.processedTweets].slice(-500));
        }
    }
}

export default ResponseScheduler;
