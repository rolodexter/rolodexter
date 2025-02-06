const VERCEL_PROJECT_ID = 'prj_tb0TgkFgDiq4oDLYkn9LWDSkhkRx';
const WS_CONFIG = {
    production: `wss://website-terminal.vercel.app`,
    development: `ws://${window.location.hostname}:3000`
};

let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

function connectWebSocket() {
    const wsUrl = window.location.hostname === 'localhost' ? 
        WS_CONFIG.development : 
        WS_CONFIG.production;
        
    try {
        console.log(`Attempting connection to: ${wsUrl} (${window.location.hostname})`);
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            console.log('Connected to server');
            reconnectAttempts = 0;
            appendMessage('System: Connected to chat server', false);
            document.getElementById('connection-status').className = 'connected';
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            console.error('Current environment:', window.location.hostname);
            console.error('Attempted URL:', wsUrl);
            document.getElementById('connection-status').className = 'error';
            console.log('Check if server is running on port 3000');
        };

        ws.onclose = () => {
            document.getElementById('connection-status').className = 'disconnected';
            reconnect();
        };

        ws.onmessage = (event) => {
            appendMessage(event.data);
        };

    } catch (error) {
        console.error(`Failed to connect to ${wsUrl}:`, error);
        console.log('Make sure to run: node server.js');
        document.getElementById('connection-status').className = 'error';
        appendMessage('System: Failed to connect. Check console for details.', false);
    }
}

function reconnect() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        appendMessage(`System: Connection lost. Reconnecting (attempt ${reconnectAttempts})...`, false);
        setTimeout(connectWebSocket, 3000);
    } else {
        appendMessage('System: Could not connect to server. Please check if the server is running.', false);
    }
}

connectWebSocket();

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function appendMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'message user' : 'message bot';
  messageDiv.textContent = message;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
  const message = userInput.value.trim();
  if (message) {
    ws.send(message);
    appendMessage(`You: ${message}`, true);
    userInput.value = '';
  }
}

sendButton.onclick = sendMessage;
userInput.onkeypress = (e) => {
  if (e.key === 'Enter') sendMessage();
};
