const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws, req) => {
    console.log('Client connected:', req.socket.remoteAddress);

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        ws.send(`Bot: ${message}`);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send('Bot: Hello! How can I help you today?');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`WebSocket server ready`);
});
