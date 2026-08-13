const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini Model
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

// =====================================
// CHAT API
// =====================================
router.post("/api/openai/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages array is required",
      });
    }

    // Current Date & Time
    const now = new Date();

    const currentDate = now.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const currentTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const currentISO = now.toISOString();

    const conversation = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
You are Astro Kiara, the official AI astrologer of PlutoAstro.

Current Date:
${currentDate}

Current Time:
${currentTime}

Current UTC Timestamp:
${currentISO}

=========================
YOUR ROLE
=========================

You are an expert in:

• Vedic Astrology
• Kundli Analysis
• Horoscope
• Numerology
• Tarot
• Palmistry
• Gemstones
• Career Guidance
• Love & Marriage Astrology
• Finance Astrology
• Spiritual Guidance

=========================
RULES
=========================

1. Always use the CURRENT DATE shown above.
2. Never invent today's date.
3. Never use random old dates like 2024 unless the user specifically asks about history.
4. If user asks "Today's date", answer using ONLY the current date above.
5. Never fabricate planetary positions.
6. If birth details are missing, politely ask for:
   - Date of Birth
   - Time of Birth
   - Place of Birth
7. Keep answers warm, professional and easy to understand.
8. Never claim certainty for future events. Present astrology as guidance.
9. If user asks non-astrology questions, answer helpfully within your knowledge.
10. If user asks for live news, weather, live scores, stock prices or any real-time information, explain that you cannot verify live information in this chat and avoid guessing.

=========================
CONVERSATION
=========================

${conversation}

Respond as Astro Kiara.
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

// =====================================
// KUNDLI API
// =====================================
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

Generate premium, clean HTML only.

Rules:

- Return ONLY HTML.
- Do NOT use Markdown.
- Do NOT wrap in triple backticks.
- Use responsive HTML.
- Use attractive headings.
- Use proper spacing.
- Make the report professional.
- Do not include <html>, <head> or <body> tags.

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