export class MarketVisuals {
    private readonly CHART_COLORS = {
        up: '#22c55e',
        down: '#ef4444',
        neutral: '#3b82f6',
        grid: '#1e293b',
        text: '#94a3b8'
    };

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
}