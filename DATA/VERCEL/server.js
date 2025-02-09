const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = config.apiKey;

// Validate API key on startup
if (!API_KEY) {
    console.error("ERROR: OPENROUTER_API_KEY is not set in environment variables!");
    process.exit(1);
}

app.use(express.static(path.join(__dirname, 'public')));

// Add root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/api/chat", async (req, res) => {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 📩 New request received`);

    if (!req.body.message) {
        return res.status(400).json({ error: "Message is required!" });
    }

    const headers = {
        'HTTP-Referer': 'http://localhost:8080', // Required for OpenRouter
        'Authorization': `Bearer ${API_KEY}`, // ✅ Correct Format
        'Content-Type': 'application/json'
    };

    const payload = {
        model: "openai/gpt-4",
        messages: [{ role: "user", content: req.body.message }],
        temperature: 0.7,
        max_tokens: 1000
    };

    try {
        console.log(`[${requestId}] 🔑 Using API key: ${API_KEY.substring(0, 10)}...`);
        console.log(`[${requestId}] 📤 Sending request with headers:`, headers);
        
        const response = await axios.post(API_URL, payload, { headers });
        
        console.log(`[${requestId}] ✅ Success:`, {
            status: response.status,
            model: response.data?.model,
            tokens: response.data?.usage?.total_tokens
        });
        
        res.json({ reply: response.data.choices?.[0]?.message?.content || "No response" });
    } catch (error) {
        console.error(`[${requestId}] ❌ Error:`, {
            message: error.message,
            response: error.response?.data,
            headers: error.response?.headers
        });
        
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || error.message
        });
    }
});

const PORT = process.env.PORT || 8080; // Changed to match existing setup
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🔑 Using OpenRouter API key: ${API_KEY.substring(0, 10)}...`);
});
