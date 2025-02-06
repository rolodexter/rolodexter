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
        this.modelInfo = null;  // Cache for model information
        this.lastUsedModelIndex = -1; // Track last used model
        this.defaultModel = 'openai/gpt-4'; // Change to GPT-4 as default
        this.maxRetries = 3;
        this.retryDelay = 2000;
        this.lastModelFetch = 0; // Track when we last fetched models
        this.modelCacheDuration = 1000 * 60 * 60; // Cache models for 1 hour
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

    async getAvailableModels() {
        // Check cache first
        const now = Date.now();
        if (this.modelInfo && (now - this.lastModelFetch) < this.modelCacheDuration) {
            return this.modelInfo;
        }

        try {
            const response = await fetch('https://openrouter.ai/api/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': 'https://github.com/dreaminglucid/agentic',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get models: ${response.status}`);
            }

            const data = await response.json();
            
            // Filter and sort models silently
            const validModels = data.data
                .filter(model => model && model.id && !model.id.includes('image'))
                .sort((a, b) => {
                    const aIndex = this.preferredModels.indexOf(a.id);
                    const bIndex = this.preferredModels.indexOf(b.id);
                    if (aIndex === -1 && bIndex === -1) return 0;
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;
                    return aIndex - bIndex;
                });

            // Only log if we have no valid models
            if (validModels.length === 0) {
                Logger.warn('No valid models found, using default model');
                return [{ id: this.defaultModel }];
            }

            // Cache results
            this.modelInfo = validModels;
            this.lastModelFetch = now;
            return validModels;

        } catch (error) {
            Logger.error(`Failed to fetch models: ${error.message}`);
            return [{ id: this.defaultModel }];
        }
    }

    async selectModel() {
        // Get models if not cached
        if (!this.modelInfo) {
            await this.getAvailableModels();
        }

        // Always select first available model from sorted list
        const model = this.modelInfo[0]?.id || this.defaultModel;
        Logger.info(`Selected model: ${model}`);
        return model;
    }

    async generateResponse(tweet) {
        let attempts = 0;
        
        while (attempts < this.maxRetries) {
            try {
                const basePrompt = await this.loadPrompt();
                if (!basePrompt) throw new Error('Failed to load base prompt');

                // Sanitize username and text for API request
                const safeUsername = tweet.username.replace(/[^\x00-\x7F]/g, '').trim() || 'User';
                const safeText = tweet.text
                    .replace(/[@#]/g, '') // Remove @ mentions and hashtags
                    .replace(/[^\w\s.,!?-]/g, '') // Keep only basic punctuation
                    .trim();

                Logger.info(`Generating response for tweet from @${safeUsername}`);
                
                const model = await this.selectModel();
                
                const apiRequest = {
                    model: model,
                    messages: [
                        { role: "system", content: basePrompt },
                        { 
                            role: "user", 
                            content: `Generate a brief, factual response to: "${safeText}". Focus on technology and innovation. Keep it under 280 characters and avoid personal remarks or criticism.` 
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7,
                    presence_penalty: 0.6,
                    frequency_penalty: 0.5,
                    stop: ["\n", "```"]  // Add stop sequences
                };

                Logger.debug(`API Request: ${JSON.stringify(apiRequest, null, 2)}`);

                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://github.com/dreaminglucid/agentic',
                        'X-Title': 'RolodexterAI',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(apiRequest)
                });

                // Get response as text first for debugging
                const rawResponse = await response.text();
                Logger.debug(`Raw API Response: ${rawResponse}`);

                let responseData;
                try {
                    responseData = JSON.parse(rawResponse);
                } catch (parseError) {
                    Logger.error(`Failed to parse API response: ${parseError.message}`);
                    Logger.debug(`Invalid JSON: ${rawResponse}`);
                    throw new Error('Invalid JSON response from API');
                }

                // Enhanced response validation
                if (!response.ok) {
                    const errorDetail = responseData.error?.message || 'Unknown error';
                    Logger.error(`API Error (Attempt ${attempts + 1}/${this.maxRetries}):
                        Status: ${response.status}
                        Error: ${errorDetail}
                        Model: ${apiRequest.model}`);
                    
                    if (attempts < this.maxRetries - 1) {
                        attempts++;
                        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempts));
                        continue;
                    }
                    throw new Error(`API request failed: ${errorDetail}`);
                }

                // Detailed response validation
                if (!responseData) {
                    throw new Error('Empty response from API');
                }

                if (!Array.isArray(responseData.choices)) {
                    Logger.error('Unexpected response structure:');
                    Logger.debug(JSON.stringify(responseData, null, 2));
                    throw new Error('Invalid response structure: missing choices array');
                }

                if (responseData.choices.length === 0) {
                    throw new Error('No choices in response');
                }

                const choice = responseData.choices[0];
                if (!choice?.message?.content) {
                    Logger.error('Invalid choice structure:');
                    Logger.debug(JSON.stringify(choice, null, 2));
                    throw new Error('Invalid choice structure: missing message content');
                }

                // Process response
                const cleanResponse = choice.message.content
                    .trim()
                    .replace(/['"]/g, '')
                    .replace(/\s+/g, ' ');

                if (cleanResponse.length === 0) {
                    throw new Error('Empty response after cleaning');
                }

                Logger.success(`Generated response (${cleanResponse.length} chars)`);
                return cleanResponse.length > 280 ? 
                    cleanResponse.slice(0, 277) + '...' : 
                    cleanResponse;

            } catch (error) {
                if (attempts < this.maxRetries - 1) {
                    Logger.warn(`Attempt ${attempts + 1} failed, retrying in ${this.retryDelay * attempts}ms...`);
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempts));
                    continue;
                }
                
                Logger.error(`OpenRouter API error after ${this.maxRetries} attempts: ${error.message}`);
                return 'SYSTEM ALERT: Neural processing matrix offline. Deploying backup routines...';
            }
        }
    }
}

export default OpenRouterClient;
