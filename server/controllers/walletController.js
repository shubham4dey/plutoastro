const Wallet = require("../models/Wallet");

const WalletTransaction = require("../models/WalletTransaction");

const User = require("../models/User");

const Pricing = require("../models/Pricing");

const razorpay = require("../config/razorpay");

const crypto = require("crypto");
 
/* ======================================

   GET WALLET

====================================== */
 
exports.getWallet = async (req, res) => {

  try {

    const { email } = req.query;
 
    const user = await User.findOne({ email });
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    const wallet = await Wallet.findOne({

      userId: user._id,

    });
 
    return res.json({

      success: true,

      wallet,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};
 
/* ======================================

   RECHARGE WALLET (Test Mode)

====================================== */
 
exports.rechargeWallet = async (req, res) => {

  try {

    const { email, amount } = req.body;
 
    const user = await User.findOne({ email });
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    const wallet = await Wallet.findOne({

      userId: user._id,

    });
 
    if (!wallet) {

      return res.status(404).json({

        success: false,

        message: "Wallet not found",

      });

    }
 
    const before = wallet.balance;
 
    wallet.balance += Number(amount);
 
    await wallet.save();
 
    await WalletTransaction.create({

      userId: user._id,

      type: "credit",

      reason: "Recharge",

      amount,

      balanceBefore: before,

      balanceAfter: wallet.balance,

      status: "success",

    });
 
    res.json({

      success: true,

      wallet,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};
 
/* ======================================

   WALLET TRANSACTION HISTORY

====================================== */
 
exports.getWalletTransactions = async (req, res) => {

  try {

    const { email } = req.query;
 
    const user = await User.findOne({ email });
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    const transactions = await WalletTransaction.find({

      userId: user._id,

    }).sort({ createdAt: -1 });
 
    res.status(200).json({

      success: true,

      count: transactions.length,

      transactions,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* ======================================

   CHECK CHAT ELIGIBILITY

====================================== */
 
exports.canStartChat = async (req, res) => {

  try {

    const { email } = req.query;
 
    const user = await User.findOne({ email });
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    const wallet = await Wallet.findOne({

      userId: user._id,

    });
 
    if (!wallet) {

      return res.status(404).json({

        success: false,

        message: "Wallet not found",

      });

    }
 
    let pricing = await Pricing.findOne();
 
    if (!pricing) {

      pricing = await Pricing.create({});

    }
 
    if (wallet.balance < pricing.chatPerMinute) {

      return res.json({

        success: false,

        recharge: true,

        balance: wallet.balance,

        required: pricing.chatPerMinute,

        message: "Insufficient wallet balance",

      });

    }
 
    return res.json({

      success: true,

      balance: wallet.balance,

      charge: pricing.chatPerMinute,

      message: "Wallet balance sufficient",

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};
 
/* ======================================

   ✅ NEW: WALLET DETAILS (Balance + History Combined)

====================================== */
 
exports.getWalletDetails = async (req, res) => {

  try {

    const { email } = req.params;
 
    const user = await User.findOne({ email });
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    let wallet = await Wallet.findOne({ userId: user._id });
 
    if (!wallet) {

      wallet = await Wallet.create({ userId: user._id, balance: 0 });

    }
 
    const transactions = await WalletTransaction.find({

      userId: user._id,

    })

      .sort({ createdAt: -1 })

      .limit(50);
 
    res.json({ success: true, wallet, transactions });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }

};
 
/* ======================================

   ✅ RAZORPAY: CREATE ORDER

====================================== */
 
exports.createOrder = async (req, res) => {

  try {

    const { email, amount } = req.body;
 
    if (!email || !amount) {

      return res.status(400).json({

        success: false,

        message: "Email and amount required",

      });

    }
 
    const order = await razorpay.orders.create({

      amount: Math.round(Number(amount) * 100), // ₹ ko paise me

      currency: "INR",

      receipt: `rcpt_${Date.now()}`,

    });
 
    console.log("✅ Razorpay Order Created:", order.id);
 
    res.json({ success: true, order });

  } catch (err) {

    console.error("========== CREATE ORDER ERROR ==========");

    console.error(err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 
/* ======================================

   ✅ RAZORPAY: VERIFY PAYMENT + WALLET CREDIT

====================================== */
 
exports.verifyPayment = async (req, res) => {

  try {

    const { email, amount, orderId, paymentId, signature } = req.body;
 
    // ✅ Signature verify (security check)

    const expected = crypto

      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)

      .update(`${orderId}|${paymentId}`)

      .digest("hex");
 
    if (expected !== signature) {

      return res.status(400).json({

        success: false,

        message: "Invalid payment signature",

      });

    }
 
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({ success: false, message: "User not found" });

    }
 
    let wallet = await Wallet.findOne({ userId: user._id });

    if (!wallet) {

      wallet = await Wallet.create({ userId: user._id, balance: 0 });

    }
 
    const before = wallet.balance;

    wallet.balance = before + Number(amount);

    await wallet.save();
 
    // ✅ Transaction me paymentId save hoga (Admin Payments me dikhega)

    await WalletTransaction.create({

      userId: user._id,

      type: "credit",

      reason: "Recharge",

      amount: Number(amount),

      balanceBefore: before,

      balanceAfter: wallet.balance,

      paymentId,

      status: "success",

    });
 
    console.log("✅ Payment Verified + Wallet Credited:", paymentId);
 
    res.json({ success: true, balance: wallet.balance });

  } catch (err) {

    console.error("========== VERIFY PAYMENT ERROR ==========");

    console.error(err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 