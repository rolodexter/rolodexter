export class MarketVisuals {
    constructor() {
        this.CHART_COLORS = {
            up: '#22c55e',
            down: '#ef4444',
            neutral: '#3b82f6',
            grid: '#1e293b',
            text: '#94a3b8'
        };
    }

    initializeCharts() {
        this.setupChartCanvas();
        this.setupEventListeners();
    }

    setupChartCanvas() {
        const container = document.querySelector('.chart-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);
        this.canvas = canvas;
    }

    drawMiniChart(canvas, data, isPositive) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 4;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
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

    calculateChartPoints(data, width, height, padding) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        return data.map((value, index) => ({
            x: padding + (index / (data.length - 1)) * (width - padding * 2),
            y: height - (padding + ((value - min) / range) * (height - padding * 2))
        }));
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            if (this.canvas) {
                this.canvas.width = this.canvas.parentElement.clientWidth;
                this.canvas.height = this.canvas.parentElement.clientHeight;
            }
        });
    }
}