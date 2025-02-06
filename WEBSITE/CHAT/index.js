const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Move this line up

const botResponses = {
  hello: ["Hi there!", "Hello! How can I help?", "Greetings!"],
  help: ["I can help you with basic questions.", "What do you need help with?"],
  bye: ["Goodbye!", "See you later!", "Have a great day!"],
};

function getBotResponse(message) {
  const lowercaseMsg = message.toLowerCase();
  
  for (const [key, responses] of Object.entries(botResponses)) {
    if (lowercaseMsg.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return "I'm still learning, but I'll try my best to help!";
}

// API routes
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  const reply = getBotResponse(message);
  res.json({ reply });
});

// Remove the catch-all route since we want static files to be served directly
// app.get('*', ...) - Remove this line

// Server startup
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🤖 Bot is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
