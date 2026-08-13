const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "Recharge",
        "Chat",
        "Call",
        "Refund",
        "Admin",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceBefore: Number,
    balanceAfter: Number,

    paymentId: String,

    status: {
      type: String,
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);