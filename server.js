require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Allow the frontend to talk to us
app.use(cors());
app.use(express.json());

// 1. HEALTH CHECK (So Render knows we are alive)
app.get('/', (req, res) => {
    res.send("FinRangers Brain is Active! 🧠");
});

// 2. SETUP GEMINI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in Render Environment Variables!");
}

app.post("/chat", async (req, res) => {
  try {
    if (!genAI) {
        throw new Error("Server has no API Key. Check Render settings.");
    }

    const { message, rangerPrompt } = req.body;

    // --- MODEL SELECTION ---
    // We are using 'gemini-1.5-pro' because it is smarter than Flash.
    // If this fails, change it to 'gemini-pro' (the older reliable one).
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Combine the Ranger's personality with the user's message
    const prompt = `${rangerPrompt}\n\nUser: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Reply sent successfully");
    res.json({ text: text });

  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    res.status(500).json({ error: "Mission Failed", details: error.message });
  }
});

// 3. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FinRangers HQ active on port ${PORT}`);
});
