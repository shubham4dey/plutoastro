const { randomUUID } = require("crypto");
 
const CallSession = require("../models/CallSession");

const User = require("../models/User");

const Astrologer = require("../models/Astrologer");

const Wallet = require("../models/Wallet");

const Pricing = require("../models/Pricing");

const WalletTransaction = require("../models/WalletTransaction");
 
/* ==========================================

   START CALL (Ringing Session Create)

========================================== */
 
exports.startCall = async (req, res) => {

  try {

    const { email, astrologerId } = req.body;
 
    if (!email || !astrologerId) {

      return res.status(400).json({

        success: false,

        message: "Email and Astrologer ID are required",

      });

    }
 
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({ success: false, message: "User not found" });

    }
 
    const astrologer = await Astrologer.findById(astrologerId);

    if (!astrologer) {

      return res.status(404).json({ success: false, message: "Astrologer not found" });

    }
 
    const wallet = await Wallet.findOne({ userId: user._id });

    if (!wallet) {

      return res.status(404).json({ success: false, message: "Wallet not found" });

    }
 
    const pricing = await Pricing.findOne();

    if (!pricing) {

      return res.status(404).json({ success: false, message: "Pricing not configured" });

    }
 
    const callRate = pricing.callPerMinute || pricing.chatPerMinute;
 
    if (wallet.balance < callRate) {

      return res.status(400).json({

        success: false,

        recharge: true,

        balance: wallet.balance,

        required: callRate,

        message: "Insufficient wallet balance",

      });

    }
 
    // Pehle se ringing/active call hai?

    const existing = await CallSession.findOne({

      userId: user._id,

      astrologerId: astrologer._id,

      status: { $in: ["ringing", "active"] },

    });
 
    if (existing) {

      return res.status(200).json({

        success: true,

        message: "Call already in progress",

        roomId: existing.roomId,

        session: existing,

      });

    }
 
    const roomId = randomUUID();
 
    const session = await CallSession.create({

      userId: user._id,

      astrologerId: astrologer._id,

      roomId,

      status: "ringing",

      pricePerMinute: callRate,

    });
 
    console.log("📞 Call Session Created:", roomId);
 
    return res.status(201).json({

      success: true,

      message: "Call initiated",

      roomId,

      session,

    });

  } catch (err) {

    console.error("========== START CALL ERROR ==========");

    console.error(err);

    return res.status(500).json({ success: false, message: err.message });

  }

};
 
/* ==========================================

   ACCEPT CALL (status → active)

========================================== */
 
exports.acceptCall = async (req, res) => {

  try {

    const { roomId } = req.body;
 
    const session = await CallSession.findOne({ roomId });

    if (!session) {

      return res.status(404).json({ success: false, message: "Call not found" });

    }
 
    session.status = "active";

    session.startedAt = new Date();

    await session.save();
 
    console.log("✅ Call Accepted:", roomId);
 
    res.json({ success: true, session });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }

};
 
/* ==========================================

   END CALL (Billing + Session End)

========================================== */
 
exports.endCall = async (req, res) => {

  try {

    const { roomId } = req.body;
 
    console.log("🔴 Ending Call:", roomId);
 
    const session = await CallSession.findOne({ roomId });

    if (!session) {

      return res.status(404).json({ success: false, message: "Call not found" });

    }
 
    if (session.status === "ended") {

      return res.status(400).json({ success: false, message: "Call already ended" });

    }
 
    // Agar call accept hi nahi hui (rejected/missed) → bina billing end

    if (!session.startedAt) {

      session.status = "ended";

      session.endedAt = new Date();

      session.duration = 0;

      session.totalAmount = 0;

      await session.save();
 
      return res.status(200).json({

        success: true,

        message: "Call ended (no billing)",

        duration: 0,

        totalAmount: 0,

        session,

      });

    }
 
    const wallet = await Wallet.findOne({ userId: session.userId });

    const pricing = await Pricing.findOne();
 
    const duration = Math.max(

      1,

      Math.ceil((Date.now() - session.startedAt.getTime()) / 60000)

    );
 
    const totalAmount = duration * session.pricePerMinute;
 
    const companyCommission = pricing

      ? (totalAmount * pricing.companyCommission) / 100

      : 0;

    const astrologerAmount = pricing

      ? (totalAmount * pricing.astrologerCommission) / 100

      : 0;
 
    let deductAmount = 0;

    let pendingAmount = totalAmount;
 
    if (wallet) {

      const before = wallet.balance;

      deductAmount = Math.min(before, totalAmount);

      pendingAmount = Math.max(0, totalAmount - deductAmount);
 
      wallet.balance = before - deductAmount;

      await wallet.save();
 
      if (deductAmount > 0) {

        await WalletTransaction.create({

          userId: session.userId,

          type: "debit",

          reason: "Call",

          amount: deductAmount,

          balanceBefore: before,

          balanceAfter: wallet.balance,

          status: "success",

        });

      }

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
 
    console.log("✅ Call Ended Successfully");

    console.log(`   Duration: ${duration} min | Bill: ₹${totalAmount}`);
 
    return res.status(200).json({

      success: true,

      message: "Call ended successfully",

      duration,

      totalAmount,

      deductedAmount: deductAmount,

      pendingAmount,

      walletBalance: wallet ? wallet.balance : 0,

      session,

    });

  } catch (err) {

    console.error("========== END CALL ERROR ==========");

    console.error(err);

    return res.status(500).json({ success: false, message: err.message });

  }

};
 
/* ======================================

   GET CALL SESSION (Names ke liye)

====================================== */
 
exports.getCallSession = async (req, res) => {

  try {

    const { roomId } = req.params;
 
    const session = await CallSession.findOne({ roomId })

      .populate("userId", "name email")

      .populate("astrologerId", "name image");
 
    if (!session) {

      return res.status(404).json({ success: false, message: "Call not found" });

    }
 
    res.json({ success: true, session });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }

};
 