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

    // Save the uploaded file using its original name in the uploads directory inside src
    const destPath = path.join(
      process.cwd(),
      "src",
      "uploads",
      req.file.originalname
    );
    console.log(
      `Received file: ${req.file.originalname}, saved as: ${req.file.path}`
    );
    fs.rename(req.file.path, destPath, (err) => {
      if (err) {
        console.error(`Error saving file: ${err.message}`);
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }
      console.log(`File saved to: ${destPath}`);
      res.json({
        success: true,
        message: `CSV data uploaded and updated successfully as ${req.file.originalname}`,
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.error(`Upload error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
