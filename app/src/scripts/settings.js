import { api } from './api.js';

async function loadSettings() {
    try {
        const user = await api.user.getProfile();
        
        document.getElementById('username-field').value = user.username || '';
        document.getElementById('fullname-field').value = user.full_name || '';
        document.getElementById('email-field').value = user.email || '';
        
    } catch (err) {
        console.error('Error loading settings:', err);
        alert('Failed to load profile information.');
    }
}

async function saveProfile(e) {
    e.preventDefault();
    
    const data = {
        username: document.getElementById('username-field').value.trim(),
        full_name: document.getElementById('fullname-field').value.trim(),
        email: document.getElementById('email-field').value.trim(),
    };

    if (!data.username || !data.full_name) {
        alert('Username and Full Name are required.');
        return;
    }

    try {
        await api.user.updateProfile(data);
        alert('Profile updated successfully!');
    } catch (err) {
        alert('Error updating profile: ' + err.message);
    }
}

async function updatePassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('new-password-field').value;
    const confirmPassword = document.getElementById('confirm-password-field').value;

    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        await api.user.updateProfile({ password: newPassword });
        alert('Password updated successfully!');
        document.getElementById('new-password-field').value = '';
        document.getElementById('confirm-password-field').value = '';
    } catch (err) {
        alert('Error updating password: ' + err.message);
    }
}

// AI API Key Handling
function handleAiKey() {
    const aiKeyInput = document.getElementById('aiApiKey');
    const saveAiKeyBtn = document.getElementById('saveAiKey');

    if (aiKeyInput) {
        aiKeyInput.value = localStorage.getItem('ai_api_key') || '';
    }

    if (saveAiKeyBtn) {
        saveAiKeyBtn.onclick = () => {
            const key = aiKeyInput.value.trim();
            localStorage.setItem('ai_api_key', key);
            alert('AI API Key saved locally!');
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    handleAiKey();
    
    document.getElementById('profileForm')?.addEventListener('submit', saveProfile);
    document.getElementById('passwordForm')?.addEventListener('submit', updatePassword);
});
