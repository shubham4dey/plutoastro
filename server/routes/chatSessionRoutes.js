const express = require("express");

const router = express.Router();
 
console.log("✅ chatSessionRoutes Loaded");
 
const {

  startChat,

  endChat,

  getChatSession,

  getActiveSessions,

  getAstrologerStats,

  savePreChatForm,

  getUserSessions, // ✅ NEW — Inbox ke liye

} = require("../controllers/chatSessionController");
 
/* ==========================================

   TEST ROUTE

========================================== */
 
router.get("/test", (req, res) => {

  console.log("✅ TEST ROUTE HIT");

  res.json({

    success: true,

    message: "Chat Session Route Working",

  });

});
 
/* ==========================================

   START CHAT

========================================== */
 
router.post("/start", startChat);
 
/* ==========================================

   END CHAT

========================================== */
 
router.post("/end", endChat);
 
/* ==========================================

   SAVE PRE-CHAT FORM

========================================== */
 
router.post("/save-form", savePreChatForm);
 
/* ==========================================

   GET CHAT SESSION (Form data ke liye)

========================================== */
 
router.get("/session/:roomId", getChatSession);
 
/* ==========================================

   ASTROLOGER KI ACTIVE CHATS

========================================== */
 
router.get("/astrologer/:astrologerId", getActiveSessions);
 
/* ==========================================

   ASTROLOGER REAL STATS

========================================== */
 
router.get("/stats/:astrologerId", getAstrologerStats);
 
/* ==========================================

   ✅ NEW: USER KI SABHI CHAT SESSIONS (Inbox ke liye)

========================================== */
 
router.get("/user-sessions/:email", getUserSessions);
 
module.exports = router;
 