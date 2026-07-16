const express = require("express");
const router = express.Router();

// ✅ 1. Upload middleware import karo
const upload = require("../middleware/upload"); 

const {
  getAstrologers,
  getAstrologerById,
  createAstrologer,   // ✅ Ye function controller mein add karna hoga
  updateAstrologer    // ✅ Ye function controller mein add karna hoga
} = require("../controllers/astrologerController");

// GET Routes (Pehle se the, waise hi rahenge)
router.get("/", getAstrologers);
router.get("/:id", getAstrologerById);

// ✅ 2. POST Route: Naya Astrologer Add karna (Image ke saath)
// upload.single("image") ka matlab hai form mein field ka naam "image" hona chahiye
router.post("/", upload.single("image"), createAstrologer);

// ✅ 3. PUT Route: Astrologer Update karna (Optional: Nayi image ke saath)
router.put("/:id", upload.single("image"), updateAstrologer);

module.exports = router;