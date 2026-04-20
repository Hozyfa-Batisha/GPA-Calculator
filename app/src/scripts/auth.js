import { api } from './api.js';

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Support both 'username' and 'email' for login
        const identifier = document.getElementById('email').value; 
        const password = document.getElementById('password').value;

        try {
            const response = await api.auth.login(identifier, password);
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
        
        // Correctly map fields to avoid the "mix-up"
        const username = document.getElementById('regUsername').value.trim();
        const name     = document.getElementById('regName').value.trim();
        const email    = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();

        try {
            // Order: (username, password, name, email)
            await api.auth.register(username, password, name, email);
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
