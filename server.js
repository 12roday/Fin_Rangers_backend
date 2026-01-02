const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini with your Environment Variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message, rangerPrompt } = req.body;
    
    // Choose the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine the Ranger personality with the user's message
    const prompt = `System: ${rangerPrompt}\n\nUser: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text: text });

  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    res.status(500).json({ error: "Mission Failed", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FinRangers HQ active on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, rangerPrompt } = req.body;
    
    // Check if the key exists before trying to use it
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key is missing in Render settings!" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `System: ${rangerPrompt}\n\nUser: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text: text });

  } catch (error) {
    // This sends the REAL error back to your website screen
    console.error("DEBUG ERROR:", error.message);
    res.status(500).json({ 
      error: "Mission Failed", 
      details: error.message,
      suggestion: "Check Render Environment Variables"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FinRangers HQ active on port ${PORT}`));


