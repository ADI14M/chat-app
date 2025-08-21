import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Send a message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMessage = new Message({
      sender: req.user,
      receiver: receiverId,
      message,
    });

    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get messages between two users
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
