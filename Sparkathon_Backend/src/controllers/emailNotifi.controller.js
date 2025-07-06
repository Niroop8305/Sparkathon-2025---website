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
        // Find top trending product by Trend Score
        const topProduct = results.reduce((max, curr) =>
          parseFloat(curr["Trend Score"]) > parseFloat(max["Trend Score"]) ? curr : max
        );
        const productName = topProduct["Product Name"];

        // Fetch all users
        const users = await UserModel.find();

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Send email to each user
        for (const user of users) {
          await transporter.sendMail({
            from: `"Walmart Sparkathon" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Today's Top Trending Product!",
            text: `Hi ${user.name}, today the may be the best selling product will be ${productName} so make sure to increase your sales today. Thank you!`,
          });
        }
        resolve();
      })
      .on("error", (err) => reject(err));
  });
};