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
const username = args[0] || 'rolodexter6';

const pipeline = new TwitterPipeline(username);

// More restrictive tweet filtering
pipeline.filterTweets = (tweets) => {
  return tweets.filter(tweet => {
    // Skip if tweet is null or text is missing
    if (!tweet?.text) return false;
    
    const text = tweet.text.toLowerCase();
    const keywords = ['rolodexter', 'rolodexterai'];
    
    // Only keep tweets that contain any of our keywords
    return keywords.some(keyword => text.includes(keyword));
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
    Logger.success(`✅ Found ${filteredTweets.length} tweets containing rolodexter keywords`);
    return pipeline.dataOrganizer.saveTweets(filteredTweets); // Save only filtered tweets
  })
  .catch(() => process.exit(1));
