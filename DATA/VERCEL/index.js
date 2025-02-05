const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static('public'));

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

app.get("/", (req, res) => {
  res.send("🤖 Bot is live!");
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  const reply = getBotResponse(message);
  res.json({ reply });
});

module.exports = app;
