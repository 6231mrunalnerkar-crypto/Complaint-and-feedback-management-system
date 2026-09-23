const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    name: { type: String, trim: true, required: true },
    institution: { type: String, trim: true, default: "" },
    dateOfBirth: { type: String, default: "" },
    age: { type: Number, min: 0, default: null },
    address: { type: String, trim: true, default: "" },
    rollNumber: { type: String, trim: true, uppercase: true, default: "" },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true, index: true },
    contact: { type: String, trim: true, default: "" },
    identityProofName: { type: String, default: "" },
    identityProofSubmitted: { type: Boolean, default: false },
    identityProofPath: { type: String, default: "" },
    passwordHash: { type: String, default: "" },
    loginCodeHash: { type: String, default: "" },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
      index: true,
    },
    department: { type: String, trim: true, default: "Unassigned" },
    accountStatus: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, department: 1 });

module.exports = mongoose.model("User", userSchema);