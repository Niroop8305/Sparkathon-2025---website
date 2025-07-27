import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

// Create test user endpoint for development
router.post("/create-test-user", async (req, res) => {
  try {
    // Check if test user already exists
    const existingUser = await UserModel.findOne({
      email: "admin@example.com",
    });
    if (existingUser) {
      return res.status(200).json({ msg: "Test user already exists" });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const testUser = new UserModel({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
    });
    await testUser.save();
    res.status(201).json({ msg: "Test user created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error creating test user" });
  }
});
