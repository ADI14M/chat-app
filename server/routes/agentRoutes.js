import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Agent (Admin only)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Only admin can add agents" });

    const { name, email, phone, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const agent = new User({ name, email, phone, password: hashed, role: "agent" });
    await agent.save();

    res.json({ message: "Agent added", agent });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
