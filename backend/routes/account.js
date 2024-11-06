const express = require("express");
const mongoose = require("mongoose");
const accountRouter = express.Router();
const { Account } = require("../models/db");
const { authMiddleWare } = require("../middlewares/middleware");

accountRouter.get("/balance", authMiddleWare, async (req, res) => {
  const accountDetails = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: accountDetails.balance,
  });
});

accountRouter.post("/transfer", authMiddleWare, async (req, res) => {
  const session = await mongoose.session;
  session.startTransaction();
  const { amount, to } = req.body;
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }
  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);
  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

module.exports = {
  accountRouter,
};
