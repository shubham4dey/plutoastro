const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Firebase se aaye user ko MongoDB mein save karo
router.post("/save-user", async (req, res) => {
  try {
    const { uid, email, displayName, phone } = req.body;

    console.log("📥 Saving user to MongoDB:", { uid, email, displayName });

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { firebaseUid: uid }] 
    });

    if (existingUser) {
      console.log("⚠️ User already exists in MongoDB");
      return res.json({
        success: true,
        message: "User already exists",
        user: existingUser
      });
    }

    // Create new user
    const user = await User.create({
      firebaseUid: uid,
      name: displayName || "User",
      email: email,
      phone: phone || "",
      password: "firebase-auth", // Placeholder - Firebase handles auth
      status: "active",
      role: "user"
    });

    console.log("✅ User saved to MongoDB:", user._id);

    res.status(201).json({
      success: true,
      message: "User saved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;