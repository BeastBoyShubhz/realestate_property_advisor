require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend from /public

// Google Maps Key endpoint
app.get('/api/maps-key', (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Google Maps API key not configured.' });
  }
  res.json({ key });
});

// OpenAI config
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Advice Endpoint
app.post('/advice', async (req, res) => {
  const { address, action } = req.body;

  if (!address || !action) {
    return res.status(400).json({ response: "Address and action are required." });
  }

  const prompt = `
Give a professional real estate advisory report for this address: "${address}".
Purpose: ${action.toUpperCase()}

Include:
- Estimated property value
- Property age
- Past sale/rent history (if any)
- Area and neighbourhood analysis
- Suitability for ${action}
- Red flags or advantages`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    if (error.message.includes("quota")) {
      return res.status(429).json({ response: "OpenAI quota exceeded or billing issue." });
    }
    res.status(500).json({ response: "Something went wrong with the AI request." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
  
// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
