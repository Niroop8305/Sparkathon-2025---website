import fs from "fs";
import path from "path";
import csv from "csv-parser";
import nodemailer from "nodemailer";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const notifyTrendingProduct = async () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvPath = path.join(
      process.cwd(),
      "src",
      "uploads",
      "trending_products_final_full_train.csv"
    );

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        if (results.length === 0) return reject(new Error("CSV is empty"));

        // Identify top trending product
        const topProduct = results.reduce((max, curr) =>
          parseFloat(curr["Trend Score"]) > parseFloat(max["Trend Score"]) ? curr : max
        );

        const productName = topProduct["Product Name"];

        // Generate dynamic HTML table rows
        const tableRows = results
          .map((row) => {
            const isTop = row["Product Name"] === productName;
            return `
              <tr style="background-color: ${isTop ? "#fff3cd" : "#ffffff"}; font-weight: ${isTop ? "bold" : "normal"};">
                <td style="padding: 8px; border: 1px solid #ddd;">${row["Product Name"]}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${row["Trend Label"]}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${row["Predicted Label"]}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${parseFloat(row["Trend Score"]).toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${parseFloat(row["Expected Sales"]).toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${row["Confidence (%)"]}</td>
              </tr>
            `;
          })
          .join("");

        // Email HTML template (dynamic)
        const generateHtml = (user) => `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <h2 style="color: #2c3e50;">Hi <span style="color: #2980b9;">${user.name}</span>,</h2>
            <p style="font-size: 16px; color: #333;">
              Here's your daily insight on trending products to help drive your sales strategy.
            </p>

            <div style="margin: 20px 0; padding: 15px; background-color: #d1ecf1; border-left: 6px solid #17a2b8;">
              <strong style="font-size: 18px;">🚀 Top Trending Product:</strong>
              <span style="color: #0c5460; font-weight: bold;">${productName}</span> with a trend score of <strong>${parseFloat(
          topProduct["Trend Score"]
        ).toFixed(2)}</strong> and expected sales of <strong>${parseFloat(
          topProduct["Expected Sales"]
        ).toFixed(2)}</strong> units!
            </div>

            <h3 style="color: #333;">📊 Full Product Trend Report</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff; font-size: 14px;">
              <thead style="background-color: #343a40; color: white;">
                <tr>
                  <th style="padding: 10px; border: 1px solid #ddd;">Product Name</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Trend Label</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Predicted Label</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Trend Score</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Expected Sales</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Confidence (%)</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>

            <p style="color: #6c757d; font-size: 13px; margin-top: 30px;">
              Let’s aim for higher sales today. Stay smart and stay ahead. <br />
              – Walmart Sparkathon Team
            </p>
          </div>
        `;

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Fetch users from DB
        const users = await UserModel.find();

        // Send email to each user
        for (const user of users) {
          await transporter.sendMail({
            from: `"Walmart Sparkathon" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "📈 Today's Trending Products Report",
            html: generateHtml(user),
          });
        }

        resolve();
      })
      .on("error", (err) => reject(err));
  });
};
