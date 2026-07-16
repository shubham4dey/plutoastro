const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  getAstrologers,
  getAstrologerById,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
} = require("../controllers/astrologerController");

router.get("/", getAstrologers);
router.get("/:id", getAstrologerById);
router.post("/", upload.single("image"), createAstrologer);
router.put("/:id", upload.single("image"), updateAstrologer);
router.delete("/:id", deleteAstrologer);

module.exports = router;
