const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { normalizeUser } = require("../utils/normalize");

async function listUsers(req, res, next) {
  try {
    const { role = "", search = "", department = "", status = "" } = req.query;
    const filter = {};

    if (role && role !== "All") filter.role = role;
    if (department && department !== "All") filter.department = department;
    if (status && status !== "All") filter.accountStatus = status;

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { rollNumber: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-passwordHash -loginCodeHash")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { users: users.map(normalizeUser) } });
  } catch (error) {
    next(error);
  }
}

async function createStaff(req, res, next) {
  try {
    const { name, email, loginCode, department = "Unassigned" } = req.body;

    if (!name?.trim() || !email?.trim() || !loginCode?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email and unique login code are required.",
      });
    }

    if (String(loginCode).length < 6) {
      return res.status(400).json({ success: false, message: "Login code must contain at least 6 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "A user with this email already exists." });
    }

    const loginCodeHash = await bcrypt.hash(String(loginCode), 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      loginCodeHash,
      role: "staff",
      department: department.trim() || "Unassigned",
    });

    res.status(201).json({
      success: true,
      message: "Staff account created.",
      data: { user: normalizeUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const { accountStatus } = req.body;

    if (!["Active", "Suspended"].includes(accountStatus)) {
      return res.status(400).json({ success: false, message: "Invalid account status." });
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: "You cannot suspend your own account." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus },
      { new: true }
    ).select("-passwordHash -loginCodeHash");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      message: `User account ${accountStatus.toLowerCase()}.`,
      data: { user: normalizeUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const allowed = ["firstName", "lastName", "name", "institution", "dateOfBirth", "age", "address", "contact"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated.",
      data: { user: normalizeUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listUsers, createStaff, updateUserStatus, updateProfile };