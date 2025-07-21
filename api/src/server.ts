import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import clientRoutes from "./routes/clients";
import articleRoutes from "./routes/articles";
import orderRoutes from "./routes/orders";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mini-crm")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Mini CRM API is running" });
});

// 404 handler for all other routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
