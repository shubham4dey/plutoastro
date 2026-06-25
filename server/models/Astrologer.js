const mongoose = require("mongoose");

const astrologerSchema = new mongoose.Schema(
  {
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
      default: "online",
    },

    orders: {
      type: Number,
      default: 250,
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

module.exports = mongoose.model(
  "Astrologer",
  astrologerSchema
);