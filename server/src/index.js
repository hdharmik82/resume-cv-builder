import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";
import supportRoutes from "./routes/support.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet with tailored CSP allowing Razorpay checkout
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
        ],
        frameSrc: ["'self'", "https://api.razorpay.com"],
        connectSrc: [
          "'self'",
          "https://api.razorpay.com",
          "https://lumberjack.razorpay.com",
        ],
        imgSrc: ["'self'", "data:", "https://*"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing (Supports Localhost, Custom Domains & Vercel Preview Deployments)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// JSON Parser with strict payload limit to prevent DoS
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// General Rate Limiting
app.use("/api", apiLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ProResume Studio Backend API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);

// 404 Handler for undefined API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`,
  });
});

// Global Centralized Error Handling Middleware (Sanitized against leakage)
app.use((err, req, res, next) => {
  console.error("[Unhandled Server Error]:", err?.message || err);
  const isDev = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    success: false,
    message: isDev
      ? err.message || "An internal server error occurred."
      : "An unexpected error occurred. Please try again later.",
    ...(isDev && { stack: err.stack }),
  });
});


// Connect to MongoDB & Start Server
async function startServer() {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[ProResume Server] Running on http://0.0.0.0:${PORT} in ${
        process.env.NODE_ENV || "development"
      } mode`
    );
  });
}

startServer();
