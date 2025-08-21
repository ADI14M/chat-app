import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatapp";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
