// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import cors from "cors"; // Import CORS
import { mkdir } from "fs/promises";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Enable CORS for frontend on http://localhost:3000
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Enable sending cookies or authentication headers
  })
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist

try {
  await mkdir(path.join(__dirname, "uploads/candidates"), { recursive: true });
} catch (error) {
  console.error("Error creating uploads directory:", error);
}

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/votes", voteRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
