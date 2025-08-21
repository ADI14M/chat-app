import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["admin", "agent"], default: "agent" }
});

export default mongoose.model("User", userSchema);
