/**
 * theme.js
 * Handles Dark/Light mode persistence and application.
 */

const ThemeManager = {
    init() {
        this.applyTheme();
        this.setupToggle();
    },
    applyTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },
    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        return isDark;
    },
    setupToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.checked = localStorage.getItem('theme') === 'dark';
            toggle.addEventListener('change', () => {
                this.toggleTheme();
            });
        }
    }
};

// Apply theme immediately to prevent flash
(function applyImmediateTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme'); // Use documentElement for faster application
        // We will also add it to body in init()
    }
})();

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
