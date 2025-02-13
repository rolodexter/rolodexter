// Import dependencies
import { ChatSystem } from './chat.js';
import { MarketVisuals } from './marketVisuals.js';

export class BeaconPlatform {
    constructor() {
        // Initialize core components
        this.activeIdeas = new Map();
        this.marketVisuals = new MarketVisuals();
        this.chatSystem = new ChatSystem();
        
        // Setup UI elements immediately
        this.setupTourGuide();
        this.setupNotifications();
        this.setupMessenger();
        
        // Initialize mock data
        this.initializeMockData();
        
        // Setup event listeners after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupTourGuide() {
        const cursor = document.createElement('div');
        cursor.className = 'simulated-cursor';
        document.body.appendChild(cursor);

        const spotlight = document.createElement('div');
        spotlight.className = 'tour-spotlight';
        const spotlightHole = document.createElement('div');
        spotlightHole.className = 'tour-spotlight-hole';
        spotlight.appendChild(spotlightHole);
        document.body.appendChild(spotlight);
    }

    setupNotifications() {
        const container = document.querySelector('.notifications-container');
        if (!container) {
            const notificationContainer = document.createElement('div');
            notificationContainer.className = 'notifications-container';
            document.body.appendChild(notificationContainer);
        }
    }

    setupMessenger() {
        // Ensure messenger is visible and properly positioned
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.zIndex = '1000';
            chatContainer.style.visibility = 'visible';
        }
        
        // Initialize chat system
        this.chatSystem.createChatUI();
    }

    initializeMockData() {
        // Initialize mock data and tour steps
        this.mockIdeas = [
            {
                url: 'https://x.com/SpaceX/status/1889386081960730742',
                description: 'Space debris cleanup using self-replicating nanobots',
                initialPrice: 2.45,
                supply: 5000
            },
            {
                url: 'https://x.com/elonmusk/status/1757788419166335468',
                description: 'AGI safety protocol using quantum encryption',
                initialPrice: 3.20,
                supply: 7500
            },
            {
                url: 'https://github.com/ggerganov/llama.cpp',
                description: 'Neural interface for direct brain-LLM communication',
                initialPrice: 1.85,
                supply: 4000
            },
            {
                url: 'https://research.nvidia.com/labs/dir/nerf/',
                description: 'Holographic memory storage using NeRF technology',
                initialPrice: 4.10,
                supply: 6000
            },
            {
                url: 'https://stability.ai/news/stable-video-3d',
                description: 'Mind-to-3D instant reality generation engine',
                initialPrice: 2.95,
                supply: 5500
            },
            // Adding 5 more active ideas
            {
                url: 'https://x.com/tesla/status/1234567890123456789',
                description: 'Tesla AI Day Highlights',
                initialPrice: 3.75,
                supply: 7000
            },
            {
                url: 'https://x.com/nasa/status/9876543210987654321',
                description: 'Mars Rover Discovery',
                initialPrice: 2.10,
                supply: 4500
            },
            {
                url: 'https://x.com/google/status/1122334455667788990',
                description: 'Quantum Computing Breakthrough',
                initialPrice: 4.50,
                supply: 8000
            },
            {
                url: 'https://x.com/apple/status/9988776655443322110',
                description: 'Apple AR Glasses Launch',
                initialPrice: 3.00,
                supply: 6500
            },
            {
                url: 'https://x.com/amazon/status/7766554433221100987',
                description: 'Amazon Drone Delivery',
                initialPrice: 2.75,
                supply: 5000
            },
            {
                url: 'https://x.com/tesla/status/1234567890',
                description: 'Tesla Quantum Battery Tech',
                initialPrice: 5.20,
                supply: 10000
            },
            {
                url: 'https://x.com/apple/status/9988776655443322110',
                description: 'Apple AR Glasses Launch',
                initialPrice: 3.00,
                supply: 6500
            },
            {
                url: 'https://x.com/amazon/status/7766554433221100987',
                description: 'Amazon Drone Delivery',
                initialPrice: 2.75,
                supply: 5000
            },
            {
                url: 'https://x.com/nvidia/status/5544332211009988776',
                description: 'NVIDIA AI Breakthrough',
                initialPrice: 4.50,
                supply: 8000
            },
            {
                url: 'https://x.com/spacex/status/3322110099887766554',
                description: 'SpaceX Mars Colony',
                initialPrice: 6.00,
                supply: 12000
            },
            {
                url: 'https://x.com/meta/status/1100998877665544332',
                description: 'Meta Neural Interface',
                initialPrice: 3.80,
                supply: 7500
            },
            {
                url: 'https://x.com/google/status/9988776655443322111',
                description: 'Google Quantum OS',
                initialPrice: 4.90,
                supply: 9000
            },
            {
                url: 'https://x.com/microsoft/status/8877665544332211009',
                description: 'Microsoft HoloOS',
                initialPrice: 4.20,
                supply: 8500
            },
            {
                url: 'https://x.com/intel/status/7766554433221100998',
                description: 'Intel Neural Chip',
                initialPrice: 3.50,
                supply: 7000
            },
            {
                url: 'https://x.com/samsung/status/6655443322110099887',
                description: 'Samsung Biotech Display',
                initialPrice: 2.90,
                supply: 6000
            }
        ];

        // Add trending ideas
        this.trendingMockIdeas = [
            {
                url: 'https://x.com/elonmusk/status/1889386081960730742',
                description: 'Tesla Neural Implant Patent',
                initialPrice: 8.45,
                supply: 15000,
                trend: 1,
                momentum: 0.8,
                volume24h: 450000
            },
            {
                url: 'https://github.com/microsoft/deepspeed',
                description: 'Revolutionary AI Training Speed',
                initialPrice: 6.20,
                supply: 12000,
                trend: 1,
                momentum: 0.6,
                volume24h: 380000
            },
            {
                url: 'https://x.com/ethereum/status/1234567890',
                description: 'ETH 2.0 Major Breakthrough',
                initialPrice: 7.80,
                supply: 14000,
                trend: 1,
                momentum: 0.7,
                volume24h: 420000
            },
            {
                url: 'https://x.com/apple/status/9876543210',
                description: 'Apple Quantum Computer Plans',
                initialPrice: 5.90,
                supply: 11000,
                trend: 1,
                momentum: 0.5,
                volume24h: 350000
            },
            {
                url: 'https://x.com/nvidia/status/5555555555',
                description: 'NVIDIA Brain-Computer Interface',
                initialPrice: 9.10,
                supply: 16000,
                trend: 1,
                momentum: 0.9,
                volume24h: 480000
            }
        ];

        this.tourSteps = [
            {
                element: '.logo',
                title: 'Welcome to Beacon',
                content: 'Generate ideas. Get paid for good ones.',
                position: 'right',
                spotlight: true
            },
            {
                element: '.idea-creation',
                title: 'Create New Ideas',
                content: 'Turn any URL into a tradeable NFT. This is where your idea journey begins.',
                position: 'right',
                spotlight: true
            },
            {
                element: '#ideaUrl',
                title: 'URL Input',
                content: 'Paste any URL you think has potential value.',
                position: 'right',
                spotlight: true,
                action: async () => {
                    const url = 'https://x.com/SpaceX/status/1889386081960730742';
                    await this.simulateTyping('#ideaUrl', url);
                }
            },
            {
                element: '#aiGenerateBtn',
                title: 'AI Assistance',
                content: 'Let rolodexter help generate a compelling idea description.',
                position: 'right',
                spotlight: true,
                action: async () => {
                    await this.simulateClick('#aiGenerateBtn');
                }
            },
            {
                element: '.ideas-table',
                title: 'Active Ideas Market',
                content: 'Watch ideas trade in real-time. Ideas graduate when they reach $50K market cap!',
                position: 'left',
                spotlight: true
            },
            {
                element: '.trending',
                title: 'Trending Ideas',
                content: 'See which ideas are gaining momentum right now.',
                position: 'right',
                spotlight: true
            },
            {
                element: '.featured-ideas',
                title: 'Featured Ideas',
                content: 'Top performing ideas with the highest potential.',
                position: 'left',
                spotlight: true
            },
            {
                element: '.token-card',
                title: '$ROLODEXTER Token',
                content: 'Stake $ROLODEXTER to earn platform fees and participate in idea curation.',
                position: 'left',
                spotlight: true
            },
            {
                element: '.chat-toggle',
                title: 'Market Analysis Assistant',
                content: 'Meet rolodexter, your AI market analyst. Get real-time technical analysis, market sentiment, and idea validation.',
                position: 'left',
                spotlight: true,
                action: async () => {
                    await this.simulateClick('.chat-toggle');
                }
            },
            {
                element: '.chat-window',
                title: 'Analyze Any Idea',
                content: 'Ask rolodexter about price trends, trading volumes, or graduation potential for any idea NFT.',
                position: 'left',
                spotlight: true,
                action: async () => {
                    await this.simulateMarketAnalysisChat({
                        query: 'What\'s your technical analysis for Space debris cleanup idea NFT?',
                        ideaId: 'space-debris'
                    });
                }
            },
            {
                element: '.chat-threads',
                title: 'Connect with Creators',
                content: 'Join group chats with other idea creators or have private discussions about market opportunities.',
                position: 'left',
                spotlight: true
            }
        ];

        this.currentTourStep = 0;
        this.initializeMarketData();
        this.startMarketSimulation();

        // Initialize AI generation prompts
        this.ideaPrompts = [
            "Revolutionizing {industry} with quantum computing",
            "Using AI to solve {problem} in developing nations",
            "Decentralized {service} platform for the masses",
            "Bio-engineered solution for {environmental_issue}",
            "Neural interface to enhance {human_ability}"
        ];

        // Add mock portfolio data
        this.portfolioIdeas = [
            {
                url: 'https://x.com/tesla/status/1234567890',
                description: 'Tesla Quantum Battery Tech',
                holdings: 2500,
                avgPrice: 1.20,
                currentPrice: 5.20,
                value: 13000,
                status: 'graduated',
                purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            },
            {
                url: 'https://github.com/microsoft/deepspeed',
                description: 'Revolutionary AI Training Speed',
                holdings: 1800,
                avgPrice: 2.10,
                currentPrice: 6.20,
                value: 11160,
                status: 'active',
                purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                url: 'https://x.com/ethereum/status/1234567890',
                description: 'ETH 2.0 Major Breakthrough',
                holdings: 2200,
                avgPrice: 3.50,
                currentPrice: 7.80,
                value: 17160,
                status: 'graduated',
                purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
            }
        ];

        // Add recent activity
        this.recentActivity = [
            {
                type: 'purchase',
                idea: 'Revolutionary AI Training Speed',
                amount: 500,
                price: 6.20,
                time: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                type: 'sale',
                idea: 'Tesla Quantum Battery Tech',
                amount: 200,
                price: 5.20,
                time: new Date(Date.now() - 5 * 60 * 60 * 1000)
            },
            {
                type: 'graduation',
                idea: 'ETH 2.0 Major Breakthrough',
                reward: 1000,
                time: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        ];

        // Add portfolio tour steps
        this.tourSteps.push(
            {
                element: '.portfolio-nav',
                title: 'Your Portfolio',
                content: 'Track your idea investments, rewards, and performance.',
                position: 'right',
                spotlight: true,
                action: async () => {
                    await this.simulateClick('.portfolio-nav');
                }
            },
            {
                element: '.portfolio-summary',
                title: 'Portfolio Overview',
                content: 'See your total portfolio value and key metrics at a glance.',
                position: 'right',
                spotlight: true
            },
            {
                element: '.holdings-card',
                title: 'Your Ideas',
                content: 'Manage your idea investments and track their performance.',
                position: 'left',
                spotlight: true
            },
            {
                element: '.rewards-card',
                title: 'Earn Rewards',
                content: 'Collect rewards from trading, staking, and idea royalties.',
                position: 'left',
                spotlight: true
            }
        );

        // Add messenger tour steps
        this.tourSteps.push(
            {
                element: '.chat-toggle',
                title: 'Messenger & Market Analysis',
                content: 'Chat with rolodexter for real-time market analysis and connect with other idea creators.',
                position: 'left',
                spotlight: true,
                action: async () => {
                    await this.simulateClick('.chat-toggle');
                }
            },
            {
                element: '.chat-window',
                title: 'Market Analysis Chat',
                content: 'Ask rolodexter about market trends, technical analysis, and idea validation.',
                position: 'left',
                spotlight: true,
                action: async () => {
                    const chatSystem = document.querySelector('.chat-system');
                    await this.simulateMarketAnalysisChat(chatSystem);
                }
            }
        );

        // Initialize rolodexter's market analysis responses
        this.marketAnalysisResponses = {
            technicalAnalysis: [
                "Based on the 4-hour chart, {idea} shows a bullish divergence with RSI crossing above 30. Key resistance at ${price + 2.50}.",
                "Volume analysis indicates strong accumulation for {idea}. MACD histogram turning positive suggests momentum shift.",
                "Market structure for {idea} forming higher lows. Watch for breakout above ${price} with increased volume.",
                "Fibonacci retracement levels suggest strong support at ${price * 0.786}. Graduation potential within 72 hours."
            ],
            marketSentiment: [
                "Social sentiment analysis shows growing interest in {idea}. Mentions up 125% in the last 24h.",
                "Institutional wallets accumulating {idea}. Smart money flow index trending positive.",
                "Market makers building positions in {idea}. Order book shows strong bid support.",
                "Whale tracking indicates notable accumulation of {idea} at current levels."
            ],
            ideaValidation: [
                "Innovation score for {idea}: 8.5/10. Similar successful ideas had graduation rates of 85%.",
                "Market timing analysis suggests optimal entry. Category momentum strongly positive.",
                "Competitive analysis shows unique value proposition. Limited similar ideas in market.",
                "Growth metrics indicate high graduation potential. User adoption curve accelerating."
            ]
        };
    }

    initializeUI() {
        // Initialize chat system
        this.chatSystem.createChatUI();
        
        // Initialize market data display
        this.initializeMarketData();
        
        // Initialize charts
        if (document.getElementById('tokenChart')) {
            this.initializeTokenChart();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Populate initial ideas table
        this.populateIdeasTable();
        
        // Start market simulation
        this.startMarketSimulation();
    }

    populateIdeasTable() {
        const tbody = document.getElementById('activeIdeasList');
        if (!tbody) return;
        
        // Clear existing content
        tbody.innerHTML = '';
        
        // Add each idea to the table
        this.mockIdeas.forEach(mockIdea => {
            const idea = {
                id: this.generateHash(),
                ...mockIdea,
                currentPrice: mockIdea.initialPrice,
                marketCap: mockIdea.initialPrice * mockIdea.supply,
                holders: Math.floor(mockIdea.supply * 0.4),
                volume24h: mockIdea.initialPrice * mockIdea.supply * (Math.random() * 0.3),
                change24h: (Math.random() * 20) - 10,
                mintedAt: new Date(Date.now() - Math.random() * 86400000),
                graduated: false,
                graduationWarningShown: false
            };
            
            this.activeIdeas.set(idea.id, idea);
            this.addIdeaToTable(idea);
        });
    }

    initializeTokenChart() {
        const ctx = document.getElementById('tokenChart').getContext('2d');
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 200);
        gradientFill.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradientFill.addColorStop(1, 'rgba(59, 130, 246, 0)');

        this.tokenChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${23-i}h`).reverse(),
                datasets: [{
                    label: '$ROLODEXTER',
                    data: this.generatePriceHistory(),
                    borderColor: '#3B82F6',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradientFill,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: { color: '#9CA3AF' }
                    },
                    y: {
                        grid: {
                            color: 'rgba(75, 85, 99, 0.1)',
                            drawBorder: false
                        },
                        ticks: { color: '#9CA3AF' }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    generatePriceHistory() {
        let basePrice = 1.24;
        return Array.from({length: 24}, () => {
            basePrice += (Math.random() - 0.48) * 0.05;
            return basePrice;
        });
    }

    setupEventListeners() {
        const mintButton = document.getElementById('mintIdea');
        if (mintButton) {
            mintButton.addEventListener('click', () => this.handleMintIdea());
        }

        // Setup search functionality
        const searchInput = document.querySelector('.table-controls input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Setup time filter buttons
        const timeButtons = document.querySelectorAll('.time-filters button');
        timeButtons.forEach(button => {
            button.addEventListener('click', () => {
                timeButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                this.updateTrendingIdeas(button.textContent);
            });
        });

        const aiGenerateBtn = document.getElementById('aiGenerateBtn');
        if (aiGenerateBtn) {
            aiGenerateBtn.addEventListener('click', async () => {
                const urlInput = document.getElementById('ideaUrl');
                const descInput = document.getElementById('ideaDescription');
                
                aiGenerateBtn.disabled = true;
                aiGenerateBtn.innerHTML = '<span class="ai-icon">🤖</span>Thinking...';
                
                const description = await this.generateIdeaDescription(urlInput.value);
                descInput.value = description;
                
                aiGenerateBtn.disabled = false;
                aiGenerateBtn.innerHTML = '<span class="ai-icon">🤖</span>Ask rolodexter';
                
                this.showNotification('AI generated a new idea description!', 'info');
            });
        }

        // Add portfolio navigation
        const portfolioNav = document.querySelector('.nav-item[href="#portfolio"]');
        if (portfolioNav) {
            portfolioNav.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.platform-page').style.display = 'none';
                document.querySelector('.portfolio-page').style.display = 'block';
                this.initializePortfolio();
            });
        }

        // Add view controls for portfolio
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                // Filter portfolio view based on selection
                const filter = button.textContent.toLowerCase();
                this.updatePortfolioView(filter);
            });
        });

        // Add chat system event listeners
        document.querySelector('.chat-toggle')?.addEventListener('click', () => {
            document.querySelector('.chat-window')?.classList.toggle('show');
        });

        document.querySelector('.minimize-chat')?.addEventListener('click', () => {
            document.querySelector('.chat-window')?.classList.remove('show');
        });
    }

    async handleMintIdea() {
        const urlInput = document.getElementById('ideaUrl');
        const descInput = document.getElementById('ideaDescription');
        const supplyInput = document.getElementById('ideaSupply');
        const royaltyInput = document.getElementById('ideaRoyalty');

        if (!this.validateInputs(urlInput, descInput, supplyInput, royaltyInput)) {
            return;
        }

        const mintButton = document.getElementById('mintIdea');
        mintButton.disabled = true;
        mintButton.textContent = 'Minting...';

        try {
            const newIdea = {
                id: this.generateHash(),
                url: urlInput.value,
                description: descInput.value,
                supply: parseInt(supplyInput.value),
                royalty: parseInt(royaltyInput.value),
                currentPrice: 1.00,
                marketCap: parseInt(supplyInput.value) * 1.00,
                holders: 1,
                mintedAt: new Date(),
                change24h: 0,
                volume24h: 0,
                graduated: false
            };

            await this.simulateMinting(newIdea);
            this.activeIdeas.set(newIdea.id, newIdea);
            this.addIdeaToTable(newIdea);
            this.updateTrendingIdeas();

            // Reset form
            urlInput.value = '';
            descInput.value = '';
            supplyInput.value = '1000';
            royaltyInput.value = '5';

            // Show success notification
            this.showNotification('Idea NFT minted successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to mint Idea NFT. Please try again.', 'error');
        } finally {
            mintButton.disabled = false;
            mintButton.innerHTML = '<span class="icon">⚡</span>Mint Idea NFT';
        }
    }

    async simulateMinting(idea) {
        const steps = [
            'Creating SPL token...',
            'Setting initial supply...',
            'Configuring royalties...',
            'Finalizing mint...'
        ];

        for (const step of steps) {
            this.showNotification(step, 'info');
            await this.sleep(1000);
        }
    }

    validateInputs(urlInput, descInput, supplyInput, royaltyInput) {
        try {
            new URL(urlInput.value);
        } catch {
            this.showNotification('Please enter a valid URL', 'error');
            return false;
        }

        if (!descInput.value.trim()) {
            this.showNotification('Please provide a description', 'error');
            return false;
        }

        const supply = parseInt(supplyInput.value);
        if (isNaN(supply) || supply < 100 || supply > 10000) {
            this.showNotification('Supply must be between 100 and 10,000', 'error');
            return false;
        }

        const royalty = parseInt(royaltyInput.value);
        if (isNaN(royalty) || royalty < 1 || royalty > 10) {
            this.showNotification('Royalty must be between 1% and 10%', 'error');
            return false;
        }

        return true;
    }

    initializeMarketData() {
        // First initialize trending ideas
        this.trendingMockIdeas.forEach(mockIdea => {
            const idea = {
                id: this.generateHash(),
                ...mockIdea,
                currentPrice: mockIdea.initialPrice,
                marketCap: mockIdea.initialPrice * mockIdea.supply,
                holders: Math.floor(mockIdea.supply * 0.6), // Higher holder ratio for trending
                change24h: (Math.random() * 15) + 5, // Positive changes for trending
                mintedAt: new Date(Date.now() - Math.random() * 86400000),
                graduated: false,
                graduationWarningShown: false,
                lastUpdate: Date.now(),
                volatility: 0.03 + (Math.random() * 0.04), // Higher volatility for trending
            };
            this.activeIdeas.set(idea.id, idea);
            this.addIdeaToTable(idea);
        });

        // Then initialize regular ideas
        this.mockIdeas.forEach(mockIdea => {
            const idea = {
                id: this.generateHash(),
                ...mockIdea,
                currentPrice: mockIdea.initialPrice,
                marketCap: mockIdea.initialPrice * mockIdea.supply,
                holders: Math.floor(mockIdea.supply * 0.4),
                volume24h: mockIdea.initialPrice * mockIdea.supply * (Math.random() * 0.3),
                change24h: (Math.random() * 20) - 10,
                mintedAt: new Date(Date.now() - Math.random() * 86400000),
                graduated: false,
                graduationWarningShown: false,
                lastUpdate: Date.now(),
                volatility: 0.02 + (Math.random() * 0.03),
                trend: Math.random() > 0.5 ? 1 : -1,
                momentum: 0
            };
            this.activeIdeas.set(idea.id, idea);
            this.addIdeaToTable(idea);
        });

        // Immediately update trending display
        this.updateTrendingIdeas('1H');
    }

    startMarketSimulation() {
        // Update prices every 1.5 seconds
        setInterval(() => this.updateMarketPrices(), 1500);
        
        // Update trends every 20 seconds
        setInterval(() => this.updateMarketTrends(), 20000);
        
        // Update trading volume every 5 seconds
        setInterval(() => this.updateTradingVolumes(), 5000);
        
        // Update featured ideas every 3 seconds
        setInterval(() => this.updateFeaturedIdeas(), 3000);
        
        // Update trending ideas every 10 seconds
        setInterval(() => this.updateTrendingIdeas(), 10000);
    }

    updateMarketPrices() {
        // Global market sentiment (-1 to 1)
        const marketSentiment = Math.cos(Date.now() / 1000000) * 0.5;
        
        this.activeIdeas.forEach(idea => {
            const timeDelta = (Date.now() - idea.lastUpdate) / 1000;
            
            // Apply market sentiment to momentum
            idea.momentum += (Math.random() - 0.5 + marketSentiment) * 0.1 * idea.trend;
            idea.momentum *= 0.95; // Decay momentum
            
            // More realistic price movement
            const baseChange = (Math.random() - 0.5) * idea.volatility;
            const sentimentChange = marketSentiment * idea.volatility * 0.5;
            const momentumChange = idea.momentum * idea.volatility;
            const totalChange = (baseChange + sentimentChange + momentumChange) * timeDelta;
            
            const oldPrice = idea.currentPrice;
            idea.currentPrice *= (1 + totalChange);
            idea.currentPrice = Math.max(0.01, idea.currentPrice);
            
            // Update metrics
            idea.marketCap = idea.currentPrice * idea.supply;
            idea.change24h = ((idea.currentPrice / oldPrice - 1) * 100);
            
            // Simulate correlated volume
            if (Math.abs(totalChange) > idea.volatility) {
                idea.volume24h += Math.abs(totalChange) * idea.currentPrice * idea.supply * 0.1;
            }
            
            idea.lastUpdate = Date.now();
            this.checkGraduationStatus(idea);
            this.updateIdeaInTable(idea);
        });

        this.updateMarketMetrics();
        this.updateTrendingIdeas();
    }

    updateMarketTrends() {
        this.activeIdeas.forEach(idea => {
            if (Math.random() > 0.7) { // 30% chance to change trend
                idea.trend *= -1;
                idea.volatility = 0.02 + (Math.random() * 0.03);
            }
        });
    }

    updateTradingVolumes() {
        this.activeIdeas.forEach(idea => {
            const volumeChange = (Math.random() * idea.currentPrice * 100) * (1 + Math.abs(idea.momentum));
            idea.volume24h += volumeChange;
            
            // Simulate holder changes
            const holderChange = Math.floor(Math.random() * 3) - 1;
            idea.holders = Math.max(1, Math.min(idea.supply, idea.holders + holderChange));
            
            this.updateIdeaInTable(idea);
        });
    }

    simulateNewIdea() {
        const topics = ['AI', 'Space', 'Crypto', 'Biotech', 'Climate'];
        const urls = [
            'github.com',
            'x.com',
            'research.ai',
            'space.tech',
            'biotech.org'
        ];
        
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
        
        const newIdea = {
            id: this.generateHash(),
            url: `https://${randomUrl}/trending-${randomTopic.toLowerCase()}-${Date.now()}`,
            description: `New breakthrough in ${randomTopic} technology`,
            currentPrice: 1.0 + (Math.random() * 2),
            supply: 1000 + Math.floor(Math.random() * 9000),
            holders: 1,
            volume24h: 0,
            change24h: 0,
            mintedAt: new Date(),
            graduated: false,
            graduationWarningShown: false,
            lastUpdate: Date.now(),
            volatility: 0.02 + (Math.random() * 0.03),
            trend: 1,
            momentum: 0
        };

        newIdea.marketCap = newIdea.currentPrice * newIdea.supply;
        
        this.activeIdeas.set(newIdea.id, newIdea);
        this.addIdeaToTable(newIdea);
        this.showNotification(`New Idea Minted: ${newIdea.description}`, 'info');
    }

    checkGraduationStatus(idea) {
        if (idea.marketCap >= 40000 && idea.marketCap < 50000 && !idea.graduationWarningShown) {
            idea.graduationWarningShown = true;
            this.showNotification(`${new URL(idea.url).hostname} is approaching graduation! 🚀`, 'warning');
        }

        if (idea.marketCap >= 50000 && !idea.graduated) {
            idea.graduated = true;
            this.showNotification(`${new URL(idea.url).hostname} has graduated! Market cap: $${this.formatNumber(idea.marketCap)}`, 'graduation');
        }
    }

    addIdeaToTable(idea) {
        const tbody = document.getElementById('activeIdeasList');
        if (!tbody) return;

        const tr = document.createElement('tr');
        tr.id = `idea-${idea.id}`;
        
        const isAboutToGraduate = idea.marketCap >= 40000 && idea.marketCap < 50000;
        
        tr.innerHTML = `
            <td>
                <div class="idea-cell">
                    <div class="idea-name">${new URL(idea.url).hostname}</div>
                    <div class="idea-desc">${idea.description}</div>
                </div>
            </td>
            <td>$${idea.currentPrice.toFixed(4)}</td>
            <td class="${idea.change24h >= 0 ? 'positive' : 'negative'}">
                ${idea.change24h > 0 ? '+' : ''}${idea.change24h.toFixed(2)}%
            </td>
            <td>$${this.formatNumber(idea.marketCap)}</td>
            <td>$${this.formatNumber(idea.volume24h)}</td>
            <td>
                ${isAboutToGraduate ? 
                    '<span class="status-badge about-to-graduate">Ready Soon</span>' : 
                    '—'}
            </td>
            <td>
                ${idea.graduated ? 
                    '<span class="status-badge graduated">Yes</span>' : 
                    '—'}
            </td>
            <td>
                <button class="action-btn trade-btn">Trade</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    updateIdeaInTable(idea) {
        const row = document.getElementById(`idea-${idea.id}`);
        if (!row) return;

        const cells = row.getElementsByTagName('td');
        const oldPrice = parseFloat(cells[1].textContent.replace('$', ''));
        const newPrice = idea.currentPrice;
        
        // Price cell with animation
        cells[1].innerHTML = `
            $${newPrice.toFixed(4)}
            <span class="price-indicator ${newPrice > oldPrice ? 'price-up' : 'price-down'}"></span>
        `;
        cells[1].classList.remove('flash-green', 'flash-red');
        cells[1].classList.add(newPrice > oldPrice ? 'flash-green' : 'flash-red');

        // Change cell with trend
        cells[2].className = idea.change24h >= 0 ? 'positive' : 'negative';
        cells[2].innerHTML = `
            <span class="trend-indicator ${idea.change24h >= 0 ? 'trend-up' : 'trend-down'}">
                ${idea.change24h >= 0 ? '↑' : '↓'} ${Math.abs(idea.change24h).toFixed(2)}%
            </span>
        `;

        // Market cap with graduation progress
        const graduationProgress = Math.min((idea.marketCap / 50000) * 100, 100);
        cells[3].innerHTML = `
            $${this.formatNumber(idea.marketCap)}
            <div class="graduation-progress">
                <div class="graduation-progress-bar" style="width: ${graduationProgress}%"></div>
            </div>
        `;

        // Volume with visual bar
        const maxVolume = Math.max(...Array.from(this.activeIdeas.values()).map(i => i.volume24h));
        const volumePercentage = (idea.volume24h / maxVolume) * 100;
        cells[4].innerHTML = `
            $${this.formatNumber(idea.volume24h)}
            <div class="volume-bar">
                <div class="volume-bar-fill" style="width: ${volumePercentage}%"></div>
            </div>
        `;

        // Update graduation status cells
        const isAboutToGraduate = idea.marketCap >= 40000 && idea.marketCap < 50000;
        cells[5].innerHTML = isAboutToGraduate ? 
            '<span class="status-badge about-to-graduate">Ready Soon</span>' : 
            '—';
        cells[6].innerHTML = idea.graduated ? 
            '<span class="status-badge graduated">Yes</span>' : 
            '—';

        // Highlight row if actively trading
        if (Math.random() > 0.7) {
            row.classList.add('active-row');
            setTimeout(() => row.classList.remove('active-row'), 1000);
        }
    }

    updateTrendingIdeas(timeframe = '1H') {
        const container = document.getElementById('trendingIdeas');
        if (!container) return;

        // Get top 8 ideas by volume
        const ideas = Array.from(this.activeIdeas.values())
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, 8);

        container.innerHTML = ideas.map(idea => `
            <div class="trending-item">
                <div class="trending-info">
                    <div class="trending-url">${new URL(idea.url).hostname}</div>
                    <div class="trending-description">${idea.description}</div>
                </div>
                <div class="trending-metrics">
                    <div class="trending-price">$${idea.currentPrice.toFixed(4)}</div>
                    <div class="trending-change ${idea.change24h >= 0 ? 'positive' : 'negative'}">
                        <span class="trend-arrow">${idea.change24h >= 0 ? '↑' : '↓'}</span>
                        ${Math.abs(idea.change24h).toFixed(2)}%
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateMarketMetrics() {
        const totalVolume = Array.from(this.activeIdeas.values())
            .reduce((sum, idea) => sum + idea.volume24h, 0);
        const totalMarketCap = Array.from(this.activeIdeas.values())
            .reduce((sum, idea) => sum + idea.marketCap, 0);
        const graduatedCount = Array.from(this.activeIdeas.values())
            .filter(idea => idea.graduated).length;

        document.querySelector('.market-overview').innerHTML = `
            <div class="stat-card">
                <span class="stat-label">24h Volume</span>
                <span class="stat-value">$${this.formatNumber(totalVolume)}</span>
                <span class="stat-change positive">+12.5%</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Active Ideas</span>
                <span class="stat-value">${this.activeIdeas.size}</span>
                <span class="stat-change positive">+${Math.floor(Math.random() * 5)}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Graduated</span>
                <span class="stat-value">${graduatedCount}</span>
                <span class="stat-change neutral">+${Math.floor(Math.random() * 2)}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Total TVL</span>
                <span class="stat-value">$${this.formatNumber(totalMarketCap)}</span>
                <span class="stat-change positive">+5.2%</span>
            </div>
        `;
    }

    updateFeaturedIdeas() {
        const featuredContainer = document.getElementById('featuredIdeas');
        if (!featuredContainer) return;

        // Select top 3 ideas by volume and positive momentum
        const featuredIdeas = Array.from(this.activeIdeas.values())
            .filter(idea => !idea.graduated && idea.momentum > 0)
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, 3);

        featuredContainer.innerHTML = featuredIdeas.map(idea => `
            <div class="featured-item">
                <div class="featured-header">
                    <div class="featured-name">${new URL(idea.url).hostname}</div>
                    <div class="featured-price">$${idea.currentPrice.toFixed(4)}</div>
                </div>
                <div class="featured-description">${idea.description}</div>
                <div class="featured-metrics">
                    <div class="metric">
                        <span class="label">Vol</span>
                        <span class="value">$${this.formatNumber(idea.volume24h)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">MCap</span>
                        <span class="value">$${this.formatNumber(idea.marketCap)}</span>
                    </div>
                    <div class="metric ${idea.change24h >= 0 ? 'positive' : 'negative'}">
                        <span class="label">24h</span>
                        <span class="value">${idea.change24h > 0 ? '+' : ''}${idea.change24h.toFixed(2)}%</span>
                    </div>
                </div>
                <button class="trade-btn">Trade Now</button>
            </div>
        `).join('');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        
        // Special styling for graduation notifications
        if (message.includes('graduated')) {
            type = 'graduation';
            notification.innerHTML = `
                <div class="notification-icon">🎓</div>
                <div class="notification-content">
                    <div class="notification-title">Graduation Achievement!</div>
                    <div class="notification-message">${message}</div>
                </div>
            `;
        } else {
            notification.textContent = message;
        }
        
        notification.className = `notification ${type}`;
        document.querySelector('.notifications-container').appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000); // Show graduation notifications longer
        }, 100);
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toFixed(0);
    }

    generateHash() {
        return '0x' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startFeatureTour() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'tour-overlay';
        document.body.appendChild(overlay);

        for (const step of this.tourSteps) {
            await this.showTourStep(step);
        }

        // Clean up
        document.body.removeChild(overlay);
    }

    async showTourStep(step, cursor, spotlight, spotlightHole) {
        const element = document.querySelector(step.element);
        if (!element) return;

        // Special handling for messenger steps
        if (step.element === '.chat-toggle') {
            // Ensure messenger button is highly visible
            document.querySelector('.chat-toggle').classList.add('highlight-pulse');
            // Wait slightly longer on messenger introduction
            await this.sleep(800);
        }

        // Remove highlight from previous elements
        document.querySelectorAll('[data-tour-active="true"]').forEach(el => {
            el.removeAttribute('data-tour-active');
            el.classList.remove('highlight-pulse');
        });

        // Add highlight to current element
        element.setAttribute('data-tour-active', 'true');

        // Move cursor to element
        const rect = element.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        
        await this.moveCursor(cursor, targetX, targetY);

        // Enhanced spotlight for messenger features
        if (step.element.includes('chat-')) {
            spotlight.classList.add('visible', 'messenger-spotlight');
            const padding = step.element === '.chat-toggle' ? 15 : 20;
            Object.assign(spotlightHole.style, {
                left: `${rect.left - padding}px`,
                top: `${rect.top - padding}px`,
                width: `${rect.width + (padding * 2)}px`,
                height: `${rect.height + (padding * 2)}px`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            });
        } else {
            spotlight.classList.remove('messenger-spotlight');
            spotlight.classList.add('visible');
            const padding = 10;
            Object.assign(spotlightHole.style, {
                left: `${rect.left - padding}px`,
                top: `${rect.top - padding}px`,
                width: `${rect.width + (padding * 2)}px`,
                height: `${rect.height + (padding * 2)}px`
            });
        }

        // Enhanced tooltip for messenger features
        const tooltip = document.getElementById('tourTooltip');
        if (step.element.includes('chat-')) {
            tooltip.className = 'tour-tooltip messenger-tooltip';
        } else {
            tooltip.className = 'tour-tooltip';
        }

        tooltip.innerHTML = `
            <div class="tour-tooltip-header">
                <h3>${step.title}</h3>
                <span class="tour-step">${this.tourSteps.indexOf(step) + 1}/${this.tourSteps.length}</span>
            </div>
            <div class="tour-tooltip-content">${step.content}</div>
            <div class="tour-tooltip-footer">
                <button class="tour-next-btn">Continue</button>
            </div>
        `;

        // Position tooltip
        const tooltipPos = this.calculateTooltipPosition(rect, step.position);
        Object.assign(tooltip.style, tooltipPos);
        tooltip.classList.add('visible');

        // Perform step action if any
        if (step.action) {
            await step.action();
        }

        // Special handling for chat window step
        if (step.element === '.chat-window') {
            // Keep chat window visible longer to show the interaction
            await new Promise(resolve => {
                const nextBtn = tooltip.querySelector('.tour-next-btn');
                nextBtn.onclick = () => {
                    element.removeAttribute('data-tour-active');
                    tooltip.classList.remove('visible');
                    spotlight.classList.remove('visible', 'messenger-spotlight');
                    resolve();
                };
                setTimeout(() => {
                    if (tooltip.classList.contains('visible')) {
                        element.removeAttribute('data-tour-active');
                        tooltip.classList.remove('visible');
                        spotlight.classList.remove('visible', 'messenger-spotlight');
                        resolve();
                    }
                }, 8000); // Longer timeout for chat interaction
            });
            return;
        }

        // Standard step handling
        await new Promise(resolve => {
            const nextBtn = tooltip.querySelector('.tour-next-btn');
            nextBtn.onclick = () => {
                element.removeAttribute('data-tour-active');
                tooltip.classList.remove('visible');
                spotlight.classList.remove('visible', 'messenger-spotlight');
                resolve();
            };
            setTimeout(() => {
                if (tooltip.classList.contains('visible')) {
                    element.removeAttribute('data-tour-active');
                    tooltip.classList.remove('visible');
                    spotlight.classList.remove('visible', 'messenger-spotlight');
                    resolve();
                }
            }, 4000);
        });
    }

    calculateTooltipPosition(elementRect, position) {
        const tooltipWidth = 300;
        const tooltipHeight = 150;
        const margin = 20;
        let left, top;

        switch (position) {
            case 'right':
                left = elementRect.right + margin;
                top = elementRect.top + (elementRect.height - tooltipHeight) / 2;
                break;
            case 'left':
                left = elementRect.left - tooltipWidth - margin;
                top = elementRect.top + (elementRect.height - tooltipHeight) / 2;
                break;
            case 'top':
                left = elementRect.left + (elementRect.width - tooltipWidth) / 2;
                top = elementRect.top - tooltipHeight - margin;
                break;
            case 'bottom':
                left = elementRect.left + (elementRect.width - tooltipWidth) / 2;
                top = elementRect.bottom + margin;
                break;
        }

        // Keep tooltip within viewport
        left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));

        return {
            left: `${left}px`,
            top: `${top}px`
        };
    }

    async typeIntoInput(inputId, text) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.focus();
        input.value = '';
        for (const char of text) {
            input.value += char;
            await this.sleep(50);
        }
    }

    // Add AI generation method
    async generateIdeaDescription(url) {
        const industries = ['healthcare', 'education', 'transportation', 'energy', 'agriculture'];
        const problems = ['water scarcity', 'food distribution', 'renewable energy access', 'medical care', 'education'];
        const services = ['healthcare', 'banking', 'education', 'logistics', 'governance'];
        const environmental_issues = ['carbon capture', 'ocean cleanup', 'reforestation', 'waste management'];
        const human_abilities = ['memory', 'learning', 'creativity', 'physical performance', 'cognitive processing'];

        const getRandomFrom = arr => arr[Math.floor(Math.random() * arr.length)];
        const prompt = getRandomFrom(this.ideaPrompts)
            .replace('{industry}', getRandomFrom(industries))
            .replace('{problem}', getRandomFrom(problems))
            .replace('{service}', getRandomFrom(services))
            .replace('{environmental_issue}', getRandomFrom(environmental_issues))
            .replace('{human_ability}', getRandomFrom(human_abilities));

        // Simulate AI thinking
        await this.sleep(1000);
        return prompt;
    }

    // Add these new methods for tour functionality
    async startProductTour() {
        // Create cursor element
        const cursor = document.createElement('div');
        cursor.className = 'simulated-cursor';
        document.body.appendChild(cursor);

        // Create spotlight overlay
        const spotlight = document.createElement('div');
        spotlight.className = 'tour-spotlight';
        const spotlightHole = document.createElement('div');
        spotlightHole.className = 'tour-spotlight-hole';
        spotlight.appendChild(spotlightHole);
        document.body.appendChild(spotlight);

        // Reduced initial wait time
        await this.sleep(1000); // Reduced from 2000ms to 1000ms

        // Run through each tour step
        for (const step of this.tourSteps) {
            await this.showTourStep(step, cursor, spotlight, spotlightHole);
        }

        // Cleanup
        document.body.removeChild(cursor);
        document.body.removeChild(spotlight);
    }

    async moveCursor(cursor, targetX, targetY) {
        const startX = parseFloat(cursor.style.left) || 0;
        const startY = parseFloat(cursor.style.top) || 0;
        const steps = 15; // Reduced from 20 for faster movement
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const x = startX + (targetX - startX) * this.easeInOutCubic(progress);
            const y = startY + (targetY - startY) * this.easeInOutCubic(progress);
            
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
            
            await this.sleep(15); // Reduced from 20ms to 15ms for faster movement
        }
    }

    async simulateClick(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        const cursor = document.querySelector('.simulated-cursor');
        if (cursor) {
            cursor.classList.add('clicking');
            await this.sleep(200);
            cursor.classList.remove('clicking');
        }

        element.click();
    }

    async simulateTyping(selector, text) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.focus();
        element.value = '';
        for (const char of text) {
            element.value += char;
            await this.sleep(25); // Reduced from 50ms to 25ms for faster typing
        }
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    initializePortfolio() {
        this.initializePortfolioChart();
        this.updatePortfolioView();
        this.updateActivityList();
        this.startPortfolioUpdates();
    }

    initializePortfolioChart() {
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 200);
        gradientFill.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradientFill.addColorStop(1, 'rgba(59, 130, 246, 0)');

        this.portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => `${29-i}d`).reverse(),
                datasets: [{
                    label: 'Portfolio Value',
                    data: this.generatePortfolioHistory(),
                    borderColor: '#3B82F6',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradientFill,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        grid: {
                            color: 'rgba(75, 85, 99, 0.1)'
                        }
                    }
                }
            }
        });
    }

    generatePortfolioHistory() {
        let value = 35000;
        return Array.from({length: 30}, () => {
            value += (Math.random() - 0.45) * 1000; // Slight upward bias
            return value;
        });
    }

    updatePortfolioView() {
        const holdingsList = document.getElementById('holdingsList');
        if (!holdingsList) return;

        holdingsList.innerHTML = this.portfolioIdeas.map(idea => {
            const profitLoss = (idea.currentPrice - idea.avgPrice) * idea.holdings;
            const profitLossPercent = ((idea.currentPrice / idea.avgPrice - 1) * 100).toFixed(2);
            
            return `
                <tr>
                    <td>
                        <div class="idea-cell">
                            <div class="idea-name">${new URL(idea.url).hostname}</div>
                            <div class="idea-desc">${idea.description}</div>
                        </div>
                    </td>
                    <td>${idea.holdings.toLocaleString()}</td>
                    <td>$${idea.avgPrice.toFixed(4)}</td>
                    <td>$${idea.currentPrice.toFixed(4)}</td>
                    <td class="holdings-profit ${profitLoss >= 0 ? 'positive' : 'negative'}">
                        ${profitLoss >= 0 ? '+' : ''}${profitLossPercent}%
                        ($${Math.abs(profitLoss).toLocaleString(undefined, {maximumFractionDigits: 2})})
                    </td>
                    <td>$${idea.value.toLocaleString()}</td>
                    <td>
                        <span class="status-badge ${idea.status}">${idea.status}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateActivityList() {
        const activityList = document.getElementById('recentActivity');
        if (!activityList) return;

        activityList.innerHTML = this.recentActivity.map(activity => {
            const timeAgo = this.getTimeAgo(activity.time);
            let icon, title, details;

            switch (activity.type) {
                case 'purchase':
                    icon = '🔵';
                    title = `Bought ${activity.idea}`;
                    details = `${activity.amount} tokens at $${activity.price}`;
                    break;
                case 'sale':
                    icon = '🔴';
                    title = `Sold ${activity.idea}`;
                    details = `${activity.amount} tokens at $${activity.price}`;
                    break;
                case 'graduation':
                    icon = '🎓';
                    title = `${activity.idea} Graduated`;
                    details = `Earned ${activity.reward} $ROLODEXTER`;
                    break;
            }

            return `
                <div class="activity-item">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content">
                        <div class="activity-title">${title}</div>
                        <div class="activity-details">${details}</div>
                        <div class="activity-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    startPortfolioUpdates() {
        setInterval(() => {
            // Update idea prices
            this.portfolioIdeas.forEach(idea => {
                const change = (Math.random() - 0.48) * 0.01; // Slight upward bias
                idea.currentPrice *= (1 + change);
                idea.value = idea.holdings * idea.currentPrice;
            });

            this.updatePortfolioView();
        }, 5000);
    }

    async simulateMarketAnalysisChat(chatSystem) {
        const messages = [
            {
                content: "Hi rolodexter! Can you analyze the Space debris cleanup NFT?",
                sender: "user"
            },
            {
                content: "📊 Quick Market Analysis for Space Debris Cleanup NFT:\n\n" +
                        "Price: $2.45 (+15.3% 24h)\n" +
                        "Volume: $125K (+85% 24h)\n" +
                        "Market Cap: $12.25K\n\n" +
                        "Graduation Progress: 24.5%\n\n" +
                        "Would you like technical analysis, market sentiment, or idea validation metrics?",
                sender: "rolodexter"
            },
            {
                content: "Show me the technical analysis please",
                sender: "user"
            },
            {
                content: "🎯 Technical Analysis - Space Debris Cleanup NFT:\n\n" +
                        "1. Price Action:\n" +
                        "- Strong uptrend on 4H chart\n" +
                        "- Trading above all EMAs\n" +
                        "- Clear higher highs and lows\n\n" +
                        "2. Key Levels:\n" +
                        "- Support: $2.30\n" +
                        "- Resistance: $2.75\n" +
                        "- Breakout target: $3.15\n\n" +
                        "3. Indicators:\n" +
                        "- RSI: 65 (Bullish)\n" +
                        "- MACD: Golden Cross forming\n" +
                        "- Volume: Above 20D average\n\n" +
                        "🔮 Forecast: High probability of reaching $3.15 within 48h",
                sender: "rolodexter"
            }
        ];

        for (const message of messages) {
            await this.sleep(800); // Slightly faster message timing
            await this.simulateTypingMessage(message, message.sender === 'rolodexter' ? 20 : 10);
        }
    }

    async simulateTypingMessage(message, typingSpeed = 10) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `chat-message ${message.sender}`;
        
        // Enhanced message styling for rolodexter's analysis
        if (message.sender === 'rolodexter' && message.content.includes('Technical Analysis')) {
            messageContainer.classList.add('analysis-message');
        }
        
        messageContainer.innerHTML = `<div class="message-content"></div>`;
        document.querySelector('.chat-messages').appendChild(messageContainer);

        const content = messageContainer.querySelector('.message-content');
        
        // Show typing indicator
        if (message.sender === 'rolodexter') {
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
            messageContainer.appendChild(typingIndicator);
            await this.sleep(500);
            typingIndicator.remove();
        }

        // Type out the message
        for (const char of message.content) {
            content.textContent += char;
            await this.sleep(typingSpeed);
        }

        // Scroll to latest message
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize platform when running in browser
if (typeof window !== 'undefined') {
    // Make BeaconPlatform available globally
    window.BeaconPlatform = BeaconPlatform;
}

// Only add browser-specific code if we're in a browser environment
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        const platform = new BeaconPlatform();
        
        // Start product tour after a brief delay
        setTimeout(() => {
            platform.startProductTour();
        }, 3000);
    });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BeaconPlatform;
}