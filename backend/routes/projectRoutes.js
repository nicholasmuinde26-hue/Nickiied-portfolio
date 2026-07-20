import express from "express";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET all projects - PUBLIC
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) { 
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch projects" }) 
  }
});

// CREATE project - PROTECTED
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { 
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to create project" }) 
  }
});

// UPDATE project - PROTECTED
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) { 
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to update project" }) 
  }
});

// DELETE project - PROTECTED
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { 
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to delete project" }) 
  }
});

export default router;