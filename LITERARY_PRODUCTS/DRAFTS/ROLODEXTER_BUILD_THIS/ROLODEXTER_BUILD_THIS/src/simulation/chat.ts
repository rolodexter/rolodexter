interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
    type: 'user' | 'rolodexter' | 'system';
    attachment?: {
        type: 'idea' | 'image' | 'link';
        content: string;
    };
}

interface ChatThread {
    id: string;
    type: 'direct' | 'group' | 'rolodexter';
    name: string;
    participants: string[];
    messages: ChatMessage[];
    unreadCount: number;
    lastMessage?: ChatMessage;
}

export class ChatSystem {
    private threads: Map<string, ChatThread>;
    private activeThread: string | null;
    private readonly ROLODEXTER_ID = 'rolodexter';
    private marketAnalyst: MarketAnalyst;

    constructor() {
        this.threads = new Map();
        this.activeThread = null;
        this.marketAnalyst = new MarketAnalyst();
        this.initializeDefaultThreads();
    }

    private initializeDefaultThreads() {
        // Initialize Rolodexter chat
        this.threads.set(this.ROLODEXTER_ID, {
            id: this.ROLODEXTER_ID,
            type: 'rolodexter',
            name: 'rolodexter',
            participants: ['user', this.ROLODEXTER_ID],
            messages: [
                {
                    id: this.generateId(),
                    sender: this.ROLODEXTER_ID,
                    content: "Hi! I'm rolodexter. I can help you generate and validate ideas, or connect you with other idea creators. What would you like to do?",
                    timestamp: new Date(),
                    type: 'rolodexter'
                }
            ],
            unreadCount: 0
        });

        // Add some mock group chats
        this.threads.set('ideas-collective', {
            id: 'ideas-collective',
            type: 'group',
            name: 'Ideas Collective',
            participants: ['user', 'alice', 'bob', 'charlie'],
            messages: [],
            unreadCount: 0
        });

        this.threads.set('ai-innovators', {
            id: 'ai-innovators',
            type: 'group',
            name: 'AI Innovators',
            participants: ['user', 'dave', 'eve', 'frank'],
            messages: [],
            unreadCount: 0
        });
    }

    public createChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-toggle">
                <span class="chat-icon">💬</span>
                <span class="unread-badge"></span>
            </div>
            <div class="chat-window">
                <div class="chat-header">
                    <div class="chat-title">Messages</div>
                    <button class="minimize-chat">_</button>
                </div>
                <div class="chat-threads"></div>
                <div class="chat-messages"></div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" placeholder="Type a message...">
                    <button class="send-message">↗️</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);
        this.setupChatEventListeners();
        this.renderThreads();
    }

    private setupChatEventListeners() {
        const chatToggle = document.querySelector('.chat-toggle');
        const chatWindow = document.querySelector('.chat-window');
        const minimizeBtn = document.querySelector('.minimize-chat');
        const input = document.querySelector('.chat-input') as HTMLInputElement;
        const sendBtn = document.querySelector('.send-message');

        chatToggle?.addEventListener('click', () => {
            chatWindow?.classList.toggle('show');
            chatToggle.classList.toggle('active');
        });

        minimizeBtn?.addEventListener('click', () => {
            chatWindow?.classList.remove('show');
            chatToggle?.classList.remove('active');
        });

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage(input.value);
                input.value = '';
            }
        });

        sendBtn?.addEventListener('click', () => {
            if (input?.value) {
                this.sendMessage(input.value);
                input.value = '';
            }
        });
    }

    private async sendMessage(content: string) {
        if (!this.activeThread || !content.trim()) return;

        const message: ChatMessage = {
            id: this.generateId(),
            sender: 'user',
            content: content.trim(),
            timestamp: new Date(),
            type: 'user'
        };

        const thread = this.threads.get(this.activeThread);
        if (!thread) return;

        thread.messages.push(message);
        this.renderMessages(thread);

        // If chatting with rolodexter, generate a response
        if (thread.type === 'rolodexter') {
            await this.generateRolodexterResponse(content);
        }
    }

    private async generateRolodexterResponse(userMessage: string) {
        const thread = this.threads.get(this.ROLODEXTER_ID);
        if (!thread) return;

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const responses = [
            "That's an interesting perspective! Have you considered...",
            "Based on market trends, I suggest...",
            "I can help you validate that idea. Let's analyze...",
            "Would you like me to connect you with others working on similar ideas?",
            "I can generate a detailed description for your idea NFT..."
        ];

        const response: ChatMessage = {
            id: this.generateId(),
            sender: this.ROLODEXTER_ID,
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: 'rolodexter'
        };

        thread.messages.push(response);
        this.hideTypingIndicator();
        this.renderMessages(thread);
    }

    private showTypingIndicator() {
        const messagesContainer = document.querySelector('.chat-messages');
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer?.appendChild(indicator);
    }

    private hideTypingIndicator() {
        document.querySelector('.typing-indicator')?.remove();
    }

    private renderThreads() {
        const threadsContainer = document.querySelector('.chat-threads');
        if (!threadsContainer) return;

        threadsContainer.innerHTML = Array.from(this.threads.values())
            .map(thread => `
                <div class="chat-thread ${thread.id === this.activeThread ? 'active' : ''}" 
                     data-thread-id="${thread.id}">
                    <div class="thread-icon">
                        ${thread.type === 'rolodexter' ? '🤖' : 
                          thread.type === 'group' ? '👥' : '👤'}
                    </div>
                    <div class="thread-info">
                        <div class="thread-name">${thread.name}</div>
                        <div class="thread-preview">
                            ${thread.lastMessage?.content || 'Start a conversation...'}
                        </div>
                    </div>
                    ${thread.unreadCount > 0 ? 
                        `<div class="thread-unread">${thread.unreadCount}</div>` : 
                        ''}
                </div>
            `).join('');

        // Add click listeners to threads
        document.querySelectorAll('.chat-thread').forEach(threadEl => {
            threadEl.addEventListener('click', () => {
                const threadId = threadEl.getAttribute('data-thread-id');
                if (threadId) {
                    this.setActiveThread(threadId);
                }
            });
        });

        // Set initial active thread if none selected
        if (!this.activeThread) {
            this.setActiveThread(this.ROLODEXTER_ID);
        }
    }

    private setActiveThread(threadId: string) {
        this.activeThread = threadId;
        const thread = this.threads.get(threadId);
        if (!thread) return;

        // Update UI
        document.querySelectorAll('.chat-thread').forEach(el => 
            el.classList.toggle('active', el.getAttribute('data-thread-id') === threadId)
        );

        // Reset unread count
        thread.unreadCount = 0;
        this.renderThreads();
        this.renderMessages(thread);
    }

    private renderMessages(thread: ChatThread) {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = thread.messages.map(msg => `
            <div class="chat-message ${msg.type}">
                <div class="message-content">
                    ${msg.content}
                    ${msg.attachment ? this.renderAttachment(msg.attachment) : ''}
                </div>
                <div class="message-time">
                    ${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    private renderAttachment(attachment: NonNullable<ChatMessage['attachment']>) {
        switch (attachment.type) {
            case 'idea':
                return `
                    <div class="message-attachment idea-card">
                        <div class="idea-preview">
                            <div class="idea-title">${attachment.content}</div>
                            <button class="view-idea">View Idea</button>
                        </div>
                    </div>
                `;
            case 'image':
                return `
                    <div class="message-attachment">
                        <img src="${attachment.content}" alt="Attachment">
                    </div>
                `;
            case 'link':
                return `
                    <div class="message-attachment">
                        <a href="${attachment.content}" target="_blank">${attachment.content}</a>
                    </div>
                `;
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

export class MarketAnalyst {
    private chartCanvas: HTMLCanvasElement;
    private trendLines: Map<string, any> = new Map();
    
    constructor() {
        this.setupChartCanvas();
    }

    async generateMarketAnalysis(ideaId: string, type: 'technical' | 'sentiment' | 'onchain') {
        switch(type) {
            case 'technical':
                return this.generateTechnicalAnalysis(ideaId);
            case 'sentiment':
                return this.generateSentimentAnalysis(ideaId);
            case 'onchain':
                return this.generateOnChainAnalysis(ideaId);
        }
    }

    private async generateTechnicalAnalysis(ideaId: string) {
        const timeframes = ['1H', '4H', '1D'];
        const indicators = ['RSI', 'MACD', 'Volume'];
        const chartData = this.generateChartPreview(ideaId);
        
        return {
            type: 'technical',
            content: {
                timeframes: timeframes.map(tf => ({
                    period: tf,
                    trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
                    strength: Math.floor(Math.random() * 100)
                })),
                indicators: indicators.map(ind => ({
                    name: ind,
                    value: Math.random() * 100,
                    signal: Math.random() > 0.5 ? 'buy' : 'sell'
                })),
                support_resistance: {
                    support: [2.15, 2.30, 2.45],
                    resistance: [2.75, 2.90, 3.15]
                },
                chart: chartData
            }
        };
    }

    private generateChartPreview(ideaId: string) {
        // Mini chart data for inline display
        return {
            prices: Array.from({length: 24}, (_, i) => ({
                time: new Date(Date.now() - (23-i) * 3600000),
                value: 2.45 + Math.sin(i/3) * 0.2 + (Math.random() - 0.5) * 0.1
            })),
            volume: Array.from({length: 24}, () => Math.random() * 10000)
        };
    }

    private async generateSentimentAnalysis(ideaId: string) {
        return {
            type: 'sentiment',
            content: {
                social_metrics: {
                    twitter_mentions: Math.floor(Math.random() * 1000),
                    sentiment_score: (Math.random() * 5).toFixed(1),
                    engagement_rate: `${(Math.random() * 100).toFixed(1)}%`
                },
                market_metrics: {
                    buy_pressure: Math.floor(Math.random() * 100),
                    seller_exhaustion: Math.floor(Math.random() * 100),
                    accumulation_score: Math.floor(Math.random() * 100)
                },
                whales: {
                    active_whales: Math.floor(Math.random() * 10),
                    net_position: Math.random() > 0.5 ? 'accumulating' : 'distributing',
                    confidence: Math.floor(Math.random() * 100)
                }
            }
        };
    }

    formatAnalysis(analysis: any): string {
        let formattedMessage = '';
        
        switch(analysis.type) {
            case 'technical':
                formattedMessage = this.formatTechnicalAnalysis(analysis.content);
                break;
            case 'sentiment':
                formattedMessage = this.formatSentimentAnalysis(analysis.content);
                break;
        }
        
        return formattedMessage;
    }

    private formatTechnicalAnalysis(content: any): string {
        return `📊 Technical Analysis Summary\n\n` +
               `Timeframe Analysis:\n` +
               content.timeframes.map(tf => 
                   `${tf.period}: ${tf.trend.toUpperCase()} (${tf.strength}% strength)`
               ).join('\n') + '\n\n' +
               `Key Indicators:\n` +
               content.indicators.map(ind =>
                   `${ind.name}: ${ind.value.toFixed(2)} [${ind.signal.toUpperCase()}]`
               ).join('\n') + '\n\n' +
               `Price Levels:\n` +
               `Support: $${content.support_resistance.support.join(', $')}\n` +
               `Resistance: $${content.support_resistance.resistance.join(', $')}`;
    }

    private formatSentimentAnalysis(content: any): string {
        const {social_metrics, market_metrics, whales} = content;
        
        return `🎯 Market Sentiment Analysis\n\n` +
               `Social Metrics:\n` +
               `- Twitter Mentions: ${social_metrics.twitter_mentions}\n` +
               `- Sentiment Score: ${social_metrics.sentiment_score}/5.0\n` +
               `- Engagement: ${social_metrics.engagement_rate}\n\n` +
               `Market Metrics:\n` +
               `- Buy Pressure: ${market_metrics.buy_pressure}/100\n` +
               `- Seller Exhaustion: ${market_metrics.seller_exhaustion}/100\n` +
               `- Accumulation: ${market_metrics.accumulation_score}/100\n\n` +
               `Whale Activity:\n` +
               `- Active Whales: ${whales.active_whales}\n` +
               `- Position: ${whales.net_position}\n` +
               `- Confidence: ${whales.confidence}%`;
    }
}