import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  firstname: String,
  phone: String,
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Task", taskSchema);
