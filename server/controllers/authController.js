const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { normalizeUser } = require("../utils/normalize");

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

async function register(req, res, next) {
  try {
    const {
      firstName = "",
      lastName = "",
      institution = "",
      dateOfBirth = "",
      age = "",
      address = "",
      rollNumber = "",
      email,
      contact = "",
      password,
      consent,
    } = req.body;

    if (consent !== true && consent !== "true") {
      return res.status(400).json({ success: false, message: "Consent is required." });
    }

    if (!firstName.trim() || !lastName.trim() || !institution.trim() ||
        !dateOfBirth || !address.trim() || !rollNumber.trim() ||
        !email || !contact.trim() || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required registration fields." });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: "Password must contain at least 6 characters." });
    }

    if (!/^\d{10}$/.test(String(contact).trim())) {
      return res.status(400).json({ success: false, message: "Contact number must contain exactly 10 digits." });
    }

    const normalizedEmail = cleanEmail(email);
    const normalizedRoll = String(rollNumber).trim().toUpperCase();

    const [existingEmail, existingRoll] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ rollNumber: normalizedRoll }),
    ]);

    if (existingEmail) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    if (existingRoll) {
      return res.status(409).json({ success: false, message: "This roll number is already registered." });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      institution: institution.trim(),
      dateOfBirth,
      age: age ? Number(String(age).replace(/\D/g, "")) : null,
      address: address.trim(),
      rollNumber: normalizedRoll,
      email: normalizedEmail,
      contact: contact.trim(),
      identityProofName: req.file?.originalname || "",
      identityProofSubmitted: Boolean(req.file),
      identityProofPath: req.file ? `/uploads/identity-proofs/${req.file.filename}` : "",
      passwordHash,
      role: "student",
    });

    res.status(201).json({
      success: true,
      message: "Student account created successfully.",
      data: {
        user: normalizeUser(user),
        token: signToken(user),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, loginCode, role = "student" } = req.body;
    const normalizedEmail = cleanEmail(email);

    if (!normalizedEmail || !role) {
      return res.status(400).json({ success: false, message: "Email and role are required." });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.role !== role || user.accountStatus !== "Active") {
      return res.status(401).json({ success: false, message: "Invalid login details." });
    }

    if (role === "student") {
      if (!password) {
        return res.status(400).json({ success: false, message: "Password is required." });
      }

      const valid = await bcrypt.compare(String(password), user.passwordHash || "");
      if (!valid) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      }
    } else {
      if (!loginCode) {
        return res.status(400).json({ success: false, message: "Unique login code is required." });
      }

      const valid = await bcrypt.compare(String(loginCode), user.loginCodeHash || "");
      if (!valid) {
        return res.status(401).json({ success: false, message: "Invalid email or unique login code." });
      }
    }

    res.json({
      success: true,
      message: "Login successful.",
      data: {
        user: normalizeUser(user),
        token: signToken(user),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({
    success: true,
    data: { user: normalizeUser(req.user) },
  });
}

module.exports = { register, login, me };