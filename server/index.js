// index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// very basic realtime relay (upgrade later for rooms & auth)
io.on("connection", (socket) => {
  console.log("🔌 socket connected", socket.id);

  socket.on("chatMessage", (payload) => {
    // payload: { text, from, to? }
    io.emit("chatMessage", { ...payload, at: new Date().toISOString() });
  });

  socket.on("disconnect", () => console.log("🔌 socket disconnected", socket.id));
});

server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

app.get("/", (_, res) => res.send("✅ API is running..."));

// MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://Adityam2004:ADITYAM2004@cluster0.tb5fugp.mongodb.net/chatApp?retryWrites=true&w=majority";

import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/agents", agentRoutes);
app.use("/tasks", taskRoutes);
app.use("/messages", messageRoutes);

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected to Atlas"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});
