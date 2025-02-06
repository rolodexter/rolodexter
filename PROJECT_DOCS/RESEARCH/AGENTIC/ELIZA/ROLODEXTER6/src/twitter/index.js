import dotenv from 'dotenv';
import inquirer from 'inquirer';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import DataOrganizer from './DataOrganizer.js';
dotenv.config();

import TwitterPipeline from './TwitterPipeline.js';
import Logger from './Logger.js';
import { loginToTwitter } from './Login.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Update cleanup function to only run on explicit termination
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

// Only attach cleanup to SIGINT (Ctrl+C) and SIGTERM
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Helper function for delays
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function extractTweets(page) {
  const tweets = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
    return articles.map(article => ({
      text: article.querySelector('[data-testid="tweetText"]')?.innerText || '',
      username: article.querySelector('[data-testid="User-Name"]')?.innerText.split('\n')[0] || '',
      timestamp: article.querySelector('time')?.dateTime || null,
      likes: parseInt(article.querySelector('[data-testid="like"]')?.innerText || '0'),
      retweets: parseInt(article.querySelector('[data-testid="retweet"]')?.innerText || '0'),
      permanentUrl: article.querySelector('time')?.parentElement?.href || ''
    }));
  });
  
  return tweets.filter(t => t.text && t.username);
}

async function displayTweetPreviews(tweets, query) {
  console.log('\n' + '='.repeat(80));
  console.log(chalk.cyan(`Latest ${Math.min(20, tweets.length)} tweets for "${query}":`));
  console.log('='.repeat(80) + '\n');

  tweets.slice(0, 20).forEach((tweet, i) => {
    console.log(chalk.yellow(`${i + 1}. Tweet by @${tweet.username}`));
    console.log(chalk.white(tweet.text));
    console.log(chalk.blue(`URL: ${tweet.permanentUrl}`));
    console.log('-'.repeat(80) + '\n');
  });
}

async function runContinuousMonitoring(page) {
  Logger.info('📝 Starting continuous Twitter monitoring...');
  
  const searchQueries = [
    'blockchain',
    'web3',
    'crypto',
    'NFT',
    'rolodexter',
    'rolodexterai'
  ];
  
  let currentQueryIndex = 0;
  const dataOrganizer = new DataOrganizer('pipeline', 'global_search');
  
  while (true) {
    try {
      const query = searchQueries[currentQueryIndex];
      Logger.info(`🔍 Executing search ${currentQueryIndex + 1}/${searchQueries.length}: "${query}"`);

      // Navigate to Twitter search with 'Latest' tab
      const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(query)}&f=live&vertical=default`;
      Logger.debug(`Navigating to: ${searchUrl}`);
      
      await page.goto(searchUrl, {
        waitUntil: ['networkidle0'],
        timeout: 30000
      });

      // Initial pause to let content load
      await delay(3000);

      // Verify we're on the search page
      const searchBox = await page.$('input[data-testid="SearchBox_Search_Input"]');
      if (!searchBox) {
        throw new Error('Failed to load search page');
      }

      // Wait for tweets to load
      const tweetsSelector = 'article[data-testid="tweet"]';
      await page.waitForSelector(tweetsSelector, { timeout: 10000 });
      
      // Scroll to load more tweets
      Logger.info('Loading more tweets...');
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await delay(1000);
      }
      
      // Collect tweets
      const tweets = await extractTweets(page);
      
      if (tweets.length > 0) {
        Logger.success(`Found ${tweets.length} tweets for "${query}"`);
        await dataOrganizer.saveTweets(tweets);
        
        // Display tweet previews in console
        await displayTweetPreviews(tweets, query);
      } else {
        Logger.warn(`No tweets found for "${query}"`);
      }

      // Rotate to next query
      currentQueryIndex = (currentQueryIndex + 1) % searchQueries.length;
      
      const minDelay = parseInt(process.env.MIN_DELAY || '30000');
      const maxDelay = parseInt(process.env.MAX_DELAY || '60000');
      const delayTime = Math.floor(Math.random() * (maxDelay - minDelay) + minDelay);
      
      Logger.info(`Waiting ${delayTime/1000}s before next query...`);
      await delay(delayTime);

    } catch (error) {
      Logger.error(`Error during monitoring: ${error.message}`);
      const retryDelay = parseInt(process.env.RETRY_DELAY || '60000');
      Logger.info(`Waiting ${retryDelay/1000}s before retry...`);
      await delay(retryDelay);
    }
  }
}

async function main() {
  try {
    const { runContinuous } = await inquirer.prompt([{
      type: 'confirm',
      name: 'runContinuous',
      message: 'Do you want to run in continuous monitoring mode?',
      default: false
    }]);

    // Get browser and page from login
    const result = await loginToTwitter();
    browser = result.browser;
    page = result.page;

    // Verify we're logged in by checking for home timeline
    await page.waitForSelector('div[data-testid="primaryColumn"]', { timeout: 10000 });
    Logger.success('Twitter login verified');

    if (runContinuous) {
      Logger.info('📝 Starting persistent Twitter monitoring session...');
      await runContinuousMonitoring(page);
    } else {
      // Handle single-run mode if needed
      Logger.info('Running in single-pass mode...');
      // Add your single-run logic here
    }

  } catch (error) {
    Logger.error('❌ Pipeline failed:', error);
    // Don't automatically close browser on error
    if (error.message.includes('Could not verify successful login')) {
      Logger.warn('Please check the browser window and try again if needed.');
      // Keep browser open for manual intervention
      return;
    }
    await cleanup();
  }
}

main().catch(error => {
  Logger.error('❌ Fatal error:', error);
  process.exit(1);
});
