// index.js
import dotenv from 'dotenv';
dotenv.config();

import TwitterPipeline from './TwitterPipeline.js';
import Logger from './Logger.js';
import inquirer from 'inquirer';
import puppeteer from 'puppeteer';
import TwitterLite from 'twitter-lite';

process.on('unhandledRejection', (error) => {
  Logger.error(`❌ Unhandled promise rejection: ${error.message}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.error(`❌ Uncaught exception: ${error.message}`);
  process.exit(1);
});

const args = process.argv.slice(2);
const DEFAULT_USERNAME = 'rolodexter6';  // Changed default
const username = DEFAULT_USERNAME; // Remove args override

const DEFAULT_CONFIG = {
  targetAccount: `@${DEFAULT_USERNAME}`,
  searchQuery: 'rolodexter6 OR rolodexterai',
  maxTweets: 1000,
  // ...existing code...
};

const pipeline = new TwitterPipeline(username);

// Extend pipeline to search for specific keywords and hashtags
pipeline.filterTweets = (tweets) => {
  return tweets.filter(tweet => {
    const text = tweet.text.toLowerCase();
    const hashtags = tweet.hashtags?.map(h => h.toLowerCase()) || [];

    return (
      text.includes('rolodexter6') ||
      text.includes('rolodexterai') ||
      hashtags.includes('rolodexter6') ||
      hashtags.includes('rolodexterai')
    );
  });
};

async function postSystemStatusTweet() {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-:]/g, '').split('.')[0];
  const tweetContent = `runtime_test_rolodexter6_${formattedDate}`;
  console.log(`\nPreview of the tweet:\n"${tweetContent}"\n`);

  const { postTweet } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'postTweet',
      message: 'Do you want to post this system status tweet?',
      default: false
    }
  ]);

  if (postTweet) {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ],
      userDataDir: './user_data'
    });
    const page = await browser.newPage();

    try {
      // Phase 1: Username Entry
      await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle2' });
      await page.waitForSelector('[autocomplete="username"]', { visible: true, timeout: 30000 });
      await page.type('[autocomplete="username"]', process.env.TWITTER_USERNAME, { delay: 100 });

      // Simulate pressing the "Enter" key after typing the username
      await page.keyboard.press('Enter');

      // Add a short delay before typing the password
      await new Promise(r => setTimeout(r, 2000));

      // Phase 2: Password Entry
      await page.waitForSelector('[name="password"]', { visible: true, timeout: 30000 });
      await page.keyboard.type('Babykin143!', { delay: 100 });

      // Verify that the password field is populated
      const passwordValue = await page.evaluate(() => document.querySelector('[name="password"]').value);
      if (!passwordValue) {
        throw new Error('Password field is not populated');
      }

      // Simulate pressing the "Enter" key after typing the password
      await page.keyboard.press('Enter');

      // Handle 2FA if required
      try {
        await page.waitForSelector('[data-testid="ocfEnterTextTextInput"]', { timeout: 5000 });
        await page.type('[data-testid="ocfEnterTextTextInput"]', process.env.TWITTER_2FA);
        await page.click('[data-testid="ocfSubmitButton"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
      } catch (err) {
        console.log('2FA not required');
      }

      // Wait for the tweet composition box
      await page.waitForSelector('div[aria-label="Post text"][role="textbox"]', { 
        visible: true,
        timeout: 30000 
      });

      // Input the tweet content with a delay to mimic human typing
      await page.type('div[aria-label="Post text"][role="textbox"]', tweetContent, { delay: 50 });

      // Simulate pressing Ctrl+Enter to send the tweet
      await page.keyboard.down('Control');
      await page.keyboard.press('Enter');
      await page.keyboard.up('Control');

      Logger.success('✅ System status tweet posted successfully.');
      await browser.close();
    } catch (error) {
      Logger.error(`❌ Failed to post system status tweet: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  } else {
    console.log('Skipping tweet posting.');
  }
}

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

async function organizeTweets() {
  Logger.info('📂 Organizing tweets into replied/unreplied folders...');
  try {
    const pythonScriptPath = Path.join(process.cwd(), 'scripts', 'organize_tweets.py');
    const { spawn } = require('child_process');
    const organizer = spawn('python', [pythonScriptPath], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    // Capture and log output
    organizer.stdout.on('data', (data) => {
      Logger.info(data.toString().trim());
    });

    organizer.stderr.on('data', (data) => {
      Logger.error(data.toString().trim());
    });

    return new Promise((resolve, reject) => {
      organizer.on('close', (code) => {
        if (code === 0) {
          Logger.success('✅ Successfully organized tweets into replied/unreplied folders');
          resolve();
        } else {
          Logger.error(`❌ Tweet organization failed with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    Logger.error(`❌ Error organizing tweets: ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log('🐦 Twitter Data Collection Pipeline');
  console.log(`Target Account: @${DEFAULT_USERNAME}`); // Use DEFAULT_USERNAME

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'runScraper',
      message: 'Do you want to run the scraper?',
      default: true
    }
  ]);

  if (!answer.runScraper) {
    console.log('Skipping scraper and collecting data.');
  } else {
    await pipeline.run()
      .then(async (results) => {
        // Ensure we have valid results with tweets array
        if (!results || !results.tweets || !Array.isArray(results.tweets)) {
          throw new Error('Invalid tweet data structure');
        }

        // Filter tweets using pipeline method
        const filteredTweets = pipeline.filterTweets(results.tweets);
        Logger.success(`✅ Found ${filteredTweets.length} relevant tweets for keywords and hashtags.`);
        
        // Run tweet organization
        Logger.info('🗂️ Running tweet organization...');
        await organizeTweets();
        
        // Post system status tweet
        await postSystemStatusTweet();
      })
      .catch((error) => {
        Logger.error(`❌ Pipeline error: ${error.message}`);
        process.exit(1);
      });
  }

  // New functionality to post system status tweet
  await postSystemStatusTweet();
}

main();
