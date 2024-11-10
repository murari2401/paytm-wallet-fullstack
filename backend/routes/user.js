const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const { User, Account } = require("../models/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleWare } = require("../middlewares/middleware");

//SIGNUP USER
const singupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
});

userRouter.post("/signup", async (req, res) => {
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
  const userId = newUser._id;
  const userAccount = await Account.create({
    userId: userId,
    balance: Math.random() * 10000 + 1,
  });
  console.log(newUser);
  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    message: "Created new user",
    token: token,
  });
});

//SIGNIN USER
const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
userRouter.post("/signin", async (req, res) => {
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

//UPDATE USER
const updateUserSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
userRouter.put("/", authMiddleWare, async (req, res) => {
  const { success } = updateUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  User.updateOne(req.body, {
    id: req.userId,
  });
  res.json({
    message: "Updated successfully",
  });
});

//search other users
userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
module.exports = {
  userRouter,
};
