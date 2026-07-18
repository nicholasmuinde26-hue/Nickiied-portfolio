import express from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;