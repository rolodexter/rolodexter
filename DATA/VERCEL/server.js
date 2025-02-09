const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', (req, res) => {
  console.log('Received request:', req.body);
  // Handle the chat request here
  res.send({ message: 'Chat endpoint hit!' });
});

// Move static file serving after API routes
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
