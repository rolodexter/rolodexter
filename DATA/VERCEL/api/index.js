const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🤖 Bot is live!");
});

app.post("/api/message", (req, res) => {
  const { message } = req.body;
  res.json({ response: `You said: ${message}` });
});

app.listen(3000, () => {
  console.log("Bot is running on port 3000");
});
