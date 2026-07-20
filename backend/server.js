import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import bcrypt from "bcrypt"; // ADDED
import rateLimit from "express-rate-limit"; // ADDED

dotenv.config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import Admin from "./models/Admin.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET not set. Exiting.");
  process.exit(1);
}

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));

// CORS - allow Netlify + localhost
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://nickiiedtech.netlify.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// IMPORTANT: Make uploads public so Netlify can load images
app.use("/uploads", express.static(uploadDir));

// Rate limiter for contact form
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: "Too many requests, try again later" });

// Routes - moved outside so they load even if mongo is slow
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactLimiter, contactRoutes); // added limiter here
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.send("Nickiied Portfolio API ✅"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

const MONGO = process.env.MONGO_URL || "mongodb://localhost:27017/nickiied_portfolio";
mongoose.connect(MONGO)
  .then(async () => {
    console.log("MongoDB connected ✅");

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await Admin.create({ email: process.env.ADMIN_EMAIL.toLowerCase().trim(), password: hash });
      console.log(`Default admin created: ${process.env.ADMIN_EMAIL}`);
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  })
  .catch(err => { console.error("Mongo error:", err); process.exit(1); });