import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middleware/auth.js";
import Project from "../models/Project.js";

const router = express.Router();

// Make sure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Only images allowed"), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET all projects (public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
});

// POST create project (protected)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const body = req.body;
    const tech = body.tech ? JSON.parse(body.tech) : [];

    if (!req.file && !body.image) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : body.image;

    const project = await Project.create({
      title: body.title,
      description: body.description,
      alt: body.alt || body.title, // for accessibility
      tech,
      link: body.link || "",
      github: body.github || "",
      image,
      order: Number(body.order) || 0
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create project" });
  }
});

// PUT update project (protected)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    
    // parse tech safely
    let tech;
    if (body.tech) {
      try { tech = JSON.parse(body.tech) } catch { tech = body.tech.split(",") }
    }

    const update = {};
    if (body.title) update.title = body.title;
    if (body.description) update.description = body.description;
    if (body.alt) update.alt = body.alt;
    if (typeof tech !== "undefined") update.tech = tech;
    if (body.link !== undefined) update.link = body.link; // allow empty string
    if (body.github !== undefined) update.github = body.github; // allow empty string
    if (body.order !== undefined) update.order = Number(body.order);
    
    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    }

    const project = await Project.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ msg: "Project not found" });
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update project" });
  }
});

// DELETE project (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete" });
  }
});

export default router;