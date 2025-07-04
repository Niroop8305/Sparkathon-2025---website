// src/routes/marketing.routes.js
import { Router } from "express";
import { getMarketing } from "../controllers/marketing.controller.js";

const router = Router();

router.get("/", getMarketing);

export default router;
