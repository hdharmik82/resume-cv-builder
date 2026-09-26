import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { getDbStatus } from "../config/db.js";
import { seedInitialDataIfNeeded } from "../utils/seedData.js";

const router = express.Router();

// All routes require Authentication AND Admin Role (only Super Admin can manage users)
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/overview
 * @desc    Get dashboard metrics, revenue, download stats, and system status
 * @access  Private (Admin Only)
 */
router.get("/overview", async (req, res) => {
  try {
    // User counts
    const totalUsers = await User.countDocuments();
    const paidUsers = await User.countDocuments({ isPaid: true });
    const freeUsers = Math.max(0, totalUsers - paidUsers);
    const adminUsers = await User.countDocuments({ role: "admin" });

    // Download counts
    const downloadAggregation = await User.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: "$downloadCount" } } },
    ]);
    const totalDownloads =
      downloadAggregation.length > 0 ? downloadAggregation[0].totalDownloads : 0;

    // Payments & Revenue
    const totalTransactions = await Payment.countDocuments();
    const capturedTransactions = await Payment.countDocuments({
      status: "captured",
    });
    const failedTransactions = await Payment.countDocuments({
      status: "failed",
    });

    const revenueAggregation = await Payment.aggregate([
      { $match: { status: "captured" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue =
      revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Conversion rate
    const conversionRate =
      totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0.0";

    // Recent 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    // Recent 5 payments
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // System Diagnostics
    const db = getDbStatus();
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
    const isMockGateway =
      !razorpayKeyId || razorpayKeyId.includes("mock") || razorpayKeyId.includes("test_your");

    const system = {
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      dbStatus: db,
      paymentGateway: {
        mode: isMockGateway ? "Sandbox / Simulation Mode" : "Live Razorpay Gateway",
        keyConfigured: Boolean(razorpayKeyId && !razorpayKeyId.includes("your")),
      },
    };

    return res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        paidUsers,
        freeUsers,
        adminUsers,
        totalDownloads,
        totalRevenue,
        totalTransactions,
        capturedTransactions,
        failedTransactions,
        conversionRate,
      },
      recentUsers,
      recentPayments,
      system,
    });
  } catch (error) {
    console.error("[Admin Overview Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard metrics.",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get paginated, searchable, and filtered list of users
 * @access  Private (Admin Only)
 */
router.get("/users", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const search = (req.query.search || "").trim();
    const filter = req.query.filter || "all"; // 'all', 'paid', 'free', 'admin'
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build query conditions
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "paid") {
      query.isPaid = true;
    } else if (filter === "free") {
      query.isPaid = false;
    } else if (filter === "admin") {
      query.role = "admin";
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password");

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[Admin Users Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user from Admin Panel
 * @access  Private (Admin Only)
 */
router.post("/users", async (req, res) => {
  try {
    let { name, email, phone, password, role, isPaid } = req.body;

    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    phone = (phone || "").trim();

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
        message: "Valid email address required.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile phone number required.",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email address already exists.",
      });
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      role: role === "admin" ? "admin" : "user",
      isPaid: Boolean(isPaid),
      paidAt: isPaid ? new Date() : null,
      authProvider: "local",
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("[Admin Create User Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create user.",
    });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user details + their payment history
 * @access  Private (Admin Only)
 */
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const payments = await Payment.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      user,
      payments,
    });
  } catch (error) {
    console.error("[Admin Get User Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details.",
    });
  }
});

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Update user attributes (name, email, phone, role, isPaid, downloadCount)
 * @access  Private (Admin Only)
 */
router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const { name, email, phone, role, isPaid, downloadCount } = req.body;

    // Prevent demoting the last admin or demoting oneself accidentally
    if (role && role !== user.role) {
      if (
        user._id.toString() === req.user._id.toString() &&
        role !== "admin"
      ) {
        return res.status(400).json({
          success: false,
          message: "You cannot revoke your own administrator privileges.",
        });
      }

      if (user.role === "admin" && role === "user") {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "Cannot demote the only remaining administrator.",
          });
        }
      }
      user.role = role;
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phone) user.phone = phone.trim();

    if (typeof isPaid === "boolean") {
      user.isPaid = isPaid;
      if (isPaid && !user.paidAt) {
        user.paidAt = new Date();
      } else if (!isPaid) {
        user.paidAt = null;
      }
    }

    if (typeof downloadCount === "number" && downloadCount >= 0) {
      user.downloadCount = downloadCount;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("[Admin Update User Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user.",
    });
  }
});

/**
 * @route   POST /api/admin/users/:id/reset-password
 * @desc    Reset password for a user
 * @access  Private (Admin Only)
 */
router.post("/users/:id/reset-password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Password for ${user.email} updated successfully.`,
    });
  } catch (error) {
    console.error("[Admin Reset Password Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset user password.",
    });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user account
 * @access  Private (Admin Only)
 */
router.delete("/users/:id", async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own logged-in administrator account.",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Delete associated payments
    await Payment.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `User ${user.email} and associated records deleted.`,
    });
  } catch (error) {
    console.error("[Admin Delete User Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
});

/**
 * @route   GET /api/admin/payments
 * @desc    Get paginated, searchable payments list
 * @access  Private (Admin Only)
 */
router.get("/payments", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const search = (req.query.search || "").trim();
    const status = req.query.status || "all";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const query = {};

    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: "i" } },
        { razorpayOrderId: { $regex: search, $options: "i" } },
        { razorpayPaymentId: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[Admin Payments Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions.",
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/admin/payments/:id
 * @desc    Update payment status
 * @access  Private (Admin Only)
 */
router.patch("/payments/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["created", "authorized", "captured", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    payment.status = status;
    await payment.save();

    // If marked captured, update user
    if (status === "captured" && payment.userId) {
      const user = await User.findById(payment.userId);
      if (user) {
        user.isPaid = true;
        if (!user.paidAt) user.paidAt = new Date();
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated.",
      payment,
    });
  } catch (error) {
    console.error("[Admin Update Payment Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment record.",
    });
  }
});

/**
 * @route   POST /api/admin/payments/manual
 * @desc    Record a manual/offline payment and activate user pass
 * @access  Private (Admin Only)
 */
router.post("/payments/manual", async (req, res) => {
  try {
    const { email, amount = 99, notes = "Manual Admin Grant" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with the provided email address.",
      });
    }

    const manualOrderId = `order_manual_${crypto.randomBytes(6).toString("hex")}`;
    const manualPaymentId = `pay_manual_${crypto.randomBytes(6).toString("hex")}`;

    const payment = new Payment({
      userId: user._id,
      userEmail: user.email,
      amount: Number(amount) || 99,
      currency: "INR",
      razorpayOrderId: manualOrderId,
      razorpayPaymentId: manualPaymentId,
      razorpaySignature: "manual_admin_verified",
      status: "captured",
      itemDescription: `ProResume Studio - Vector PDF Download Pass (₹${amount}) [Manual Entry]`,
      metadata: { notes, grantedBy: req.user.email },
    });

    await payment.save();

    user.isPaid = true;
    user.paidAt = new Date();
    user.razorpayOrderId = manualOrderId;
    user.razorpayPaymentId = manualPaymentId;
    await user.save();

    return res.status(201).json({
      success: true,
      message: `Manual payment of ₹${amount} recorded and lifetime pass granted to ${user.email}.`,
      payment,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("[Admin Manual Payment Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record manual payment.",
    });
  }
});

/**
 * @route   GET /api/admin/export/users
 * @desc    Export all users as CSV format
 * @access  Private (Admin Only)
 */
router.get("/export/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const header = "ID,Name,Email,Phone,Role,IsPaid,PaidAt,Downloads,AuthProvider,CreatedAt\n";
    const rows = users.map((u) => {
      const escape = (val) => `"${String(val || "").replace(/"/g, '""')}"`;
      return [
        u._id,
        escape(u.name),
        escape(u.email),
        escape(u.phone),
        u.role,
        u.isPaid ? "YES" : "NO",
        u.paidAt ? u.paidAt.toISOString() : "",
        u.downloadCount || 0,
        u.authProvider || "local",
        u.createdAt ? u.createdAt.toISOString() : "",
      ].join(",");
    });

    const csv = header + rows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="proresume_users.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Export failed." });
  }
});

/**
 * @route   GET /api/admin/export/payments
 * @desc    Export all transactions as CSV format
 * @access  Private (Admin Only)
 */
router.get("/export/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    const header = "ID,UserEmail,AmountINR,Status,RazorpayOrderId,RazorpayPaymentId,CreatedAt\n";
    const rows = payments.map((p) => {
      const escape = (val) => `"${String(val || "").replace(/"/g, '""')}"`;
      return [
        p._id,
        escape(p.userEmail),
        p.amount,
        p.status,
        escape(p.razorpayOrderId),
        escape(p.razorpayPaymentId),
        p.createdAt ? p.createdAt.toISOString() : "",
      ].join(",");
    });

    const csv = header + rows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="proresume_payments.csv"'
    );
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Export failed." });
  }
});

/**
 * @route   POST /api/admin/seed-demo
 * @desc    Trigger mock seed generation on demand
 * @access  Private (Admin Only)
 */
router.post("/seed-demo", async (req, res) => {
  try {
    await seedInitialDataIfNeeded();
    return res.status(200).json({
      success: true,
      message: "Database seed operation executed.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to trigger seed.",
      error: error.message,
    });
  }
});

export default router;
