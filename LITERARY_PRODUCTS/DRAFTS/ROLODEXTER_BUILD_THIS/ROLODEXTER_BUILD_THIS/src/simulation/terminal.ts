/**
 * Terminal Simulation class for rolodexter interface
 * 
 * UI Components:
 * - Chat interface with customizable macros (replacing GPT model selection)
 * - Cloud provider quick-access buttons (AWS, Azure, GCP, Vercel)
 * - Real-time status updates and metrics
 * - File attachment support
 */
class TerminalSimulation {
    private username: string;
    private password: string;
    private isLoggedIn: boolean;
    private readonly TERMINAL_WIDTH: number = 80;
    private readonly loadingFrames = [
        "⠋ Connecting to rolodexter",
        "⠙ Connecting to rolodexter",
        "⠹ Connecting to rolodexter",
        "⠸ Connecting to rolodexter",
        "⠼ Connecting to rolodexter",
        "⠴ Connecting to rolodexter",
        "⠦ Connecting to rolodexter",
        "⠧ Connecting to rolodexter",
        "⠇ Connecting to rolodexter",
        "⠏ Connecting to rolodexter"
    ];

    private readonly COLORS = {
        RESET: "\x1b[0m",
        BRIGHT_CYAN: "\x1b[96m",
        BRIGHT_GREEN: "\x1b[92m",
        BRIGHT_BLUE: "\x1b[94m",
        WHITE: "\x1b[97m"
    };

    private readonly jiraPreviewHTML = `
        <div class="jira-modal-overlay">
            <div class="jira-preview">
                <button class="close-preview">✕</button>
                <div class="jira-header">
                    <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira" class="jira-logo">
                    <span class="project-key">NOMIX-Schema</span>
                </div>
                <div class="jira-issues">
                    <div class="issue">
                        <span class="issue-key">NOMIX-123</span>
                        <span class="issue-priority">🔥 High</span>
                        <div class="issue-title">Update Solana Transaction Schema</div>
                        <div class="issue-description">
                            Schema needs to be updated to accommodate new Solana transaction types and metadata fields.
                            <ul>
                                <li>Add support for SPL token transfers</li>
                                <li>Include program invocation context</li>
                                <li>Update signature verification process</li>
                            </ul>
                        </div>
                        <div class="issue-metadata">
                            <span class="assignee">Assigned to: Joe Maristela</span>
                            <span class="status">Status: In Progress</span>
                        </div>
                    </div>
                    <div class="issue">
                        <span class="issue-key">NOMIX-124</span>
                        <span class="issue-priority">⚡ Medium</span>
                        <div class="issue-title">Implement Schema Validation for New Fields</div>
                        <div class="issue-description">
                            Create validation rules for new schema fields and implement error handling.
                        </div>
                        <div class="issue-metadata">
                            <span class="assignee">Assigned to: Joe Maristela</span>
                            <span class="status">Status: To Do</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    private readonly jiraPreviewStyles = `
        <style>
            .jira-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(9, 30, 66, 0.54);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(2px);
            }
            .jira-preview {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 8px 16px rgba(9, 30, 66, 0.25);
                margin: 20px;
                max-width: 800px;
                width: 90%;
                position: relative;
                animation: slideIn 0.2s cubic-bezier(0.2, 0, 0.13, 1.5);
            }
            .issue {
                border: 1px solid #dfe1e6;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
            }
            .issue:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(9, 30, 66, 0.1);
                border-color: #0052CC;
            }
            .issue-key {
                display: inline-block;
                padding: 2px 8px;
                background: #DEEBFF;
                border-radius: 3px;
                color: #0052CC;
                font-weight: 500;
                margin-right: 8px;
                font-size: 12px;
            }
            .issue-priority {
                font-size: 12px;
                color: #FF5630;
                background: #FFEBE6;
                padding: 2px 8px;
                border-radius: 3px;
            }
            .issue-title {
                font-size: 16px;
                font-weight: 600;
                color: #172B4D;
                margin: 12px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #EBECF0;
            }
            .issue-description {
                font-size: 14px;
                color: #172B4D;
                margin-bottom: 16px;
                line-height: 1.5;
            }
            .issue-metadata {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #5E6C84;
                padding-top: 12px;
                border-top: 1px solid #EBECF0;
            }
            .assignee, .status {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .assignee::before {
                content: '👤';
                font-size: 12px;
            }
            .status::before {
                content: '🔄';
                font-size: 12px;
            }
            // ...existing styles...
            
            .close-preview {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #EBECF0;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #42526E;
                transition: all 0.2s ease;
                z-index: 1001;
            }
            .close-preview:hover {
                background: #DFE1E6;
                transform: scale(1.1);
            }
            .jira-preview.closing {
                animation: slideOut 0.2s ease-in forwards;
            }
            @keyframes slideOut {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(20px); opacity: 0; }
            }
            .jira-modal-overlay.closing {
                animation: fadeOut 0.2s ease-in forwards;
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        </style>`;

    private readonly meetingNotesPreviewHTML = `
        <div class="preview-modal-overlay meeting-notes-overlay">
            <div class="preview-window meeting-notes">
                <button class="close-preview">✕</button>
                <div class="preview-header">
                    <img src="images/joe.jpg" alt="Joe" class="avatar">
                    <span class="header-title">Meeting Notes - 11 AM</span>
                </div>
                <div class="preview-content">
                    <div class="note-section">
                        <div class="note-timestamp">10:58 AM</div>
                        <div class="note-title">Project Updates</div>
                        <div class="note-content">
                            <ul>
                                <li>NOMIX schema requires updates for Solana integration</li>
                                <li>New transaction types need to be supported</li>
                                <li>Additional metadata fields for SPL tokens</li>
                            </ul>
                        </div>
                    </div>
                    <div class="note-section">
                        <div class="note-timestamp">11:15 AM</div>
                        <div class="note-title">Action Items</div>
                        <div class="note-content">
                            <ul>
                                <li>Update schema documentation</li>
                                <li>Create validation rules for new fields</li>
                                <li>Schedule technical review with blockchain team</li>
                            </ul>
                        </div>
                    </div>
                    <div class="note-section">
                        <div class="note-timestamp">11:30 AM</div>
                        <div class="note-title">Next Steps</div>
                        <div class="note-content">
                            <p>Deploy MVP to test environment and validate changes with sample transactions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    private readonly previewStyles = `
        <style>
            .preview-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(9, 30, 66, 0.54);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(2px);
            }
            .preview-window {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 8px 16px rgba(9, 30, 66, 0.25);
                margin: 20px;
                max-width: 800px;
                width: 90%;
                position: relative;
                animation: slideIn 0.2s cubic-bezier(0.2, 0, 0.13, 1.5);
                font-size: 11px; /* Base font size reduced */
            }
            .preview-header {
                padding: 16px;
                border-bottom: 1px solid #dfe1e6;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .avatar {
                width: 24px; /* Reduced from 32px */
                height: 24px; /* Reduced from 32px */
                border-radius: 50%;
            }
            .header-title {
                font-size: 14px; /* Reduced from 18px */
                font-weight: 500;
                color: #172B4D;
            }
            .preview-content {
                padding: 16px;
            }
            .note-section {
                margin-bottom: 24px;
            }
            .note-timestamp {
                font-size: 10px; /* Reduced from 12px */
                color: #5E6C84;
                margin-bottom: 2px;
            }
            .note-title {
                font-size: 12px; /* Reduced from 16px */
                font-weight: 600;
                margin-bottom: 6px;
            }
            .note-content {
                font-size: 11px; /* Reduced from 14px */
                line-height: 1.4;
            }
            .note-content ul {
                margin: 6px 0;
                padding-left: 18px;
            }
            .note-content li {
                margin: 3px 0;
            }
            .preview-link {
                color: #0052CC !important;
                text-decoration: none !important;
                padding: 2px 4px;
                border-radius: 3px;
                cursor: pointer;
                background: rgba(0, 82, 204, 0.05);
                transition: all 0.2s ease;
            }
            .preview-link:hover {
                background: rgba(0, 82, 204, 0.1);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 82, 204, 0.1);
            }
            .preview-link:active {
                transform: translateY(0);
                box-shadow: none;
            }
            .preview-link::before {
                content: '🔗';
                font-size: 12px;
                margin-right: 4px;
                opacity: 0.7;
            }
            .issue-key {
                font-size: 10px; /* Reduced from 12px */
                padding: 1px 6px;
            }
            .issue-priority {
                font-size: 10px; /* Reduced from 12px */
                padding: 1px 6px;
            }
            .issue-title {
                font-size: 12px; /* Reduced from 16px */
                margin: 8px 0;
                padding-bottom: 6px;
            }
            .issue-description {
                font-size: 11px; /* Reduced from 14px */
                margin-bottom: 12px;
                line-height: 1.4;
            }
            .issue-metadata {
                font-size: 10px; /* Reduced from 12px */
                padding-top: 8px;
            }
            .close-preview {
                width: 24px; /* Reduced from 32px */
                height: 24px; /* Reduced from 32px */
                font-size: 12px; /* Reduced from 16px */
            }
            // ...existing styles...
            .jira-link {
                color: #0052CC;
                text-decoration: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                background: rgba(0, 82, 204, 0.05);
                transition: all 0.2s ease;
                display: inline-block;
                margin: 0 4px;
                font-weight: bold;
                border: 1px solid rgba(0, 82, 204, 0.2);
            }
            .jira-link:hover {
                background: rgba(0, 82, 204, 0.15);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 82, 204, 0.2);
                border-color: #0052CC;
            }
        </style>`;

    constructor() {
        this.username = '';
        this.password = '';
        this.isLoggedIn = false;
    }

    public async startSimulation(): Promise<void> {
        console.clear(); // Clear the terminal screen
        await this.displayMessage(`${this.COLORS.BRIGHT_BLUE}+------------------------------------------+${this.COLORS.RESET}`);
        await this.displayMessage(`${this.COLORS.BRIGHT_BLUE}| ${this.COLORS.WHITE}rolodexter [${new Date().toLocaleString()}] Server status: Running ${this.COLORS.BRIGHT_BLUE}|${this.COLORS.RESET}`);
        await this.displayMessage(`${this.COLORS.BRIGHT_BLUE}+------------------------------------------+${this.COLORS.RESET}`);
        await this.sleep(1000);
        
        await this.displayLoadingAnimation();
        
        await this.displayMessage(`\n${this.COLORS.BRIGHT_GREEN}✨ Connection established successfully ✨${this.COLORS.RESET}\n`);
        await this.sleep(1000);
        
        process.stdout.write(`${this.COLORS.WHITE}| Username: ${this.COLORS.RESET}`);
        this.username = "JoeMaristela";
        await this.simulateTyping("JoeMaristela");
        await this.displayMessage(""); // Add space between stages
        await this.login();
    }

    private async displayLoadingAnimation(): Promise<void> {
        const stages = [
            "Initializing secure connection",
            "Establishing encrypted channel",
            "Authenticating service endpoints",
            "Loading relationship matrix",
            "Syncing neural pathways"
        ];
        
        let frame = 0;
        for (const stage of stages) {
            process.stdout.write("\r\x1b[K"); // Clear line
            for (let i = 0; i < 12; i++) {
                process.stdout.write(`\r${this.COLORS.BRIGHT_CYAN}${this.loadingFrames[frame % this.loadingFrames.length]} ${this.COLORS.WHITE}[${stage}]${this.COLORS.RESET}`);
                frame++;
                await this.sleep(100);
            }
            process.stdout.write(`\r${this.COLORS.BRIGHT_GREEN}✓ ${stage}${this.COLORS.RESET}\n`);
            await this.sleep(200);
        }
    }

    private async login(): Promise<void> {
        process.stdout.write("| Password: ");
        this.password = "rolodexter";
        await this.simulateTyping("rolodexter", true);
        await this.displayMessage(""); // Add extra space

        if (this.username === "JoeMaristela" && this.password === "rolodexter") {
            this.isLoggedIn = true;
            await this.sleep(1000); // Pause before starting chat
            await this.startChatSequence();
        }
    }

    private async startChatSequence(): Promise<void> {
        await this.displayChat("rolodexter", "Hello Joe! How was your 11 AM meeting?", false);
        await this.sleep(2000);
        
        await this.displayChat("Joe", "It was okay, I've updated some notes and sent them to you.", true);
        await this.sleep(1500);
        
        await this.displayChat("rolodexter", "Yes, I'm already <a href='#' class='preview-link meeting-notes-link'>synthesizing</a> and have some questions for you about that.", false);
        this.setupPreviewHandler('meeting-notes-link', 'meeting-notes-overlay');
        await this.sleep(2000);
        
        await this.displayChat("Joe", "Okay, great. Let's go over that later though. Right now, I need you to set up an MVP of NOMIX. I've updated a few things about the system, pertaining to Solana transactions.", true);
        await this.sleep(1500);
        
        const jiraMessage = "Got it. Please respond to pending <a href='#' class='jira-link'>Jira issues</a> posted about NOMIX schema, and I'll spin this up on a local server right away. Do you want me to deploy to a temp Vercel workspace as well?";
        await this.displayChat("rolodexter", jiraMessage, false);
        await this.simulateJiraClick(); // Add cursor simulation
        await this.sleep(2000);
        
        await this.displayChat("Joe", "Sure, yes, I won't have access to ParkHealth later, so Vercel would be great.", true);
        await this.sleep(1500);
        
        await this.displayChat("rolodexter", "Got it, see you in a bit.", false);
    }

    private setupPreviewHandler(linkClass: string, overlayClass: string): void {
        // Remove any existing preview container
        const existingOverlay = document.querySelector(`.${overlayClass}`);
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create and append the modal overlay with styles
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = this.previewStyles + (overlayClass === 'jira-modal-overlay' ? this.jiraPreviewHTML : this.meetingNotesPreviewHTML);
        document.body.appendChild(modalContainer);

        const overlay = document.querySelector(`.${overlayClass}`);
        const closeButton = document.querySelector(`.${overlayClass} .close-preview`);
        const previewLinks = document.querySelectorAll(`.${linkClass}`);

        // Add click handler to preview links
        previewLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (overlay) {
                    (overlay as HTMLElement).style.display = 'flex';
                }
            });
        });

        // Close modal when clicking outside or on close button
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    const preview = overlay.querySelector('.preview-window, .jira-preview');
                    if (preview) {
                        preview.classList.add('closing');
                        overlay.classList.add('closing');
                        setTimeout(() => {
                            (overlay as HTMLElement).style.display = 'none';
                            preview.classList.remove('closing');
                            overlay.classList.remove('closing');
                        }, 200);
                    }
                }
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const preview = overlay?.querySelector('.preview-window, .jira-preview');
                if (preview && overlay) {
                    preview.classList.add('closing');
                    overlay.classList.add('closing');
                    setTimeout(() => {
                        (overlay as HTMLElement).style.display = 'none';
                        preview.classList.remove('closing');
                        overlay.classList.remove('closing');
                    }, 200);
                }
            });
        }
    }

    private async simulateJiraClick(): Promise<void> {
        // Create cursor animation styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .cursor {
                width: 20px;
                height: 20px;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="%23000" d="M12,1L30,19L19,19L12,31L5,19L1,19z"/></svg>');
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
        `;
        document.head.appendChild(styleElement);

        // Create cursor element
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        // Find the Jira link
        const jiraLink = document.querySelector('.jira-link') as HTMLElement;
        if (!jiraLink) return;

        const linkRect = jiraLink.getBoundingClientRect();
        
        // Position cursor at the right side (simulating Joe's position)
        cursor.style.left = `${window.innerWidth - 50}px`;
        cursor.style.top = `${linkRect.top + window.scrollY + linkRect.height / 2}px`;

        // Wait a moment before moving
        await this.sleep(500);

        // Move cursor to link
        cursor.style.left = `${linkRect.left + linkRect.width / 2}px`;
        cursor.style.top = `${linkRect.top + window.scrollY + linkRect.height / 2}px`;

        // Wait for cursor to arrive
        await this.sleep(800);

        // Add click effect to link
        jiraLink.style.transform = 'scale(0.95)';
        jiraLink.style.backgroundColor = 'rgba(0, 82, 204, 0.2)';

        // Wait a moment
        await this.sleep(200);

        // Remove click effect
        jiraLink.style.transform = '';
        jiraLink.style.backgroundColor = '';

        // Open Jira preview
        const overlay = document.querySelector('.jira-modal-overlay') as HTMLElement;
        if (overlay) {
            overlay.style.display = 'flex';
        }

        // Remove cursor
        cursor.remove();
        styleElement.remove();
    }

    private async simulateJoeClick(): Promise<void> {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .joe-cursor {
                width: 24px;
                height: 24px;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="%23000" d="M12,1L30,19L19,19L12,31L5,19L1,19z"/></svg>');
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
                filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
            }
            .mock-link {
                color: #0052CC;
                text-decoration: none;
                background: rgba(0, 82, 204, 0.08);
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid rgba(0, 82, 204, 0.3);
                font-weight: 500;
                position: relative;
            }
            .mock-link::before {
                content: '🔗';
                font-size: 12px;
                margin-right: 4px;
                opacity: 0.7;
            }
            .mock-link:hover {
                background: rgba(0, 82, 204, 0.12);
                border-color: #0052CC;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 82, 204, 0.15);
            }
            .mock-link.clicked {
                transform: scale(0.95);
                background: rgba(0, 82, 204, 0.2);
                box-shadow: none;
            }
            .mock-link.clicked::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(0, 82, 204, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: clickRipple 0.5s ease-out;
            }
            @keyframes clickRipple {
                0% { width: 5px; height: 5px; opacity: 1; }
                100% { width: 50px; height: 50px; opacity: 0; }
            }
        `;
        document.head.appendChild(styleElement);

        // Find the message containing [Jira issues]
        const messages = document.querySelectorAll('.message');
        let jiraText: HTMLElement | null = null;
        messages.forEach(msg => {
            if (msg.textContent?.includes('[Jira issues]')) {
                msg.innerHTML = msg.innerHTML.replace(
                    /\[Jira issues\]/,
                    '<span class="mock-link">Jira issues</span>'
                );
                jiraText = msg.querySelector('.mock-link');
            }
        });

        if (!jiraText) return;

        // Create and position cursor
        const cursor = document.createElement('div');
        cursor.className = 'joe-cursor';
        document.body.appendChild(cursor);

        const linkRect = jiraText.getBoundingClientRect();
        
        // Start position (from Joe's side - right of screen)
        cursor.style.left = `${window.innerWidth - 50}px`;
        cursor.style.top = `${linkRect.top + window.scrollY + linkRect.height / 2}px`;
        cursor.style.opacity = '1';
        cursor.style.transform = 'rotate(-15deg)';

        // Wait a moment before moving
        await this.sleep(500);

        // Move cursor to link
        cursor.style.left = `${linkRect.left + linkRect.width / 2}px`;
        cursor.style.top = `${linkRect.top + window.scrollY + linkRect.height / 2}px`;
        cursor.style.transform = 'rotate(0deg)';

        // Wait for cursor to arrive
        await this.sleep(600);

        // Quick cursor press animation
        cursor.style.transform = 'scale(0.9)';
        
        // Simulate click effect
        jiraText.classList.add('clicked');
        await this.sleep(300);
        jiraText.classList.remove('clicked');
        cursor.style.transform = 'scale(1)';

        // Show Jira preview
        const overlay = document.querySelector('.jira-modal-overlay') as HTMLElement;
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.animation = 'fadeIn 0.3s ease-out';
        }

        // Cleanup
        await this.sleep(200);
        cursor.remove();
        styleElement.remove();
    }

    private async displayChat(sender: string, message: string, alignRight: boolean): Promise<void> {
        const maxMessageWidth = 50;

        // Add message container with styling
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${alignRight ? 'message-right' : 'message-left'}`;
        messageContainer.innerHTML = `
            <style>
                .message {
                    margin: 8px 0;
                    font-family: monospace;
                    position: relative;
                    line-height: 1.5;
                }
                .message-right {
                    text-align: right;
                    padding-left: 20%;
                }
                .message-left {
                    text-align: left;
                    padding-right: 20%;
                }
            </style>
            ${message}
        `;

        document.body.appendChild(messageContainer);
        await this.sleep(50);

        // Set up click handlers after the message is added
        if (!alignRight && message.includes('Jira issues')) {
            this.setupPreviewHandler('jira-link', 'jira-modal-overlay');
        }
    }

    private async displayMessage(message: string, newLine: boolean = true): Promise<void> {
        process.stdout.write(`${message}${newLine ? '\n' : ''}`);
    }

    private async simulateTyping(text: string, mask: boolean = false, delay: number = 0, speed: number = 0): Promise<void> {
        await this.sleep(delay);
        for (const char of text) {
            process.stdout.write(mask ? '*' : char);
            await this.sleep(speed || this.getRandomInt(50, 150));
        }
        process.stdout.write('\n');
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private startStatusUpdates(): void {
        // System metrics update (every 500ms)
        setInterval(() => {
            const metrics = [
                `[SYSTEM] cpu=${Math.floor(Math.random() * 30) + 10}% mem=${Math.floor(Math.random() * 512) + 512}MB threads=${Math.floor(Math.random() * 20) + 30}`,
                `[NETWORK] latency=${Math.floor(Math.random() * 50) + 5}ms bandwidth=${(Math.random() * 100).toFixed(2)}Mbps packets=${Math.floor(Math.random() * 1000) + 100}/s`,
                `[SECURITY] status=active threats=0 cert=valid encryption=AES-256-GCM`,
                `[DATABASE] connections=${Math.floor(Math.random() * 50) + 100} queries/sec=${Math.floor(Math.random() * 1000) + 500}`,
            ];

            metrics.forEach(metric => {
                console.log(this.COLORS.BRIGHT_CYAN + metric + this.COLORS.RESET);
            });
        }, 500);

        // Performance metrics (every 750ms)
        setInterval(() => {
            const perfMetrics = [
                `[CACHE] hit_rate=${(Math.random() * 2 + 98).toFixed(2)}% keys=${Math.floor(Math.random() * 10000) + 5000}`,
                `[MEMORY] heap=${Math.floor(Math.random() * 256) + 256}MB gc_pause=${(Math.random() * 10).toFixed(2)}ms`,
                `[API] requests=${Math.floor(Math.random() * 500) + 200}/s response_time=${Math.floor(Math.random() * 100) + 20}ms`
            ];

            perfMetrics.forEach(metric => {
                console.log(this.COLORS.BRIGHT_GREEN + metric + this.COLORS.RESET);
            });
        }, 750);

        // Service health checks (every 1000ms)
        setInterval(() => {
            const services = [
                `[AUTH] status=healthy sessions=${Math.floor(Math.random() * 1000) + 500}`,
                `[QUEUE] pending=${Math.floor(Math.random() * 100)} processed=${Math.floor(Math.random() * 10000) + 5000}`,
                `[BLOCKCHAIN] synced=true block=${Math.floor(Math.random() * 1000000) + 15000000}`
            ];

            services.forEach(service => {
                console.log(this.COLORS.BRIGHT_BLUE + service + this.COLORS.RESET);
            });
        }, 1000);
    }
}

export default TerminalSimulation;