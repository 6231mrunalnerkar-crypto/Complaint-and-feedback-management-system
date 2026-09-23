const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

async function upsertStaffOrAdmin({ name, email, loginCode, role, department }) {
  if (!name || !email || !loginCode) {
    throw new Error(`${role} seed variables are incomplete.`);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const loginCodeHash = await bcrypt.hash(String(loginCode), 12);

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name: name.trim(),
      email: normalizedEmail,
      loginCodeHash,
      role,
      department: department || "Unassigned",
      accountStatus: "Active",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`${role} ready: ${user.email}`);
}

async function seed() {
  await connectDB();

  await upsertStaffOrAdmin({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    loginCode: process.env.ADMIN_LOGIN_CODE,
    role: "admin",
    department: "Administration",
  });

  await upsertStaffOrAdmin({
    name: process.env.STAFF_NAME,
    email: process.env.STAFF_EMAIL,
    loginCode: process.env.STAFF_LOGIN_CODE,
    role: "staff",
    department: process.env.STAFF_DEPARTMENT || "Unassigned",
  });

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});