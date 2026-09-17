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
 
// ✅ Audio upload setup — audio is buffered in MEMORY and pushed
// straight to Cloudinary (under the "video" resource type, which is how
// Cloudinary stores audio). Nothing is written to the Render
// filesystem, so audio messages survive restarts and redeploys.

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// Permanent storage helper (multer memory buffer → Cloudinary).
const {
  CLOUDINARY_FOLDERS,
  uploadBufferToCloudinary,
} = require("../utils/cloudinaryUpload");
 
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
 
router.post("/upload-audio", upload.single("audio"), async (req, res) => {

  if (!req.file) {

    return res.status(400).json({ success: false, message: "No file" });

  }

  // Store permanently on Cloudinary — no local/Render disk usage.
  try {

    const uploaded = await uploadBufferToCloudinary(req.file, {

      folder: CLOUDINARY_FOLDERS.chatAudio,

      resourceType: "video", // Cloudinary stores audio as "video"

    });

    return res.json({

      success: true,

      url: uploaded.secure_url,

      public_id: uploaded.public_id,

    });

  } catch (error) {

    console.error("Audio upload error:", error);

    return res.status(500).json({

      success: false,

      message: error.message || "Audio upload failed",

    });

  }

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
 