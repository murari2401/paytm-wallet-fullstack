const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../models/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const singupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = singupSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const existingUser = await User.findOne({
    username,
  });
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }
  const newUser = await User.create({
    username,
    password,
    firstName,
    lastName,
  });
  console.log(newUser);
  const userId = newUser._id;
  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    message: "Created new user",
    token: token,
  });
});

const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const userInDB = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (userInDB) {
    const token = jwt.sign({ userId: userInDB._id }, JWT_SECRET);
    res.json({
      token: token,
    });
    return;
  }
  res.status(411).json({
    message: "Error while logging in",
  });
});
module.exports = {
  router,
};
