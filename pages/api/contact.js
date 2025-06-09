// File: pages/api/contact.js

import mongoose from "mongoose";

// Define MongoDB schema
const MessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await connectDB();
    await Message.create({ name, email, message });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
}
