# Degen Scraper

Pipeline for generating AI character files and training datasets by scraping public figures' online presence across Twitter and blogs.

> ⚠️ **IMPORTANT**: Create a new Twitter account for this tool. DO NOT use your main account as it may trigger Twitter's automation detection and result in account restrictions.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the `.env.example` into a `.env` file and fill in the required values:

   ```properties
   # (Required) Twitter Authentication
   TWITTER_USERNAME=     # your twitter username
   TWITTER_PASSWORD=     # your twitter password

   # (Optional) Blog Configuration
   BLOG_URLS_FILE=      # path to file containing blog URLs

   # (Optional) Scraping Configuration
   MAX_TWEETS=          # max tweets to scrape
   MAX_RETRIES=         # max retries for scraping
   RETRY_DELAY=         # delay between retries
   MIN_DELAY=           # minimum delay between requests
   MAX_DELAY=           # maximum delay between requests
   ```

## Usage

### Twitter Collection

```bash
npm run twitter -- username
```

Example: `npm run twitter -- rolodexter6`

### Blog Collection

```bash
npm run blog
```

### Generate Character

```bash
npm run character -- username
```

Example: `npm run character -- rolodexter6`

### Finetune

```bash
npm run finetune
```

### Finetune (with test)

```bash
npm run finetune:test
```

### Generate Virtuals Character Card

<https://whitepaper.virtuals.io/developer-documents/agent-contribution/contribute-to-cognitive-core#character-card-and-goal-samples>

Run this after Twitter Collection step

```bash
npm run generate-virtuals -- username date 
```

Example: `npm run generate-virtuals -- rolodexter6 2025-02-05`
Example without date: `npm run generate-virtuals -- rolodexter6`

The generated character file will be in the `pipeline/[username]/[date]/character/character.json` directory.
The generated tweet dataset file will be in `pipeline/[username]/[date]/raw/tweets.json`.

## Troubleshooting

### Twitter Collection Issues

1. **Login Errors**
   - Verify Twitter credentials in `.env` file
   - Create a new Twitter account if your account is restricted
   - Wait 15 minutes if you see too many login attempts

2. **Rate Limiting**
   - Increase `MIN_DELAY` and `MAX_DELAY` in `.env`
   - Reduce `MAX_TWEETS` to collect data in smaller batches
   - Wait at least 15 minutes between collection attempts

3. **Network Errors**
   - Check your internet connection
   - Verify you're not using a VPN that Twitter might block
   - Try increasing `MAX_RETRIES` and `RETRY_DELAY`

4. **No Data Collected**
   - Verify the target username exists
   - Check if the account is private
   - Ensure the account has public tweets

For detailed error logs, run with debug mode:

```
