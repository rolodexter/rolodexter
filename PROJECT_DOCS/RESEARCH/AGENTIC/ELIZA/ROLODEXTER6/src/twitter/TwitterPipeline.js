import inquirer from "inquirer";
import chalk from "chalk";
import { format } from "date-fns";
import path from "path";
import fs from "fs/promises";

// Imported Files
import Logger from "./Logger.js";
import DataOrganizer from "./DataOrganizer.js";
import TweetFilter from "./TweetFilter.js";

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

export class TwitterPipeline {
  constructor(username) {
    this.username = username;
    this.dataOrganizer = new DataOrganizer("pipeline", username);
    this.paths = this.dataOrganizer.getPaths();
    this.tweetFilter = new TweetFilter();
    this.tweets = [];

    // Update cookie path to be in top-level cookies directory
    this.paths.cookies = path.join(
      process.cwd(),
      'cookies',
      `${process.env.TWITTER_USERNAME}_cookies.json`
    );

    // Enhanced configuration with fallback handling
    this.config = {
      twitter: {
        maxTweets: parseInt(process.env.MAX_TWEETS) || 50000,
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
      const searchQuery = 'rolodexter6 OR rolodexterai';
      Logger.info(`🔍 Searching for tweets with query: ${searchQuery}`);
      const searchResults = scraper.searchTweets(
        searchQuery,
        this.config.twitter.maxTweets,
        SearchMode.LIVE
      );

      const allTweets = new Map();
      let previousCount = 0;
      let stagnantBatches = 0;
      const MAX_STAGNANT_BATCHES = 2;

      for await (const tweet of searchResults) {
        if (tweet && !allTweets.has(tweet.id)) {
          const processedTweet = this.processTweetData(tweet);
          if (processedTweet) {
            allTweets.set(tweet.id, processedTweet);

            if (allTweets.size % 100 === 0) {
              const completion = (
                (allTweets.size / this.config.twitter.maxTweets) *
                100
              ).toFixed(1);
              Logger.info(
                `📊 Progress: ${allTweets.size.toLocaleString()} unique tweets (${completion}%)`
              );

              if (allTweets.size === previousCount) {
                stagnantBatches++;
                if (stagnantBatches >= MAX_STAGNANT_BATCHES) {
                  Logger.info(
                    "📝 Collection rate has stagnated, checking fallback..."
                  );
                  break;
                }
              } else {
                stagnantBatches = 0;
              }
              previousCount = allTweets.size;
            }
          }
        }
      }

      // Use fallback for replies if needed
      if (
        allTweets.size < this.config.twitter.maxTweets * 0.8 &&
        this.config.fallback.enabled
      ) {
        Logger.info("\n🔍 Collecting additional tweets via fallback...");

        try {
          const fallbackTweets = await this.collectWithFallback(
            searchQuery
          );
          let newTweetsCount = 0;

          fallbackTweets.forEach((tweet) => {
            if (!allTweets.has(tweet.id)) {
              const processedTweet = this.processTweetData(tweet);
              if (processedTweet) {
                allTweets.set(tweet.id, processedTweet);
                newTweetsCount++;
                this.stats.fallbackUsed = true;
              }
            }
          });

          if (newTweetsCount > 0) {
            Logger.info(
              `Found ${newTweetsCount} additional tweets via fallback`
            );
          }
        } catch (error) {
          Logger.warn(`⚠️  Fallback collection error: ${error.message}`);
        }
      }

      Logger.success(
        `\n🎉 Collection complete! ${allTweets.size.toLocaleString()} unique tweets collected${
          this.stats.fallbackUsed
            ? ` (including ${this.stats.fallbackCount} from fallback)`
            : ""
        }`
      );

      return Array.from(allTweets.values());
    } catch (error) {
      Logger.error(`Failed to collect tweets: ${error.message}`);
      throw error;
    }
  }

  async searchMentions() {
    const searchQuery = 'rolodexterai';
    Logger.info(`🔍 Searching for mentions with query: ${searchQuery}`);
    const searchResults = this.scraper.searchTweets(
      searchQuery,
      this.config.twitter.maxTweets,
      SearchMode.LIVE
    );

    const mentions = [];
    for await (const tweet of searchResults) {
      if (tweet && tweet.text.includes('rolodexterai')) {
        mentions.push(tweet);
      }
    }

    Logger.info(`Found ${mentions.length} mentions of "rolodexterai".`);
    return mentions;
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

  async organizeTweets(tweets) {
    Logger.info("🗂️ Running tweet organization...");
    try {
        const baseDir = this.dataOrganizer.baseDir;
        const repliedPath = path.join(baseDir, 'processed', 'replied');
        const unrepliedPath = path.join(baseDir, 'processed', 'unreplied');

        // Create directories if they don't exist
        await fs.mkdir(repliedPath, { recursive: true });
        await fs.mkdir(unrepliedPath, { recursive: true });

        Logger.info("📂 Organizing tweets into replied/unreplied folders...");

        const replied = tweets.filter(t => t.isReply);
        const unreplied = tweets.filter(t => !t.isReply);

        await fs.writeFile(
            path.join(repliedPath, 'tweets.json'),
            JSON.stringify(replied, null, 2)
        );
        await fs.writeFile(
            path.join(unrepliedPath, 'tweets.json'),
            JSON.stringify(unreplied, null, 2)
        );

        return {
            replied: replied.length,
            unreplied: unreplied.length
        };
    } catch (error) {
        throw new Error(`Failed to organize tweets: ${error.message}`);
    }
}

  async run() {
    const startTime = Date.now();

    console.log("\n" + chalk.bold.blue("🐦 Twitter Data Collection Pipeline"));
    console.log(
      chalk.bold(`Target Account: ${chalk.cyan("@" + this.username)}\n`)
    );

    try {
      await this.validateEnvironment();

      // Initialize main scraper
      const scraperInitialized = await this.initializeScraper();
      if (!scraperInitialized && !this.config.fallback.enabled) {
        throw new Error(
          "Failed to initialize scraper and fallback is disabled"
        );
      }

      // Start collection
      Logger.startSpinner(`Collecting tweets from @${this.username}`);
      const allTweets = await this.collectTweets(this.scraper);
      Logger.stopSpinner();

      if (allTweets.length === 0) {
        Logger.warn("⚠️  No tweets collected");
        return;
      }

      // Normalize and process tweets
      const processedTweets = await Promise.all(
        allTweets.map(tweet => processTweetData(tweet))
      ).then(tweets => tweets.filter(t => t !== null));

      // Store processed tweets
      this.tweets = processedTweets;

      // Save collected data
      Logger.startSpinner("Processing and saving data");
      const analytics = await this.dataOrganizer.saveTweets(this.tweets);
      Logger.stopSpinner();

      // Organize tweets
      try {
        const organizationStats = await this.organizeTweets(this.tweets);
        analytics.organization = organizationStats;
      } catch (error) {
        Logger.warn(`⚠️ Tweet organization error: ${error.message}`);
      }

      // Calculate and display statistics
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const tweetsPerMinute = (this.tweets.length / (duration / 60)).toFixed(1);
      const successRate = ((this.tweets.length / (this.stats.requestCount + this.stats.fallbackCount)) * 100).toFixed(1);

      // Display results and analytics
      this.displayResults(analytics, {
        duration,
        tweetsPerMinute,
        successRate
      });

      // Show sample tweets
      await this.showSampleTweets(this.tweets);

      // Cleanup
      await this.cleanup();

      return {
        tweets: processedTweets,
        analytics
      };

    } catch (error) {
      Logger.error(`Pipeline failed: ${error.message}`);
      await this.logError(error, {
        stage: "pipeline_execution",
        runtime: (Date.now() - startTime) / 1000,
        stats: this.stats,
      });
      await this.cleanup();
      throw error;
    }
  }

  displayResults(analytics, stats) {
    // Display final results
    Logger.stats("📈 Collection Results", {
        "Total Tweets": this.tweets.length.toLocaleString(),
        "Original Tweets": analytics.directTweets.toLocaleString(),
        "Replies": analytics.replies.toLocaleString(),
        "Retweets": analytics.retweets.toLocaleString(),
        "Date Range": `${analytics.timeRange.start} to ${analytics.timeRange.end}`,
        "Runtime": `${stats.duration} seconds`,
        "Collection Rate": `${stats.tweetsPerMinute} tweets/minute`,
        "Success Rate": `${stats.successRate}%`,
        "Rate Limit Hits": this.stats.rateLimitHits.toLocaleString(),
        "Fallback Collections": this.stats.fallbackCount.toLocaleString(),
        "Storage Location": chalk.gray(this.dataOrganizer.baseDir),
    });

    // Content type breakdown
    Logger.info("\n📊 Content Type Breakdown:");
    console.log(
        chalk.cyan(`• Text Only: ${analytics.contentTypes.textOnly.toLocaleString()}`)
    );
    console.log(
        chalk.cyan(`• With Images: ${analytics.contentTypes.withImages.toLocaleString()}`)
    );
    console.log(
        chalk.cyan(`• With Videos: ${analytics.contentTypes.withVideos.toLocaleString()}`)
    );
    console.log(
        chalk.cyan(`• With Links: ${analytics.contentTypes.withLinks.toLocaleString()}`)
    );

    // Engagement statistics
    Logger.info("\n💫 Engagement Statistics:");
    console.log(
        chalk.cyan(`• Total Likes: ${analytics.engagement.totalLikes.toLocaleString()}`)
    );
    console.log(
        chalk.cyan(`• Total Retweets: ${analytics.engagement.totalRetweetCount.toLocaleString()}`)
    );
    console.log(
        chalk.cyan(`• Total Replies: ${analytics.engagement.totalReplies.toLocaleString()}`)
    );
    console.log(
        chalk.cyan(`• Average Likes: ${analytics.engagement.averageLikes}`)
    );

    // Collection method breakdown
    if (this.stats.fallbackUsed) {
        Logger.info("\n🔄 Collection Method Breakdown:");
        console.log(
            chalk.cyan(`• Primary Collection: ${(this.tweets.length - this.stats.fallbackCount).toLocaleString()}`)
        );
        console.log(
            chalk.cyan(`• Fallback Collection: ${this.stats.fallbackCount.toLocaleString()}`)
        );
    }
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

  async saveProgress(startTime, endTime, uniqueTweets, additionalStats) {
    const progressLog = {
      startTime,
      endTime,
      uniqueTweets,
      ...additionalStats,
    };

    const progressLogPath = path.join(
      this.dataOrganizer.baseDir,
      "meta",
      "progress_log.json"
    );

    try {
      let existingLogs = [];
      try {
        const existing = await fs.readFile(progressLogPath, "utf-8");
        existingLogs = JSON.parse(existing);
      } catch {
        // File doesn't exist yet
      }

      existingLogs.push(progressLog);

      // Keep only recent progress logs
      if (existingLogs.length > 100) {
        existingLogs = existingLogs.slice(-100);
      }

      await fs.writeFile(progressLogPath, JSON.stringify(existingLogs, null, 2));
    } catch (logError) {
      Logger.error(`Failed to save progress log: ${logError.message}`);
    }
  }

  async cleanup() {
    try {
      // Cleanup main scraper
      if (this.scraper) {
        await this.scraper.logout();
        Logger.success("🔒 Logged out of primary system");
      }

      // Cleanup fallback system
      if (this.cluster) {
        await this.cluster.close();
        Logger.success("🔒 Cleaned up fallback system");
      }

      await this.saveProgress(null, null, this.stats.uniqueTweets, {
        completed: true,
        endTime: new Date().toISOString(),
        fallbackUsed: this.stats.fallbackUsed,
        fallbackCount: this.stats.fallbackCount,
        rateLimitHits: this.stats.rateLimitHits,
      });

      Logger.success("✨ Cleanup complete");
    } catch (error) {
      Logger.warn(`⚠️  Cleanup error: ${error.message}`);
      await this.saveProgress(null, null, this.stats.uniqueTweets, {
        completed: true,
        endTime: new Date().toISOString(),
        error: error.message,
      });
    }
  }

  async postTweet(content) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log("🔑 Logging into Twitter...");
        
        await page.goto("https://twitter.com/i/flow/login", { waitUntil: "networkidle2" });
        
        // Load stored cookies
        if (await this.loadCookies(page)) {
            console.log("✅ Logged in via cookies.");
        } else {
            await page.type('input[name="session[username_or_email]"]', process.env.TWITTER_USERNAME, { delay: 50 });
            await page.type('input[name="session[password]"]', process.env.TWITTER_PASSWORD, { delay: 50 });
            await page.click('div[data-testid="LoginForm_Login_Button"]');
            await page.waitForNavigation({ waitUntil: "networkidle2" });
            await this.saveCookies(page);
        }

        // Navigate to tweet box
        await page.goto("https://twitter.com/compose/tweet", { waitUntil: "networkidle2" });

        // Enter tweet text
        await page.type('div[aria-label="Tweet text"]', content, { delay: 50 });

        // Click "Tweet" button
        await page.click('div[data-testid="tweetButtonInline"]');

        console.log("✅ Tweet posted successfully!");
    } catch (error) {
        console.error("❌ Error posting tweet:", error);
    } finally {
        await browser.close();
    }
  }

  // Add method to ensure tweets are in correct format
  normalizeTweets(rawTweets) {
    if (!Array.isArray(rawTweets)) {
      Logger.warn('Converting non-array tweets to array format');
      rawTweets = [rawTweets];
    }
    return rawTweets.map(tweet => {
      return {
        text: tweet.text || tweet.full_text || '',
        hashtags: (tweet.entities?.hashtags || []).map(h => h.text),
        // Add other fields you need
      };
    });
  }
}

export default TwitterPipeline;

async function processTweetData(tweet) {
  try {
    if (!tweet || !tweet.id) return null;

    // Ensure valid timestamp
    let timestamp = tweet.timestamp;
    if (!timestamp) {
      if (tweet.createdAt) {
        timestamp = new Date(tweet.createdAt).getTime();
      } else if (tweet.timeParsed) {
        timestamp = tweet.timeParsed.getTime();
      } else {
        // Default to current time if no valid timestamp
        timestamp = Date.now();
      }
    }

    // Convert to milliseconds if needed
    if (timestamp < 1e12) timestamp *= 1000;

    // Validate timestamp
    if (isNaN(timestamp) || timestamp <= 0) {
      Logger.warn(`Invalid timestamp for tweet ${tweet.id}, using current time`);
      timestamp = Date.now();
    }

    return {
      ...tweet,
      timestamp,
      createdAt: new Date(timestamp).toISOString(),
    };
  } catch (error) {
    Logger.warn(`Error processing tweet ${tweet?.id}: ${error.message}`);
    return null;
  }
}