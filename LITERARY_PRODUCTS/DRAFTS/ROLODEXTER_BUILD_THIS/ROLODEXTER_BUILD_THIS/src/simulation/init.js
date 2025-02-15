// Simple initialization
const init = () => {
    const beacon = new BeaconSimulation();
    window.beacon = beacon;
};

// Start immediately if document is ready
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// Backup initialization
window.addEventListener('load', () => {
    if (!window.beacon) {
        init();
    }
});