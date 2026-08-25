const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const AIAstrologer = require("../models/AIAstrologer");
const upload = require("../middleware/upload");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =========================
   GET ALL ACTIVE
========================= */
router.get("/", async (req, res) => {
  try {
    const astrologers =
      await AIAstrologer.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(astrologers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   GET ALL FOR ADMIN
========================= */
router.get(
  "/admin/all",
  async (req, res) => {
    try {
      const astrologers =
        await AIAstrologer.find().sort({
          createdAt: -1,
        });

      res.status(200).json(
        astrologers
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   GET SINGLE
========================= */
router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      res.status(200).json(
        astrologer
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   CREATE
========================= */
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        price,
        speciality,
        description,
        prompt,
        isActive,
      } = req.body;

      let image = "";

      if (req.file) {
        image = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${
          req.file.filename
        }`;
      }

      const astrologer =
        await AIAstrologer.create({
          name,
          price:
            Number(price) ||
            0,
          description,
          prompt,
          image,

          speciality:
            typeof speciality ===
            "string"
              ? speciality
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(
                    Boolean
                  )
              : speciality ||
                [],

          isActive:
            isActive ===
            "false"
              ? false
              : true,
        });

      res.status(201).json({
        success: true,
        message:
          "AI Astrologer created successfully",
        astrologer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   UPDATE
========================= */
router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      if (
        req.body.name !==
        undefined
      ) {
        astrologer.name =
          req.body.name;
      }

      if (
        req.body.price !==
        undefined
      ) {
        astrologer.price =
          Number(
            req.body.price
          );
      }

      if (
        req.body.description !==
        undefined
      ) {
        astrologer.description =
          req.body.description;
      }

      if (
        req.body.prompt !==
        undefined
      ) {
        astrologer.prompt =
          req.body.prompt;
      }

      if (
        req.body.speciality !==
        undefined
      ) {
        astrologer.speciality =
          typeof req.body
            .speciality ===
          "string"
            ? req.body.speciality
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(
                  Boolean
                )
            : req.body
                .speciality;
      }

      if (
        req.body.isActive !==
        undefined
      ) {
        astrologer.isActive =
          req.body
            .isActive ===
          "true";
      }

      if (req.file) {
        astrologer.image =
          `${req.protocol}://${req.get(
            "host"
          )}/uploads/${
            req.file.filename
          }`;
      }

      await astrologer.save();

      res.status(200).json({
        success: true,
        message:
          "AI Astrologer updated successfully",
        astrologer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   DELETE
========================= */
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      await astrologer.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "AI Astrologer deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   TOGGLE STATUS
========================= */
router.patch(
  "/:id/status",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      astrologer.isActive =
        !astrologer.isActive;

      await astrologer.save();

      res.status(200).json({
        success: true,
        message:
          "Status updated successfully",
        astrologer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);
/* ==========================================
   ✅ FINAL: AI CHAT ROUTE (Gemini 3.5 Flash)
   ========================================== */
router.post("/:id/chat", async (req, res) => {
  try {
    const { id } = req.params;
    const { message, history = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid AI Astrologer ID" });
    }

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const astrologer = await AIAstrologer.findById(id);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: "AI Astrologer not found" });
    }

    if (!astrologer.isActive) {
      return res.status(403).json({ success: false, message: "This AI Astrologer is currently inactive" });
    }

    console.log(`🔮 Generating AI response for: ${astrologer.name} (Using Gemini 3.5 Flash)`);

    // ✅ Gemini 3.5 Flash - Most Intelligent Model
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",  // ✅ Latest model
  
  systemInstruction: astrologer.prompt || `You are Astro Kiara, expert Vedic Astrologer for PlutoAstro.com.

CRITICAL RULES:
1. ALWAYS use Indian Standard Time (IST) = UTC+5:30
2. Current IST: Calculate using new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})
3. Provide detailed, accurate responses with proper astrological terminology
4. Use professional vocabulary and structured format
5. Include practical remedies (mantras, gemstones, fasting)
6. Be empathetic yet factual
7. Never guess - if unsure, ask for clarification

RESPONSE STRUCTURE:
- Opening greeting
- Detailed analysis with astrological terms
- Specific predictions with timeframes
- Practical remedies
- Encouraging closing`,
  
  generationConfig: {
    maxOutputTokens: 2048,    // ✅ Detailed responses
    temperature: 0.3,         // ✅ Accurate & factual
    topP: 0.9,                // ✅ Good diversity
    topK: 40,                 // ✅ Balanced sampling
  },
});

    // Format history (First message MUST be 'user')
    let formattedHistory = history
      .filter(msg => msg.content && msg.content.trim() !== "")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory = formattedHistory.slice(1);
    }

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    console.log("✅ Gemini 3.5 Flash Response Generated");

    res.status(200).json({
      success: true,
      message: responseText,
      astrologerName: astrologer.name,
    });

  } catch (error) {
    console.error("❌ AI Astrologer Chat Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
});

module.exports = router;