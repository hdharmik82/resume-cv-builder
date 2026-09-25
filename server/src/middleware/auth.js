import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "proresume_jwt_super_secure_vault_secret_2026_xyz987_production_grade";

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again.",
        });
      }
      return res.status(403).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[Auth Middleware Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Internal authentication error.",
    });
  }
}

// Middleware to ensure user has completed the ₹99 download payment
export function requirePaidUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!req.user.isPaid) {
    return res.status(402).json({
      success: false,
      code: "PAYMENT_REQUIRED",
      message:
        "One-time payment of ₹99 is required to download and print vector resumes.",
      amount: 99,
      currency: "INR",
    });
  }

  next();
}
