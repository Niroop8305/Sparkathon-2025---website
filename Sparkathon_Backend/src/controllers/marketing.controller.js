// src/controllers/marketing.controller.js

import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read marketing data from predicted_platform_types.csv
// Read marketing data from predicted_platform_types.csv
export const getMarketing = (req, res) => {
  const results = {};
  const filePath = path.join(
    __dirname,
    "../uploads/predicted_platform_types.csv"
  );
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const product = row["Product Name"];
      if (!results[product]) {
        results[product] = {
          product,
          channels: [],
          optimalMessage: row["Marketing Notes"] || "",
        };
      }
      results[product].channels.push({
        name: row["Platform"],
        effectiveness: parseFloat(row["Effectiveness (%)"]),
        cost: `₹${parseInt(row["Ad Budget (INR)"] || 0).toLocaleString()}`,
        roi: `${parseFloat(row["ROI (%)"]).toFixed(0)}%`,
      });
    })
    .on("end", () => {
      const data = Object.values(results);
      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    });
};
