const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, rangerPrompt } = req.body;
    
    // 1. Check if the key even exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key is MISSING in Render Environment settings!" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `System: ${rangerPrompt}\n\nUser: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text: text });

  } catch (error) {
    // 2. This will send the EXACT error message to your chat bubble
    res.status(500).json({ 
      error: "Mission Failed", 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FinRangers HQ active on port ${PORT}`));
