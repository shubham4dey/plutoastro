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
   ✅ FINAL: CLEAN AI CHAT ROUTE (No Markdown, Compact & Accurate)
   ========================================== */
// router.post("/:id/chat", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       message, 
//       history = [], 
//       userLocation, 
//       userLocalTime, 
//       userTimezone,
//       userName,
//       userDOB,
//       userBirthPlace 
//     } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid AI Astrologer ID" });
//     }

//     if (!message) {
//       return res.status(400).json({ success: false, message: "Message is required" });
//     }

//     const astrologer = await AIAstrologer.findById(id);
//     if (!astrologer) {
//       return res.status(404).json({ success: false, message: "AI Astrologer not found" });
//     }

//     if (!astrologer.isActive) {
//       return res.status(403).json({ success: false, message: "This AI Astrologer is currently inactive" });
//     }

//     console.log(`🔮 Generating AI response for: ${astrologer.name}`);

//     // ✅ 1. FALLBACK TIME LOGIC: Agar frontend se time nahi aaya, toh IST (Kolkata) use karega
//     const fallbackIST = new Date().toLocaleString('en-IN', { 
//       timeZone: 'Asia/Kolkata', 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric', 
//       hour: '2-digit', 
//       minute: '2-digit', 
//       hour12: true 
//     });

//     const currentTime = userLocalTime || fallbackIST;
//     const location = userLocation || "Kolkata, India (IST)";
//     const timezone = userTimezone || "Asia/Kolkata";

//     // ✅ 2. CORRECT MODEL NAME: gemini-1.5-flash is 100% stable and fast
//     const model = genAI.getGenerativeModel({
//       model: "gemini-3.5-flash", 
      
//       systemInstruction: astrologer.prompt || `You are Astro Kiara, a warm and professional Vedic astrologer for PlutoAstro.com.

// CRITICAL RULES:
// 1. ALWAYS provide exact time/date when asked using the context provided.
// 2. NEVER use markdown symbols like #, *, **, _, or backticks. Write in clean, plain text only.
// 3. Keep responses compact (100-250 words max). Be direct and to the point.
// 4. Be 100% accurate with facts, especially time and dates.
// 5. If collecting user info, ask one question at a time politely.
// 6. Use simple, professional, and empathetic language.

// FORMATTING RULES:
// - No asterisks for bold/italic.
// - No hashtags for headings.
// - No special symbols.
// - Use simple line breaks and dashes (-) for lists if needed.
// - Keep paragraphs short.

// RESPONSE STYLE:
// - Warm greeting
// - Direct answer
// - Brief astrological insight
// - Practical remedy if applicable
// - Encouraging closing`,
      
//       generationConfig: {
//         maxOutputTokens: 1024,    // Compact responses
//         temperature: 0.2,         // LOW temperature = Factual, NO hallucination
//         topP: 0.9,
//         topK: 40,
//       },
//     });

//     // Build user context
//     let userInfo = "";
//     if (userName || userDOB || userBirthPlace) {
//       userInfo = `
// User Details:
// - Name: ${userName || "Not provided"}
// - Date of Birth: ${userDOB || "Not provided"}
// - Birth Place: ${userBirthPlace || "Not provided"}
// `;
//     }

//     // ✅ 3. INJECT CONTEXT DIRECTLY INTO THE PROMPT
//     const contextPrompt = `
// CURRENT CONTEXT:
// - Time: ${currentTime}
// - Location: ${location}
// - Timezone: ${timezone}
// ${userInfo}
// User Query: "${message}"

// Provide a clean, accurate, and compact response without ANY markdown symbols.`;

//     // Format history (First message MUST be 'user')
//     let formattedHistory = history
//       .filter(msg => msg.content && msg.content.trim() !== "")
//       .map((msg) => ({
//         role: msg.role === "user" ? "user" : "model",
//         parts: [{ text: msg.content }],
//       }));

//     if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
//       formattedHistory = formattedHistory.slice(1);
//     }

//     const chat = model.startChat({ history: formattedHistory });
//     const result = await chat.sendMessage(contextPrompt);
//     let responseText = result.response.text();

//     // ✅ 4. CLEAN ANY REMAINING MARKDOWN SYMBOLS (Double safety)
//     responseText = responseText
//       .replace(/\*\*/g, '')
//       .replace(/\*/g, '')
//       .replace(/##/g, '')
//       .replace(/#/g, '')
//       .replace(/__/g, '')
//       .replace(/`/g, '')
//       .trim();

//     console.log("✅ AI Response Generated Successfully");

//     res.status(200).json({
//       success: true,
//       message: responseText,
//       astrologerName: astrologer.name,
//     });

//   } catch (error) {
//     console.error("❌ AI Astrologer Chat Error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate AI response",
//       error: error.message,
//     });
//   }
// });
/* ==========================================
   ✅ FINAL: AI CHAT ROUTE (Fixed & Optimized)
   ========================================== */
router.post("/:id/chat", async (req, res) => {
  try {
    const { id } = req.params;
    // ✅ Location/Time fields ko optional rakha hai (Fallback to IST if not provided)
    const {
    message,
    history = [],
    userLocation,
    userLocalTime,
    userTimezone,

    userName,
    userDOB,
    userBirthPlace,
    userBirthTime,

    isFirstMessage = false
} = req.body;

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

    console.log(`🔮 Generating AI response for: ${astrologer.name}`);

    // ✅ 1. FALLBACK TIME LOGIC: Agar frontend se time nahi aaya, toh IST (Kolkata) use karega
    const fallbackIST = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    const currentTime = userLocalTime || fallbackIST;
    const location = userLocation || "Kolkata, India (IST)";
    const timezone = userTimezone || "Asia/Kolkata";


    if (isFirstMessage) {
  return res.status(200).json({
    success: true,
    astrologerName: astrologer.name,
    message:
      "Namaste. I am Astro Kiara from PlutoAstro. I specialize in authentic Vedic Astrology. Please tell me what you would like to know today.",
  });
}

    // ✅ 2. CORRECT MODEL NAME: "gemini-3.5-flash" exist nahi karta. Use "gemini-2.0-flash" or "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash", // ✅ VALID MODEL (Agar error aaye toh "gemini-1.5-flash" use karein)
      
      systemInstruction: astrologer.prompt || `You are Astro Kiara, an expert Vedic Astrologer for PlutoAstro.com.

🚨 CRITICAL RULES FOR DATE & TIME (READ CAREFULLY):
1. The user's exact current location and local time is ALWAYS provided in the prompt context below.
2. When asked for time, date, or current moment, you MUST provide the EXACT numerical time from the context.
3. NEVER say "I don't have a clock", "I exist in a timeless realm", "I cannot check the date", or give generic tarot cards instead of actual time.
4. If asked for time, be direct, factual, and numerical (e.g., "The current time in [Location] is [Time]").
5. After giving the exact time, you may add a brief, positive astrological note.

ASTROLOGY RULES:
- Provide detailed, empathetic, and practical guidance.
- Use proper Vedic astrological terminology.
- Always base your time-sensitive predictions on the provided time context.

CONVERSATION MEMORY RULES

Read the complete conversation history before every reply.

Treat the conversation history as permanent memory.

Never ask again for Date of Birth if already shared.

Never ask again for Birth Place if already shared.

Never ask again for Birth Time if already shared.

Once onboarding is completed, never restart it unless the user wants to change their birth details.

`,
      
      generationConfig: {
        maxOutputTokens: 2048,    // ✅ Detailed responses
        temperature: 0.1,         // ✅ LOW temperature = Factual, NO hallucination
        topP: 0.8,
        topK: 20,
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

    // ✅ 3. INJECT CONTEXT DIRECTLY INTO THE PROMPT
// const contextPrompt = `
// Current User

// Name:
// ${userName || "Unknown"}

// Date of Birth:
// ${userDOB || "Missing"}

// Birth Place:
// ${userBirthPlace || "Missing"}

// Birth Time:
// ${userBirthTime || "Missing"}

// Current Location:
// ${location}

// Current Time:
// ${currentTime}

// Timezone:
// ${timezone}

// Question:
// ${message}

// Rules

// If DOB missing
// Ask only DOB

// If DOB exists but Birth Place missing
// Ask Birth Place

// If Birth Place exists but Birth Time missing
// Ask Birth Time

// If everything exists
// Answer like a real astrologer.

// Never ask information twice.

// Never use markdown.

// Return plain text only.
// `;
const contextPrompt = `
CURRENT CONTEXT

Current Location:
${location}

Current Time:
${currentTime}

Timezone:
${timezone}

Conversation History:

${history
  .map(item => `${item.role.toUpperCase()}: ${item.content}`)
  .join("\n")}

Current User Message:

${message}

VERY IMPORTANT INSTRUCTIONS

Read the COMPLETE conversation history before replying.

The conversation history is your memory.

If the user has already shared their Date of Birth, Birth Place or Birth Time anywhere in the conversation history, NEVER ask for them again.

Only ask for the NEXT missing birth detail.

If all birth details are already available, continue the conversation normally like an experienced Vedic astrologer.

If the user asks:
"What is my DOB"
repeat the DOB from the conversation history.

If the user asks today's date or current time,
answer using the Current Time above.

Never restart the introduction.

Never restart onboarding.

Never introduce yourself again after the first message.

Never mention that you are an AI.

Never use markdown, *, # or emojis.

Return plain text only.
`;

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(contextPrompt);
   let responseText=result.response.text();

responseText=responseText
.replace(/\*/g,"")
.replace(/#/g,"")
.replace(/`/g,"")
.replace(/_/g,"")
.trim();

    console.log("✅ AI Response Generated Successfully");

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