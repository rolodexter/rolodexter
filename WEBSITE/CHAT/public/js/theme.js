const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

function setTheme(theme) {
    if (theme === 'light') {
        root.style.setProperty('--bg-color', 'white');
        root.style.setProperty('--text-color', 'black');
        themeToggle.textContent = '🌙';
    } else {
        root.style.setProperty('--bg-color', 'black');
        root.style.setProperty('--text-color', 'white');
        themeToggle.textContent = '☀️';
    }
    localStorage.setItem('theme', theme);
}

// Make sure this file exists at this exact path
themeToggle.addEventListener('click', () => {
    const newTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});
