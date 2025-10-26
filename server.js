import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
