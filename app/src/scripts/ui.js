/**
 * UI Utilities: Handling responsive elements, toggles, and common interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Global Logout Handler
    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            try {
                // We call the API through a simple fetch since we don't have api.js here
                await fetch('/gpa-calculator/server/routes/auth.php?action=logout', { method: 'POST' });
                localStorage.removeItem('userToken');
                window.location.href = 'login.html';
            } catch (err) {
                alert('Logout failed: ' + err.message);
            }
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});
