const { Server } = require('ws');

module.exports = (req, res) => {
    if (req.headers.upgrade !== 'websocket') {
        res.end('Need websocket upgrade');
        return;
    }

    const wss = new Server({ noServer: true });

    wss.on('connection', (ws) => {
        console.log('Client connected to Vercel WebSocket');

        ws.on('message', (message) => {
            console.log('Received:', message.toString());
            ws.send(`Bot: ${message}`);
        });

        ws.send('Bot: Hello! How can I help you today?');
    });

    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit('connection', ws, req);
    });
};
