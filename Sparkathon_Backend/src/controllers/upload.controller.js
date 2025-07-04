// src/controllers/upload.controller.js

import fs from "fs";
import path from "path";

export const uploadCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Save the uploaded file as submission.csv in the uploads directory inside src
    const destPath = path.join(
      process.cwd(),
      "src",
      "uploads",
      "submission.csv"
    );
    fs.rename(req.file.path, destPath, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }
      res.json({
        success: true,
        message: "CSV data uploaded and updated successfully",
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
