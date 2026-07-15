const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");

// ✅ SUBSCRIBE TO NEWSLETTER
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed!"
      });
    }

    // Create new subscription
    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!"
    });

  } catch (error) {
    console.error("Newsletter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again."
    });
  }
});

// ✅ GET ALL SUBSCRIBERS (Admin only - optional)
router.get("/admin/subscribers", async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error("Fetch Subscribers Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscribers"
    });
  }
});

module.exports = router;