import fetch from 'node-fetch';
import fs from 'fs/promises';
import Logger from './Logger.js';

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

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': 'https://github.com/your-username/your-repo',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: "system", content: basePrompt },
                        { role: "user", content: `Tweet to respond to: "${tweet.text}" from @${tweet.username}` }
                    ]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate response');
            }

            return data.choices[0].message.content.trim();

        } catch (error) {
            Logger.error(`OpenRouter API error: ${error.message}`);
            // Fallback to default response
            return `[INGEST] ${new Date().toISOString()}\nTweet received for processing.`;
        }
    }
}

export default OpenRouterClient;
