const axios = require('axios');

async function getBotResponse(message) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  try {
    const response = await axios.post(apiUrl, {
      prompt: message
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
}

module.exports = { getBotResponse };
