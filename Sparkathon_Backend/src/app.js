import express from "express";
import cors from "cors";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample data - in production, this would come from your ML model
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

const sampleMarketingData = [
  {
    product: "Organic Avocados",
    channels: [
      { name: "Social Media", effectiveness: 87, cost: "$2,340", roi: "312%" },
      { name: "Email Marketing", effectiveness: 72, cost: "$890", roi: "245%" },
      {
        name: "In-Store Display",
        effectiveness: 91,
        cost: "$1,200",
        roi: "387%",
      },
      { name: "Digital Ads", effectiveness: 68, cost: "$3,450", roi: "198%" },
    ],
    optimalMessage: "Fresh, healthy, and sustainably sourced",
  },
  {
    product: "Greek Yogurt",
    channels: [
      { name: "Social Media", effectiveness: 78, cost: "$1,890", roi: "267%" },
      { name: "Email Marketing", effectiveness: 84, cost: "$650", roi: "289%" },
      {
        name: "In-Store Display",
        effectiveness: 76,
        cost: "$980",
        roi: "234%",
      },
      { name: "Digital Ads", effectiveness: 82, cost: "$2,100", roi: "278%" },
    ],
    optimalMessage: "High protein, low sugar, perfect for active lifestyles",
  },
];

// API Routes

// app.get("/api/products", (req, res) => {
//   res.json({
//     success: true,
//     data: sampleTrendingProducts,
//     timestamp: new Date().toISOString(),
//   });
// });

app.get("/api/products", (req, res) => {
  const results = [];

  fs.createReadStream(path.join(__dirname, "submission.csv")) // Your ML output file
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
      // Here we just aggregate data and mock-enrich it
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
            name: `Department ${dept.departmentId}`, // Mock name
            category: "General", // You can enrich this manually later
            trendScore: Math.round((avgSales % 100) + 50), // Mock trend score
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
        data: responseData.slice(0, 10), // Send only top 10 items
        timestamp: new Date().toISOString(),
      });
    });
});

app.get("/api/pricing", (req, res) => {
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
});

app.get("/api/marketing", (req, res) => {
  res.json({
    success: true,
    data: sampleMarketingData,
    timestamp: new Date().toISOString(),
  });
});

// CSV upload endpoint for ML model data
app.post("/api/upload-csv", async (req, res) => {
  try {
    // This would handle CSV file uploads from your ML model
    res.json({
      success: true,
      message: "CSV data processed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
