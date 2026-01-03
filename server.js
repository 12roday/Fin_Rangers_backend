require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Allow your frontend to talk to this server
app.use(cors());
app.use(express.json());

// 1. HEALTH CHECK (Visit your URL in a browser to see this)
app.get('/', (req, res) => {
    res.send("FinRangers Server is Running! 🚀");
});

// 2. SETUP GOOGLE AI
const apiKey = process.env.GEMINI_API_KEY;

// Log a warning if the key is missing (helps debugging)
if (!apiKey) {
    console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in Render Environment Variables!");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// 3. CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  try {
    // Safety Check
    if (!genAI) {
        throw new Error("Server has no API Key. Please check Render settings.");
    }

    const { message, rangerPrompt } = req.body;

    // *** IMPORTANT: Using 'gemini-pro' for maximum stability ***
    // If you want to try others later, you can use "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create the full prompt
    const prompt = `${rangerPrompt}\n\nUser: ${message}`;

    // Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Reply generated successfully");
    res.json({ text: text });

  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    
    // Send a helpful error to the frontend so we know what happened
    res.status(500).json({ 
        error: "Mission Failed", 
        details: error.message 
    });
  }
});

// 4. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FinRangers HQ active on port ${PORT}`);
});
