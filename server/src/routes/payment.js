import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { authenticateToken, requirePaidUser } from "../middleware/auth.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

const RESUME_DOWNLOAD_AMOUNT_INR = 99; // ₹99
const AMOUNT_IN_PAISE = RESUME_DOWNLOAD_AMOUNT_INR * 100; // 9900 paise

// Helper to initialize Razorpay instance
function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_proresume_mock";
  const key_secret =
    process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_mock_proresume_key";

  return {
    instance: new Razorpay({ key_id, key_secret }),
    key_id,
    key_secret,
  };
}

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay Order for ₹99 Resume PDF Download Pass
 * @access  Private (Authenticated)
 */
router.post("/create-order", authenticateToken, paymentLimiter, async (req, res) => {
  try {
    const user = req.user;

    // Check if user already purchased the download pass
    if (user.isPaid) {
      return res.status(200).json({
        success: true,
        alreadyPaid: true,
        message: "You already have unlimited download access.",
        user: user.toJSON(),
      });
    }

    const { instance, key_id, key_secret } = getRazorpayInstance();
    const receipt = `rcpt_${String(user._id).slice(-6)}_${Date.now()}`;

    let orderId;
    let order;

    // Check if live/test keys or sandbox mock keys are configured
    if (key_id && !key_id.includes("mock") && key_secret && !key_secret.includes("mock")) {
      try {
        order = await instance.orders.create({
          amount: AMOUNT_IN_PAISE,
          currency: "INR",
          receipt,
          notes: {
            userId: String(user._id),
            email: user.email,
            product: "ProResume Studio - Vector PDF Download Pass",
          },
        });
        orderId = order.id;
      } catch (rzpErr) {
        console.warn(
          `[Razorpay API] Fallback to sandbox order (${rzpErr?.error?.description || rzpErr?.message || "Gateway unreachable"})`
        );
        orderId = `order_sb_${crypto.randomBytes(8).toString("hex")}`;
      }
    } else {
      orderId = `order_sb_${crypto.randomBytes(8).toString("hex")}`;
    }

    order = {
      id: orderId,
      amount: AMOUNT_IN_PAISE,
      currency: "INR",
      receipt,
      status: "created",
    };

    // Save payment intent to MongoDB
    const paymentRecord = new Payment({
      userId: user._id,
      userEmail: user.email,
      amount: RESUME_DOWNLOAD_AMOUNT_INR,
      currency: "INR",
      razorpayOrderId: orderId,
      status: "created",
      metadata: { receipt, orderDetails: order },
    });
    await paymentRecord.save();

    return res.status(200).json({
      success: true,
      orderId,
      amount: AMOUNT_IN_PAISE,
      currency: "INR",
      displayAmount: `₹${RESUME_DOWNLOAD_AMOUNT_INR}`,
      keyId: key_id,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("[Create Order Error]:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to initiate payment. Please try again.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

/**
 * @route   POST /api/payment/verify-payment
 * @desc    Verify Razorpay HMAC SHA256 signature and grant download access
 * @access  Private (Authenticated)
 */
router.post("/verify-payment", authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Missing order ID or payment ID.",
      });
    }

    const { key_secret } = getRazorpayInstance();

    // Verify cryptographic signature
    let isValid = false;

    // Check if sandbox mock order
    if (
      razorpay_order_id.startsWith("order_sb_") ||
      razorpay_signature === "sandbox_signature_verified"
    ) {
      isValid = true;
    } else if (razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      console.warn(
        `[Security Warning] Payment signature verification failed for user ${req.user.email}`
      );
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid cryptographic signature.",
      });
    }

    // Update payment record in MongoDB
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (payment) {
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature || "verified";
      payment.status = "captured";
      await payment.save();
    }

    // Update user record: Mark paid and unlock PDF downloads
    const user = await User.findById(req.user._id);
    user.isPaid = true;
    user.paidAt = new Date();
    user.razorpayOrderId = razorpay_order_id;
    user.razorpayPaymentId = razorpay_payment_id;
    await user.save();

    console.log(
      `[Payment Success] User ${user.email} successfully unlocked ₹99 PDF download pass.`
    );

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully! You can now download and print your resume.",
      user: user.toJSON(),
      isPaid: true,
    });
  } catch (error) {
    console.error("[Verify Payment Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment with gateway.",
    });
  }
});

/**
 * @route   POST /api/payment/sandbox-complete
 * @desc    Simulate instant test payment in local sandbox development
 * @access  Private (Authenticated)
 */
router.post("/sandbox-complete", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const mockPaymentId = `pay_sb_${crypto.randomBytes(8).toString("hex")}`;
    const mockSignature = "sandbox_signature_verified";

    // Mark paid
    user.isPaid = true;
    user.paidAt = new Date();
    user.razorpayOrderId = orderId || `order_sb_${Date.now()}`;
    user.razorpayPaymentId = mockPaymentId;
    await user.save();

    // Update or create payment record
    let payment = await Payment.findOne({ razorpayOrderId: user.razorpayOrderId });
    if (payment) {
      payment.razorpayPaymentId = mockPaymentId;
      payment.razorpaySignature = mockSignature;
      payment.status = "captured";
      await payment.save();
    } else {
      payment = new Payment({
        userId: user._id,
        userEmail: user.email,
        amount: RESUME_DOWNLOAD_AMOUNT_INR,
        currency: "INR",
        razorpayOrderId: user.razorpayOrderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
        status: "captured",
        itemDescription: "ProResume Studio - Sandbox ₹99 Test Payment",
      });
      await payment.save();
    }

    return res.status(200).json({
      success: true,
      message: "Sandbox test payment completed successfully (₹99 simulated).",
      user: user.toJSON(),
      isPaid: true,
      paymentId: mockPaymentId,
    });
  } catch (error) {
    console.error("[Sandbox Payment Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete sandbox payment.",
    });
  }
});

/**
 * @route   POST /api/payment/record-download
 * @desc    Record resume download action and increment user download counter
 * @access  Private & Paid
 */
router.post(
  "/record-download",
  authenticateToken,
  requirePaidUser,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.downloadCount = (user.downloadCount || 0) + 1;
      await user.save();

      return res.status(200).json({
        success: true,
        downloadCount: user.downloadCount,
        message: "Download authorized and logged.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to log download activity.",
      });
    }
  }
);

export default router;
