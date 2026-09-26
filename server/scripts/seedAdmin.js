import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function promoteOrSeedAdmin() {
  const emailArg = process.argv[2] || "admin@proresume.com";
  const passwordArg = process.argv[3] || "adminpassword123";

  console.log(`[Admin CLI] Processing target email: ${emailArg}...`);
  await connectDB();

  let user = await User.findOne({ email: emailArg.toLowerCase() });

  if (user) {
    user.role = "admin";
    user.isPaid = true;
    if (!user.paidAt) user.paidAt = new Date();
    await user.save();
    console.log(`[Admin CLI] Successfully promoted existing user ${user.email} to Administrator!`);
  } else {
    console.log(`[Admin CLI] User not found. Creating new Administrator account for ${emailArg}...`);
    user = await User.create({
      name: "System Administrator",
      email: emailArg.toLowerCase(),
      phone: "+91 9876543210",
      password: passwordArg,
      authProvider: "local",
      role: "admin",
      isPaid: true,
      paidAt: new Date(),
      downloadCount: 10,
    });
    console.log(`[Admin CLI] New Administrator account created:`);
    console.log(`  Email:    ${emailArg}`);
    console.log(`  Password: ${passwordArg}`);
  }

  await mongoose.disconnect();
  console.log("[Admin CLI] Finished.");
  process.exit(0);
}

promoteOrSeedAdmin().catch((err) => {
  console.error("[Admin CLI Error]:", err);
  process.exit(1);
});
