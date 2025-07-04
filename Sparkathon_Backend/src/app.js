import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
