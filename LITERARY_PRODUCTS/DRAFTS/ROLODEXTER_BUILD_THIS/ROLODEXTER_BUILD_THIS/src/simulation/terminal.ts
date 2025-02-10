class TerminalSimulation {
    private username: string;
    private password: string;
    private isLoggedIn: boolean;

    constructor() {
        this.username = '';
        this.password = '';
        this.isLoggedIn = false;
    }

    public startSimulation(): void {
        this.displayMessage("rolodexter [" + new Date().toLocaleString() + "] Server status: Running");
        this.login();
    }

    private login(): void {
        this.displayMessage("Please enter your username:");
        // Simulate user input for username
        this.username = "JoeMaristela"; // This would be replaced with actual input handling

        this.displayMessage("Please enter your password:");
        // Simulate user input for password
        this.password = "rolodexter"; // This would be replaced with actual input handling

        if (this.username === "JoeMaristela" && this.password === "rolodexter") {
            this.isLoggedIn = true;
            this.displayMessage(`rolodexter: Hello ${this.username}! How was your 11 AM meeting?`);
            this.handleUserInput();
        } else {
            this.displayMessage("Invalid username or password. Please try again.");
            this.login();
        }
    }

    private handleUserInput(): void {
        // Simulate user interaction with delays
        this.displayMessage("Joe: It was okay, I've updated some notes and sent them to you.", 1000);
        this.displayMessage("rolodexter: Yes, I'm already synthesizing and have some questions for you about that.", 2000);
        this.displayMessage("Joe: Okay, great. Let's go over that later though. Right now, I need you to set up an MVP of NOMIX. I've updated a few things about the system, pertaining to Solana transactions.", 3000);
        this.displayMessage("rolodexter: Got it. Please respond to pending Jira issues posted about NOMIX schema, and I'll spin this up on a local server right away. Do you want me to deploy to a temp Vercel workspace as well?", 4000);
        this.displayMessage("Joe: Sure, yes, I won't have access to ParkHealth later, so Vercel would be great.", 5000);
        this.displayMessage("rolodexter: Got it, see you in a bit.", 6000);
    }

    private displayMessage(message: string, delay: number = 0): void {
        setTimeout(() => {
            console.log(message);
        }, delay);
    }
}

export default TerminalSimulation;