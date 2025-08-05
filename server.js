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
app.use(bodyParser());
app.use(express.static(path.join(__dirname)));

// Google Maps Key endpoint
app.get('/api/maps-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Property advice route
app.post('/advice', async (req, res) => {
  const { address, action } = req.body;

  const prompt = `Give a professional real estate advisory report for this address: "${address}".
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
    res.status(500).json({ response: "Something went wrong." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
