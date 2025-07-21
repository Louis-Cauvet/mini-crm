import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import clientRoutes from "./routes/clients";
import articleRoutes from "./routes/articles";
import orderRoutes from "./routes/orders";
import authRoutes from "./routes/auth";
import { auth } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Important pour les cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mini-crm")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes publiques (auth)
app.use("/api/auth", authRoutes);

// Routes protégées
app.use("/api/clients", auth, clientRoutes);
app.use("/api/articles", auth, articleRoutes);
app.use("/api/orders", auth, orderRoutes);

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
