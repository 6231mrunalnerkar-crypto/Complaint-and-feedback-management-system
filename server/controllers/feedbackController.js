const Feedback = require("../models/Feedback");
const { Complaint } = require("../models/Complaint");

async function submitFeedback(req, res, next) {
  try {
    const {
      complaintId,
      complaintReferenceId,
      rating,
      category = "General",
      comment = "",
      anonymous = true,
    } = req.body;

    const reference = String(complaintId || complaintReferenceId || "").trim();

    if (!reference) {
      return res.status(400).json({ success: false, message: "Complaint reference ID is required." });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const complaint = await Complaint.findOne({ referenceId: reference });

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (complaint.status !== "Resolved" && complaint.status !== "Closed") {
      return res.status(400).json({
        success: false,
        message: "Feedback can be submitted only after the complaint is resolved.",
      });
    }

    const existing = await Feedback.findOne({ complaint: complaint._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Feedback has already been submitted for this complaint.",
      });
    }

    const feedback = await Feedback.create({
      complaint: complaint._id,
      complaintReferenceId: complaint.referenceId,
      submittedBy: anonymous ? null : req.user?._id || null,
      anonymous: Boolean(anonymous),
      rating: numericRating,
      category: String(category).trim() || "General",
      comment: String(comment).trim(),
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
}

async function verifyComplaintForFeedback(req, res, next) {
  try {
    const reference = String(req.params.referenceId || "").trim();
    const complaint = await Complaint.findOne({ referenceId: reference })
      .select("referenceId title status category isAnonymous createdAt");

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    const existing = await Feedback.findOne({ complaint: complaint._id });

    res.json({
      success: true,
      data: {
        complaint,
        eligible: ["Resolved", "Closed"].includes(complaint.status) && !existing,
        alreadySubmitted: Boolean(existing),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function listFeedback(req, res, next) {
  try {
    const { page = 1, limit = 20, search = "", rating = "", category = "" } = req.query;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    const filter = {};

    if (rating && rating !== "All") filter.rating = Number(rating);
    if (category && category !== "All") filter.category = category;

    if (search.trim()) {
      const q = search.trim();
      filter.$or = [
        { referenceId: { $regex: q, $options: "i" } },
        { complaintReferenceId: { $regex: q, $options: "i" } },
        { comment: { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Feedback.find(filter)
        .populate("complaint", "referenceId title status category")
        .populate("submittedBy", "name email rollNumber")
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      Feedback.countDocuments(filter),
    ]);

    const allRatings = await Feedback.find(filter).select("rating anonymous").lean();
    const averageRating = allRatings.length
      ? Number((allRatings.reduce((sum, item) => sum + Number(item.rating), 0) / allRatings.length).toFixed(1))
      : 0;
    const anonymousCount = allRatings.filter((item) => item.anonymous).length;

    res.json({
      success: true,
      data: {
        feedback: items,
        analytics: {
          total: total,
          averageRating,
          anonymousCount,
        },
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          pages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitFeedback, verifyComplaintForFeedback, listFeedback };