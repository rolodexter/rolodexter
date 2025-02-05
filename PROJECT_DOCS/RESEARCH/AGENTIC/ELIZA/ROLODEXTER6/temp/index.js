// index.js
import dotenv from 'dotenv';
dotenv.config();

import TwitterPipeline from './TwitterPipeline.js';
import Logger from './Logger.js';

process.on('unhandledRejection', (error) => {
  Logger.error(`❌ Unhandled promise rejection: ${error.message}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.error(`❌ Uncaught exception: ${error.message}`);
  process.exit(1);
});

const args = process.argv.slice(2);
const username = args[0] || 'degenspartan';

const pipeline = new TwitterPipeline(username);

// Extend pipeline to search for specific keywords and hashtags
pipeline.filterTweets = (tweets) => {
  return tweets.filter(tweet => {
    const text = tweet.text.toLowerCase();
    const hashtags = tweet.entities?.hashtags?.map(h => h.text.toLowerCase()) || [];

    return (
      text.includes('rolodexter') ||
      text.includes('rolodexterai') ||
      hashtags.includes('rolodexter')
    );
  });
};

const cleanup = async () => {
  Logger.warn('\n🛑 Received termination signal. Cleaning up...');
  try {
    if (pipeline.scraper) {
      await pipeline.scraper.logout();
      Logger.success('🔒 Logged out successfully.');
    }
  } catch (error) {
    Logger.error(`❌ Error during cleanup: ${error.message}`);
  }
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

pipeline.run()
  .then(tweets => {
    const filteredTweets = pipeline.filterTweets(tweets);
    Logger.success(`✅ Found ${filteredTweets.length} relevant tweets for keywords and hashtags.`);
    // Save filtered tweets or process further
  })
  .catch(() => process.exit(1));
