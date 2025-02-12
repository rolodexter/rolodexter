class BeaconPlatform {
    constructor() {
        this.activeIdeas = new Map();
        this.initializeTokenChart();
        this.setupEventListeners();
        
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
                element: '.idea-creation',
                title: 'Create New Ideas',
                content: 'Turn any URL into a tradeable NFT. This is where your idea journey begins.',
                position: 'right'
            },
            {
                element: '#ideaUrl',
                title: 'URL Input',
                content: 'Let\'s try creating an Idea NFT! We\'ll use this SpaceX post about space exploration.',
                position: 'right',
                action: async () => {
                    const url = 'https://x.com/SpaceX/status/1889386081960730742';
                    await this.typeIntoInput('ideaUrl', url);
                }
            },
            {
                element: '#ideaDescription',
                title: 'Idea Description',
                content: 'Add a compelling description that explains the potential of your idea.',
                position: 'right',
                action: async () => {
                    const desc = 'One step closer to discovering Aliens!';
                    await this.typeIntoInput('ideaDescription', desc);
                }
            },
            {
                element: '.form-grid',
                title: 'Supply & Royalties',
                content: 'Set your initial token supply and royalty percentage. You\'ll earn royalties every time your idea is traded.',
                position: 'right'
            },
            {
                element: '#mintIdea',
                title: 'Mint Your Idea',
                content: 'Click here to mint your idea as an NFT. Once minted, it will appear in the Active Ideas table.',
                position: 'top',
                action: () => document.getElementById('mintIdea').click()
            },
            {
                element: '.ideas-table',
                title: 'Active Ideas Market',
                content: 'Watch your idea trade in real-time. When it reaches $50K market cap, it graduates to major exchanges!',
                position: 'left'
            },
            {
                element: '.token-card',
                title: '$ROLODEXTER Token',
                content: 'Stake $ROLODEXTER to earn platform fees and participate in idea curation.',
                position: 'left'
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
        // Update prices more frequently
        setInterval(() => this.updateMarketPrices(), 1500);
        
        // Update trends more frequently
        setInterval(() => this.updateMarketTrends(), 20000);
        
        // Simulate new ideas being created (more frequently)
        setInterval(() => {
            // Maintain minimum 15 active ideas
            if (this.activeIdeas.size < 15) {
                this.simulateNewIdea();
            }
        }, 30000);
        
        // Update trading volume
        setInterval(() => this.updateTradingVolumes(), 5000);

        // Update featured ideas
        setInterval(() => this.updateFeaturedIdeas(), 3000);

        // More frequent notifications about market activity
        setInterval(() => {
            const ideas = Array.from(this.activeIdeas.values());
            const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
            
            if (Math.random() > 0.7) {
                const events = [
                    `Whale accumulating ${new URL(randomIdea.url).hostname} 🐋`,
                    `Strong buy signals for ${new URL(randomIdea.url).hostname} 📈`,
                    `Unusual volume detected in ${new URL(randomIdea.url).hostname} 🚀`,
                    `New analysis suggests ${new URL(randomIdea.url).hostname} undervalued 💎`,
                    `Market makers interested in ${new URL(randomIdea.url).hostname} 👀`
                ];
                this.showNotification(events[Math.floor(Math.random() * events.length)], 'info');
            }
        }, 8000);
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
                ${idea.change24h > 0 ? '↑' : '↓'} ${Math.abs(idea.change24h).toFixed(2)}%
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

    async showTourStep(step) {
        const element = document.querySelector(step.element);
        if (!element) return;

        // Highlight current element
        element.classList.add('tour-highlight');

        // Position tooltip
        const tooltip = document.getElementById('tourTooltip');
        tooltip.innerHTML = `
            <div class="tour-tooltip-header">${step.title}</div>
            <div class="tour-tooltip-content">${step.content}</div>
            <div class="tour-tooltip-footer">
                <div class="tour-progress">Step ${this.currentTourStep + 1}/${this.tourSteps.length}</div>
                <button class="tour-next-btn">Next</button>
            </div>
        `;

        // Position tooltip relative to element
        const rect = element.getBoundingClientRect();
        const tooltipPosition = this.calculateTooltipPosition(rect, step.position);
        Object.assign(tooltip.style, tooltipPosition);

        // Show tooltip
        tooltip.classList.remove('hidden');

        // Perform step action if any
        if (step.action) {
            await step.action();
        }

        // Wait for next button click
        await new Promise(resolve => {
            const nextBtn = tooltip.querySelector('.tour-next-btn');
            nextBtn.onclick = resolve;
        });

        // Hide tooltip and remove highlight
        tooltip.classList.add('hidden');
        element.classList.remove('tour-highlight');
        this.currentTourStep++;
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
}

// Initialize platform when page loads
window.addEventListener('load', () => {
    const platform = new BeaconPlatform();
});