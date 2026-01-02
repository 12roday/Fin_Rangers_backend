const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  console.log("Request received!"); // This should force a log line
  
  try {
    const { message, rangerPrompt } = req.body;

    // Safety check 1: Environment Variable
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("RENDER_ENV_MISSING: GEMINI_API_KEY is not set in Render settings.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `System: ${rangerPrompt}\n\nUser: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text: text });

  } catch (error) {
    // This part sends the ACTUAL error back to your website screen
    console.error("CRITICAL ERROR:", error.message);
    res.status(500).json({ 
      text: "🚨 SERVER ERROR: " + error.message 
    });
  }
});

// Root route to test if the server is even awake
app.get("/", (req, res) => res.send("FinRangers HQ is Online and Waiting."));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`));

