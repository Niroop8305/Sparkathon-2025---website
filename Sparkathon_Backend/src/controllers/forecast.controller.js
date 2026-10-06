// src/controllers/forecast.controller.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

// Send features to FastAPI and get demand prediction
export const predictDemand = async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        features: req.body.features,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Forecast API error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to connect to the forecasting model",
      error: error.message,
    });
  }
};

// Get prediction + SHAP explanation
export const explainDemand = async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        features: req.body.features,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Forecast explanation API error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to connect to the forecasting model",
      error: error.message,
    });
  }
};

// Get real FreshRetailNet inference samples
export const getInferenceSamples = (req, res) => {
  const results = [];

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(
    __dirname,
    "../uploads/inference_sample.csv"
  );

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      res.json({
        success: true,
        count: results.length,
        data: results,
      });
    })
    .on("error", (error) => {
      console.error("Inference sample error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to load inference samples",
        error: error.message,
      });
    });
};