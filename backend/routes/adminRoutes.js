import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// Register - DISABLE IN PRODUCTION after first admin is created
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });
    if (password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters" });

    const exists = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 12); // 12 is safer than 10
    const admin = await Admin.create({ email: email.toLowerCase().trim(), password: hash });
    res.status(201).json({ msg: "Admin created", id: admin._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Registration failed" });
  }
});

// Login -> returns JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, admin: { id: admin._id, email: admin.email } }); // also return admin info
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login failed" });
  }
});

// Get current admin (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({ admin: req.admin });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ msg: "Failed to fetch admin" });
  }
});

// Change password (protected)
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ msg: "Both passwords required" });
    if (newPassword.length < 6) return res.status(400).json({ msg: "New password must be at least 6 characters" });

    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const ok = await bcrypt.compare(currentPassword, admin.password);
    if (!ok) return res.status(401).json({ msg: "Current password incorrect" });

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Failed to change password" });
  }
});

// Delete admin (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.admin._id.toString() === id) return res.status(400).json({ msg: "Cannot delete yourself" });
    
    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) return res.status(400).json({ msg: "Cannot delete last admin" }); // safety

    await Admin.findByIdAndDelete(id);
    res.json({ msg: "Admin deleted" });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ msg: "Failed to delete admin" });
  }
});

export default router;