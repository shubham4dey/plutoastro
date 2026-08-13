const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

const getWallet = async (userId) => {
  return await Wallet.findOne({ userId });
};

const creditWallet = async (
  userId,
  amount,
  reason = "Credit"
) => {

  const wallet = await Wallet.findOne({ userId });

  if (!wallet)
    throw new Error("Wallet not found");

  const before = wallet.balance;

  wallet.balance += Number(amount);

  await wallet.save();

  await WalletTransaction.create({
    userId,
    type: "credit",
    reason,
    amount,
    balanceBefore: before,
    balanceAfter: wallet.balance,
    status: "success",
  });

  return wallet;

};

const debitWallet = async (
  userId,
  amount,
  reason = "Debit"
) => {

  const wallet = await Wallet.findOne({ userId });

  if (!wallet)
    throw new Error("Wallet not found");

  if (wallet.balance < amount)
    throw new Error("Insufficient Balance");

  const before = wallet.balance;

  wallet.balance -= Number(amount);

  await wallet.save();

  await WalletTransaction.create({
    userId,
    type: "debit",
    reason,
    amount,
    balanceBefore: before,
    balanceAfter: wallet.balance,
    status: "success",
  });

  return wallet;

};

module.exports = {
  getWallet,
  creditWallet,
  debitWallet,
};