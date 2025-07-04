// src/routes/upload.routes.js
import { Router } from "express";

import { uploadCsv } from "../controllers/upload.controller.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

router.post("/csv", upload.single("file"), uploadCsv);

export default router;
