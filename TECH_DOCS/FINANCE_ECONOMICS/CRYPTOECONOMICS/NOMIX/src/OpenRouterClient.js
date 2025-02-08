import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: path.join(__dirname, '..', '.env') });

class OpenRouterClient {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.defaultModel = 'openai/gpt-4';
    }

    async summarizeContent(content) {
        try {
            const apiRequest = {
                model: this.defaultModel,
                prompt: `Summarize the following content:\n\n${content}`,
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.5,
            };

            const response = await fetch(`${this.baseUrl}/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiRequest),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();
            const summary = responseData.choices[0].text.trim();
            return summary;
        } catch (error) {
            console.error(`Error summarizing content: ${error.message}`);
            return "Error summarizing content.";
        }
    }
}

export default OpenRouterClient;
