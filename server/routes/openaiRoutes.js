const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Latest model
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

// ===============================
// CHAT API
// ===============================
router.post("/api/openai/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages array is required",
      });
    }

    const conversation = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
You are AstroGPT.

You are an expert Vedic Astrologer.

Give accurate astrology guidance.

Conversation:

${conversation}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return res.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: text,
          },
        },
      ],
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

// ===============================
// KUNDLI API
// ===============================
router.post("/api/openai/kundli", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const finalPrompt = `
You are PlutoKundli AI.

Generate ONLY premium HTML.

Do not use markdown.

${prompt}
`;

    const result = await model.generateContent(finalPrompt);

    let html = result.response.text();

    html = html
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    return res.json({
      success: true,
      html,
    });
  } catch (err) {
    console.error("KUNDLI ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;