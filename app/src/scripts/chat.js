/**
 * chat.js
 * AI Assistant using Google Gemini API
 */

const ChatAssistant = {
    init() {
        this.window = document.getElementById('chat-window');
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.toggleBtn = document.getElementById('chat-toggle');

        if (!this.window || !this.toggleBtn) return;

        this.toggleBtn.onclick = () => this.toggleWindow();
        if (this.sendBtn) {
            this.sendBtn.onclick = () => this.sendMessage();
        }
        if (this.input) {
            this.input.onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };
        }
    },

    toggleWindow() {
        this.window.classList.toggle('active');
    },

    async sendMessage() {
        if (!this.input) return;
        const text = this.input.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        this.input.value = '';

        const apiKey = localStorage.getItem('ai_api_key');
        if (!apiKey) {
            this.appendMessage('ai', 'Please set your Gemini API Key in the Profile Settings page to use the AI assistant.');
            return;
        }

        const loadingMsg = this.appendMessage('ai', 'Thinking...');

        try {
            const response = await this.fetchGeminiResponse(text, apiKey);
            loadingMsg.textContent = response;
        } catch (err) {
            loadingMsg.textContent = 'Error: ' + err.message;
        }
    },

    async fetchGeminiResponse(text, apiKey) {
        // Gemini API Endpoint
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful and encouraging academic advisor for the "Student Success Hub" GPA Calculator. 
                        Help the student understand their GPA, plan for improvements, and manage their courses. 
                        Be concise, supportive, and professional. \n\nUser: ${text}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Failed to connect to Gemini AI.');
        }

        const data = await response.json();
        // Gemini response path: candidates[0].content.parts[0].text
        return data.candidates[0].content.parts[0].text;
    },

    appendMessage(role, text) {
        if (!this.messagesContainer) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return msgDiv;
    }
};

document.addEventListener('DOMContentLoaded', () => ChatAssistant.init());
