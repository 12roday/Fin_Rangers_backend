const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 1. Fix CORS for local testing and production
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 2. The Gemini Connection
// In 2026, we use the gemini-2.5-flash stable model
const GEMINI_MODEL = "gemini-2.5-flash"; 

app.post("/chat", async (req, res) => {
  console.log("Transmission received at HQ...");

  try {
    const { message, rangerPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Safety check: Is the key missing?
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is missing from Render Environment Variables!");
      return res.status(500).json({ text: "🚨 HQ Error: API Key is missing in Render settings." });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Generate content using the modern 2.5 architecture
    const result = await model.generateContent([rangerPrompt, message]);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response successful.");
    res.json({ text: text });

  } catch (error) {
    console.error("GEMINI ERROR LOG:", error.message);
    
    // This sends the SPECIFIC error back to your chat window
    res.status(500).json({ 
      text: "🚨 HQ Error: " + error.message,
      debug: "Model used: " + GEMINI_MODEL
    });
  }
});

// Health check route
app.get("/", (req, res) => res.send("FinRangers Server is ONLINE."));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ranger Server active on port ${PORT}`);
  console.log(`Using model: ${GEMINI_MODEL}`);
});
