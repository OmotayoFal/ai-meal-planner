import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./backend/routes/auth.js";
import mealPlanRouter from "./backend/routes/mealplan.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Connecting to MongoDB:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.use("/api/auth", authRouter);
    app.use("/api/mealplan", mealPlanRouter);
    app.get("/", (req, res) => res.send("Server running ✅"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});