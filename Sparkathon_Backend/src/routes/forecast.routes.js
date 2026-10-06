// src/routes/forecast.routes.js

import { Router } from "express";
import {
  predictDemand,
  explainDemand,
  getInferenceSamples,
} from "../controllers/forecast.controller.js";

const router = Router();
router.get("/test", (req, res) => {
  res.json({ message: "Forecast router works" });
});
console.log("FORECAST ROUTES LOADED");
router.use((req, res, next) => {
  console.log("FORECAST REQUEST:", req.method, req.originalUrl);
  next();
});

router.post("/predict", predictDemand);
router.post("/explain", explainDemand);
router.get("/samples", getInferenceSamples);

export default router;