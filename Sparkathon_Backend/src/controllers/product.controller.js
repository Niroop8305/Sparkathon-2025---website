// src/controllers/product.controller.js
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trending products from trending_products_final_full_train.csv
export const getProducts = (req, res) => {
  const results = [];
  const filePath = path.join(
    __dirname,
    "../uploads/trending_products_final_full_train.csv"
  );
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push({
        name: row["Product Name"],
        trendLabel: row["Trend Label"],
        predictedLabel: row["Predicted Label"],
        trendScore: parseFloat(row["Trend Score"]),
        expectedSales: parseFloat(row["Expected Sales"]),
        confidence: parseInt(row["Confidence (%)"]),
      });
    })
    .on("end", () => {
      res.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
    });
};

// Unified pricing and trend data
export const getPricing = (req, res) => {
  const trendFile = path.join(
    __dirname,
    "../uploads/trending_products_final_full_train.csv"
  );
  const priceFile = path.join(
    __dirname,
    "../uploads/optimal_price_predictions.csv"
  );
  const trends = {};
  const prices = {};

  // Read trends first
  fs.createReadStream(trendFile)
    .pipe(csv())
    .on("data", (row) => {
      const name = row["Product Name"];
      trends[name] = {
        name,
        trendLabel: row["Trend Label"],
        predictedLabel: row["Predicted Label"],
        trendScore: parseFloat(row["Trend Score"]),
        expectedSales: parseFloat(row["Expected Sales"]),
        confidence: parseInt(row["Confidence (%)"]),
      };
    })
    .on("end", () => {
      // Now read prices
      fs.createReadStream(priceFile)
        .pipe(csv())
        .on("data", (row) => {
          const product = row["Product Name"];
          if (!prices[product]) {
            prices[product] = [];
          }
          prices[product].push({
            year: row["Year"],
            month: row["Month"],
            unitsManufactured: parseInt(row["Units Manufactured"]),
            unitsSold: parseInt(row["Units Sold"]),
            price: parseFloat(row["Price (INR)"]),
            predictedOptimalPrice: parseFloat(row["Predicted Optimal Price"]),
            discount: parseFloat(row["Discount (%)"]),
            stockLeft: parseInt(row["Stock Left"]),
            expiryDate: row["Expiry Date"],
          });
        })
        .on("end", () => {
          let idCounter = 1;
          const data = Object.keys(trends).map((name) => {
            let latest = null;
            if (prices[name] && prices[name].length > 0) {
              latest = prices[name].reduce((a, b) => {
                if (
                  parseInt(b.year) > parseInt(a.year) ||
                  (b.year === a.year && parseInt(b.month) > parseInt(a.month))
                ) {
                  return b;
                }
                return a;
              });
            }
            return {
              id: idCounter++,
              name,
              currentPrice: latest ? latest.price : null,
              optimalPrice: latest ? latest.predictedOptimalPrice : null,
              priceChange:
                latest && latest.discount !== undefined
                  ? `${latest.discount}%`
                  : null,
              expectedSales: latest ? latest.unitsSold : null,
              wasteReduction: latest ? latest.stockLeft : null,
              confidence: trends[name].confidence,
              trendLabel: trends[name].trendLabel,
              predictedLabel: trends[name].predictedLabel,
              trendScore: trends[name].trendScore,
            };
          });
          res.json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
          });
        });
    });
};
