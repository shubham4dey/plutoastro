const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Astrologer = require("../models/Astrologer");

// Middleware: Token Verify Karne Ke Liye
const verifyAstrologer = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "plutoastro_secret_key");
    req.astrologer = await Astrologer.findById(decoded.id);
    if (!req.astrologer) return res.status(404).json({ success: false, message: "Astrologer not found" });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// 1. ASTROLOGER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const astrologer = await Astrologer.findOne({ email });
    
    if (!astrologer) return res.status(400).json({ success: false, message: "Invalid email or password" });
    if (!astrologer.isApproved) return res.status(403).json({ success: false, message: "Your account is pending admin approval." });
    
    const isMatch = await bcrypt.compare(password, astrologer.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });
    
    const token = jwt.sign({ id: astrologer._id }, process.env.JWT_SECRET || "plutoastro_secret_key", { expiresIn: "7d" });
    
    res.json({
      success: true,
      token,
      astrologer: {
        _id: astrologer._id,
        name: astrologer.name,
        email: astrologer.email,
        image: astrologer.image,
        skills: astrologer.skills,
        experience: astrologer.experience,
        rating: astrologer.rating,
        status: astrologer.status,
        earnings: astrologer.earnings,
        orders: astrologer.orders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2. UPDATE STATUS (Online/Offline/Busy)
router.put("/status", verifyAstrologer, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["online", "offline", "busy"];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const updatedAstrologer = await Astrologer.findByIdAndUpdate(req.astrologer._id, { status }, { new: true });
    res.json({ success: true, astrologer: updatedAstrologer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

module.exports = router;