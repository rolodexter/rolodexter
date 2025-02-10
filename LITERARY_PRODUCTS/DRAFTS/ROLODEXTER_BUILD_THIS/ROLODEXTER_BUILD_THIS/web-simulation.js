class WebTerminalSimulation {
    constructor() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatForm = document.getElementById('chat-form');
        this.username = '';
        this.password = '';
        this.isLoggedIn = false;
        this.messages = [
            ["rolodexter", "Hello Joe! How was your 11 AM meeting?"],
            ["Joe", "It was okay, I've updated some notes and sent them to you."],
            ["rolodexter", "Yes, I'm already synthesizing and have some questions for you about that."],
            ["Joe", "Okay, great. Let's go over that later though. Right now, I need you to set up an MVP of NOMIX. I've updated a few things about the system, pertaining to Solana transactions."],
            ["rolodexter", "Got it. Please respond to pending Jira issues posted about NOMIX schema, and I'll spin this up on a local server right away. Do you want me to deploy to a temp Vercel workspace as well?"],
            ["Joe", "Sure, yes, I won't have access to ParkHealth later, so Vercel would be great."],
            ["rolodexter", "Got it, see you in a bit."]
        ];
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginContainer = document.getElementById('login-container');
        this.cursorInterval = null; // Add cursor interval tracker
        this.statusFrame = document.getElementById('status-frame');
        this.connectionStages = [
            "Initializing secure connection",
            "Establishing encrypted channel",
            "Authenticating service endpoints",
            "Loading relationship matrix",
            "Syncing neural pathways"
        ];
    }

    async startSimulation() {
        await this.showConnectionSequence();
        const container = document.createElement('div');
        container.className = 'connection-sequence';
        this.messagesContainer.appendChild(container);
    }

    async showConnectionSequence() {
        this.statusFrame.innerHTML = ''; // Clear existing status messages
        
        // Show each connection stage
        for (const stage of this.connectionStages) {
            const statusLine = document.createElement('div');
            statusLine.className = 'status-line';
            statusLine.textContent = stage;
            this.statusFrame.appendChild(statusLine);
            
            await this.sleep(800); // Wait before showing the checkmark
            statusLine.textContent = `✓ ${stage}`;
            statusLine.classList.add('visible', 'success');
        }

        // Show final success message
        const successLine = document.createElement('div');
        successLine.className = 'status-line connection-success';
        successLine.textContent = '✨ Connection established successfully ✨';
        this.statusFrame.appendChild(successLine);
        await this.sleep(500);
        successLine.classList.add('visible');
    }

    // Add a method to update status frame with new messages
    async addStatusMessage(message, type = 'pending') {
        const statusLine = document.createElement('div');
        statusLine.className = `status-line ${type}`;
        statusLine.textContent = message;
        this.statusFrame.appendChild(statusLine);
        this.statusFrame.scrollTop = this.statusFrame.scrollHeight;
        
        await this.sleep(100);
        statusLine.classList.add('visible');
        return statusLine; // Return the element for further updates
    }

    async updateStatusMessage(element, message, type) {
        element.textContent = message;
        element.className = `status-line visible ${type}`;
    }

    startCursorBlink(element) {
        let dots = '';
        this.cursorInterval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            element.textContent = `Connecting to rolodexter${dots}${dots.length < 3 ? ' ' : ''}`;
        }, 500);
    }

    stopCursorBlink() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
            this.cursorInterval = null;
        }
    }

    async showSystemMessage(text) {
        const div = document.createElement('div');
        div.className = 'system-message';
        div.textContent = text;
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
    }

    async simulateLogin() {
        // Initial pause before starting to type
        await this.sleep(1000);

        // Simulate typing username with realistic pauses and corrections
        const usernameToType = "JoeMaristela";
        for (let i = 0; i < usernameToType.length; i++) {
            // Simulate a typing mistake and correction at 'M'
            if (i === 3) {
                this.usernameInput.value += 'n';
                await this.sleep(200);
                this.usernameInput.value = this.usernameInput.value.slice(0, -1);
                await this.sleep(300);
            }
            
            this.usernameInput.value += usernameToType[i];
            // Longer pause after 'Joe' to simulate thinking
            if (i === 2) {
                await this.sleep(400);
            } else {
                await this.sleep(Math.random() * 150 + 50);
            }
        }
        await this.sleep(700);

        // Tab to password field pause
        await this.sleep(300);

        // Simulate typing password (showing asterisks) with natural rhythm
        const actualPassword = "rolodexter";
        for (let i = 0; i < actualPassword.length; i++) {
            this.passwordInput.value += '*';
            // Slight pause in the middle of typing password
            if (i === 4) {
                await this.sleep(400);
            } else {
                await this.sleep(Math.random() * 120 + 80);
            }
        }
        await this.sleep(800);
        
        await this.showSystemMessage("Authenticating as JoeMaristela...");
        await this.sleep(2000);
        
        // Remove login container after successful authentication
        this.loginContainer.style.opacity = '0';
        this.loginContainer.style.transition = 'opacity 0.5s ease-out';
        await this.sleep(500);
        this.loginContainer.style.display = 'none';
        
        this.startChatSequence();
    }

    async startChatSequence() {
        for (const [sender, message] of this.messages) {
            if (sender === "rolodexter") {
                await this.showTypingIndicator();
                await this.sleep(1500);
                await this.displayRolodexter(message);
            } else {
                await this.simulateUserTyping(message);
                await this.displayJoe(message);
            }
            await this.sleep(2000);
        }
    }

    async showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.textContent = 'rolodexter is typing...';
        this.messagesContainer.appendChild(indicator);
        this.scrollToBottom();
        return indicator;
    }

    async simulateUserTyping(text) {
        this.chatInput.value = '';
        this.chatInput.focus();
        for (const char of text) {
            this.chatInput.value += char;
            await this.sleep(Math.random() * 50 + 50);
        }
        await this.sleep(500);
        this.chatInput.value = '';
    }

    async displayRolodexter(text) {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }

        const div = document.createElement('div');
        div.className = 'message rolodexter';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = './images/rolodexter.jpg';
        avatar.alt = 'rolodexter avatar';
        
        const content = document.createElement('div');
        content.className = 'content';

        div.appendChild(avatar);
        div.appendChild(content);
        await this.typeText(content, text);
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
    }

    async displayJoe(text) {
        const div = document.createElement('div');
        div.className = 'message joe';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = './images/joe.jpg';
        avatar.alt = 'Joe avatar';
        
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = text;

        div.appendChild(avatar);
        div.appendChild(content);
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
    }

    async typeText(element, text) {
        let displayText = '';
        for (const char of text) {
            displayText += char;
            element.textContent = displayText;
            await this.sleep(Math.random() * 30 + 20);
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const style = document.createElement('style');
style.textContent = `
.connection-sequence {
    margin: 20px 0;
    font-family: monospace;
    color: #333; /* Added darker text color */
}

.connection-stage {
    padding: 8px;
    transition: all 0.3s ease;
    opacity: 0.9; /* Increased opacity for better contrast */
}

.connection-stage.loading {
    animation: spin 1s linear infinite;
}

.connection-stage.completed {
    opacity: 1;
    color: #008000; /* Darker green color for completed stages */
}

.connection-success {
    margin-top: 16px;
    text-align: center;
    color: #008000; /* Matching green color for success message */
    font-weight: bold;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

window.addEventListener('load', () => {
    const simulation = new WebTerminalSimulation();
    simulation.startSimulation();
});