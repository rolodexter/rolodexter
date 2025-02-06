import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import path from "path";
import fs from "fs/promises";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const COOKIES_PATH = path.join(
  process.cwd(),
  "cookies",
  `${process.env.TWITTER_USERNAME}_cookies.json`
);

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
    console.log("🔑 Logging into Twitter...");

    // Try loading cookies
    const cookiesLoaded = await loadCookies(page);
    if (cookiesLoaded) {
      await page.goto("https://twitter.com/home", { 
        waitUntil: ["networkidle0", "domcontentloaded"],
        timeout: 30000 
      });
      
      // Check if we're actually logged in
      const loginButton = await page.$('a[href="/login"]');
      if (!loginButton) {
        console.log("✅ Already logged in using cookies.");
        return { browser, page };
      }
    }

    // Go to login page and wait for it to load
    await page.goto("https://twitter.com/i/flow/login", { 
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000 
    });

    // Wait for the login form to be ready
    await page.waitForTimeout(2000);

    // Updated selectors for username
    console.log("Entering username...");
    await page.waitForSelector('input[autocomplete="username"]', { timeout: 10000 });
    await page.type('input[autocomplete="username"]', process.env.TWITTER_USERNAME, { delay: 100 });
    
    // Click the Next button
    await page.waitForSelector('div[role="button"]:has-text("Next")', { timeout: 5000 });
    await page.click('div[role="button"]:has-text("Next")');
    
    // Wait and enter password
    console.log("Entering password...");
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.type('input[type="password"]', process.env.TWITTER_PASSWORD, { delay: 100 });
    
    // Click login button
    await page.waitForSelector('div[role="button"]:has-text("Log in")', { timeout: 5000 });
    await page.click('div[role="button"]:has-text("Log in")');

    // Wait for navigation after login
    await page.waitForNavigation({ 
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000 
    });

    // Verify login success
    const loginError = await page.$('div[role="alert"]');
    if (loginError) {
      throw new Error('Login failed - Invalid credentials or verification required');
    }

    console.log("✅ Successfully logged in to Twitter.");
    await saveCookies(page);
    
    return { browser, page };
  } catch (error) {
    // Take screenshot on error for debugging
    try {
      await page.screenshot({ path: 'login-error.png' });
      console.error("📸 Login error screenshot saved to login-error.png");
    } catch (screenshotError) {
      console.warn("⚠️ Could not save error screenshot");
    }
    
    console.error(`❌ Login failed: ${error.message}`);
    await browser.close();
    throw error;
  }
}

export { loginToTwitter };
