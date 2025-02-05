import inquirer from "inquirer";
import chalk from "chalk";
import { format } from "date-fns";
import path from "path";
import fs from "fs/promises";

// Imported Files
import Logger from "./Logger.js";
import DataOrganizer from "./DataOrganizer.js";
import TweetFilter from "./TweetFilter.js";
import ResponseScheduler from './ResponseScheduler.js';

// agent-twitter-client
import { Scraper, SearchMode } from "agent-twitter-client";

// Puppeteer
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import { Cluster } from "puppeteer-cluster";

// Configure puppeteer stealth once
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

class TwitterPipeline {
  constructor(username) {
    this.username = username;
    this.dataOrganizer = new DataOrganizer("pipeline", username);
    this.paths = this.dataOrganizer.getPaths();
    this.tweetFilter = new TweetFilter();
    this.responseScheduler = new ResponseScheduler();

    // Update cookie path to be in top-level cookies directory
    this.paths.cookies = path.join(
      process.cwd(),
      'cookies',
      `${process.env.TWITTER_USERNAME}_cookies.json`
    );

    // Enhanced configuration with fallback handling
    this.config = {
      twitter: {
        maxTweets: 1000, // Limit tweets to 1000
        maxRetries: parseInt(process.env.MAX_RETRIES) || 5,
        retryDelay: parseInt(process.env.RETRY_DELAY) || 5000,
        minDelayBetweenRequests: parseInt(process.env.MIN_DELAY) || 1000,
        maxDelayBetweenRequests: parseInt(process.env.MAX_DELAY) || 3000,
        rateLimitThreshold: 3, // Number of rate limits before considering fallback
      },
      fallback: {
        enabled: true,
        sessionDuration: 30 * 60 * 1000, // 30 minutes
        viewport: {
          width: 1366,
          height: 768,
          deviceScaleFactor: 1,
          hasTouch: false,
          isLandscape: true,
        },
      },
    };

    this.scraper = new Scraper();
    this.cluster = null;

    // Enhanced statistics tracking
    this.stats = {
      requestCount: 0,
      rateLimitHits: 0,
      retriesCount: 0,
      uniqueTweets: 0,
      fallbackCount: 0,
      startTime: Date.now(),
      oldestTweetDate: null,
      newestTweetDate: null,
      fallbackUsed: false,
    };

    this.browser = null;
    this.page = null;
  }

  async initializeFallback() {
    if (!this.cluster) {
      this.cluster = await Cluster.launch({
        puppeteer,
        maxConcurrency: 1, // Single instance for consistency
        timeout: 30000,
        puppeteerOptions: {
          headless: "new",
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
          ],
        },
      });

      this.cluster.on("taskerror", async (err) => {
        Logger.warn(`Fallback error: ${err.message}`);
        this.stats.retriesCount++;
      });
    }
  }

  async setupFallbackPage(page) {
    await page.setViewport(this.config.fallback.viewport);

    // Basic evasion only - maintain consistency
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });
  }

  async validateEnvironment() {
    Logger.startSpinner("Validating environment");
    const required = ["TWITTER_USERNAME", "TWITTER_PASSWORD"];
    const missing = required.filter((var_) => !process.env[var_]);

    if (missing.length > 0) {
      Logger.stopSpinner(false);
      Logger.error("Missing required environment variables:");
      missing.forEach((var_) => Logger.error(`- ${var_}`));
      console.log("\n📝 Create a .env file with your Twitter credentials:");
      console.log(`TWITTER_USERNAME=your_username`);
      console.log(`TWITTER_PASSWORD=your_password`);
      process.exit(1);
    }
    Logger.stopSpinner();
  }

async loadCookies() {
    try {
      if (await fs.access(this.paths.cookies).catch(() => false)) {
        const cookiesData = await fs.readFile(this.paths.cookies, 'utf-8');
        const cookies = JSON.parse(cookiesData);
        await this.scraper.setCookies(cookies);
        return true;
      }
    } catch (error) {
      Logger.warn(`Failed to load cookies: ${error.message}`);
    }
    return false;
}

async saveCookies() {
    try {
      const cookies = await this.scraper.getCookies();
      // Create cookies directory if it doesn't exist
      await fs.mkdir(path.dirname(this.paths.cookies), { recursive: true });
      await fs.writeFile(this.paths.cookies, JSON.stringify(cookies));
      Logger.success('Saved authentication cookies');
    } catch (error) {
      Logger.warn(`Failed to save cookies: ${error.message}`);
    }
}


  async initializeScraper() {
    Logger.startSpinner("Initializing Twitter scraper");
    let retryCount = 0;

    // Try loading cookies first
    if (await this.loadCookies()) {
      try {
        if (await this.scraper.isLoggedIn()) {
          Logger.success("✅ Successfully authenticated with saved cookies");
          Logger.stopSpinner();
          return true;
        }
      } catch (error) {
        Logger.warn("Saved cookies are invalid, attempting fresh login");
      }
    }

    // Verify all required credentials are present
    const username = process.env.TWITTER_USERNAME;
    const password = process.env.TWITTER_PASSWORD;
    const email = process.env.TWITTER_EMAIL;

    if (!username || !password || !email) {
      Logger.error("Missing required credentials. Need username, password, AND email");
      Logger.stopSpinner(false);
      return false;
    }

    // Attempt login with email verification
    while (retryCount < this.config.twitter.maxRetries) {
      try {
        // Add random delay before login attempt
        await this.randomDelay(5000, 10000);

        // Always use email in login attempt
        await this.scraper.login(username, password, email);

        // Verify login success
        const isLoggedIn = await this.scraper.isLoggedIn();
        if (isLoggedIn) {
          await this.saveCookies();
          Logger.success("✅ Successfully authenticated with Twitter");
          Logger.stopSpinner();
          return true;
        } else {
          throw new Error("Login verification failed");
        }

      } catch (error) {
        retryCount++;
        Logger.warn(
          `⚠️  Authentication attempt ${retryCount} failed: ${error.message}`
        );

        if (retryCount >= this.config.twitter.maxRetries) {
          Logger.stopSpinner(false);
          return false;
        }

        // Exponential backoff with jitter
        const baseDelay = this.config.twitter.retryDelay * Math.pow(2, retryCount - 1);
        const maxJitter = baseDelay * 0.2; // 20% jitter
        const jitter = Math.floor(Math.random() * maxJitter);
        await this.randomDelay(baseDelay + jitter, baseDelay + jitter + 5000);
      }
    }
    return false;
  }


  async randomDelay(min, max) {
    // Gaussian distribution for more natural delays
    const gaussianRand = () => {
      let rand = 0;
      for (let i = 0; i < 6; i++) rand += Math.random();
      return rand / 6;
    };

    const delay = Math.floor(min + gaussianRand() * (max - min));
    Logger.info(`Waiting ${(delay / 1000).toFixed(1)} seconds...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /*
  async initializeScraper() {
    Logger.startSpinner("Initializing Twitter scraper");
    let retryCount = 0;

    while (retryCount < this.config.twitter.maxRetries) {
      try {
        const username = process.env.TWITTER_USERNAME;
        const password = process.env.TWITTER_PASSWORD;

        if (!username || !password) {
          throw new Error("Twitter credentials not found");
        }

        // Try login with minimal parameters first
        await this.scraper.login(username, password);

        if (await this.scraper.isLoggedIn()) {
          Logger.success("✅ Successfully authenticated with Twitter");
          Logger.stopSpinner();
          return true;
        } else {
          throw new Error("Authentication failed");
        }
      } catch (error) {
        retryCount++;
        Logger.warn(
          `⚠️  Authentication attempt ${retryCount} failed: ${error.message}`
        );

        if (retryCount >= this.config.twitter.maxRetries) {
          Logger.stopSpinner(false);
          // Don't throw - allow fallback
          return false;
        }

        await this.randomDelay(
          this.config.twitter.retryDelay * retryCount,
          this.config.twitter.retryDelay * retryCount * 2
        );
      }
    }
    return false;
  }   */

  async randomDelay(min = null, max = null) {
    const minDelay = min || this.config.twitter.minDelayBetweenRequests;
    const maxDelay = max || this.config.twitter.maxDelayBetweenRequests;

    // Use gaussian distribution for more natural delays
    const gaussianRand = () => {
      let rand = 0;
      for (let i = 0; i < 6; i++) rand += Math.random();
      return rand / 6;
    };

    const delay = Math.floor(minDelay + gaussianRand() * (maxDelay - minDelay));
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  async handleRateLimit(retryCount = 1) {
    this.stats.rateLimitHits++;
    const baseDelay = 60000; // 1 minute
    const maxDelay = 15 * 60 * 1000; // 15 minutes

    // Exponential backoff with small jitter
    const exponentialDelay = baseDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    const delay = Math.min(exponentialDelay + jitter, maxDelay);

    Logger.warn(
      `⚠️  Rate limit hit - waiting ${
        delay / 1000
      } seconds (attempt ${retryCount})`
    );

    await this.randomDelay(delay, delay * 1.1);
  }

  processTweetData(tweet) {
    try {
      if (!tweet || !tweet.id) return null;

      let timestamp = tweet.timestamp;
      if (!timestamp) {
        timestamp = tweet.timeParsed?.getTime();
      }

      if (!timestamp) return null;

      if (timestamp < 1e12) timestamp *= 1000;

      if (isNaN(timestamp) || timestamp <= 0) {
        Logger.warn(`⚠️  Invalid timestamp for tweet ${tweet.id}`);
        return null;
      }

      const tweetDate = new Date(timestamp);
      if (
        !this.stats.oldestTweetDate ||
        tweetDate < this.stats.oldestTweetDate
      ) {
        this.stats.oldestTweetDate = tweetDate;
      }
      if (
        !this.stats.newestTweetDate ||
        tweetDate > this.stats.newestTweetDate
      ) {
        this.stats.newestTweetDate = tweetDate;
      }

      return {
        id: tweet.id,
        text: tweet.text,
        username: tweet.username || this.username,
        timestamp,
        createdAt: new Date(timestamp).toISOString(),
        isReply: Boolean(tweet.isReply),
        isRetweet: Boolean(tweet.isRetweet),
        likes: tweet.likes || 0,
        retweetCount: tweet.retweets || 0,
        replies: tweet.replies || 0,
        photos: tweet.photos || [],
        videos: tweet.videos || [],
        urls: tweet.urls || [],
        permanentUrl: tweet.permanentUrl,
        quotedStatusId: tweet.quotedStatusId,
        inReplyToStatusId: tweet.inReplyToStatusId,
        hashtags: tweet.hashtags || [],
      };
    } catch (error) {
      Logger.warn(`⚠️  Error processing tweet ${tweet?.id}: ${error.message}`);
      return null;
    }
  }

  async collectWithFallback(searchQuery) {
    if (!this.cluster) {
      await this.initializeFallback();
    }

    const tweets = new Set();
    let sessionStartTime = Date.now();

    const fallbackTask = async ({ page }) => {
      await this.setupFallbackPage(page);

      try {
        // Login with minimal interaction
        await page.goto("https://twitter.com/login", {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        await page.type(
          'input[autocomplete="username"]',
          process.env.TWITTER_USERNAME
        );
        await this.randomDelay(500, 1000);
        await page.click('div[role="button"]:not([aria-label])');
        await this.randomDelay(500, 1000);
        await page.type('input[type="password"]', process.env.TWITTER_PASSWORD);
        await this.randomDelay(500, 1000);
        await page.click('div[role="button"][data-testid="LoginButton"]');
        await page.waitForNavigation({ waitUntil: "networkidle0" });

        // Go directly to search
        await page.goto(
          `https://twitter.com/search?q=${encodeURIComponent(
            searchQuery
          )}&f=live`
        );
        await this.randomDelay(1000, 2000);

        let lastTweetCount = 0;
        let unchangedCount = 0;

        while (
          unchangedCount < 3 &&
          Date.now() - sessionStartTime < this.config.fallback.sessionDuration
        ) {
          await page.evaluate(() => {
            window.scrollBy(0, 500);
          });

          await this.randomDelay(1000, 2000);

          const newTweets = await page.evaluate(() => {
            const tweetElements = Array.from(
              document.querySelectorAll('article[data-testid="tweet"]')
            );
            return tweetElements
              .map((tweet) => {
                try {
                  return {
                    id: tweet.getAttribute("data-tweet-id"),
                    text: tweet.querySelector("div[lang]")?.textContent || "",
                    timestamp: tweet
                      .querySelector("time")
                      ?.getAttribute("datetime"),
                    metrics: Array.from(
                      tweet.querySelectorAll('span[data-testid$="count"]')
                    ).map((m) => m.textContent),
                  };
                } catch (e) {
                  return null;
                }
              })
              .filter((t) => t && t.id);
          });

          for (const tweet of newTweets) {
            if (!tweets.has(tweet.id)) {
              tweets.add(tweet);
              this.stats.fallbackCount++;
            }
          }

          if (tweets.size === lastTweetCount) {
            unchangedCount++;
          } else {
            unchangedCount = 0;
            lastTweetCount = tweets.size;
          }
        }
      } catch (error) {
        Logger.warn(`Fallback collection error: ${error.message}`);
        throw error;
      }
    };

    await this.cluster.task(fallbackTask);
    await this.cluster.queue({});

    return Array.from(tweets);
  }

  async collectTweets(scraper) {
    try {
      const HARD_LIMIT = 1000;
      const allTweets = new Map();
      let totalCollected = 0;

      Logger.info(`🔍 Searching for tweets containing 'rolodexter' or 'rolodexterai' (limit: ${HARD_LIMIT})`);

      try {
        // Updated search query with exclusions
        const searchResults = scraper.searchTweets(
          'from:* (rolodexter OR rolodexterai) -from:rolodexter6 -from:joemaristela',
          HARD_LIMIT * 2, // Request more to ensure we get enough after filtering
          SearchMode.Latest
        );

        for await (const tweet of searchResults) {
          // Stop if we've reached our limit
          if (totalCollected >= HARD_LIMIT) {
            Logger.info(`Reached ${HARD_LIMIT} tweet limit`);
            break;
          }

          // Check if tweet contains our keywords
          if (tweet?.text) {
            const text = tweet.text.toLowerCase();
            if (text.includes('rolodexter') || text.includes('rolodexterai')) {
              const processedTweet = this.processTweetData(tweet);
              if (processedTweet && !allTweets.has(tweet.id)) {
                allTweets.set(tweet.id, processedTweet);
                totalCollected++;
                if (totalCollected % 100 === 0) {
                  Logger.info(`📊 Progress: ${totalCollected}/${HARD_LIMIT} matching tweets`);
                }
              }
            }
          }
        }

        // Skip fallback collection - we want strict limit
        Logger.success(`\n🎉 Collection complete! Found ${totalCollected} matching tweets`);
        return Array.from(allTweets.values());

      } catch (error) {
        Logger.error(`Search error: ${error.message}`);
        throw error;
      }
    } catch (error) {
      Logger.error(`Failed to collect tweets: ${error.message}`);
      throw error;
    }
  }

  async showSampleTweets(tweets) {
    const { showSample } = await inquirer.prompt([
      {
        type: "confirm",
        name: "showSample",
        message: "Would you like to see a sample of collected tweets?",
        default: true,
      },
    ]);

    if (showSample) {
      Logger.info("\n🌟 Sample Tweets (Most Engaging):");

      const sortedTweets = tweets
        .filter((tweet) => !tweet.isRetweet)
        .sort((a, b) => b.likes + b.retweetCount - (a.likes + a.retweetCount))
        .slice(0, 5);

      sortedTweets.forEach((tweet, i) => {
        console.log(
          chalk.cyan(
            `\n${i + 1}. [${format(new Date(tweet.timestamp), "yyyy-MM-dd")}]`
          )
        );
        console.log(chalk.white(tweet.text));
        console.log(
          chalk.gray(
            `❤️ ${tweet.likes.toLocaleString()} | 🔄 ${tweet.retweetCount.toLocaleString()} | 💬 ${tweet.replies.toLocaleString()}`
          )
        );
        console.log(chalk.gray(`🔗 ${tweet.permanentUrl}`));
      });
    }
  }

  async getProfile() {
    const profile = await this.scraper.getProfile(this.username);
    return profile;
  }

  async postStatusUpdate(stats) {
    // Check if we already have a browser session
    if (!this.browser) {
        Logger.info('📝 Starting new browser session...');
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        this.page = await this.browser.newPage();
        
        // Initial login sequence
        await this.loginToTwitter(this.page);
    }

    try {
        // Use existing page
        Logger.info('📝 Preparing to post status update...');
        await this.page.goto('https://twitter.com/home');
        await this.randomDelay(2000, 3000);

        // Type and post tweet
        const statusUpdate = this.generateStatusUpdate(stats);
        await this.page.keyboard.type(statusUpdate);
        await this.randomDelay(1000, 2000);
        
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.up('Control');
        
        Logger.success('✅ Status update posted successfully');
    } catch (error) {
        Logger.error(`❌ Failed to post status update: ${error.message}`);
        // Try to re-establish session on error
        await this.resetSession();
    }
}

async loginToTwitter(page) {
    try {
        Logger.info('🔄 Logging into Twitter...');
        
        // Go to login page and wait for it to load
        await page.goto('https://twitter.com/i/flow/login', { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });
        await this.randomDelay(3000, 5000);

        // Type username and explicitly press Enter
        Logger.info('Entering username...');
        await page.waitForSelector('input[autocomplete="username"]', { visible: true });
        await page.type('input[autocomplete="username"]', process.env.TWITTER_USERNAME);
        await this.randomDelay(1000, 2000);
        await page.keyboard.press('Enter');
        
        // Wait for password field with better error handling
        Logger.info('Waiting for password field...');
        await page.waitForSelector('input[name="password"]', { 
            visible: true,
            timeout: 10000 
        });
        
        // Type password and submit
        Logger.info('Entering password...');
        await page.type('input[name="password"]', process.env.TWITTER_PASSWORD);
        await this.randomDelay(1000, 2000);
        await page.keyboard.press('Enter');

        // Wait for navigation and verify login
        await Promise.race([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
            page.waitForSelector('[data-testid="AppTabBar_Home_Link"]', { timeout: 60000 })
        ]);

        Logger.success('✅ Logged in successfully');
        return true;

    } catch (error) {
        Logger.error(`Failed to log in: ${error.message}`);
        await page.screenshot({ 
            path: `login-error-${Date.now()}.png`,
            fullPage: true 
        });
        throw error;
    }
}

async resetSession() {
    try {
        if (this.browser) {
            await this.browser.close();
        }
        this.browser = null;
        this.page = null;
    } catch (error) {
        Logger.warn(`⚠️ Error resetting session: ${error.message}`);
    }
}

  generateStatusUpdate(stats) {
    const now = new Date();
    return `[SYSTEM STATUS] ${format(now, 'yyyy-MM-dd HH:mm')}
Status: NOMINAL`;
  }

  async shouldSkipScraping() {
    const { skipScraping } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'skipScraping',
        message: 'Do you want to skip the scraper and go straight to posting a tweet?',
        default: false
      }
    ]);
    return skipScraping;
  }

  async run() {
    const startTime = Date.now();
    console.log("\n" + chalk.bold.blue("🐦 Twitter Data Collection Pipeline"));
    
    try {
        await this.validateEnvironment();
        
        // Ask if monitoring mode
        const { monitorMode } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'monitorMode',
                message: 'Do you want to run in continuous monitoring mode?',
                default: false
            }
        ]);

        if (monitorMode) {
            // Start monitoring and keep session alive
            await this.startMonitoring();
            return; // Don't run cleanup in monitoring mode
        }

        // Regular tweet collection and posting mode
        // ...rest of existing run() code...
    } catch (error) {
        Logger.error(`Pipeline failed: ${error.message}`);
        await this.logError(error, {
            stage: 'pipeline_execution',
            runtime: (Date.now() - startTime) / 1000,
        });
        throw error;
    }
    // Remove cleanup from here - we'll handle it in the index.js
}

  async logError(error, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
      },
      context: {
        ...context,
        username: this.username,
        sessionDuration: Date.now() - this.stats.startTime,
        rateLimitHits: this.stats.rateLimitHits,
        fallbackUsed: this.stats.fallbackUsed,
        fallbackCount: this.stats.fallbackCount,
      },
      stats: this.stats,
      config: {
        delays: {
          min: this.config.twitter.minDelayBetweenRequests,
          max: this.config.twitter.maxDelayBetweenRequests,
        },
        retries: this.config.twitter.maxRetries,
        fallback: {
          enabled: this.config.fallback.enabled,
          sessionDuration: this.config.fallback.sessionDuration,
        },
      },
    };

    const errorLogPath = path.join(
      this.dataOrganizer.baseDir,
      "meta",
      "error_log.json"
    );

    try {
      let existingLogs = [];
      try {
        const existing = await fs.readFile(errorLogPath, "utf-8");
        existingLogs = JSON.parse(existing);
      } catch {
        // File doesn't exist yet
      }

      existingLogs.push(errorLog);

      // Keep only recent errors
      if (existingLogs.length > 100) {
        existingLogs = existingLogs.slice(-100);
      }

      await fs.writeFile(errorLogPath, JSON.stringify(existingLogs, null, 2));
    } catch (logError) {
      Logger.error(`Failed to save error log: ${logError.message}`);
    }
  }

  async cleanup() {
    if (process.env.MONITOR_MODE === 'true') {
        Logger.info('Keeping session alive for monitoring...');
        return;
    }

    try {
        await this.resetSession();
        if (this.scraper) {
            await this.scraper.logout();
            Logger.success("🔒 Logged out of primary system");
        }
        if (this.cluster) {
            await this.cluster.close();
            Logger.success("🔒 Cleaned up fallback system");
        }
    } catch (error) {
        Logger.warn(`⚠️  Cleanup error: ${error.message}`);
    }
  }

  async startMonitoring() {
    if (!this.browser) {
        Logger.info('📝 Starting persistent Twitter monitoring session...');
        this.browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.loginToTwitter(this.page);
    }

    // Start monitoring loop
    Logger.info('🔍 Starting live tweet monitoring...');
    Logger.info(chalk.blue('💡 Click on tweet URLs to open in browser or copy to clipboard'));
    let lastSeenTweets = new Set();
    let respondedTweets = new Set(); // Track tweets we've replied to
    let currentMode = 'search'; // Use string instead of boolean
    let cycleCount = 0;

    while (true) {
        try {
            Logger.info(`\n🔄 Checking ${currentMode.toUpperCase()} feed...`);
            
            // Navigate based on mode
            if (currentMode === 'search') {
                const searchQuery = '(rolodexter OR rolodexterai) -from:rolodexter6 -from:joemaristela';
                await this.page.goto(`https://twitter.com/search?q=${encodeURIComponent(searchQuery)}&f=live`, {
                    waitUntil: 'networkidle2',
                    timeout: 60000
                });
            } else {
                await this.page.goto('https://twitter.com/home', {
                    waitUntil: 'networkidle2',
                    timeout: 60000
                });
            }
            await this.randomDelay(2000, 3000);

            // Extract tweets using self-contained evaluate function
            const tweets = await this.page.evaluate((mode) => {
                return Array.from(document.querySelectorAll('article[data-testid="tweet"]'))
                    .map(tweet => {
                        try {
                            const tweetLink = tweet.querySelector('a[href*="/status/"]')?.href || '';
                            if (!tweetLink) return null;

                            return {
                                id: tweetLink.split('/status/')[1]?.split('?')[0] || '',
                                username: tweet.querySelector('div[dir="ltr"] span')?.textContent || '',
                                text: tweet.querySelector('div[lang]')?.innerText || '',
                                time: tweet.querySelector('time')?.getAttribute('datetime') || '',
                                url: tweetLink,
                                source: mode,
                                metrics: {
                                    likes: tweet.querySelector('[data-testid="like"]')?.textContent || '0',
                                    retweets: tweet.querySelector('[data-testid="retweet"]')?.textContent || '0',
                                    replies: tweet.querySelector('[data-testid="reply"]')?.textContent || '0'
                                }
                            };
                        } catch (err) {
                            return null;
                        }
                    })
                    .filter(tweet => tweet?.id && tweet?.text);
            }, currentMode);

            // Process new tweets
            const newTweets = tweets.filter(tweet => !lastSeenTweets.has(tweet.id));
            newTweets.forEach(tweet => lastSeenTweets.add(tweet.id));

            // Prevent memory growth
            if (lastSeenTweets.size > 1000) {
                lastSeenTweets = new Set([...lastSeenTweets].slice(-500));
            }

            // Log results
            if (newTweets.length > 0) {
                Logger.info(`\n📢 Found ${newTweets.length} new tweets from ${currentMode.toUpperCase()}:\n`);
                
                // Find tweets we haven't responded to yet
                const unrespondedTweets = newTweets.filter(tweet => !respondedTweets.has(tweet.id));
                
                for (const tweet of unrespondedTweets) {
                    const date = new Date(tweet.time).toLocaleString();
                    
                    // Log tweet details
                    console.log(chalk.cyan(`\n@${tweet.username}`) + chalk.gray(` • ${date}`));
                    console.log(chalk.white(tweet.text));
                    console.log(chalk.bold.blue(`➜ ${tweet.url}`));
                    
                    // Try to respond to this tweet
                    try {
                        await this.page.goto(tweet.url);
                        await this.randomDelay(2000, 3000);
                        
                        // Click reply button
                        await this.page.waitForSelector('[data-testid="reply"]');
                        await this.page.click('[data-testid="reply"]');
                        await this.randomDelay(1000, 2000);
                        
                        // Generate and post response
                        const response = `[INGEST] ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\nTweet received for processing.`;
                        await this.page.keyboard.type(response);
                        await this.randomDelay(1000, 2000);
                        
                        await this.page.keyboard.down('Control');
                        await this.page.keyboard.press('Enter');
                        await this.page.keyboard.up('Control');
                        
                        // Mark as responded
                        respondedTweets.add(tweet.id);
                        Logger.success(`✅ Posted response to @${tweet.username}`);
                        
                        // Exit after first response
                        break;
                    } catch (error) {
                        Logger.error(`Failed to respond to tweet: ${error.message}`);
                        continue;
                    }
                }
            }

            // Toggle mode and wait
            currentMode = currentMode === 'search' ? 'following' : 'search';
            await this.randomDelay(5000, 8000);

        } catch (error) {
            Logger.error(`❌ Monitoring error: ${error.message}`);
            
            // Try to recover the session
            try {
                await this.resetSession();
                this.browser = await puppeteer.launch({
                    headless: false,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                this.page = await this.browser.newPage();
                await this.loginToTwitter(this.page);
                Logger.success('✅ Successfully recovered monitoring session');
            } catch (recoveryError) {
                Logger.error(`❌ Failed to recover session: ${recoveryError.message}`);
                throw recoveryError; // Stop monitoring if we can't recover
            }
            
            await this.randomDelay(30000, 60000);
        }
    }
}

}

export default TwitterPipeline;