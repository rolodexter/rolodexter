// TweetFilter.js
import inquirer from 'inquirer';
import { parseISO, isValid } from 'date-fns';
import Table from 'cli-table3';
import chalk from 'chalk';
import Logger from './Logger.js';

class TweetFilter {
  constructor() {
    this.HARD_LIMIT = 1000;
    this.options = {
      maxTweets: this.HARD_LIMIT,
      keywords: ['rolodexter', 'rolodexterai'],
      processedCount: 0
    };
  }

  async promptCollectionMode() {
    // Remove complex prompts, use default settings
    this.options = {
      maxTweets: 5000,
      keywords: ['rolodexter', 'rolodexterai'],
      processedCount: 0
    };

    Logger.info('\nCollection Configuration:');
    const configTable = new Table({
      head: [chalk.white('Parameter'), chalk.white('Value')],
      colWidths: [25, 60],
    });

    configTable.push(
      ['Max Tweets', this.options.maxTweets],
      ['Keywords', this.options.keywords.join(', ')],
      ['Collection Mode', 'Automatic']
    );

    console.log(configTable.toString());
    return this.options;
  }

  shouldIncludeTweet(tweet) {
    // Hard stop if we've hit the limit
    if (this.options.processedCount >= this.HARD_LIMIT) {
      return false;
    }

    // Only increment counter for tweets we actually want
    if (!tweet?.text) return false;
    
    const text = tweet.text.toLowerCase();
    const hasKeyword = this.options.keywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );

    if (hasKeyword) {
      this.options.processedCount++;
    }

    return hasKeyword && this.options.processedCount <= this.HARD_LIMIT;
  }

  resetCount() {
    this.options.processedCount = 0;
  }

  getCurrentCount() {
    return this.options.processedCount;
  }
}

export default TweetFilter;
