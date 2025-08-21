import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import User from "../models/User.js";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { parseFile } from "../utils/fileParser.js";
import fs from "fs";

const router = express.Router();

// Upload & Distribute
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Only admin can upload tasks" });

    const filePath = req.file.path;
    const data = await parseFile(filePath);

    const agents = await User.find({ role: "agent" });
    if (agents.length < 1) return res.status(400).json({ message: "No agents found" });

    let tasks = [];
    let agentIndex = 0;

    data.forEach((row) => {
      const agent = agents[agentIndex % agents.length];
      tasks.push({
        firstname: row.FirstName || row.firstname,
        phone: row.Phone || row.phone,
        notes: row.Notes || row.notes,
        assignedTo: agent._id
      });
      agentIndex++;
    });

    await Task.insertMany(tasks);
    fs.unlinkSync(filePath);

    res.json({ message: "Tasks distributed", tasks });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get tasks for an agent
router.get("/:agentId", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.agentId });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
