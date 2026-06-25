const express = require("express");
const router = express.Router();

const {
  getAstrologers,
  getAstrologerById,
} = require("../controllers/astrologerController");

router.get("/", getAstrologers);
router.get("/:id", getAstrologerById);

module.exports = router;