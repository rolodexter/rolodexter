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
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    console.log("🔑 Logging into Twitter...");

    // Try loading cookies
    const cookiesLoaded = await loadCookies(page);
    if (cookiesLoaded) {
      await page.goto("https://twitter.com/home", { waitUntil: "networkidle2" });
      if (await page.$('input[name="session[username_or_email]"]') === null) {
        console.log("✅ Already logged in using cookies.");
        await browser.close();
        return;
      }
    }

    // Go to login page
    await page.goto("https://twitter.com/login", { waitUntil: "networkidle2" });

    // Enter credentials
    console.log("Entering username...");
    await page.type('input[name="text"]', process.env.TWITTER_USERNAME);
    await page.click('div[role="button"]'); // Click "Next"
    await page.waitForSelector('input[name="password"]', { timeout: 10000 });
    console.log("Entering password...");
    await page.type('input[name="password"]', process.env.TWITTER_PASSWORD);
    await page.click('div[data-testid="LoginForm_Login_Button"]');

    // Wait for successful login
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("✅ Successfully logged in to Twitter.");

    // Save cookies
    await saveCookies(page);
  } catch (error) {
    console.error(`❌ Login failed: ${error.message}`);
  } finally {
    await browser.close();
    console.log("🔒 Browser closed.");
  }
}

// Run the login script
loginToTwitter();
