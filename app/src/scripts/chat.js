/**
 * chat.js
 * Handles the AI Academic Advisor interface on the dashboard.
 */

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const window = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');
    const message = input.value.trim();
    const apiKey = localStorage.getItem('ai_api_key');

    if (!message) return;
    if (!apiKey) {
        alert('Please set your Gemini API Key in Profile Settings first.');
        return;
    }

    // 1. Add User Message to UI
    appendMessage('user', message);
    input.value = '';
    
    // 2. Add Loading State
    const loadingId = 'msg-' + Date.now();
    appendMessage('bot', '...', loadingId);
    sendBtn.disabled = true;

    try {
        const response = await fetch('/gpa-calculator/server/routes/ai.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, apiKey })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'AI request failed');
        }

        const data = await response.json();
        updateMessage(loadingId, data.response);
    } catch (err) {
        updateMessage(loadingId, 'Error: ' + err.message);
    } finally {
        sendBtn.disabled = false;
    }
}

function appendMessage(role, text, id = null) {
    const window = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    if (id) div.id = id;
    div.innerText = text;
    window.appendChild(div);
    window.scrollTop = window.scrollHeight;
}

function updateMessage(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
    const window = document.getElementById('chat-window');
    window.scrollTop = window.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-btn')?.addEventListener('click', sendMessage);
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
