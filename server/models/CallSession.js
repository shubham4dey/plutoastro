const mongoose = require("mongoose");
 
const callSessionSchema = new mongoose.Schema(

  {

    roomId: { type: String, required: true, index: true },
 
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
 
    status: {

      type: String,

      enum: ["ringing", "active", "ended", "rejected", "missed"],

      default: "ringing",

    },
 
    startedAt: Date,   // jab call accept hui

    endedAt: Date,

    duration: Number,  // minutes
 
    pricePerMinute: { type: Number, default: 0 },

    totalAmount: Number,

    deductedAmount: Number,

    pendingAmount: Number,

    companyCommission: Number,

    astrologerAmount: Number,

  },

  { timestamps: true }

);
 
module.exports = mongoose.model("CallSession", callSessionSchema);
 