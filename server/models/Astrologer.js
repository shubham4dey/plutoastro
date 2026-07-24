const mongoose = require("mongoose");

const astrologerSchema = new mongoose.Schema(
  {
    // ---  NEW FIELDS (Login & Dashboard ke liye) ---
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Jab tak Admin approve na kare, login nahi kar payenge
    },
    earnings: {
      type: Number,
      default: 0, // Dashboard par earnings dikhane ke liye
    },
    socketId: {
      type: String,
      default: "", // Real-time online/offline track karne ke liye
    },

    // --- ✅ EXISTING FIELDS (Tumhare purane fields, same rakhe hain) ---
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    experience: {
      type: Number,
      default: 0,
    },
    languages: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    pricePerMinute: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      default: "offline", // Changed to 'offline' taaki dashboard se control ho
    },
    orders: {
      type: Number,
      default: 0, // Fake 250 hata kar 0 kar diya real tracking ke liye
    },
    verified: {
      type: Boolean,
      default: true,
    },
    totalCallDurationInMin: {
      type: Number,
      default: 120,
    },
    totalChatDurationInMin: {
      type: Number,
      default: 80,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Astrologer", astrologerSchema);