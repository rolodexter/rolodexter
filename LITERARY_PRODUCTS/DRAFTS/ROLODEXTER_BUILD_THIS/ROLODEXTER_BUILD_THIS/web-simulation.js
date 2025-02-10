class WebTerminalSimulation {
    constructor() {
        console.log('Initializing WebTerminalSimulation...');
        try {
            // Wait for all elements to be available
            console.log('Checking for required elements...');
            const requiredElements = {
                statusFrame: document.getElementById('status-frame'),
                chatInput: document.getElementById('chat-input'),
                messagesContainer: document.getElementById('chat-messages'),
                loginContainer: document.getElementById('login-container'),
                usernameInput: document.getElementById('username'),
                passwordInput: document.getElementById('password'),
                sendButton: document.getElementById('send-button'),
                modelSelect: document.getElementById('model-select'),
                fileInput: document.getElementById('file-input'),
                attachmentPreview: document.getElementById('attachment-preview'),
                chatForm: document.getElementById('chat-form')
            };

            // Log each element's presence
            Object.entries(requiredElements).forEach(([name, element]) => {
                console.log(`${name}: ${element ? 'Found' : 'Missing'}`);
            });

            // Check if any required elements are missing
            const missingElements = Object.entries(requiredElements)
                .filter(([_, element]) => !element)
                .map(([name]) => name);

            if (missingElements.length > 0) {
                throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
            }

            // Assign all elements to instance
            Object.assign(this, requiredElements);
            console.log('All required elements found and assigned');

            // Initialize other properties
            this.selectedFiles = new Set();
            this.connectionStages = [
                "Initializing secure connection [protocol=TLSv1.3, cipher=AES-256-GCM, session=0x7f8a2c3d]",
                "Establishing encrypted channel [handshake=ECDHE-RSA, curve=X25519, key_size=4096]",
                "Authenticating service endpoints [method=JWT, alg=RS256, exp=3600s]",
                "Loading relationship matrix [format=sparse, compression=zstd-19, blocks=128]",
                "Syncing neural pathways [model=transformer-xl, batch=32, cuda_cores=3584]",
                "Retrieving meeting context [source=google-meet, meeting_id=park-health-q1-sync, duration=45m]",
                "Processing meeting transcripts [participants=6, speaker_diarization=enabled]"
            ];
            this.sessionIPs = {
                joe: '172.16.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256),
                rolodexter: '10.0.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256)
            };
            this.serverId = 'srv-' + Math.random().toString(36).substr(2, 9);
            this.environment = {
                node: 'v18.19.0',
                arch: 'x64',
                cluster: 'us-west-2',
                pod: `pod-${Math.random().toString(36).substr(2, 6)}`
            };
            this.networkMetrics = {
                latency: Math.floor(Math.random() * 15) + 5, // 5-20ms latency
                throughput: Math.floor(Math.random() * 500) + 500, // 500-1000 Mbps
                packetLoss: (Math.random() * 0.1).toFixed(3) // 0-0.1% packet loss
            };
            this.systemMetrics = {
                cpuLoad: Math.floor(Math.random() * 30) + 10, // 10-40% CPU load
                memoryUsage: Math.floor(Math.random() * 512) + 512, // 512-1024MB
                activeThreads: Math.floor(Math.random() * 8) + 4 // 4-12 threads
            };
            this.meetingMetrics = {
                meetingId: 'park-health-q1-sync-' + Math.random().toString(36).substr(2, 9),
                participants: ['Joe Maristela', 'Sarah Chen', 'Michael Park', 'Alex Rivera', 'Diana Wong', 'rolodexter'],
                startTime: new Date(new Date().getTime() - 45*60000).toISOString(), // 45 minutes ago
                endTime: new Date(new Date().getTime() - 2*60000).toISOString(),    // 2 minutes ago
                transcriptTokens: Math.floor(Math.random() * 2000) + 3000,
                audioQuality: 'high',
                platform: 'google-meet'
            };

            // Initialize event listeners
            console.log('Initializing event listeners...');
            this.initializeEventListeners();
            
            // Start simulation with a slight delay to ensure DOM is ready
            console.log('Scheduling simulation start...');
            setTimeout(() => {
                console.log('Starting delayed simulation...');
                this.startSimulation();
            }, 100);

        } catch (error) {
            console.error('Initialization error:', error);
            console.error('Stack trace:', error.stack);
            const statusFrame = document.getElementById('status-frame');
            if (statusFrame) {
                statusFrame.innerHTML = `<div class="status-line error">Initialization error: ${error.message}</div>`;
            }
        }
    }

    async startSimulation() {
        console.log('startSimulation() called');
        try {
            console.log('Starting connection sequence...');
            await this.showConnectionSequence();
            console.log('Connection sequence completed');
            
            console.log('Starting login simulation...');
            await this.simulateLogin();
            console.log('Login simulation completed');
        } catch (error) {
            console.error('Error in simulation:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    initializeEventListeners() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.chatInput.addEventListener('input', () => this.handleInputChange());
    }

    handleInputChange() {
        this.sendButton.disabled = !this.chatInput.value.trim() && this.selectedFiles.size === 0;
    }

    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.selectedFiles.clear();
        this.attachmentPreview.innerHTML = '';

        for (const file of files) {
            this.selectedFiles.add(file);
            const preview = document.createElement('div');
            preview.className = 'attachment-preview';
            preview.innerHTML = `
                ${file.name}
                <span class="remove" onclick="this.parentElement.remove(); window.simulation.removeFile('${file.name}')">×</span>
            `;
            this.attachmentPreview.appendChild(preview);
        }

        this.handleInputChange();
    }

    removeFile(filename) {
        for (const file of this.selectedFiles) {
            if (file.name === filename) {
                this.selectedFiles.delete(file);
                break;
            }
        }
        this.handleInputChange();
    }

    async handleSubmit(event) {
        event.preventDefault();
        const message = this.chatInput.value.trim();
        const model = this.modelSelect.value;
        const files = Array.from(this.selectedFiles);

        if (!message && files.length === 0) return;

        // Clear input and attachments
        this.chatInput.value = '';
        this.selectedFiles.clear();
        this.attachmentPreview.innerHTML = '';
        this.sendButton.disabled = true;

        // If there are files, show them in the message
        if (files.length > 0) {
            const fileList = files.map(f => f.name).join(', ');
            const systemMessage = document.createElement('div');
            systemMessage.className = 'system-message';
            systemMessage.textContent = `Files attached: ${fileList}`;
            this.messagesContainer.appendChild(systemMessage);
        }

        if (message) {
            await this.displayJoe(message);
            await this.simulateNetworkDelay();
            await this.showRolodexterThinking();
            
            // Simulate response based on selected model
            const responseDelay = {
                'gpt-4': 2000,
                'gpt-3.5': 1000,
                'claude-2': 1500,
                'palm': 800
            }[model] || 1500;

            await this.sleep(responseDelay);
            await this.displayRolodexter(this.generateResponse(message, model));
        }
    }

    generateResponse(message, model) {
        // Simulate different response styles based on model
        const modelTag = `[${model}] `;
        return modelTag + "I've received your message and am processing the request. I'll get back to you shortly with more details.";
    }

    async showConnectionSequence() {
        const timestamp = new Date().toISOString();
        
        // Show environment details
        const envLine = document.createElement('div');
        envLine.className = 'status-line info';
        envLine.innerHTML = `[${timestamp}] ${this.formatServerInfo()} Environment: [runtime=node-${this.environment.node}, arch=${this.environment.arch}]`;
        this.statusFrame.appendChild(envLine);
        envLine.classList.add('visible');
        await this.sleep(500);

        // Show system initialization
        const initLine = document.createElement('div');
        initLine.className = 'status-line info';
        initLine.innerHTML = `[${timestamp}] ${this.formatServerInfo()} Initializing system [cpu=${this.systemMetrics.cpuLoad}%, mem=${this.systemMetrics.memoryUsage}MB, net=${this.networkMetrics.latency}ms]`;
        this.statusFrame.appendChild(initLine);
        initLine.classList.add('visible');
        await this.sleep(500);

        // Network diagnostics
        const netLine = document.createElement('div');
        netLine.className = 'status-line info';
        netLine.innerHTML = `[${timestamp}] ${this.formatServerInfo()} Network metrics [throughput=${this.networkMetrics.throughput}Mbps, loss=${this.networkMetrics.packetLoss}%, routes=optimal]`;
        this.statusFrame.appendChild(netLine);
        netLine.classList.add('visible');
        await this.sleep(500);
        
        // Show each connection stage
        for (const stage of this.connectionStages) {
            // First show the loading state
            const statusLine = document.createElement('div');
            statusLine.className = 'status-line pending';
            statusLine.innerHTML = `[${timestamp}] ${this.formatServerInfo()} ${stage} <span class="progress">0%</span>`;
            this.statusFrame.appendChild(statusLine);
            statusLine.classList.add('visible');
            
            // Simulate progress updates
            for (let progress = 0; progress <= 100; progress += 20) {
                statusLine.querySelector('.progress').textContent = `${progress}%`;
                await this.sleep(200);
            }
            
            // Update to success state
            statusLine.classList.remove('pending');
            statusLine.classList.add('success');
            statusLine.innerHTML = `[${timestamp}] ${this.formatServerInfo()} [SUCCESS] ${stage} <span class="progress">100%</span>`;
            
            // Add small delay before next line
            await this.sleep(300);
        }

        // Show final success message with technical details
        const successLine = document.createElement('div');
        successLine.className = 'status-line success';
        const memUsage = Math.floor(Math.random() * 512) + 512;
        const threadsActive = Math.floor(Math.random() * 8) + 4;
        successLine.innerHTML = `[${timestamp}] ${this.formatServerInfo()} [SUCCESS] Connection established [mem=${memUsage}MB, threads=${threadsActive}, uptime=0s]`;
        this.statusFrame.appendChild(successLine);
        await this.sleep(200);
        successLine.classList.add('visible');
        
        // Wait a moment before proceeding
        await this.sleep(1000);
    }

    async simulateLogin() {
        console.log('simulateLogin() called');
        
        // Log initial state
        console.log('Login container initial state:', {
            display: this.loginContainer.style.display,
            opacity: this.loginContainer.style.opacity,
            classList: Array.from(this.loginContainer.classList)
        });
        
        // Force the login container to be visible and reset its state
        this.loginContainer.style.display = 'flex';
        this.loginContainer.style.opacity = '1';
        this.loginContainer.classList.remove('hidden');
        this.loginContainer.classList.remove('processing');
        
        console.log('Login container state after reset:', {
            display: this.loginContainer.style.display,
            opacity: this.loginContainer.style.opacity,
            classList: Array.from(this.loginContainer.classList)
        });
        
        // Get field containers for status updates
        const usernameField = this.usernameInput.closest('.login-field');
        const passwordField = this.passwordInput.closest('.login-field');
        
        console.log('Found form fields:', {
            usernameField: !!usernameField,
            passwordField: !!passwordField
        });
        
        // Reset fields
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        
        console.log('Starting initial delay...');
        await this.sleep(1000);
        
        // Username typing simulation
        console.log('Starting username typing simulation...');
        usernameField.classList.add('typing');
        this.usernameInput.classList.add('typing');
        
        const username = "JoeMaristela";
        for (const char of username) {
            this.usernameInput.value += char;
            console.log('Typed username char:', char);
            await this.sleep(Math.random() * 100 + 50);
        }
        
        console.log('Username typing complete:', this.usernameInput.value);
        
        usernameField.classList.remove('typing');
        usernameField.classList.add('done');
        this.usernameInput.classList.remove('typing');
        await this.sleep(800);

        // Password typing simulation
        console.log('Starting password typing simulation...');
        passwordField.classList.add('typing');
        this.passwordInput.classList.add('typing');
        
        const password = "rolodexter";
        for (let i = 0; i < password.length; i++) {
            this.passwordInput.value += '*';
            console.log('Typed password char:', i + 1);
            await this.sleep(Math.random() * 80 + 40);
        }
        
        console.log('Password typing complete');
        
        passwordField.classList.remove('typing');
        passwordField.classList.add('done');
        this.passwordInput.classList.remove('typing');
        await this.sleep(1000);

        // Add processing state and hide login
        console.log('Starting login transition...');
        this.loginContainer.classList.add('processing');
        await this.sleep(500);
        
        this.loginContainer.classList.add('hidden');
        await this.sleep(500);
        this.loginContainer.style.display = 'none';
        
        console.log('Login container final state:', {
            display: this.loginContainer.style.display,
            opacity: this.loginContainer.style.opacity,
            classList: Array.from(this.loginContainer.classList)
        });
        
        // Start chat sequence
        console.log('Starting chat sequence...');
        await this.startChatSequence();
    }

    async startChatSequence() {
        await this.displayRolodexter("Hey Joe - good call just now with the ParkHealth team. I'm processing the notes I took, but wanted to flag something about Sarah's concerns regarding the latency issues.");
        await this.sleep(2000);
        
        await this.displayJoe("Yeah I noticed you were taking notes. The latency stuff is concerning but I think we can address it.");
        await this.sleep(3000);
        
        await this.displayRolodexter("Already cross-referencing the points Sarah raised against our recent performance metrics. The spikes seem to correlate with their peak trading hours.");
        await this.sleep(2500);
        
        await this.displayJoe("Makes sense. Before you dig deeper into that though, I need you to set up an MVP of NOMIX. I've updated a few things about the system, pertaining to Solana transactions.");
        await this.sleep(3500);
        
        await this.displayRolodexter("Got it. I see the schema changes you pushed. I'll spin this up on a local server and handle those Jira tasks about the NOMIX schema. Want me to deploy to a temp Vercel workspace as well?");
        await this.sleep(3000);
        
        await this.displayJoe("Sure, yes, I won't have access to ParkHealth later, so Vercel would be great.");
        await this.sleep(2500);
        
        await this.displayRolodexter("On it. I'll circle back to you with meeting insights after I get NOMIX deployed.");
    }

    async simulateNetworkDelay() {
        const baseDelay = this.networkMetrics.latency;
        const jitter = Math.random() * 100;
        await this.sleep(baseDelay + jitter);
    }

    async showRolodexterThinking() {
        const thinkingTime = Math.random() * 800 + 400; // 400-1200ms thinking time
        const indicator = document.createElement('div');
        indicator.className = 'ai-thinking';
        indicator.textContent = 'rolodexter processing';
        this.messagesContainer.appendChild(indicator);
        await this.sleep(thinkingTime);
        indicator.remove();
    }

    generateMockIP(sender) {
        // Return consistent IP for the session based on sender
        return this.sessionIPs[sender.toLowerCase()];
    }

    formatTimestamp(sender) {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const time = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const ip = this.generateMockIP(sender);
        return `<span class="ip-address" title="View connection details">${ip}</span> - ${date} ${time}`;
    }

    async typeText(element, text, isHuman = false) {
        if (isHuman) {
            element.classList.add('typing');
            // Simulate more natural human typing with mistakes and corrections
            let displayText = '';
            for (const char of text) {
                // Occasionally simulate a typo that gets corrected
                if (Math.random() < 0.05 && char !== ' ') {  // 5% chance of typo
                    const typo = String.fromCharCode(char.charCodeAt(0) + 1);
                    displayText += typo;
                    element.textContent = displayText;
                    await this.sleep(300); // Pause to notice mistake
                    displayText = displayText.slice(0, -1); // Remove typo
                    element.textContent = displayText;
                    await this.sleep(200); // Pause before correction
                }
                
                displayText += char;
                element.textContent = displayText;
                
                // Variable typing speed
                const baseDelay = 30;
                const randomVariation = Math.random() * 100;
                
                if (['.', '!', '?', ','].includes(char)) {
                    await this.sleep(baseDelay + randomVariation + 200);
                } else if (char === ' ') {
                    await this.sleep(baseDelay + randomVariation + 50);
                } else {
                    await this.sleep(baseDelay + randomVariation);
                }
            }
        } else {
            // AI types faster and more consistently
            let displayText = '';
            for (const char of text) {
                displayText += char;
                element.textContent = displayText;
                await this.sleep(20);
            }
        }
        
        if (isHuman) {
            element.classList.remove('typing');
        }
    }

    async displayRolodexter(text) {
        const div = document.createElement('div');
        div.className = 'message rolodexter';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = './images/rolodexter.jpg';
        avatar.alt = 'Rolodexter avatar';
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        
        const content = document.createElement('div');
        content.className = 'content';
        
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.innerHTML = this.formatTimestamp('rolodexter');
        
        contentWrapper.appendChild(content);
        contentWrapper.appendChild(timestamp);
        
        div.appendChild(avatar);
        div.appendChild(contentWrapper);
        this.messagesContainer.appendChild(div);
        
        // AI types faster and more consistently
        await this.typeText(content, text, false);
        this.scrollToBottom();
    }

    async showTypingIndicator(name) {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.textContent = `${name} is typing...`;
        this.messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }

    async hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async displayJoe(text) {
        // Set focus to input when typing starts
        this.chatInput.focus();
        this.chatInput.classList.add('typing');
        
        // First show typing in input field
        this.chatInput.value = '';
        await this.showTypingIndicator('Joe');
        
        // Simulate typing in the input field
        for (const char of text) {
            this.chatInput.value += char;
            
            // Human typing simulation with natural pauses
            const baseDelay = 30;
            const randomVariation = Math.random() * 100;
            
            // Occasionally simulate backspace for typos
            if (Math.random() < 0.05 && char !== ' ') {
                const typo = String.fromCharCode(char.charCodeAt(0) + 1);
                this.chatInput.value += typo;
                await this.sleep(300);
                this.chatInput.value = this.chatInput.value.slice(0, -1);
                await this.sleep(200);
            }
            
            if (['.', '!', '?', ','].includes(char)) {
                await this.sleep(baseDelay + randomVariation + 200);
            } else if (char === ' ') {
                await this.sleep(baseDelay + randomVariation + 50);
            } else {
                await this.sleep(baseDelay + randomVariation);
            }
        }

        // Pause as if "sending" the message
        await this.sleep(500);
        
        // Clear input and remove focus
        this.chatInput.value = '';
        this.chatInput.classList.remove('typing');
        this.chatInput.blur();
        await this.hideTypingIndicator();

        // Now display the message in chat
        const div = document.createElement('div');
        div.className = 'message joe';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = './images/joe.jpg';
        avatar.alt = 'Joe avatar';
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = text;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.innerHTML = this.formatTimestamp('joe');
        
        contentWrapper.appendChild(content);
        contentWrapper.appendChild(timestamp);
        
        div.appendChild(contentWrapper);
        div.appendChild(avatar);
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
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

// Create instance when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('Creating simulation instance...');
    window.simulation = new WebTerminalSimulation();
});

// Additional load event listener for debugging
window.addEventListener('load', () => {
    console.log('Window load event fired');
    console.log('Document readyState:', document.readyState);
});

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const chatInput = document.getElementById('chat-input');

    // Credentials to auto-type
    const credentials = {
        username: 'joe.maristela',
        password: 'rolodexter2024'
    };

    // Function to simulate typing
    const typeText = async (element, text, delay = 100) => {
        element.classList.add('typing');
        element.parentElement.classList.add('typing');
        
        for (let char of text) {
            element.value += char;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        element.classList.remove('typing');
        element.parentElement.classList.remove('typing');
        element.parentElement.classList.add('done');
    };

    // Auto type credentials sequence
    const autoTypeCredentials = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Initial pause
        await typeText(usernameInput, credentials.username);
        await new Promise(resolve => setTimeout(resolve, 500)); // Pause between fields
        await typeText(passwordInput, credentials.password);
        
        // After typing is complete, wait and then hide login
        await new Promise(resolve => setTimeout(resolve, 1000));
        loginContainer.classList.add('hidden');
        
        // Enable chat input after login
        chatInput.removeAttribute('readonly');
        document.querySelector('.chat-controls').classList.add('enabled');
    };

    // Start the auto-typing sequence
    autoTypeCredentials();
});