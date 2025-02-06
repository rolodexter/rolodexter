import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config(); // Load environment variables from .env file

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const COOKIES_PATH = "C:/rolodexter5/rolodexter5/cookies/rolodexter6_cookies.json";

async function loadCookies(page) {
  try {
    if (await fs.access(COOKIES_PATH).catch(() => false)) {
      const cookies = JSON.parse(await fs.readFile(COOKIES_PATH, "utf-8"));
      await page.setCookie(...cookies);
      console.log("✅ Cookies loaded.");
      return true;
    }
  } catch (err) {
    console.warn("⚠️ Failed to load cookies:", err.message);
  }
  return false;
}

async function saveCookies(page) {
  try {
    const cookies = await page.cookies();
    await fs.mkdir(path.dirname(COOKIES_PATH), { recursive: true });
    await fs.writeFile(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log("✅ Cookies saved.");
  } catch (err) {
    console.warn("⚠️ Failed to save cookies:", err.message);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    console.log("🔑 Starting Twitter session...");

    // Attempt to load cookies
    if (await loadCookies(page)) {
      await page.goto("https://twitter.com/home", { waitUntil: "networkidle2" });
      await page.waitForTimeout(3000); // Ensure this line is correct
      if ((await page.url()).includes("/home")) {
        console.log("✅ Logged in using cookies.");
      } else {
        throw new Error("Cookies are invalid, re-authentication required.");
      }
    } else {
      throw new Error("No valid cookies found.");
    }

    // Placeholder: Add further actions (like replying to mentions) here
    console.log("✅ Login successful. No further tasks queued.");

    // Save cookies for future use
    await saveCookies(page);

  } catch (err) {
    console.error("❌ An error occurred:", err.message);
  } finally {
    await browser.close();
    console.log("🔄 Browser closed.");
  }
})();
