import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import journalRoutes from "./routes/journal.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/stats", statsRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
