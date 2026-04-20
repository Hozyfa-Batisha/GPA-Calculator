/**
 * chat.js
 * AI Assistant for the Student Success Hub
 */

const ChatAssistant = {
    init() {
        this.bubble = document.getElementById('chat-bubble');
        this.window = document.getElementById('chat-window');
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');

        if (!this.bubble || !this.window) return;

        this.bubble.onclick = () => this.toggleWindow();
        document.getElementById('chat-close').onclick = () => this.toggleWindow();
        this.sendBtn.onclick = () => this.sendMessage();
        this.input.onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };
    },

    toggleWindow() {
        this.window.classList.toggle('active');
    },

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        this.input.value = '';

        const apiKey = localStorage.getItem('ai_api_key');
        if (!apiKey) {
            this.appendMessage('ai', 'Please set your OpenAI API Key in the Profile Settings page to use the AI assistant.');
            return;
        }

        const loadingMsg = this.appendMessage('ai', 'Thinking...');

        try {
            const response = await this.fetchAIResponse(text, apiKey);
            loadingMsg.textContent = response;
        } catch (err) {
            loadingMsg.textContent = 'Error: ' + err.message;
        }
    },

    async fetchAIResponse(text, apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful and encouraging academic advisor for the "Student Success Hub" GPA Calculator. You help students understand their GPA, plan for improvements, and manage their courses. Be concise, supportive, and professional.'
                    },
                    { role: 'user', content: text }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Failed to connect to AI service.');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    },

    appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return msgDiv;
    }
};

document.addEventListener('DOMContentLoaded', () => ChatAssistant.init());