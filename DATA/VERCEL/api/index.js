const express = require("express");
const app = express();

app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("🤖 Bot is live! Send a POST request to /api/chat to interact.");
});

// Chat endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body; // Extract the user's message
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  // Example bot logic: Echo the message
  const botResponse = `You said: ${message}. How can I help further?`;

  res.json({ reply: botResponse });
});

// Start the bot
app.listen(3000, () => {
  console.log("Bot is running on port 3000");
});
