const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Optional for local testing, good practice

const app = express();
app.use(cors());
app.use(express.json());

// USE process.env HERE INSTEAD OF THE HARDCODED KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    // We expect the frontend to send the 'message' AND the 'rangerPrompt' (personality)
    const { message, rangerPrompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine them
    const prompt = `${rangerPrompt}\n\nUser: ${message}`;

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
