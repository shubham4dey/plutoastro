const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Astrologer",
      required: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: Date,

    duration: {
      type: Number,
      default: 0, // minutes
    },

    pricePerMinute: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    companyCommission: {
      type: Number,
      default: 0,
    },
    preChatForm: {
  name: String,
  dob: Date,
  rashi: String,
  query: String,
  submittedAt: Date,
},
    astrologerAmount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);