    </div> <!-- Closing .main-content div -->

    <!-- AI Chat Component -->
    <link rel="stylesheet" href="../../style/chat.css">
    <div id="chat-bubble" class="chat-bubble" title="AI Assistant">🤖</div>
    <div id="chat-window" class="chat-window">
        <div class="chat-header">
            <span>AI Academic Advisor</span>
            <span id="chat-close" class="chat-close">&times;</span>
        </div>
        <div id="chat-messages" class="chat-messages"></div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Ask me about your GPA...">
            <button id="chat-send">➤</button>
        </div>
    </div>
    <script src="../../scripts/chat.js"></script>
    <script src="../../scripts/ui.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/api.js" type="module"></script>
    <script src="../../scripts/global.js" type="module"></script>
</body>
</html>