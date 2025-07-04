// src/routes/product.routes.js
import { Router } from "express";
import { getProducts, getPricing } from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/pricing", getPricing);

export default router;
