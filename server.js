const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 1. IMPROVED CORS (This fixes the 204/500 loop)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 2. EMERGENCY LOGGING (This catches crashes before they happen)
process.on('uncaughtException', (err) => {
  console.error('SERVER CRITICAL CRASH:', err.message);
  console.error(err.stack);
});

app.post("/chat", async (req, res) => {
  console.log("Incoming transmission received...");
  
  try {
    const { message, rangerPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("ERROR: GEMINI_API_KEY is empty or missing!");
      return res.status(500).json({ text: "System Error: API Key missing in Render settings." });
    }

    // Initialize inside the route to prevent startup crashes
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([rangerPrompt, message]);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response successful.");
    res.json({ text: text });

  } catch (error) {
    console.error("DETAILED GEMINI ERROR:", error.message);
    res.status(500).json({ 
      text: "HQ Error: " + error.message,
      debug: "Check Render logs for 'DETAILED GEMINI ERROR'" 
    });
  }
});

app.get("/", (req, res) => res.send("FinRangers HQ is Online."));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ranger Server active on port ${PORT}`);
});
