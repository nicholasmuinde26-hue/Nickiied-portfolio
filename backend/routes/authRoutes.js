import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const getJWT = () => process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email ||!password) return res.status(400).json({ msg: "Email and password required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, getJWT(), { expiresIn: JWT_EXPIRES });
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  res.json({ admin: req.admin });
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (newPassword.length < 6) return res.status(400).json({ msg: "Min 6 chars" });
    const admin = await Admin.findById(req.admin._id).select("+password");
    const ok = await bcrypt.compare(currentPassword, admin.password);
    if (!ok) return res.status(401).json({ msg: "Current password incorrect" });
    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ msg: "Password changed" });
  } catch { res.status(500).json({ msg: "Failed" }) }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.admin._id.toString() === req.params.id) return res.status(400).json({ msg: "Cannot delete yourself" });
    if (await Admin.countDocuments() <= 1) return res.status(400).json({ msg: "Cannot delete last admin" });
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch { res.status(500).json({ msg: "Failed" }) }
});

export default router;