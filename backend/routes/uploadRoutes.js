import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

export default router;