import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ msg: "No token" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(payload.id).select("-password");
    if (!admin) return res.status(401).json({ msg: "Invalid token" });
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
