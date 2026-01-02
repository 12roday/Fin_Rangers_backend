const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// 1. CATCH-ALL ERROR LOGGER (Add this at the top)
process.on('uncaughtException', (err) => {
  console.error('SERVER CRASHED:', err.stack);
});

app.post("/chat", async (req, res) => {
  try {
    const { message, rangerPrompt } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ text: "ERROR: GEMINI_API_KEY is missing in Render Settings." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Simple prompt structure
    const result = await model.generateContent([rangerPrompt, message]);
    const response = await result.response;
    const text = response.text();

    res.json({ text: text });

  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    res.status(500).json({ text: "HQ Error: " + error.message });
  }
});

// Root route for health check
app.get("/", (req, res) => res.send("FinRangers Server is UP."));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
