import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: user.toSafeObject() });
});

export default router;
