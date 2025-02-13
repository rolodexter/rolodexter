// Initialize BeaconPlatform with all required components
import { BeaconPlatform } from './beacon.js';

// Single initialization point to avoid race conditions
document.addEventListener('DOMContentLoaded', () => {
    const platform = new BeaconPlatform();
    window.platform = platform;
});