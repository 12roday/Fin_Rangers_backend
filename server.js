const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. HEALTH CHECK (So Render knows we are alive)
app.get('/', (req, res) => {
    res.send("FinRangers Backend is running!");
});

// 2. SAFETY CHECK: Is the key actually here?
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in Environment Variables!");
} else {
    console.log("✅ API Key detected. Initializing AI...");
}

// 3. Initialize Gemini (Only if key exists to prevent crash)
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

app.post("/chat", async (req, res) => {
  try {
    // Safety check inside the chat route
    if (!genAI) {
        throw new Error("Server started without API Key. Check Render Environment variables.");
    }

    const { message, rangerPrompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

// 4. LISTEN ON 0.0.0.0 (Render requires this specific host)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FinRangers HQ active on port ${PORT}`);
});
