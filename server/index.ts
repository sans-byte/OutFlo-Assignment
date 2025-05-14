import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaignRoutes";
import messageRoutes from "./routes/messageRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/outflo";

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://out-flo-assignment-six.vercel.app",
      "http://out-flo-assignment-six.vercel.app",
      "https://localhost:5173",
      "http://127.0.0.1:5173",
      "https://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/personalized-message", messageRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
