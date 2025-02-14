export class MarketVisuals {
    private readonly CHART_COLORS = {
        up: '#22c55e',
        down: '#ef4444',
        neutral: '#3b82f6',
        grid: '#1e293b',
        text: '#94a3b8'
    };

    private priceData: number[] = [];
    private chartUpdateInterval: number | null = null;

    drawMiniChart(canvas: HTMLCanvasElement, data: number[], isPositive: boolean) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 4;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = this.CHART_COLORS.grid;
        ctx.lineWidth = 0.5;
        
        // Calculate points
        const points = this.calculateChartPoints(data, width, height, padding);
        
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = isPositive ? this.CHART_COLORS.up : this.CHART_COLORS.down;
        ctx.lineWidth = 1.5;
        
        points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        
        ctx.stroke();
        
        // Add gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        const color = isPositive ? this.CHART_COLORS.up : this.CHART_COLORS.down;
        gradient.addColorStop(0, `${color}22`);
        gradient.addColorStop(1, `${color}00`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, height);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.lineTo(points[points.length - 1].x, height);
        ctx.closePath();
        ctx.fill();
    }

    drawIndicatorGauge(canvas: HTMLCanvasElement, value: number) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const radius = Math.min(width, height) / 2 - 4;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = this.CHART_COLORS.grid;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw value arc
        const angle = Math.PI + (value / 100) * Math.PI;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, angle);
        ctx.strokeStyle = this.getIndicatorColor(value);
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw value text
        ctx.fillStyle = this.CHART_COLORS.text;
        ctx.font = '12px Monaco';
        ctx.textAlign = 'center';
        ctx.fillText(`${value}%`, centerX, centerY + 15);
    }

    private calculateChartPoints(data: number[], width: number, height: number, padding: number) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        return data.map((value, index) => ({
            x: padding + (index / (data.length - 1)) * (width - padding * 2),
            y: height - (padding + ((value - min) / range) * (height - padding * 2))
        }));
    }

    private getIndicatorColor(value: number): string {
        if (value >= 70) return this.CHART_COLORS.up;
        if (value <= 30) return this.CHART_COLORS.down;
        return this.CHART_COLORS.neutral;
    }

    createPriceCard(price: number, change: number): HTMLElement {
        const card = document.createElement('div');
        card.className = 'price-card';
        
        const isPositive = change >= 0;
        const miniChartCanvas = document.createElement('canvas');
        miniChartCanvas.width = 80;
        miniChartCanvas.height = 30;
        
        // Generate some sample price data
        const priceHistory = Array.from({length: 24}, (_, i) => 
            price * (1 + Math.sin(i/4) * 0.1 + (Math.random() - 0.5) * 0.05)
        );
        
        this.drawMiniChart(miniChartCanvas, priceHistory, isPositive);
        
        card.innerHTML = `
            <div class="price-main">
                <span class="price-value">$${price.toFixed(4)}</span>
                <span class="price-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : ''}${change.toFixed(2)}%
                </span>
            </div>
        `;
        
        card.appendChild(miniChartCanvas);
        return card;
    }

    initializeRolodexterChart() {
        // Create chart container if it doesn't exist
        let chartContainer = document.querySelector('.rolodexter-chart-container');
        if (!chartContainer) {
            chartContainer = document.createElement('div');
            chartContainer.className = 'rolodexter-chart-container';
            
            // Add chart header
            const header = document.createElement('div');
            header.className = 'chart-header';
            header.innerHTML = `
                <div class="token-info">
                    <span class="token-name">$ROLODEXTER</span>
                    <span class="token-price">$0.00</span>
                </div>
                <div class="chart-controls">
                    <div class="time-selector">
                        <button class="time-btn active" data-interval="1h">1H</button>
                        <button class="time-btn" data-interval="24h">24H</button>
                        <button class="time-btn" data-interval="7d">7D</button>
                    </div>
                </div>
            `;
            chartContainer.appendChild(header);

            // Add canvas for the chart
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 300;
            chartContainer.appendChild(canvas);

            // Insert chart into the right sidebar
            const rightSidebar = document.querySelector('.right-side-chart');
            if (rightSidebar) {
                rightSidebar.appendChild(chartContainer);
            }

            // Start updating chart
            this.startChartUpdates();
        }
    }

    private startChartUpdates() {
        // Initialize with some data
        this.priceData = Array.from({length: 24}, () => 1 + Math.random() * 0.2);
        
        // Update chart every 5 seconds
        if (!this.chartUpdateInterval) {
            this.chartUpdateInterval = window.setInterval(() => {
                // Add new price point
                const lastPrice = this.priceData[this.priceData.length - 1];
                const newPrice = lastPrice * (1 + (Math.random() - 0.45) * 0.02);
                this.priceData.push(newPrice);
                
                // Keep only last 24 points
                if (this.priceData.length > 24) {
                    this.priceData.shift();
                }

                // Update chart
                const canvas = document.querySelector('.rolodexter-chart-container canvas') as HTMLCanvasElement;
                if (canvas) {
                    this.drawRolodexterChart(canvas, this.priceData);
                }

                // Update price display
                const priceDisplay = document.querySelector('.token-price');
                if (priceDisplay) {
                    priceDisplay.textContent = `$${newPrice.toFixed(4)}`;
                }
            }, 5000);
        }
    }

    private drawRolodexterChart(canvas: HTMLCanvasElement, data: number[]) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 20;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        this.drawChartGrid(ctx, width, height, padding);

        // Calculate points
        const points = this.calculateChartPoints(data, width, height, padding);

        // Draw line with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(59, 130, 256, 0.1)');
        gradient.addColorStop(1, 'rgba(59, 130, 256, 0)');

        // Fill area under line
        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    private drawChartGrid(ctx: CanvasRenderingContext2D, width: number, height: number, padding: number) {
        ctx.strokeStyle = 'rgba(75, 85, 99, 0.1)';
        ctx.lineWidth = 1;

        // Draw horizontal lines
        for (let i = 0; i < 5; i++) {
            const y = padding + (height - padding * 2) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw vertical lines
        for (let i = 0; i < 6; i++) {
            const x = padding + (width - padding * 2) * (i / 5);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
    }
}