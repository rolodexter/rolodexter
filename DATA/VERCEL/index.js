require('dotenv').config({ path: 'C:/rolodexter/DATA/VERCEL/.env' }); // Add this line at the top
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require('axios');
const app = express();
const port = process.env.PORT || 8080;

const apiKey = process.env.OPENROUTER_API_KEY;
const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

console.log(`OpenRouter API Key: ${apiKey}`);
console.log('🤖 rolodexter is running at http://localhost:8080');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Move this line up

// API routes
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  console.log("DEBUG: Using API Key:", apiKey); // Ensure key is loaded
  console.log("DEBUG: Sending request with headers:");

  const headers = {
    "Authorization": apiKey,  // Use raw API key without "Bearer"
    "Content-Type": "application/json",
    "Referer": "http://localhost:8080",  // Updated header key for local testing
    "X-Title": "Rolodexter" // Optional, but recommended
  };

  console.log(headers); // Log headers

  try {
    const response = await axios.post(apiUrl, {
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    }, { headers });

    res.json({ reply: response.data });
  } catch (error) {
    console.error("Error response from OpenRouter:", {
      status: error.response ? error.response.status : null,
      headers: error.response ? error.response.headers : null,
      data: error.response ? error.response.data : error.message
    });
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

// Server startup
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🤖 rolodexter is running at http://localhost:${port}`);
  });
}

module.exports = app;
