const mongoose = require("mongoose");

const astrologerApplicationSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      phone: {
        type: String,
        required: true,
      },

      password: {
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

      speciality: {
        type: [String],
        default: [],
      },

      price: {
        type: Number,
        default: 0,
      },

      about: {
        type: String,
        default: "",
      },

      certificate: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "AstrologerApplication",
  astrologerApplicationSchema
);