const express = require("express");
const router = express.Router();

router.post("/api/openai/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({
        error: "Messages array is required",
      });
    }

    const userMessage = messages[0]?.content;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY missing",
      });
    }

    console.log("📡 Calling Gemini...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini Response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini request failed",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      choices: [
        {
          message: {
            role: "assistant",
            content:
              text || "No response generated",
          },
        },
      ],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;