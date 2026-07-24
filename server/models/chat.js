const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  astrologerId: { type: mongoose.Schema.Types.ObjectId, ref: "Astrologer", required: true },
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ["user", "astrologer"], required: true },
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  lastMessage: String,
  lastMessageTime: Date
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);