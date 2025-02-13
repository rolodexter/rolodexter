/**
 * Beacon Simulation class
 * 
 * UI Components:
 * - System status interface
 * - Real-time metrics and monitoring
 * - Network analysis tools
 * - Performance diagnostics
 */
interface IdeaNFT {
    id: string;
    url: string;
    description: string;
    supply: number;
    royalty: number;
    currentPrice: number;
    marketCap: number;
    holders: number;
    mintedAt: Date;
    graduated: boolean;
}

class BeaconSimulation {
    private username: string;
    private password: string;
    private isLoggedIn: boolean;
    private readonly TERMINAL_WIDTH: number = 80;

    private readonly systemMetrics = {
        nodeCount: Math.floor(Math.random() * 50) + 100,
        activeConnections: Math.floor(Math.random() * 1000) + 2000,
        throughput: Math.floor(Math.random() * 500) + 1000,
        latency: Math.floor(Math.random() * 30) + 10
    };

    private readonly marketMetrics = {
        totalIdeasMinted: 0,
        totalTradingVolume: 0,
        activeTraders: 0,
        graduatedIdeas: 0
    };

    private readonly connectionStages = [
        "Initializing Beacon network interface [protocol=UDP, port=8765]",
        "Establishing peer connections [network=mainnet, peers=active]",
        "Synchronizing distributed state [consensus=PoS]",
        "Loading network topology [type=mesh, redundancy=3x]",
        "Activating performance monitors [metrics=enabled]"
    ];

    private readonly COLORS = {
        RESET: "\x1b[0m",
        BRIGHT_CYAN: "\x1b[96m",
        BRIGHT_GREEN: "\x1b[92m",
        BRIGHT_BLUE: "\x1b[94m",
        WHITE: "\x1b[97m",
        YELLOW: "\x1b[93m"
    };

    private readonly ANIMATION_CONFIG = {
        duration: {
            fast: 300,
            medium: 600,
            slow: 1000
        },
        easing: {
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            sharp: 'cubic-bezier(0.4, 0, 1, 1)'
        },
        transitions: {
            price: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
            hover: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            scale: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
    };

    private activeIdeas: Map<string, IdeaNFT>;

    private readonly productTourSteps = [
        { 
            el: '.platform-intro',
            message: 'Welcome to BEACON—turn trending internet content into earning opportunities'
        },
        { 
            el: '.staking-section', 
            message: 'Stake your Rolodexter tokens to earn platform fees and shape the future'
        },
        { 
            el: '.idea-creation-form',
            message: 'Turn your ideas into NFTs or SPL tokens with AI-powered narratives'
        },
        { 
            el: '.market-overview',
            message: 'Explore the Ideas Market—watch, trade, and invest in early-stage ideas'
        },
        { 
            el: '.trending-ideas',
            message: 'Track trending ideas capturing mindshare across the platform'
        },
        { 
            el: '.portfolio-dashboard',
            message: 'Monitor your success with our real-time portfolio dashboard'
        },
        {
            el: '.rolodexter-flywheel',
            message: 'Trading fees fuel the Rolodexter Flywheel, creating a sustainable ecosystem'
        }
    ];

    private readonly tourSteps = [
        {
            selector: '.logo',
            message: 'Welcome to BEACON—the first Rolodexter-AI powered decentralized application'
        },
        {
            selector: '.sidebar-nav .nav-item:nth-child(4)', // Stake nav item
            message: 'Stake your Rolodexter tokens to earn platform fees'
        },
        {
            selector: '.idea-creation',
            message: 'Turn your ideas into NFTs or SPL tokens with AI assistance'
        },
        {
            selector: '.ideas-table-card',
            message: 'Explore the Ideas Market—watch, trade, and invest early'
        },
        {
            selector: '.trending',
            message: 'Keep an eye on Trending Ideas capturing mindshare'
        },
        {
            selector: '.token-card',
            message: 'Trading fees fuel the Rolodexter Flywheel, creating a sustainable ecosystem'
        }
    ];

    constructor() {
        this.username = "";
        this.password = "";
        this.isLoggedIn = false;
        this.activeIdeas = new Map();
    }

    async startSimulation() {
        console.log('Starting Beacon simulation...');
        await this.showConnectionSequence();
        await this.initializeInterface();
        // Start the product tour automatically after a short delay
        setTimeout(() => this.startProductTour(), 1000);
    }

    private async initializeInterface() {
        await this.createIdeaForm();
        this.startMarketMetricsUpdate();
        this.setupEventListeners();
        // Start cursor movement immediately
        this.setupCursorSimulation();
        await this.startProductTour();
    }

    private setupEventListeners() {
        const mintButton = document.getElementById('mintIdea');
        const urlInput = document.getElementById('ideaUrl') as HTMLInputElement;
        
        if (mintButton && urlInput) {
            mintButton.addEventListener('click', async () => {
                await this.simulateCursorMovement(mintButton);
                await this.validateAndMintIdea();
            });

            urlInput.addEventListener('input', () => {
                this.validateURL(urlInput.value);
            });
        }
    }

    private async validateAndMintIdea() {
        const urlInput = document.getElementById('ideaUrl') as HTMLInputElement;
        const descInput = document.getElementById('ideaDescription') as HTMLTextAreaElement;
        const supplyInput = document.getElementById('ideaSupply') as HTMLInputElement;
        const royaltyInput = document.getElementById('ideaRoyalty') as HTMLInputElement;

        if (!this.validateURL(urlInput.value)) {
            console.log(`${this.COLORS.YELLOW}[ERROR] Invalid URL. Please enter a valid, publicly accessible URL${this.COLORS.RESET}`);
            return;
        }

        if (!descInput.value.trim()) {
            console.log(`${this.COLORS.YELLOW}[ERROR] Please provide a description for your idea${this.COLORS.RESET}`);
            return;
        }

        console.log(`${this.COLORS.BRIGHT_BLUE}[MINTING] Initializing Idea NFT creation for ${urlInput.value}${this.COLORS.RESET}`);
        
        // Simulate Solana transaction
        const mintHash = this.generateHash();
        const supply = parseInt(supplyInput.value);
        const royalty = parseInt(royaltyInput.value);

        await this.sleep(2000);
        console.log(`${this.COLORS.BRIGHT_BLUE}[SOLANA] Creating SPL token contract...${this.COLORS.RESET}`);
        await this.sleep(1500);
        console.log(`${this.COLORS.BRIGHT_BLUE}[SOLANA] Setting initial supply: ${supply} tokens${this.COLORS.RESET}`);
        await this.sleep(1000);
        console.log(`${this.COLORS.BRIGHT_BLUE}[SOLANA] Configuring royalty: ${royalty}%${this.COLORS.RESET}`);
        await this.sleep(1500);
        
        console.log(`${this.COLORS.BRIGHT_GREEN}[SUCCESS] Idea NFT minted successfully!${this.COLORS.RESET}`);
        console.log(`${this.COLORS.WHITE}Transaction Hash: ${mintHash}${this.COLORS.RESET}`);

        const newIdea: IdeaNFT = {
            id: mintHash,
            url: urlInput.value,
            description: descInput.value,
            supply: parseInt(supplyInput.value),
            royalty: parseInt(royaltyInput.value),
            currentPrice: 1.00, // Initial price $1
            marketCap: parseInt(supplyInput.value) * 1.00,
            holders: 1, // Creator is first holder
            mintedAt: new Date(),
            graduated: false
        };

        this.activeIdeas.set(mintHash, newIdea);
        this.startIdeaTrading(mintHash);

        this.marketMetrics.totalIdeasMinted++;
        this.updateMarketMetrics();
    }

    private startIdeaTrading(ideaId: string) {
        setInterval(() => {
            const idea = this.activeIdeas.get(ideaId);
            if (!idea) return;

            // Simulate market activity
            const priceChange = (Math.random() - 0.45) * 0.1; // Slight bias towards growth
            idea.currentPrice *= (1 + priceChange);
            idea.marketCap = idea.currentPrice * idea.supply;
            
            // Simulate holder changes
            if (Math.random() > 0.7) {
                idea.holders += Math.random() > 0.5 ? 1 : -1;
                idea.holders = Math.max(1, Math.min(idea.holders, idea.supply));
            }

            // Check for graduation
            if (idea.marketCap >= 50000 && !idea.graduated) {
                idea.graduated = true;
                this.marketMetrics.graduatedIdeas++;
                this.simulateIdeaGraduation();
                console.log(`
${this.COLORS.BRIGHT_GREEN}[GRADUATION ALERT]${this.COLORS.RESET}
Idea: ${idea.url}
Market Cap: $${idea.marketCap.toFixed(2)}
Current Price: $${idea.currentPrice.toFixed(2)}
Total Holders: ${idea.holders}
                `);
            }

            // Update trading metrics
            this.marketMetrics.totalTradingVolume += idea.currentPrice * (Math.random() * 100);
            this.marketMetrics.activeTraders = Array.from(this.activeIdeas.values())
                .reduce((acc, idea) => acc + idea.holders, 0);
        }, 3000);
    }

    private validateURL(url: string): boolean {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch {
            return false;
        }
    }

    private generateHash(): string {
        return '0x' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
    }

    private async createIdeaForm() {
        const form = document.createElement('div');
        form.className = 'idea-creation-form';
        form.innerHTML = `
            <div class="form-header">Create New Idea NFT</div>
            <div class="form-group">
                <label>URL</label>
                <input type="url" id="ideaUrl" placeholder="https://..." required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="ideaDescription" placeholder="Describe your idea..." required></textarea>
            </div>
            <div class="form-group">
                <label>Initial Supply</label>
                <input type="number" id="ideaSupply" min="100" max="10000" value="1000">
            </div>
            <div class="form-group">
                <label>Royalty Percentage</label>
                <input type="number" id="ideaRoyalty" min="1" max="10" value="5">
            </div>
            <button id="mintIdea">Mint Idea NFT</button>
        `;
        document.body.appendChild(form);
        
        this.setupCursorSimulation();
    }

    private setupCursorSimulation() {
        const cursor = document.createElement('div');
        cursor.className = 'simulated-cursor';
        document.body.appendChild(cursor);
        
        // Start with cursor movement based on form elements
        this.moveCursorToNextElement();
    }

    private async moveCursorToNextElement() {
        const elements = [
            document.querySelector('.idea-creation-form'),
            document.querySelector('#ideaUrl'),
            document.querySelector('#ideaDescription'),
            document.querySelector('#ideaSupply'),
            document.querySelector('#ideaRoyalty'),
            document.querySelector('#mintIdea')
        ].filter(el => el !== null) as HTMLElement[];

        const cursor = document.querySelector('.simulated-cursor') as HTMLElement;
        if (!cursor || elements.length === 0) return;

        let currentIndex = 0;
        const moveToNext = async () => {
            const element = elements[currentIndex];
            const rect = element.getBoundingClientRect();
            
            cursor.style.left = `${rect.left + rect.width / 2}px`;
            cursor.style.top = `${rect.top + rect.height / 2}px`;
            
            // Add highlight effect
            element.classList.add('highlight');
            await this.sleep(2000);
            element.classList.remove('highlight');
            
            currentIndex = (currentIndex + 1) % elements.length;
            setTimeout(moveToNext, 2000);
        };

        moveToNext();
    }

    private async simulateCursorMovement(element: HTMLElement) {
        const cursor = document.querySelector('.simulated-cursor') as HTMLElement;
        if (!cursor || !element) return;

        const rect = element.getBoundingClientRect();
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
        
        // Click effect
        cursor.style.transform = 'scale(0.9)';
        await this.sleep(200);
        cursor.style.transform = 'scale(1)';
    }

    private async startProductTour() {
        const cursor = document.querySelector('.simulated-cursor');
        const tooltip = document.getElementById('tourTooltip');
        if (!cursor || !tooltip) return;

        for (const step of this.tourSteps) {
            const element = document.querySelector(step.selector);
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            
            // Move cursor
            cursor.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            cursor.style.left = `${rect.left + rect.width / 2}px`;
            cursor.style.top = `${rect.top + rect.height / 2}px`;
            cursor.classList.add('moving');

            // Show tooltip
            tooltip.textContent = step.message;
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 40}px`;
            tooltip.classList.add('visible');

            // Highlight the section
            element.classList.add('highlight');

            // Wait for animation
            await this.sleep(3000);

            // Reset highlight and hide tooltip
            element.classList.remove('highlight');
            tooltip.classList.remove('visible');
            cursor.classList.remove('moving');
        }

        // Move to idea creation form after tour
        const ideaForm = document.querySelector('.idea-creation');
        if (ideaForm) {
            const rect = ideaForm.getBoundingClientRect();
            cursor.style.left = `${rect.left + rect.width / 2}px`;
            cursor.style.top = `${rect.top + rect.height / 2}px`;
        }
    }

    private showTooltip(element: HTMLElement, message: string) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 82, 204, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            z-index: 10001;
            pointer-events: none;
            animation: fadeIn 0.3s ${this.ANIMATION_CONFIG.easing.smooth};
        `;

        // Position tooltip above the element
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.transform = 'translateX(-50%)';

        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 1900);
    }

    private startMarketMetricsUpdate() {
        setInterval(() => {
            this.marketMetrics.totalIdeasMinted += Math.floor(Math.random() * 3);
            this.marketMetrics.totalTradingVolume += Math.random() * 1000;
            this.marketMetrics.activeTraders = Math.floor(Math.random() * 100) + 50;
            
            // Simulate idea graduation when market cap exceeds 50K
            if (Math.random() > 0.95) {
                this.marketMetrics.graduatedIdeas++;
                this.simulateIdeaGraduation();
            }

            this.updateMarketMetrics();
        }, 5000);
    }

    private async simulateIdeaGraduation() {
        console.log(`${this.COLORS.BRIGHT_GREEN}[GRADUATION] New Idea NFT reached $50K market cap! Ready for exchange listing${this.COLORS.RESET}`);
    }

    private updateMarketMetrics() {
        console.log(`
${this.COLORS.BRIGHT_BLUE}[MARKET METRICS]${this.COLORS.RESET}
Total Ideas Minted: ${this.marketMetrics.totalIdeasMinted}
Trading Volume: $${this.marketMetrics.totalTradingVolume.toFixed(2)}
Active Traders: ${this.marketMetrics.activeTraders}
Graduated Ideas: ${this.marketMetrics.graduatedIdeas}
        `);
    }

    private async showConnectionSequence() {
        for (const stage of this.connectionStages) {
            console.log(`${this.COLORS.BRIGHT_BLUE}[${new Date().toISOString()}] ${stage}${this.COLORS.RESET}`);
            await this.sleep(1000);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private updateIdeaInTable(idea: IdeaNFT) {
        const row = document.getElementById(`idea-${idea.id}`);
        if (!row) return;

        const cells = row.getElementsByTagName('td');
        const oldPrice = parseFloat(cells[1].textContent.replace('$', ''));
        const newPrice = idea.currentPrice;
        
        // Enhanced price animation with floating numbers
        cells[1].innerHTML = `
            <div class="price-container">
                <span class="current-price">$${newPrice.toFixed(4)}</span>
                <span class="price-change ${newPrice > oldPrice ? 'price-up' : 'price-down'}">
                    ${newPrice > oldPrice ? '+' : '-'}$${Math.abs(newPrice - oldPrice).toFixed(4)}
                </span>
            </div>
        `;

        // Add pulse animation for significant price changes
        if (Math.abs(newPrice - oldPrice) / oldPrice > 0.01) {
            cells[1].classList.add('pulse-animation');
            setTimeout(() => cells[1].classList.remove('pulse-animation'), this.ANIMATION_CONFIG.duration.medium);
        }

        // Enhanced trend animation with smooth transitions
        cells[2].className = idea.change24h >= 0 ? 'positive' : 'negative';
        cells[2].innerHTML = `
            <div class="trend-container">
                <span class="trend-arrow ${idea.change24h >= 0 ? 'trend-up' : 'trend-down'}">
                    ${idea.change24h >= 0 ? '↑' : '↓'}
                </span>
                <span class="trend-value">${Math.abs(idea.change24h).toFixed(2)}%</span>
            </div>
        `;

        // Animated market cap progress
        const graduationProgress = Math.min((idea.marketCap / 50000) * 100, 100);
        cells[3].innerHTML = `
            <div class="market-cap-container">
                <span class="market-cap-value">$${this.formatNumber(idea.marketCap)}</span>
                <div class="graduation-progress">
                    <div class="graduation-progress-bar" style="width: ${graduationProgress}%">
                        <div class="progress-glow"></div>
                    </div>
                </div>
            </div>
        `;

        // Volume visualization with dynamic bars
        const maxVolume = Math.max(...Array.from(this.activeIdeas.values()).map(i => i.volume24h));
        const volumePercentage = (idea.volume24h / maxVolume) * 100;
        cells[4].innerHTML = `
            <div class="volume-container">
                <span class="volume-value">$${this.formatNumber(idea.volume24h)}</span>
                <div class="volume-bar">
                    <div class="volume-bar-fill" 
                         style="width: ${volumePercentage}%; 
                                transition: width ${this.ANIMATION_CONFIG.duration.fast}ms ${this.ANIMATION_CONFIG.easing.smooth}">
                        <div class="volume-pulse"></div>
                    </div>
                </div>
            </div>
        `;

        // ...existing code for graduation status...
    }

    private showNotification(message: string, type: string) {
        const notification = document.createElement('div');
        
        // Enhanced notification animations
        if (type === 'graduation') {
            notification.innerHTML = `
                <div class="notification-wrapper">
                    <div class="notification-icon">
                        <div class="graduation-cap">🎓</div>
                        <div class="celebration-particles"></div>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">Graduation Achievement!</div>
                        <div class="notification-message">${message}</div>
                    </div>
                </div>
            `;
        } else {
            notification.innerHTML = `
                <div class="notification-wrapper">
                    <div class="notification-content">
                        <div class="notification-message">${message}</div>
                    </div>
                </div>
            `;
        }
        
        notification.className = `notification ${type}`;
        document.querySelector('.notifications-container').appendChild(notification);

        // Smooth entry animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
            notification.style.animation = `
                slideIn ${this.ANIMATION_CONFIG.duration.fast}ms ${this.ANIMATION_CONFIG.easing.bounce} forwards,
                fadeIn ${this.ANIMATION_CONFIG.duration.fast}ms ${this.ANIMATION_CONFIG.easing.smooth} forwards
            `;
            
            setTimeout(() => {
                notification.style.animation = `
                    slideOut ${this.ANIMATION_CONFIG.duration.fast}ms ${this.ANIMATION_CONFIG.easing.smooth} forwards,
                    fadeOut ${this.ANIMATION_CONFIG.duration.fast}ms ${this.ANIMATION_CONFIG.easing.smooth} forwards
                `;
                setTimeout(() => notification.remove(), this.ANIMATION_CONFIG.duration.fast);
            }, type === 'graduation' ? 6000 : 4000);
        });
    }
}

export default BeaconSimulation;