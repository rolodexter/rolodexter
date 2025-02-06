import fetch from 'node-fetch';
import fs from 'fs/promises';
import Logger from './Logger.js';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class OpenRouterClient {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.model = 'openai/gpt-4';
    }

    async loadPrompt() {
        try {
            const promptContent = await fs.readFile('llm_prompt.md', 'utf-8');
            return promptContent.trim();
        } catch (error) {
            Logger.error(`Failed to load prompt: ${error.message}`);
            return null;
        }
    }

    async generateResponse(tweet) {
        try {
            const basePrompt = await this.loadPrompt();
            if (!basePrompt) throw new Error('Failed to load base prompt');

            Logger.info(`Generating response for tweet from @${tweet.username}`);
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-4',
                    messages: [
                        { role: "system", content: basePrompt },
                        { role: "user", content: `Generate a creative and engaging reply to this tweet: "${tweet.text}" from @${tweet.username}. Keep it under 280 characters and make it relevant to the topic.` }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();

        } catch (error) {
            Logger.error(`OpenRouter API error: ${error.message}`);
            return null;
        }
    }
}

export default OpenRouterClient;
