// This file handles the 'Authentication' (Logging in and Registering)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email && password) {
            alert("Login Successful! (Simulated)");
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Account created successfully! You can now login.");
        window.location.href = 'login.html';
    });
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}
