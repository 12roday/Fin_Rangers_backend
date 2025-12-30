const express = require("express");
const cors = require("cors");
const { Groq } = require("groq-sdk");

const app = express();
app.use(cors()); // This allows your website to talk to this server
app.use(express.json());

// This looks for your key in a safe "Environment Variable"
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { message, rangerPrompt } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: rangerPrompt },
        { role: "user", content: message },
      ],
      model: "llama3-8b-8192",
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Mission Failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FinRangers HQ active on port ${PORT}`));
