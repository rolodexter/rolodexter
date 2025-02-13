// Initialize BeaconPlatform with all required components
import { BeaconPlatform } from './beacon.js';
import { ChatSystem } from './chat.js';
import { MarketVisuals } from './marketVisuals.js';

document.addEventListener('DOMContentLoaded', () => {
    const platform = new BeaconPlatform();
    
    // Register platform globally
    window.platform = platform;
    
    // Initialize core components first
    platform.activeIdeas = new Map();
    platform.initializeTokenChart();
    platform.setupEventListeners();
    
    // Initialize mock data and market data
    platform.initializeMockData();
    platform.initializeMarketData();
    
    // Start market simulation with slight delay to ensure DOM is ready
    setTimeout(() => {
        platform.startMarketSimulation();
        
        // Start product tour after market is running
        setTimeout(() => {
            platform.startProductTour();
        }, 2000);
    }, 500);
});