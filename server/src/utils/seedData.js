import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";

export async function seedInitialDataIfNeeded() {
  try {
    const defaultAdminEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@proresume.com").trim().toLowerCase();
    const defaultAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "adminpassword123";

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      // Check if at least one admin exists
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount === 0) {
        console.log("[Seed] No admin found, ensuring default admin exists...");
        await User.create({
          name: "System Administrator",
          email: defaultAdminEmail,
          phone: "+91 9876543210",
          password: defaultAdminPassword, // Mongoose pre-save hook handles hashing
          authProvider: "local",
          role: "admin",
          isPaid: true,
          paidAt: new Date(),
          downloadCount: 12,
        });
        console.log(`[Seed] Initial admin user initialized for ${defaultAdminEmail}.`);
      }
      return;
    }

    console.log("[Seed] Database is empty. Seeding initial admin and demo users...");

    // 1. Create Default Admin
    const admin = await User.create({
      name: "System Administrator",
      email: defaultAdminEmail,
      phone: "+91 9876543210",
      password: defaultAdminPassword, // Mongoose pre-save hook will hash this once
      authProvider: "local",
      role: "admin",
      isPaid: true,
      paidAt: new Date(Date.now() - 14 * 86400000),
      downloadCount: 18,
    });


    // 2. Create Demo Paid User 1
    const user1 = await User.create({
      name: "Alexander Wright",
      email: "alexander.wright@example.com",
      phone: "+1 (555) 234-5678",
      password: "password123",
      authProvider: "local",
      role: "user",
      isPaid: true,
      paidAt: new Date(Date.now() - 7 * 86400000),
      downloadCount: 6,
      razorpayOrderId: "order_sb_alexander01",
      razorpayPaymentId: "pay_sb_alexander01",
    });

    // 3. Create Demo Paid User 2
    const user2 = await User.create({
      name: "Michael Chang",
      email: "michael.chang@example.com",
      phone: "+1 (415) 890-1234",
      password: "password123",
      authProvider: "local",
      role: "user",
      isPaid: true,
      paidAt: new Date(Date.now() - 3 * 86400000),
      downloadCount: 3,
      razorpayOrderId: "order_sb_michael02",
      razorpayPaymentId: "pay_sb_michael02",
    });

    // 4. Create Demo Free User 3
    const user3 = await User.create({
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98201 23456",
      password: "password123",
      authProvider: "local",
      role: "user",
      isPaid: false,
      paidAt: null,
      downloadCount: 0,
    });

    // 5. Create Demo Free User 4
    const user4 = await User.create({
      name: "Sarah Jenkins",
      email: "sarah.jenkins@example.com",
      phone: "+44 20 7946 0912",
      password: "password123",
      authProvider: "local",
      role: "user",
      isPaid: false,
      paidAt: null,
      downloadCount: 0,
    });

    // Create Payment records for paid users
    await Payment.create([
      {
        userId: user1._id,
        userEmail: user1.email,
        amount: 99,
        currency: "INR",
        razorpayOrderId: "order_sb_alexander01",
        razorpayPaymentId: "pay_sb_alexander01",
        razorpaySignature: "sandbox_signature_verified",
        status: "captured",
        itemDescription: "ProResume Studio - Vector PDF Download Pass (₹99)",
        createdAt: new Date(Date.now() - 7 * 86400000),
      },
      {
        userId: user2._id,
        userEmail: user2.email,
        amount: 99,
        currency: "INR",
        razorpayOrderId: "order_sb_michael02",
        razorpayPaymentId: "pay_sb_michael02",
        razorpaySignature: "sandbox_signature_verified",
        status: "captured",
        itemDescription: "ProResume Studio - Vector PDF Download Pass (₹99)",
        createdAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        userId: user3._id,
        userEmail: user3.email,
        amount: 99,
        currency: "INR",
        razorpayOrderId: "order_sb_priya03",
        razorpayPaymentId: null,
        razorpaySignature: null,
        status: "created",
        itemDescription: "ProResume Studio - Vector PDF Download Pass (₹99)",
        createdAt: new Date(Date.now() - 1 * 86400000),
      },
    ]);

    console.log("[Seed] Successfully seeded initial demo users and transactions.");
    if (process.env.NODE_ENV !== "production") {
      console.log("----------------------------------------------------------------");
      console.log(" Initial Admin Initialized:");
      console.log(` Email:    ${defaultAdminEmail}`);
      console.log(" Password: (set via INITIAL_ADMIN_PASSWORD or default in dev)");
      console.log("----------------------------------------------------------------");
    }

  } catch (error) {
    console.error("[Seed Error]:", error);
  }
}
