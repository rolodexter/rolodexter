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

    private readonly tourSteps = [
        {
            selector: '.welcome-section',
            message: 'Welcome to BEACON—the first Rolodexter-AI powered decentralized application'
        },
        {
            selector: '.staking-section',
            message: 'Stake your Rolodexter tokens to earn platform fees'
        },
        {
            selector: '.idea-nft-section',
            message: 'Turn your ideas into NFTs or SPL tokens with AI assistance'
        },
        {
            selector: '.ideas-market',
            message: 'Explore the Ideas Market—watch, trade, and invest early'
        },
        {
            selector: '.trending-section',
            message: 'Keep an eye on Trending Ideas capturing mindshare'
        },
        {
            selector: '.rolodexter-flywheel',
            message: 'Trading fees fuel the Rolodexter Flywheel, creating a sustainable ecosystem'
        }
    ];

    constructor() {
        this.username = "";
        this.password = "";
        this.isLoggedIn = false;
        this.activeIdeas = new Map();

        // Single point of initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private async init() {
        try {
            console.log('=== INITIALIZATION SEQUENCE ===');
            
            // Wait for DOM to be completely ready
            if (document.readyState !== 'complete') {
                console.log('Waiting for DOM to be ready...');
                await new Promise(resolve => window.addEventListener('load', resolve));
            }
            console.log('✓ DOM is ready');

            await this.showConnectionSequence();
            
            // Create cursor first and verify it exists
            await this.createCursor();
            const cursorExists = document.querySelector('.simulated-cursor');
            if (!cursorExists) {
                throw new Error('Failed to create cursor element');
            }
            
            // Wait for beacon container to be ready
            await this.waitForBeaconContainer();
            
            await this.setupUI();
            await this.createIdeaForm();
            this.startMarketMetricsUpdate();
            this.setupEventListeners();
            
            // Initialize market visuals
            const marketVisuals = new MarketVisuals();
            marketVisuals.initializeRolodexterChart();
            
            // Extra verification step for required elements
            console.log('Verifying all required elements...');
            const allElements = [
                '.welcome-section',
                '.staking-section',
                '.idea-nft-section',
                '.ideas-market',
                '.trending-section',
                '.rolodexter-flywheel'
            ].every(selector => {
                const exists = !!document.querySelector(selector);
                console.log(`${exists ? '✓' : '❌'} ${selector}`);
                return exists;
            });

            if (!allElements) {
                console.error('Some required elements are missing');
                return;
            }

            // Start cursor movement with a guaranteed delay
            console.log('Starting cursor movement in 1 second...');
            await this.sleep(1000);
            await this.moveCursorToNextElement();
            
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    private async createCursor() {
        console.log('=== CURSOR INITIALIZATION ===');
        if (document.querySelector('.simulated-cursor')) {
            console.log('✓ Cursor already exists');
            return;
        }

        console.log('Creating cursor element');
        const cursor = document.createElement('div');
        cursor.className = 'simulated-cursor';
        cursor.style.cssText = `
            position: fixed !important;
            width: 24px !important;
            height: 24px !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 50% !important;
            pointer-events: none !important;
            z-index: 2147483647 !important;
            transform: translate(-50%, -50%) !important;
            mix-blend-mode: difference;
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.9),
                        0 0 10px rgba(0, 82, 204, 0.5),
                        0 0 20px rgba(0, 82, 204, 0.3);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            left: 50% !important;
            top: 50% !important;
            display: block !important;
            opacity: 1 !important;
            will-change: transform, left, top;
            visibility: visible !important;
        `;
        document.body.appendChild(cursor);
        console.log('✓ Cursor element created');

        // Verify cursor is in DOM and visible
        await this.sleep(100);
        const verifiedCursor = document.querySelector('.simulated-cursor');
        console.log('Cursor verification:', verifiedCursor ? '✓ Success' : '❌ Failed');
        
        if (verifiedCursor) {
            const style = window.getComputedStyle(verifiedCursor);
            console.log('Cursor computed style:', {
                display: style.display,
                opacity: style.opacity,
                zIndex: style.zIndex,
                position: style.position,
                visibility: style.visibility
            });
        }
    }

    private async waitForBeaconContainer(): Promise<void> {
        const maxAttempts = 10;
        let attempts = 0;

        while (attempts < maxAttempts) {
            const container = document.querySelector('.beacon-container');
            if (container) {
                console.log('Beacon container found');
                return;
            }
            console.log('Waiting for beacon container...');
            await this.sleep(500);
            attempts++;
        }
        throw new Error('Beacon container not found after max attempts');
    }

    private verifyTourElements(): boolean {
        // Log the presence of each tour element
        this.tourSteps.forEach(step => {
            const element = document.querySelector(step.selector);
            console.log(`Tour element ${step.selector}: ${element ? 'Found' : 'Not found'}`);
        });

        return this.tourSteps.every(step => document.querySelector(step.selector));
    }

    private async ensureElementsExist(): Promise<boolean> {
        const maxAttempts = 15; // Increased from 10
        let attempts = 0;

        while (attempts < maxAttempts) {
            const missingElements = this.tourSteps
                .filter(step => !document.querySelector(step.selector))
                .map(step => step.selector);

            if (missingElements.length === 0) {
                console.log('All tour elements found successfully');
                return true;
            }

            console.log(`Waiting for elements... Attempt ${attempts + 1}/${maxAttempts}`);
            console.log('Missing elements:', missingElements.join(', '));
            
            await this.sleep(500);
            attempts++;
        }

        console.error('Some tour elements not found after max attempts');
        return false;
    }

    private async setupUI() {
        // Create tour elements only
        if (!document.querySelector('.tour-spotlight')) {
            const spotlight = document.createElement('div');
            spotlight.className = 'tour-spotlight';
            document.body.appendChild(spotlight);
        }

        if (!document.querySelector('.tour-tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tour-tooltip';
            document.body.appendChild(tooltip);
        }

        // Create chart container if needed
        if (!document.querySelector('.right-side-chart')) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'right-side-chart';
            document.body.appendChild(chartContainer);
        }
    }

    private initializeEventListeners() {
        // Listen for route changes or significant DOM updates
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    this.checkAndRestartTour();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    private checkAndRestartTour() {
        // Check if key tour elements are present but tour isn't active
        const hasElements = this.tourSteps.some(step => 
            document.querySelector(step.selector) !== null
        );
        const tourActive = document.querySelector('.simulated-cursor.moving') !== null;

        if (hasElements && !tourActive) {
            this.startProductTour();
        }
    }

    async startSimulation() {
        console.log('Starting Beacon simulation...');
        await this.showConnectionSequence();
        await this.initializeInterface();
        
        // Ensure UI is ready before starting tour
        await this.sleep(1500);
        await this.startProductTour();
    }

    private async initializeInterface() {
        // Initialize market visuals first
        const marketVisuals = new MarketVisuals();
        marketVisuals.initializeRolodexterChart();
        
        // Create and append chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'right-side-chart';
        document.body.appendChild(chartContainer);

        // Create cursor immediately with initial position
        const cursor = document.createElement('div');
        cursor.className = 'simulated-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000000;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.9),
                        0 0 10px rgba(0, 82, 204, 0.5),
                        0 0 20px rgba(0, 82, 204, 0.3);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            display: block;
            left: 50%;
            top: 50%;
        `;
        document.body.appendChild(cursor);

        await this.createIdeaForm();
        this.startMarketMetricsUpdate();
        this.setupEventListeners();

        // Force cursor movement to start immediately
        requestAnimationFrame(() => {
            this.moveCursorToNextElement();
        });
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
                this.showNotification(`"${idea.description}" has graduated with a market cap of $${idea.marketCap.toFixed(2)}!`, 'graduation');
                console.log(`
${this.COLORS.BRIGHT_GREEN}[GRADUATION ALERT]${this.COLORS.RESET}
Idea: ${idea.description}
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
        // Force immediate cursor movement start
        requestAnimationFrame(() => {
            this.moveCursorToNextElement();
        });
    }

    private async moveCursorToNextElement() {
        console.log('=== CURSOR MOVEMENT DEBUG ===');
        const cursor = document.querySelector('.simulated-cursor') as HTMLElement;
        if (!cursor) {
            console.error('❌ Cursor element not found - will retry in 1s');
            setTimeout(() => this.moveCursorToNextElement(), 1000);
            return;
        }
        console.log('✓ Cursor element found');

        // Get all required elements first
        const requiredElements = [
            '.welcome-section',
            '.staking-section',
            '.idea-nft-section',
            '.ideas-market',
            '.trending-section',
            '.rolodexter-flywheel'
        ];

        // Log each element's presence
        console.log('Checking for required elements:');
        const elements = requiredElements.map(selector => {
            const el = document.querySelector(selector);
            console.log(`${el ? '✓' : '❌'} ${selector}: ${el ? 'Found' : 'Not found'}`);
            return el;
        }).filter(el => el) as HTMLElement[];

        if (elements.length === 0) {
            console.warn('❌ No tour elements found - retrying in 1s');
            setTimeout(() => this.moveCursorToNextElement(), 1000);
            return;
        }

        console.log(`✓ Found ${elements.length} elements to visit`);

        let currentIndex = 0;
        const moveToNext = async () => {
            const element = elements[currentIndex];
            if (!element) {
                console.error('❌ Target element not found');
                return;
            }

            const rect = element.getBoundingClientRect();
            console.log(`Moving to element ${currentIndex}:`, {
                selector: requiredElements[currentIndex],
                position: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            });
            
            // Force cursor visibility
            cursor.style.display = 'block';
            cursor.style.opacity = '1';
            cursor.classList.add('moving');
            
            // Ensure z-index is maximal
            cursor.style.zIndex = '2147483647';
            
            // Explicitly set position with important flag
            cursor.style.cssText += `
                left: ${rect.left + rect.width / 2}px !important;
                top: ${rect.top + rect.height / 2}px !important;
                transform: translate(-50%, -50%) !important;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
            `;
            
            // Add highlight
            element.classList.add('highlight');
            console.log('Added highlight to element');
            
            await this.sleep(2000);
            
            element.classList.remove('highlight');
            cursor.classList.remove('moving');
            
            currentIndex = (currentIndex + 1) % elements.length;
            console.log(`Moving to next element (${currentIndex})`);
            setTimeout(moveToNext, 2000);
        };

        console.log('Starting cursor movement loop');
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
        // Remove product tour initialization as we're handling movement directly in init
        console.log('Product tour deprecated - using direct cursor movement');
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
        // Find the most recently graduated idea
        const graduatedIdea = Array.from(this.activeIdeas.values())
            .find(idea => idea.graduated && idea.marketCap >= 50000);
        
        if (graduatedIdea) {
            this.showNotification(`"${graduatedIdea.description}" has graduated with a market cap of $${graduatedIdea.marketCap.toFixed(2)}!`, 'graduation');
        } else {
            this.showNotification(`New Idea NFT reached $50K market cap! Ready for exchange listing`, 'graduation');
        }
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