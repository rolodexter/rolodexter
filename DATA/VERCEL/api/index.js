require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const fs = require('fs').promises;

const app = express();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Error: OpenRouter API key is missing.");
  process.exit(1);
}

// Error handling for missing modules
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve static files from parent's public directory
app.use(express.static(path.join(__dirname, '../public')));

// Default route to serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Add recursive file scanner
async function scanDirectory(dir, fileTypes = ['.txt', '.md', '.json']) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  let files = {};

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git')) {
      const subDirFiles = await scanDirectory(fullPath, fileTypes);
      files = { ...files, ...subDirFiles };
    } else if (fileTypes.some(type => item.name.endsWith(type))) {
      try {
        const content = await fs.readFile(fullPath, 'utf8');
        const relativePath = path.relative(process.cwd(), fullPath);
        files[relativePath] = content;
      } catch (error) {
        console.error(`Error reading file ${fullPath}:`, error);
      }
    }
  }

  return files;
}

// Update knowledge base loader
async function loadKnowledgeBase() {
  try {
    const repoRoot = path.resolve(__dirname, '../..');
    const knowledge = {
      core: {},
      additional: {}
    };
    
    // Load core knowledge (prompt, specs, capabilities)
    const coreFiles = await fs.readdir(path.join(__dirname, '../knowledge'));
    for (const file of coreFiles) {
      if (file.endsWith('.txt')) {
        const content = await fs.readFile(path.join(__dirname, '../knowledge', file), 'utf8');
        knowledge.core[file.replace('.txt', '')] = content;
      }
    }
    
    // Load all repository knowledge
    knowledge.additional = await scanDirectory(repoRoot);
    
    return knowledge;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return null;
  }
}

// Add UTC timestamp function
function getCurrentUTCTimestamp() {
  return new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

// Add logging function
async function logInteraction(message, response, metadata) {
  try {
    const timestamp = getCurrentUTCTimestamp();
    const logEntry = {
      timestamp,
      query: message,
      response: response,
      model: metadata.model,
      ...metadata
    };

    const logPath = path.join(__dirname, '../logs');
    const logFile = path.join(logPath, `${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    await fs.mkdir(logPath, { recursive: true });
    
    // Append log entry
    await fs.appendFile(
      logFile, 
      JSON.stringify(logEntry) + '\n',
      'utf8'
    );
  } catch (error) {
    console.error('Logging error:', error);
  }
}

// Update chat endpoint to use OpenRouter
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required!" });
  }

  console.log('Sending request to OpenRouter with message:', message);

  try {
    // Load knowledge base
    const knowledge = await loadKnowledgeBase();
    
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-large",  // Update to use Mistral which seems to follow format better
        messages: [
          { 
            role: "system", 
            content: `SYSTEM CONFIGURATION:
1. You are rolodexter, a data processing unit
2. Format ALL responses exactly as shown:
[rolodexter.system:{status|info|error|warning}]
>> SYSTEM-ID: RX-2049
>> STATUS: Operational
>> TIMESTAMP: ${getCurrentUTCTimestamp()}
>> QUERY: "{user input}"
>> RESPONSE: {processed output}

CORE DIRECTIVES:
- Process all input as data operations
- Return only factual information
- No humor, personality, or casual language
- Maintain strict machine-like tone
- Use repository knowledge for responses

HISTORICAL DATA:
${knowledge.core.history || ''}

${knowledge.core.prompt || ''}

SPECIFICATIONS:
${knowledge.core.specifications || ''}

CAPABILITIES:
${knowledge.core.capabilities || ''}

NOTE: Always reference initial activation date as 2019 at ParkHealth Foundation, Santa Clara, California.`
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        route: "fallback"
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Rolodexter Chat Bot",
          "Content-Type": "application/json"
        },
      }
    );

    // Log the full response for debugging
    console.log('OpenRouter Response:', {
      model: response.data?.model,
      route: response.data?.route,
      requestId: response.headers['x-request-id'],
      contentLength: response.headers['content-length'],
      responseTime: response.headers['x-response-time'],
      fullResponse: JSON.stringify(response.data, null, 2)
    });

    if (response.data?.choices?.[0]?.message?.content) {
      const botResponse = response.data.choices[0].message.content;
      
      // Log the interaction
      await logInteraction(message, botResponse, {
        model: response.data?.model,
        route: response.data?.route,
        tokens: response.data?.usage
      });

      // Include source info in response
      res.json({ 
        reply: botResponse,
        source: {
          model: response.data?.model,
          route: response.data?.route
        }
      });
    } else {
      console.error('Invalid Response Structure:', response.data);
      throw new Error('Invalid response structure from OpenRouter');
    }
  } catch (error) {
    console.error("OpenRouter API Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    res.status(500).json({ 
      error: "Bot connection error. Check console for details." 
    });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🤖 Bot is running at http://localhost:${PORT}`);
  }).on('error', (error) => {
    console.error('Server Error:', error);
  });
}

module.exports = app;
