const mongoose = require("mongoose");

const aiAstrologerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    speciality: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // System prompt for Gemini/OpenAI
    prompt: {
      type: String,
      default: "",
      trim: true,
    },

    // AI model name
    model: {
      type: String,
      default: "gemini-3.5-flash",
    },

    // Optional greeting message
    greeting: {
      type: String,
      default:
        "Hello! I am your AI Astrologer. How can I guide you today?",
    },

    // Statistics
    totalChats: {
      type: Number,
      default: 0,
    },

    totalUsers: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    orders: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AIAstrologer",
  aiAstrologerSchema
);