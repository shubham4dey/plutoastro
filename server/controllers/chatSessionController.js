const { randomUUID } = require("crypto");
 
const ChatSession = require("../models/ChatSession");

const User = require("../models/User");

const Astrologer = require("../models/Astrologer");

const Wallet = require("../models/Wallet");

const Pricing = require("../models/Pricing");

const WalletTransaction = require("../models/WalletTransaction");

const Chat = require("../models/Chat"); // ✅ NEW
 
exports.startChat = async (req, res) => {

  try {

    console.log("\n==============================");

    console.log("🚀 START ROUTE HIT");

    console.log("Body:", req.body);

    console.log("==============================\n");
 
    const { email, astrologerId } = req.body;
 
    if (!email || !astrologerId) {

      return res.status(400).json({

        success: false,

        message: "Email and Astrologer ID are required",

      });

    }
 
    const user = await User.findOne({ email });
 
    if (!user) {

      console.log(`problem ${user}`);

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    const astrologer = await Astrologer.findById(astrologerId);
 
    if (!astrologer) {

      return res.status(404).json({

        success: false,

        message: "Astrologer not found",

      });

    }
 
    const wallet = await Wallet.findOne({ userId: user._id });
 
    if (!wallet) {

      return res.status(404).json({

        success: false,

        message: "Wallet not found",

      });

    }
 
    const pricing = await Pricing.findOne();
 
    if (!pricing) {

      return res.status(404).json({

        success: false,

        message: "Pricing not configured",

      });

    }
 
    if (wallet.balance < pricing.chatPerMinute) {

      return res.status(400).json({

        success: false,

        recharge: true,

        balance: wallet.balance,

        required: pricing.chatPerMinute,

        message: "Insufficient wallet balance",

      });

    }
 
    const existing = await ChatSession.findOne({

      userId: user._id,

      astrologerId: astrologer._id,

      status: "active",

    });
 
    console.log("ACTIVE SESSION:", existing);
 
    if (existing) {

      console.log("♻ Returning Existing Active Session");

      return res.status(200).json({

        success: true,

        message: "Chat already active",

        roomId: existing.roomId,

        session: existing,

      });

    }
 
    const roomId = randomUUID();
 
    console.log("✨ New Room:", roomId);
 
    const session = await ChatSession.create({

      userId: user._id,

      astrologerId: astrologer._id,

      roomId,

      status: "active",

      startedAt: new Date(),

      pricePerMinute: pricing.chatPerMinute,

    });
 
    console.log("✅ Chat Session Created");
 
    return res.status(201).json({

      success: true,

      message: "Chat started successfully",

      roomId,

      session,

    });

  } catch (err) {

    console.error("========== START CHAT ERROR ==========");

    console.error(err);
 
    return res.status(500).json({

      success: false,

      message: err.message,

      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,

    });

  }

};
 
exports.endChat = async (req, res) => {

  try {

    const { roomId } = req.body;
 
    if (!roomId) {

      return res.status(400).json({

        success: false,

        message: "Room ID is required",

      });

    }
 
    console.log("🔴 Ending Chat:", roomId);
 
    const session = await ChatSession.findOne({ roomId });
 
    if (!session) {

      return res.status(404).json({

        success: false,

        message: "Chat session not found",

      });

    }
 
    if (session.status === "ended") {

      return res.status(400).json({

        success: false,

        message: "Chat already ended",

      });

    }
 
    const wallet = await Wallet.findOne({ userId: session.userId });
 
    if (!wallet) {

      return res.status(404).json({

        success: false,

        message: "Wallet not found",

      });

    }
 
    const pricing = await Pricing.findOne();
 
    if (!pricing) {

      return res.status(404).json({

        success: false,

        message: "Pricing not configured",

      });

    }
 
    const duration = Math.max(

      1,

      Math.ceil((Date.now() - session.startedAt.getTime()) / 60000)

    );
 
    const totalAmount = duration * pricing.chatPerMinute;
 
    const companyCommission =

      (totalAmount * pricing.companyCommission) / 100;
 
    const astrologerAmount =

      (totalAmount * pricing.astrologerCommission) / 100;
 
    const beforeBalance = wallet.balance;
 
    const deductAmount = Math.min(beforeBalance, totalAmount);

    const pendingAmount = Math.max(0, totalAmount - deductAmount);
 
    wallet.balance = beforeBalance - deductAmount;

    await wallet.save();
 
    if (deductAmount > 0) {

      await WalletTransaction.create({

        userId: session.userId,

        type: "debit",

        reason: "Chat",

        amount: deductAmount,

        balanceBefore: beforeBalance,

        balanceAfter: wallet.balance,

        status: "success",

      });

    }
 
    session.status = "ended";

    session.endedAt = new Date();

    session.duration = duration;

    session.totalAmount = totalAmount;

    session.deductedAmount = deductAmount;

    session.pendingAmount = pendingAmount;

    session.companyCommission = companyCommission;

    session.astrologerAmount = astrologerAmount;
 
    await session.save();
 
    console.log("✅ Chat Ended Successfully");

    console.log(`   Duration: ${duration} min`);

    console.log(`   Bill: ₹${totalAmount} | Deducted: ₹${deductAmount} | Pending: ₹${pendingAmount}`);
 
    return res.status(200).json({

      success: true,

      message: "Chat ended successfully",

      duration,

      totalAmount,

      deductedAmount: deductAmount,

      pendingAmount: pendingAmount,

      walletBalance: wallet.balance,

      session,

    });

  } catch (err) {

    console.error("========== END CHAT ERROR ==========");

    console.error(err);
 
    return res.status(500).json({

      success: false,

      message: err.message,

      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,

    });

  }

};
 
exports.getActiveSessions = async (req, res) => {

  try {

    const { astrologerId } = req.params;
 
    console.log("🔍 Fetching active sessions for astrologer:", astrologerId);
 
    const sessions = await ChatSession.find({

      astrologerId,

      status: "active",

    })

      .populate("userId", "name email")

      .sort({ createdAt: -1 });
 
    console.log(`✅ Found ${sessions.length} active sessions`);
 
    res.json({ success: true, count: sessions.length, sessions });

  } catch (err) {

    console.error("========== GET ACTIVE SESSIONS ERROR ==========");

    console.error(err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 
exports.getAstrologerStats = async (req, res) => {

  try {

    const { astrologerId } = req.params;
 
    const todayStart = new Date();

    todayStart.setHours(0, 0, 0, 0);
 
    const allSessions = await ChatSession.find({

      astrologerId,

      status: "ended",

    });
 
    const todaySessions = allSessions.filter(

      (s) => s.endedAt && new Date(s.endedAt) >= todayStart

    );
 
    const totalEarnings = allSessions.reduce(

      (sum, s) => sum + (s.astrologerAmount || 0),

      0

    );
 
    const todayEarnings = todaySessions.reduce(

      (sum, s) => sum + (s.astrologerAmount || 0),

      0

    );
 
    const uniqueUsers = [

      ...new Set(allSessions.map((s) => String(s.userId))),

    ].length;
 
    console.log("📊 Astrologer Stats:", {

      totalEarnings,

      todayEarnings,

      chats: allSessions.length,

    });
 
    res.json({

      success: true,

      stats: {

        totalEarnings,

        todayEarnings,

        todayChats: todaySessions.length,

        totalChats: allSessions.length,

        totalCustomers: uniqueUsers,

      },

    });

  } catch (err) {

    console.error("========== GET ASTROLOGER STATS ERROR ==========");

    console.error(err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 
exports.savePreChatForm = async (req, res) => {

  try {

    const { roomId, formData } = req.body;
 
    if (!roomId || !formData) {

      return res.status(400).json({

        success: false,

        message: "Room ID and form data are required",

      });

    }
 
    const session = await ChatSession.findOneAndUpdate(

      { roomId },

      {

        preChatForm: {

          name: formData.name,

          dob: formData.dob,

          rashi: formData.rashi,

          query: formData.query,

          submittedAt: new Date(),

        },

      },

      { new: true }

    );
 
    if (!session) {

      return res.status(404).json({

        success: false,

        message: "Chat session not found",

      });

    }
 
    console.log("✅ Pre-Chat Form Saved for room:", roomId);
 
    res.json({ success: true, message: "Form saved", session });

  } catch (err) {

    console.error("========== SAVE PRE-CHAT FORM ERROR ==========");

    console.error(err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 
exports.getChatSession = async (req, res) => {

  try {

    const { roomId } = req.params;
 
    const session = await ChatSession.findOne({ roomId })

      .populate("userId", "name email")

      .populate("astrologerId", "name");
 
    if (!session) {

      return res.status(404).json({ success: false, message: "Session not found" });

    }
 
    res.json({ success: true, session });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }

};
 
// ✅ NEW: GET USER SESSIONS (Inbox ke liye)

exports.getUserSessions = async (req, res) => {

  try {

    const { email } = req.params;
 
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({ success: false, message: "User not found" });

    }
 
    const sessions = await ChatSession.find({ userId: user._id })

      .populate("astrologerId", "name image status")

      .sort({ createdAt: -1 });
 
    const result = [];

    for (const s of sessions) {

      const last = await Chat.findOne({ roomId: s.roomId }).sort({

        createdAt: -1,

      });
 
      result.push({

        ...s.toObject(),

        lastMessage: last

          ? last.messageType === "audio"

            ? "🎤 Audio message"

            : last.message

          : "Chat shuru karo...",

        lastTime: last ? last.createdAt : s.createdAt,

      });

    }
 
    res.json({ success: true, sessions: result });

  } catch (err) {

    console.error("GET USER SESSIONS ERROR:", err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 