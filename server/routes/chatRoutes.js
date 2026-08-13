const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");
 
const {

  sendMessage,

  getChatHistory,

  editMessage,

  deleteMessage,

  markSeen,

} = require("../controllers/chatController");
 
const Chat = require("../models/Chat");
 
// ✅ NEW: Audio upload setup

const storage = multer.diskStorage({

  destination: (req, file, cb) =>

    cb(null, path.join(__dirname, "../uploads")),

  filename: (req, file, cb) =>

    cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`),

});

const upload = multer({ storage });
 
/* ==========================================

   SEND MESSAGE

========================================== */
 
router.post("/send", sendMessage);
 
/* ==========================================

   CHAT HISTORY (Controller)

========================================== */
 
router.get("/history/:roomId", getChatHistory);
 
/* ==========================================

   ✅ NEW: AUDIO UPLOAD

========================================== */
 
router.post("/upload-audio", upload.single("audio"), (req, res) => {

  if (!req.file) {

    return res.status(400).json({ success: false, message: "No file" });

  }

  res.json({ success: true, url: `/uploads/${req.file.filename}` });

});
 
/* ==========================================

   CHAT HISTORY BY ROOM ID

========================================== */
 
router.get("/:roomId", async (req, res) => {

  try {

    const { roomId } = req.params;
 
    const chats = await Chat.find({ roomId }).sort({

      createdAt: 1,

    });
 
    return res.json({

      success: true,

      roomId,

      messages: chats,

    });

  } catch (err) {

    console.error("GET CHAT ERROR:", err);
 
    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }

});
 
/* ==========================================

   EDIT MESSAGE

========================================== */
 
router.put("/edit/:messageId", editMessage);
 
/* ==========================================

   DELETE MESSAGE

========================================== */
 
router.delete("/delete/:messageId", deleteMessage);
 
/* ==========================================

   MESSAGE SEEN

========================================== */
 
router.put("/seen/:messageId", markSeen);
 
module.exports = router;
 