const mongoose = require("mongoose");
 
const chatSchema = new mongoose.Schema(
  {
    // Chat Room
    roomId: {
      type: String,
      required: true,
      index: true,
    },
 
    // Session Reference
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },
 
    // User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
 
    // Astrologer
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Astrologer",
      required: true,
    },
 
    // Sender (Dynamic Reference)
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderType",
    },
 
    senderType: {
      type: String,
      enum: ["User", "Astrologer"],
      required: true,
    },
 
    // Receiver (Dynamic Reference)
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverType",
    },
 
    receiverType: {
      type: String,
      enum: ["User", "Astrologer"],
      required: true,
    },
 
    // Message
    message: {
      type: String,
      required: true,
      trim: true,
    },
 
    messageType: {
      type: String,
      enum: ["text", "image", "audio", "file"],
      default: "text",
    },
 
    attachment: {
      type: String,
      default: "",
    },
 
    // Status
    delivered: {
      type: Boolean,
      default: true,
    },
 
    seen: {
      type: Boolean,
      default: false,
    },
 
    seenAt: {
      type: Date,
      default: null,
    },
 
    deleted: {
      type: Boolean,
      default: false,
    },
 
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
 
    deletedAt: {
      type: Date,
      default: null,
    },
 
    edited: {
      type: Boolean,
      default: false,
    },
 
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
 
// =========================
// INDEXES (Fast Queries)
// =========================
 
chatSchema.index({
  roomId: 1,
  createdAt: -1,
});
 
chatSchema.index({
  sessionId: 1,
  createdAt: -1,
});
 
chatSchema.index({
  userId: 1,
  createdAt: -1,
});
 
chatSchema.index({
  astrologerId: 1,
  createdAt: -1,
});
 
chatSchema.index({
  senderId: 1,
  senderType: 1,
});
 
// =========================
// VIRTUALS (Populated Data)
// =========================
 
chatSchema.virtual("sender", {
  ref: function () {
    return this.senderType;
  },
  localField: "senderId",
  foreignField: "_id",
  justOne: true,
});
 
chatSchema.virtual("receiver", {
  ref: function () {
    return this.receiverType;
  },
  localField: "receiverId",
  foreignField: "_id",
  justOne: true,
});
 
chatSchema.set("toJSON", { virtuals: true });
chatSchema.set("toObject", { virtuals: true });
 
// =========================
// INSTANCE METHODS
// =========================
 
chatSchema.methods.markAsSeen = async function () {
  this.seen = true;
  this.seenAt = new Date();
  return await this.save();
};
 
chatSchema.methods.markAsDelivered = async function () {
  this.delivered = true;
  return await this.save();
};
 
chatSchema.methods.editMessage = async function (newMessage) {
  this.message = newMessage;
  this.edited = true;
  this.editedAt = new Date();
  return await this.save();
};
 
chatSchema.methods.deleteMessage = async function (forEveryone = false) {
  this.deleted = true;
  this.deletedForEveryone = forEveryone;
  this.deletedAt = new Date();
  return await this.save();
};
 
// =========================
// STATIC METHODS
// =========================
 
chatSchema.statics.getChatHistory = async function (roomId, limit = 50, skip = 0) {
  return await this.find({ roomId, deleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("senderId", "name email image")
    .populate("receiverId", "name email image")
    .populate("userId", "name email")
    .populate("astrologerId", "name image")
    .exec();
};
 
chatSchema.statics.getUnseenMessages = async function (userId, roomId) {
  return await this.find({
    roomId,
    receiverId: userId,
    seen: false,
    deleted: false,
  }).exec();
};
 
chatSchema.statics.markAllAsSeen = async function (userId, roomId) {
  return await this.updateMany(
    {
      roomId,
      receiverId: userId,
      seen: false,
    },
    {
      seen: true,
      seenAt: new Date(),
    }
  ).exec();
};
 
// ❌ PRE-SAVE HOOK REMOVED — server.js already sets receiverType
// Ye hook crash kar raha tha (next is not a function error)
 
module.exports = mongoose.model("Chat", chatSchema);