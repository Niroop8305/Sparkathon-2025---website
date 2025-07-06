import fs from "fs";
import path from "path";
import { notifyTrendingProduct } from "./emailNotifi.controller.js";

export const uploadCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const destPath = path.join(
      process.cwd(),
      "src",
      "uploads",
      req.file.originalname
    );
    console.log(
      `Received file: ${req.file.originalname}, saved as: ${req.file.path}`
    );
    fs.rename(req.file.path, destPath, async (err) => {
      if (err) {
        console.error(`Error saving file: ${err.message}`);
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }
      console.log(`File saved to: ${destPath}`);

      // Only trigger email if the trending products file was uploaded
      if (req.file.originalname === "trending_products_final_full_train.csv") {
        try {
          await notifyTrendingProduct();
          console.log("Notification emails sent to all users.");
        } catch (notifyError) {
          console.error("Error sending notification emails:", notifyError.message);
        }
      }

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