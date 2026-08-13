const express = require("express");

const {
  getPricing,
  updatePricing,
} = require("../controllers/pricingController");

const auth = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/", getPricing);

// Admin Only
router.put("/", auth, updatePricing);

module.exports = router;