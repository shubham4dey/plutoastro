const Chat = require("../models/Chat");
const ChatSession = require("../models/ChatSession");

/* ==========================================
   SEND MESSAGE
========================================== */

exports.sendMessage = async (req, res) => {
  try {
    const {
      roomId,
      senderId,
      senderType,
      text,
      message,
      receiverId,
      messageType = "text",
    } = req.body;

    const finalMessage = text || message;

    if (!roomId || !senderId || !senderType || !finalMessage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find Active Session
    const session = await ChatSession.findOne({
      roomId,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active chat session not found",
      });
    }

    // Auto Receiver
    let finalReceiverId = receiverId;

    if (!finalReceiverId) {
      finalReceiverId =
        senderType === "user"
          ? session.astrologerId
          : session.userId;
    }

    const chat = await Chat.create({
      roomId,
      sessionId: session._id,
      userId: session.userId,
      astrologerId: session.astrologerId,
      senderId,
      receiverId: finalReceiverId,
      senderType,
      message: finalMessage,
      messageType,
    });

    res.status(201).json({
      success: true,
      chat,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* ==========================================
   CHAT HISTORY
========================================== */

exports.getChatHistory = async (req, res) => {

  try {

    const { roomId } = req.params;

    const chats = await Chat.find({
      roomId,
    }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      messages: chats,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


/* ==========================================
   DELETE MESSAGE
========================================== */

exports.deleteMessage = async (req, res) => {

  try {

    const chat = await Chat.findById(req.params.messageId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    chat.deleted = true;
    chat.deletedForEveryone = true;
    chat.message = "This message was deleted.";

    await chat.save();

    res.json({
      success: true,
      message: "Message deleted",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


/* ==========================================
   EDIT MESSAGE
========================================== */

exports.editMessage = async (req, res) => {

  try {

    const chat = await Chat.findById(req.params.messageId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    chat.message = req.body.message;
    chat.edited = true;
    chat.editedAt = new Date();

    await chat.save();

    res.json({
      success: true,
      chat,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


/* ==========================================
   MARK SEEN
========================================== */

exports.markSeen = async (req, res) => {

  try {

    const chat = await Chat.findById(req.params.messageId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    chat.seen = true;

    await chat.save();

    res.json({
      success: true,
      message: "Seen updated",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};