import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Local development
    "http://localhost:3000", // Alternative local
    "https://sparkathon-2025-website.vercel.app", // Your Vercel domain
    /\.vercel\.app$/, // Any Vercel domain
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Sparkathon Backend API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((req, res, next) => {
  console.log("APP REQUEST:", req.method, req.originalUrl);
  next();
});
app.get("/api/forecast/direct-test", (req, res) => {
  res.json({ message: "Direct forecast endpoint works" });
});
app.use("/api", router);
console.log(
  "APP ROUTES:",
  app.router.stack.map((r) => r.regexp?.toString() || r.name)
);
console.log(
  "REGISTERED ROUTES:",
  app.router.stack.map((r) => ({
    name: r.name,
    path: r.route?.path,
  }))
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
