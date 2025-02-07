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

        // Add preferred models list with priority order
        this.preferredModels = [
            'openai/gpt-4',            // Primary choice
            'openai/gpt-4-32k',        // Backup for longer contexts
            'anthropic/claude-2',       // First fallback
            'openai/gpt-3.5-turbo',    // Second fallback
            'google/palm-2-chat-bison', // Third fallback
            'anthropic/claude-instant-v1'
        ];
        this.promptPath = path.join(process.cwd(), 'llm_prompt.md');
    }

    async loadPrompt() {
        try {
            Logger.debug('Loading character prompt from:', this.promptPath);
            const promptContent = await fs.readFile(this.promptPath, 'utf-8');
            if (!promptContent) {
                throw new Error('Empty prompt file');
            }
            Logger.debug('Prompt loaded successfully');
            return promptContent.trim();
        } catch (error) {
            Logger.error(`Failed to load character prompt: ${error.message}`);
            throw error; // Propagate error to prevent generating without proper character prompt
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
                // Load and validate character prompt
                const basePrompt = await this.loadPrompt();
                if (!basePrompt) {
                    throw new Error('Character prompt is required but not available');
                }

                const apiRequest = {
                    model: "openai/gpt-4",
                    messages: [
                        { 
                            role: "system", 
                            content: basePrompt 
                        },
                        { 
                            role: "user", 
                            content: `Tweet: "${tweet.text}"\n\nRespond to this tweet following the character prompt EXACTLY. IMPORTANT: Your response MUST start with exactly two spaces followed by your message. Keep it under 240 characters.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                };

                Logger.info('Sending request to OpenRouter API...');
                
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://github.com/dreaminglucid/agentic',
                        'X-Title': 'RolodexterAI'
                    },
                    body: JSON.stringify(apiRequest)
                });

                // Check for moderation flags in error response
                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData?.error?.metadata?.reasons?.includes('harassment')) {
                        Logger.warn('Content flagged, trying with safer prompt...');
                        continue;
                    }
                    throw new Error(`API error: ${response.status}`);
                }

                // Log raw response
                const rawText = await response.text();
                Logger.debug('Raw API Response:', rawText);

                // Parse response
                let responseData;
                try {
                    responseData = JSON.parse(rawText);
                } catch (error) {
                    throw new Error(`Invalid JSON response: ${rawText.slice(0, 100)}...`);
                }

                // Log parsed response
                Logger.debug('Parsed Response:', JSON.stringify(responseData, null, 2));

                // Check HTTP status
                if (!response.ok) {
                    throw new Error(`API error (${response.status}): ${responseData.error?.message || 'Unknown error'}`);
                }

                // Validate response structure
                if (!responseData?.choices?.[0]?.message?.content) {
                    Logger.error('Response structure:', JSON.stringify(responseData, null, 2));
                    throw new Error('Invalid response structure from API');
                }

                // Get and clean content
                const formattedContent = responseData.choices[0].message.content.trim();
                // Ensure response starts with exactly two spaces
                const finalResponse = '  ' + formattedContent.trimLeft();
                if (!finalResponse) {
                    throw new Error('Empty response content');
                }

                Logger.success(`Generated response (${finalResponse.length} chars)`);
                return finalResponse.length > 240 ? finalResponse.slice(0, 237) + '...' : finalResponse;

            } catch (error) {
                attempts++;
                Logger.error(`Generation attempt ${attempts} failed: ${error.message}`);
                
                if (attempts < this.maxRetries) {
                    const delay = this.retryDelay * Math.pow(2, attempts - 1);
                    Logger.info(`Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                Logger.error('All attempts failed to generate response');
                return null;
            }
        }
    }
}

export default OpenRouterClient;
