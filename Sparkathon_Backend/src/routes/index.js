import express from "express";
import productRoutes from "./product.routes.js";
import marketingRoutes from "./marketing.routes.js";
import uploadRoutes from "./upload.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

// Health check endpoint for API
router.get("/health", (req, res) => {
  res.json({
    message: "API routes are working",
    timestamp: new Date().toISOString(),
    routes: ["products", "marketing", "upload", "auth", "users"],
  });
});

router.use("/products", productRoutes);
router.use("/marketing", marketingRoutes);
router.use("/upload", uploadRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
