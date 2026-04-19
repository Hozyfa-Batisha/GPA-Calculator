import { api } from './api.js';

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await api.auth.login(email, password);
            // The response should contain a token or session info
            localStorage.setItem('userToken', response.token || 'authenticated');
            alert("Login Successful! Welcome to the Hub.");
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
    });
}

// --- REGISTER LOGIC ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            await api.auth.register(name, email, password);
            alert("Account created successfully! You can now login.");
            window.location.href = 'login.html';
        } catch (err) {
            alert("Registration Failed: " + err.message);
        }
    });
}

// --- LOGOUT LOGIC ---
window.handleLogout = async () => {
    try {
        await api.auth.logout();
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    } catch (err) {
        console.error("Logout error:", err);
        window.location.href = 'login.html';
    }
};
