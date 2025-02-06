import dotenv from 'dotenv';
import inquirer from 'inquirer';
dotenv.config();

import TwitterPipeline from './TwitterPipeline.js';
import Logger from './Logger.js';
import { loginToTwitter } from './Login.js';

let currentMode = 'manual';
let browser = null;
let page = null;

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

// Update cleanup function
const cleanup = async () => {
  Logger.warn('\n🛑 Received termination signal. Cleaning up...');
  try {
    if (browser && browser.isConnected()) {
      await browser.close();
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

async function monitorTweets(page) {
  try {
    while (currentMode === 'continuous') {
      await page.goto('https://twitter.com/search?q=rolodexter%20OR%20rolodexterai&f=live', {
        waitUntil: 'networkidle2'
      });
      
      // Wait for tweets to load
      await page.waitForSelector('article[data-testid="tweet"]', { timeout: 30000 });
      
      // Extract tweets
      const tweets = await page.evaluate(() => {
        const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
        return Array.from(tweetElements).map(tweet => ({
          text: tweet.textContent,
          timestamp: new Date().toISOString()
        }));
      });

      if (tweets.length > 0) {
        Logger.info(`Found ${tweets.length} new tweets`);
        await pipeline.dataOrganizer.saveTweets(pipeline.filterTweets(tweets));
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  } catch (error) {
    Logger.error(`Monitoring error: ${error.message}`);
    throw error;
  }
}

async function startMonitoring() {
  try {
    const session = await loginToTwitter();
    browser = session.browser;
    page = session.page;
    
    currentMode = 'continuous';
    Logger.info('🔍 Starting live tweet monitoring...');
    Logger.info('💡 Click on tweet URLs to open in browser or copy to clipboard');

    await monitorTweets(page);
  } catch (error) {
    Logger.error(`❌ Pipeline failed: ${error.message}`);
    if (browser) await browser.close();
    throw error;
  }
}

// Replace pipeline.run with direct prompt
async function runPipeline() {
  try {
    const answer = await inquirer.prompt([{
      type: 'confirm',
      name: 'continuous',
      message: 'Do you want to run in continuous monitoring mode?',
      default: false
    }]);

    if (answer.continuous) {
      Logger.info('📝 Starting persistent Twitter monitoring session...');
      await startMonitoring();
    } else {
      // Single run mode
      currentMode = 'manual';
      const session = await loginToTwitter();
      browser = session.browser;
      page = session.page;
      
      Logger.info('🔍 Performing single search...');
      await page.goto('https://twitter.com/search?q=rolodexter%20OR%20rolodexterai&f=live');
      await page.waitForSelector('article[data-testid="tweet"]');
      
      const tweets = await page.evaluate(() => {
        const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
        return Array.from(tweetElements).map(tweet => ({
          text: tweet.textContent,
          timestamp: new Date().toISOString()
        }));
      });

      const filteredTweets = pipeline.filterTweets(tweets);
      Logger.success(`✅ Found ${filteredTweets.length} tweets containing rolodexter keywords`);
      await pipeline.dataOrganizer.saveTweets(filteredTweets);
      await browser.close();
    }
  } catch (error) {
    Logger.error(`❌ Error in pipeline: ${error.message}`);
    if (browser && browser.isConnected()) await browser.close();
    throw error;
  }
}

// Start the pipeline
runPipeline().catch(error => {
  Logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
