const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    referenceId: { type: String, unique: true, index: true },
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true, index: true },
    complaintReferenceId: { type: String, required: true, index: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    anonymous: { type: Boolean, default: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    category: { type: String, default: "General" },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

feedbackSchema.pre("validate", function (next) {
  if (!this.referenceId) {
    this.referenceId = `FB-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model("Feedback", feedbackSchema);