import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Logger from './Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add stealth plugin and use defaults
puppeteer.use(StealthPlugin());

import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import path from "path";
import fs from "fs/promises";

puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const COOKIES_PATH = path.join(
  process.cwd(),
  "cookies",
  `${process.env.TWITTER_USERNAME}_cookies.json`
);

// Helper function for delays
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function loadCookies(page) {
  try {
    const cookiesData = await fs.readFile(COOKIES_PATH, "utf-8");
    const cookies = JSON.parse(cookiesData);
    await page.setCookie(...cookies);
    console.log("✅ Cookies loaded successfully.");
    return true;
  } catch (error) {
    console.warn("⚠️ No valid cookies found or failed to load cookies.");
    return false;
  }
}

async function saveCookies(page) {
  try {
    const cookies = await page.cookies();
    await fs.mkdir(path.dirname(COOKIES_PATH), { recursive: true });
    await fs.writeFile(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log("✅ Cookies saved successfully.");
  } catch (error) {
    console.warn(`⚠️ Failed to save cookies: ${error.message}`);
  }
}

async function loginToTwitter() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1280,800"
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    Logger.info("🔑 Logging into Twitter...");

    // Try loading cookies first
    const cookiesLoaded = await loadCookies(page);
    if (cookiesLoaded) {
      await page.goto("https://twitter.com/home", { 
        waitUntil: "domcontentloaded",
        timeout: 60000 
      });
      
      // More reliable login check
      try {
        await page.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', {
          timeout: 10000
        });
        Logger.success("✅ Already logged in using cookies.");
        return { browser, page };
      } catch (e) {
        Logger.warn("Cookie login failed, proceeding with manual login...");
      }
    }

    // Go to login page and wait for it to load
    await page.goto("https://twitter.com/i/flow/login", { 
      waitUntil: "domcontentloaded",
      timeout: 60000 
    });

    // Wait for page to settle
    await delay(3000);

    // Updated username input sequence with better error handling
    Logger.info("Entering username...");
    try {
      await page.waitForSelector('input[autocomplete="username"]', { timeout: 15000 });
      await page.type('input[autocomplete="username"]', process.env.TWITTER_USERNAME, { delay: 100 });
      await delay(1000);
      await page.keyboard.press('Enter');
    } catch (error) {
      Logger.error("Failed at username step:", error);
      throw new Error("Username input failed");
    }

    // Wait longer for password field and verify it's actually visible
    Logger.info("Waiting for password field...");
    await delay(3000);
    
    try {
      await page.waitForSelector('input[type="password"]', { visible: true, timeout: 15000 });
      Logger.info("Entering password...");
      await page.type('input[type="password"]', process.env.TWITTER_PASSWORD, { delay: 100 });
      await delay(1000);
      await page.keyboard.press('Enter');
    } catch (error) {
      Logger.error("Failed at password step:", error);
      throw new Error("Password input failed");
    }

    // More reliable login verification
    Logger.info("Verifying login...");
    try {
      // Wait for either the home feed OR verification challenge
      const result = await Promise.race([
        page.waitForSelector('[data-testid="primaryColumn"]', { timeout: 30000 }),
        page.waitForSelector('[data-testid="ocfEnterTextTextInput"]', { timeout: 30000 })
      ]);

      if (await page.$('[data-testid="ocfEnterTextTextInput"]')) {
        Logger.warn("⚠️ Twitter is requesting verification. Please complete it manually...");
        // Wait for manual verification completion
        await page.waitForSelector('[data-testid="primaryColumn"]', { 
          timeout: 300000 // 5 minutes timeout for manual verification
        });
      }
      
      Logger.success("✅ Successfully logged in to Twitter.");
      await saveCookies(page);
      return { browser, page };
    } catch (error) {
      Logger.error("Login verification failed:", error);
      throw new Error("Could not verify successful login");
    }

  } catch (error) {
    try {
      await page.screenshot({ path: 'login-error.png', fullPage: true });
      Logger.error("📸 Login error screenshot saved to login-error.png");
    } catch (screenshotError) {
      Logger.warn("⚠️ Could not save error screenshot");
    }
    
    Logger.error(`❌ Login failed: ${error.message}`);
    await browser.close();
    throw error;
  }
}

export { loginToTwitter };
