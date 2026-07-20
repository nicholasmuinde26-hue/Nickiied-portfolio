import express from "express";
import Content from "../models/Content.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET public
router.get("/", async (req, res) => {
  try {
    let content = await Content.findOne({});
    if (!content) content = await Content.create({});
    res.json(content);
  } catch { res.status(500).json({ msg: "Failed to get content" }) }
});
// PUT protected - FULL OVERWRITE - FIXED
router.put("/", authMiddleware, async (req, res) => {
  try {
    // Always get the 1 and only content doc
    let content = await Content.findOne({});

    if (!content) {
      // If none exists, create new
      content = new Content(req.body);
    } else {
      // If exists, overwrite it but keep the same _id
      content.set(req.body);
    }
    
    await content.save();
    res.json(content);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ msg: "Failed to save content" }) 
  }
});


export default router;