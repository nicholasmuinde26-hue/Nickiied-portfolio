import express from "express";
import Content from "../models/Content.js";
import { authMiddleware } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// helper to parse env arrays
const parseEnv = (key) => {
  try { return JSON.parse(process.env[key] || '[]') } catch { return [] }
}

// GET content (public)
router.get("/", async (req, res) => {
  try {
    let content = await Content.findOne({});

    if (!content) {
      // SEED FROM.ENV ON FIRST LOAD
      content = await Content.create({
        hero: {
          name: process.env.VITE_NAME || "",
          bio: process.env.VITE_QUOTE || "",
          ctaText: process.env.VITE_CTA_TEXT || "View my work",
          greeting: process.env.VITE_GREETING || "Hi, I'm",
          roles: [process.env.VITE_ROLE_1, process.env.VITE_ROLE_2, process.env.VITE_ROLE_3, process.env.VITE_ROLE_4].filter(Boolean),
          profilePhoto: process.env.VITE_PROFILE_PHOTO || ""
        },
        about: {
          title: "About Me",
          subtitle: process.env.VITE_ABOUT_SUBTITLE || "Developer & Security Enthusiast",
          description: process.env.VITE_ABOUT || "",
          skills: parseEnv("VITE_SKILLS"),
          tools: parseEnv("VITE_TOOLS"),
          aboutPhoto: process.env.VITE_ABOUT_PHOTO || ""
        },
        nav: {
          logo: process.env.VITE_LOGO || ""
        },
        social: {
          email: process.env.VITE_EMAIL || "",
          github: process.env.VITE_GITHUB || "",
          linkedin: process.env.VITE_LINKEDIN || "",
          tiktok: process.env.VITE_TIKTOK || ""
        },
        services: parseEnv("VITE_SERVICES") || [
          {
            title: "Web Development",
            tag: "Popular",
            desc: "Modern responsive websites and web apps",
            features: ["React", "Node.js", "Tailwind CSS"]
          }
        ]
      });
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to get content" });
  }
});

// PUT update content (protected) - FIXED
router.put("/", authMiddleware, async (req, res) => {
  try {
    const body = req.body;
    let content = await Content.findOne({});
    if (!content) {
      content = await Content.create(body);
      return res.json(content);
    }

    // Use.set() so mongoose tracks nested object/array changes
    content.set({
      hero: body.hero,
      about: body.about,
      nav: body.nav,
      social: body.social,
      services: body.services,
    });

    // Force mark these as modified. This is the key for arrays of objects
    content.markModified('hero');
    content.markModified('about');
    content.markModified('nav');
    content.markModified('social');
    content.markModified('services');

    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to save content" });
  }
});

export default router;