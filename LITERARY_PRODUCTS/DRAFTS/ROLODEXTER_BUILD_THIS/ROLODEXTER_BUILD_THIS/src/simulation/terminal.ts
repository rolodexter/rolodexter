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
        
        await this.displayChat("rolodexter", "Yes, I'm already synthesizing and have some questions for you about that.", false);
        await this.sleep(2000);
        
        await this.displayChat("Joe", "Okay, great. Let's go over that later though. Right now, I need you to set up an MVP of NOMIX. I've updated a few things about the system, pertaining to Solana transactions.", true);
        await this.sleep(1500);
        
        await this.displayChat("rolodexter", "Got it. Please respond to pending Jira issues posted about NOMIX schema, and I'll spin this up on a local server right away. Do you want me to deploy to a temp Vercel workspace as well?", false);
        await this.sleep(2000);
        
        await this.displayChat("Joe", "Sure, yes, I won't have access to ParkHealth later, so Vercel would be great.", true);
        await this.sleep(1500);
        
        await this.displayChat("rolodexter", "Got it, see you in a bit.", false);
    }

    private async displayChat(sender: string, message: string, alignRight: boolean): Promise<void> {
        const maxMessageWidth = 50;
        const words = message.split(' ');
        let currentLine = '';
        const lines: string[] = [];

        // Word wrap the message
        for (const word of words) {
            if (currentLine.length + word.length + 1 <= maxMessageWidth) {
                currentLine += (currentLine.length === 0 ? '' : ' ') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine.length > 0) {
            lines.push(currentLine);
        }

        // Display each line with proper alignment
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isFirstLine = i === 0;
            
            if (alignRight) {
                const padding = this.TERMINAL_WIDTH - line.length - 4; // -4 for margin
                await this.simulateTyping(" ".repeat(padding) + line, false, 0, 200);
            } else {
                if (isFirstLine) {
                    await this.simulateTyping(line, false, 0, 50);
                } else {
                    await this.simulateTyping("    " + line, false, 0, 50); // Indent continuation lines
                }
            }
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
}

export default TerminalSimulation;