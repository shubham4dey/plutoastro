const express = require("express");

const router = express.Router();
 
// ✅ SAB functions ek saath import

const {

  getWallet,

  rechargeWallet,

  getWalletTransactions,

  canStartChat,

  getWalletDetails,

  createOrder,    // ✅ Razorpay: Order create

  verifyPayment,  // ✅ Razorpay: Payment verify + wallet credit

} = require("../controllers/walletController");
 
/* ==========================================

   WALLET ROUTES

========================================== */
 
// Wallet balance (query: ?email=...)

router.get("/", getWallet);
 
// ✅ Combined details (balance + history ek saath)

router.get("/details/:email", getWalletDetails);
 
// Recharge (test mode — bina payment)

router.post("/recharge", rechargeWallet);
 
// Transaction history (query: ?email=...)

router.get("/transactions", getWalletTransactions);
 
// Chat eligibility check

router.get("/can-start-chat", canStartChat);
 
/* ==========================================

   ✅ RAZORPAY ROUTES

========================================== */
 
// Order create karo (razorpay checkout ke liye)

router.post("/create-order", createOrder);
 
// Payment verify + wallet credit karo

router.post("/verify-payment", verifyPayment);
 
module.exports = router;
 