const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// VERSION MARKER: v2.5.0 - If you don't see this in logs, Render hasn't updated!
const MODEL_NAME = "gemini-2.5-flash"; 

app.post("/chat", async (req, res) => {
  try {
    const { message, rangerPrompt } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // We are forcing 2.5 Flash here
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent([rangerPrompt, message]);
    const response = await result.response;
    res.json({ text: response.text() });

  } catch (error) {
    console.error("LOGS SHOWING MODEL:", MODEL_NAME);
    res.status(500).json({ text: "HQ Error: " + error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`--- FINRANGERS DEPLOYED ---`);
  console.log(`Target Model: ${MODEL_NAME}`);
  console.log(`Port: ${PORT}`);
});
