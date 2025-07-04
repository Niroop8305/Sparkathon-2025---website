// src/controllers/product.controller.js
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data for /api/pricing
const sampleTrendingProducts = [
  {
    id: 1,
    name: "Organic Avocados",
    category: "Produce",
    trendScore: 92,
    predictedDemand: "High",
    currentPrice: 2.99,
    optimalPrice: 3.49,
    priceChange: "+16.7%",
    expectedSales: 2847,
    wasteReduction: "23%",
    confidence: 87,
  },
  {
    id: 2,
    name: "Greek Yogurt",
    category: "Dairy",
    trendScore: 88,
    predictedDemand: "High",
    currentPrice: 4.99,
    optimalPrice: 5.29,
    priceChange: "+6.0%",
    expectedSales: 1923,
    wasteReduction: "18%",
    confidence: 82,
  },
  {
    id: 3,
    name: "Fresh Salmon",
    category: "Seafood",
    trendScore: 79,
    predictedDemand: "Medium-High",
    currentPrice: 12.99,
    optimalPrice: 11.99,
    priceChange: "-7.7%",
    expectedSales: 1456,
    wasteReduction: "31%",
    confidence: 76,
  },
  {
    id: 4,
    name: "Quinoa Bowls",
    category: "Prepared Foods",
    trendScore: 74,
    predictedDemand: "Medium",
    currentPrice: 8.99,
    optimalPrice: 9.49,
    priceChange: "+5.6%",
    expectedSales: 892,
    wasteReduction: "15%",
    confidence: 71,
  },
];

export const getProducts = (req, res) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, "../uploads/submission.csv"))
    .pipe(csv())
    .on("data", (row) => {
      const [store, department, date] = row["Id"].split("_");
      results.push({
        storeId: parseInt(store),
        departmentId: parseInt(department),
        date,
        weeklySales: parseFloat(row["Weekly_Sales"]),
      });
    })
    .on("end", () => {
      const departmentSalesMap = {};
      for (const item of results) {
        const key = item.departmentId;
        if (!departmentSalesMap[key]) {
          departmentSalesMap[key] = {
            departmentId: key,
            totalSales: 0,
            count: 0,
          };
        }
        departmentSalesMap[key].totalSales += item.weeklySales;
        departmentSalesMap[key].count += 1;
      }
      const responseData = Object.values(departmentSalesMap).map(
        (dept, index) => {
          const avgSales = dept.totalSales / dept.count;
          return {
            id: index + 1,
            name: `Department ${dept.departmentId}`,
            category: "General",
            trendScore: Math.round((avgSales % 100) + 50),
            predictedDemand:
              avgSales > 10000
                ? "High"
                : avgSales > 5000
                ? "Medium-High"
                : "Medium",
            currentPrice: parseFloat((Math.random() * 10 + 1).toFixed(2)),
            optimalPrice: parseFloat((Math.random() * 10 + 2).toFixed(2)),
            priceChange: `${(Math.random() * 20 - 10).toFixed(1)}%`,
            expectedSales: Math.round(avgSales),
            wasteReduction: `${Math.floor(Math.random() * 25) + 10}%`,
            confidence: Math.floor(Math.random() * 20) + 75,
          };
        }
      );
      res.json({
        success: true,
        data: responseData.slice(0, 10),
        timestamp: new Date().toISOString(),
      });
    });
};

export const getPricing = (req, res) => {
  const pricingData = sampleTrendingProducts.map((product) => ({
    id: product.id,
    name: product.name,
    currentPrice: product.currentPrice,
    optimalPrice: product.optimalPrice,
    priceChange: product.priceChange,
    expectedSales: product.expectedSales,
    wasteReduction: product.wasteReduction,
    confidence: product.confidence,
  }));
  res.json({
    success: true,
    data: pricingData,
    timestamp: new Date().toISOString(),
  });
};
