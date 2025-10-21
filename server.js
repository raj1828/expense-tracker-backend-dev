import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Sample route for testing
app.get("/", (req, res) => {
       res.send("Expense Tracker Backend is Running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
