import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

function generateToken(userId, email) {
  const secret =
    process.env.JWT_SECRET ||
    "proresume_jwt_super_secure_vault_secret_2026_xyz987_production_grade";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId, email }, secret, { expiresIn });
}

// Input sanitization helper
function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.trim();
}

/**
 * @route   POST /api/auth/register
 * @desc    Register new user with name, email, phone, and password
 * @access  Public (Rate-limited)
 */
router.post("/register", authLimiter, async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;

    name = sanitizeString(name);
    email = sanitizeString(email).toLowerCase();
    phone = sanitizeString(phone);

    // Validation
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name is required (minimum 2 characters).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number (7 to 20 characters).",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
    }

    // Create user
    const newUser = new User({
      name,
      email,
      phone,
      password,
      authProvider: "local",
      isPaid: false,
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.email);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully!",
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error("[Register Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register account. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with email and password
 * @access  Public (Rate-limited)
 */
router.post("/login", authLimiter, async (req, res) => {
  try {
    let { email, password } = req.body;

    email = sanitizeString(email).toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        success: false,
        message: "This account was created with Google Sign-In. Please sign in with Google.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    const token = generateToken(user._id, user.email);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("[Login Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed due to a server error. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Sign in or sign up via Google OAuth
 * @access  Public
 */
router.post("/google", authLimiter, async (req, res) => {
  try {
    let { email, name, googleId, avatar } = req.body;

    email = sanitizeString(email).toLowerCase();
    name = sanitizeString(name) || "Google User";
    googleId = sanitizeString(googleId);

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Valid Google credentials (email and ID) required.",
      });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }
      await user.save();
    } else {
      user = new User({
        name,
        email,
        phone: "+91 9999999999", // Default phone for OAuth logins
        googleId,
        authProvider: "google",
        avatar: avatar || "",
        isPaid: false,
      });
      await user.save();
    }

    const token = generateToken(user._id, user.email);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful!",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("[Google Auth Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed. Please try again.",
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile.",
    });
  }
});

export default router;
