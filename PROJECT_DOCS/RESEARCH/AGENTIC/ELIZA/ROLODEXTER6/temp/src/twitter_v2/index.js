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

// Use a dummy username since we're not filtering by user
const username = 'global_search';
const pipeline = new TwitterPipeline(username);

// Simplify the pipeline to use a single filtering pass
pipeline.filterTweets = (tweets) => {
  const LIMIT = 1000;
  return tweets
    .filter(tweet => {
      if (!tweet?.text) return false;
      const text = tweet.text.toLowerCase();
      return text.includes('rolodexter') || text.includes('rolodexterai');
    })
    .slice(0, LIMIT); // Ensure we never return more than limit
};

const cleanup = async () => {
  Logger.warn('\n🛑 Received termination signal. Cleaning up...');
  try {
    if (pipeline.browser) {
      await pipeline.browser.close();
      Logger.success('🔒 Browser closed.');
    }
    process.exit(0);
  } catch (error) {
    Logger.error(`❌ Error during cleanup: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

pipeline.run()
  .then(tweets => {
    const filteredTweets = pipeline.filterTweets(tweets);
    Logger.success(`✅ Found ${filteredTweets.length} tweets containing rolodexter keywords`);
    return pipeline.dataOrganizer.saveTweets(filteredTweets); // Save only filtered tweets
  })
  .catch(() => process.exit(1));
