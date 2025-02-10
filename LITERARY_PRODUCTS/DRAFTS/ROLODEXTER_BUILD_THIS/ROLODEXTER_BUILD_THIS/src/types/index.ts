export interface User {
    username: string;
    password: string;
}

export interface SystemMessage {
    sender: string;
    content: string;
    timestamp: Date;
}