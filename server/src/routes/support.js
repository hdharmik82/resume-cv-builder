import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SupportTicket } from "../models/SupportTicket.js";
import { User } from "../models/User.js";
import { supportLimiter } from "../middleware/rateLimiter.js";
import { sanitizeString, isValidEmail } from "../utils/sanitize.js";

const router = express.Router();

/**
 * Helper to optionally extract authenticated user from token without blocking guests
 */
async function getOptionalUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    const secret =
      process.env.JWT_SECRET ||
      "proresume_jwt_super_secure_vault_secret_2026_xyz987_production_grade";
    const decoded = jwt.verify(token, secret);
    if (!decoded?.userId) return null;
    return await User.findById(decoded.userId).select("-password");
  } catch {
    return null;
  }
}

/**
 * @route   POST /api/support/ticket
 * @desc    Submit a user support ticket for login, payment, export, or builder issues
 * @access  Public (Rate-limited)
 */
router.post("/ticket", supportLimiter, async (req, res) => {
  try {
    let { name, email, category, subject, message, pageUrl } = req.body;

    // Sanitize string inputs to neutralize injection & XSS
    name = sanitizeString(name, 100);
    email = sanitizeString(email, 150).toLowerCase();
    category = sanitizeString(category, 50).toLowerCase();
    subject = sanitizeString(subject, 200);
    message = sanitizeString(message, 3000);
    pageUrl = sanitizeString(pageUrl, 250);

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address so we can respond to your request.",
      });
    }

    // Validate category
    const validCategories = ["payment", "login", "export", "builder", "other"];
    if (!validCategories.includes(category)) {
      category = "other";
    }

    // Validate message
    if (!message || message.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a brief description of the issue you are facing (minimum 5 characters).",
      });
    }

    // Set smart priority based on issue severity
    let priority = "medium";
    if (category === "payment") {
      priority = "high";
    } else if (category === "login" || category === "export") {
      priority = "medium";
    }

    // Attempt to link authenticated user if session exists
    const user = await getOptionalUser(req);
    let userId = null;
    let userRole = "guest";

    if (user) {
      userId = user._id;
      userRole = user.role === "admin" ? "admin" : user.isPaid ? "paid_user" : "free_user";
      if (!name) name = user.name;
    }

    // Generate unique, collision-resistant human-readable ticket ID
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const timestampPart = Date.now().toString().slice(-4);
    const ticketId = `SUP-${timestampPart}-${randomHex}`;

    // Clean user agent for diagnostics without storing full IP
    const userAgent = sanitizeString(req.headers["user-agent"] || "", 250);

    const ticket = new SupportTicket({
      ticketId,
      name: name || "Candidate",
      email,
      category,
      subject: subject || `${category.toUpperCase()} Inquiry`,
      message,
      priority,
      status: "open",
      userId,
      userRole,
      pageUrl,
      userAgent,
    });

    await ticket.save();

    return res.status(201).json({
      success: true,
      ticketId,
      message: "Your support request has been submitted successfully! Our team will contact you shortly.",
    });
  } catch (error) {
    console.error("[Support Ticket Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit support ticket at this time. Please try again in a few moments.",
    });
  }
});

export default router;
