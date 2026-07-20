import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const getJWT = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return secret;
}

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, getJWT());
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ msg: "Invalid token" });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
}