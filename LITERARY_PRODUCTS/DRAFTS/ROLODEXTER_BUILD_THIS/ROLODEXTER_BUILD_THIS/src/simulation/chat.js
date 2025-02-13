// Convert from TypeScript to JavaScript for compatibility
export class ChatSystem {
    constructor() {
        this.threads = new Map();
        this.activeThread = null;
        this.initializeDefaultThreads();
    }

    initializeDefaultThreads() {
        // Initialize Rolodexter chat
        this.threads.set('rolodexter', {
            id: 'rolodexter',
            type: 'rolodexter',
            name: 'rolodexter',
            participants: ['user', 'rolodexter'],
            messages: [
                {
                    id: this.generateId(),
                    sender: 'rolodexter',
                    content: "Hi! I'm rolodexter. I can help you generate and validate ideas, or connect you with other idea creators. What would you like to do?",
                    timestamp: new Date(),
                    type: 'rolodexter'
                }
            ],
            unreadCount: 0
        });

        // Add default group chats
        this.threads.set('ideas-collective', {
            id: 'ideas-collective',
            type: 'group',
            name: 'Ideas Collective',
            participants: ['user', 'alice', 'bob', 'charlie'],
            messages: [],
            unreadCount: 0
        });

        this.threads.set('ai-innovators', {
            id: 'ai-innovators',
            type: 'group',
            name: 'AI Innovators',
            participants: ['user', 'dave', 'eve', 'frank'],
            messages: [],
            unreadCount: 0
        });
    }

    createChatUI() {
        // Chat UI is now created in HTML
        this.setupChatEventListeners();
        this.renderThreads();
    }

    setupChatEventListeners() {
        const input = document.querySelector('.chat-input');
        const sendBtn = document.querySelector('.send-message');

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage(input.value);
                input.value = '';
            }
        });

        sendBtn?.addEventListener('click', () => {
            if (input?.value) {
                this.sendMessage(input.value);
                input.value = '';
            }
        });

        // Add thread click listeners
        document.querySelectorAll('.chat-thread').forEach(threadEl => {
            threadEl.addEventListener('click', () => {
                const threadId = threadEl.getAttribute('data-thread-id');
                if (threadId) {
                    this.setActiveThread(threadId);
                }
            });
        });
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}