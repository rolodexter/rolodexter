const { Scraper } = require("agent-twitter-client");
require("dotenv").config();

const scraper = new Scraper();

async function main() {
  try {
    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL
    );

    await scraper.sendTweet("Hello, world! This is a test tweet from @rolodexter6.");
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
