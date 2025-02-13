// Initialize BeaconPlatform with all required components
import { BeaconPlatform } from './beacon.js';
import { ChatSystem } from './chat.js';
import { MarketVisuals } from './marketVisuals.js';

// Create and export a singleton instance
export const platform = new BeaconPlatform();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize platform components
    platform.initializeUI();
    
    // Start market simulation with a slight delay to ensure DOM elements are ready
    setTimeout(() => {
        platform.initializeMarketData();
        platform.startMarketSimulation();
        
        // Start product tour after a brief delay
        setTimeout(() => {
            platform.startProductTour();
        }, 1000);
    }, 100);
});