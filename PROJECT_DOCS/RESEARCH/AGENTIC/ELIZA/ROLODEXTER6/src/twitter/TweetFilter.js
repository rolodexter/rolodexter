// TweetFilter.js
import inquirer from 'inquirer';
import { parseISO, isValid, subDays, format } from 'date-fns';
import Table from 'cli-table3';
import chalk from 'chalk';
import Logger from './Logger.js';

class TweetFilter {
  constructor() {
    this.options = {};
  }

  async applyFilters(tweets) {
    const now = new Date();
    const pastYearDate = subDays(now, 365);
    
    return tweets.filter(tweet => {
      const tweetDate = parseISO(tweet.timestamp);
      if (!isValid(tweetDate) || tweetDate < pastYearDate) {
        return false;
      }

      const text = tweet.text.toLowerCase();
      return (
        text.includes('@rolodexter6') ||
        text.includes('@rolodexterai') ||
        tweet.user.toLowerCase() === 'rolodexterai' // Check if the tweet is from @rolodexterai
      );
    });
  }

  async promptCollectionMode() {
    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'How would you like to collect tweets?',
        choices: [
          {
            name: '📥 Get all tweets (fastest, includes everything)',
            value: 'all',
          },
          {
            name: '🎯 Custom collection (filter by type, date, engagement, etc)',
            value: 'custom',
          },
        ],
      },
    ]);

    if (mode === 'all') {
      this.options = {
        tweetTypes: ['original', 'replies', 'quotes', 'retweets'],
        contentTypes: ['text', 'images', 'videos', 'links'],
        filterByEngagement: false,
        filterByDate: true,
        startDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        filterByMentions: true,
      };

      Logger.info('✅ Applied date and mention filters');
      return this.options;
    }

    return this.promptCustomOptions();
  }
}

export default TweetFilter;
