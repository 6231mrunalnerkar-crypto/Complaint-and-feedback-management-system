const Feedback = require("../models/Feedback");
const { Complaint } = require("../models/Complaint");

// ======================================================
// SUBMIT FEEDBACK
// ======================================================

async function submitFeedback(req, res) {
  try {
    const {
      complaintId,
      complaintReferenceId,
      rating,
      category = "General",
      comment = "",
      anonymous = true,
    } = req.body;

    const reference = String(
      complaintId || complaintReferenceId || ""
    ).trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Complaint reference ID is required.",
      });
    }

    // --------------------------------------------------
    // VALIDATE RATING
    // --------------------------------------------------

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // --------------------------------------------------
    // FIND COMPLAINT
    // --------------------------------------------------

    let complaint = await Complaint.findOne({
      referenceId: reference,
    });

    // If complaintId was sent instead of referenceId
    if (!complaint) {
      complaint = await Complaint.findById(reference).catch(
        () => null
      );
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // --------------------------------------------------
    // CHECK COMPLAINT STATUS
    // --------------------------------------------------

    const status = String(
      complaint.status || ""
    ).toLowerCase();

    if (
      status !== "resolved" &&
      status !== "closed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Feedback can be submitted only after the complaint is resolved.",
      });
    }

    // --------------------------------------------------
    // CHECK EXISTING FEEDBACK
    // --------------------------------------------------

    const existing = await Feedback.findOne({
      complaint: complaint._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Feedback has already been submitted for this complaint.",
      });
    }

    // --------------------------------------------------
    // CREATE FEEDBACK
    // --------------------------------------------------

    const feedback = await Feedback.create({
      complaint: complaint._id,

      complaintReferenceId:
        complaint.referenceId,

      submittedBy:
        anonymous === true
          ? null
          : req.user?._id || null,

      anonymous: Boolean(anonymous),

      rating: numericRating,

      category:
        String(category).trim() || "General",

      comment:
        String(comment).trim(),
    });

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Feedback submitted successfully.",
      data: {
        feedback,
      },
    });
  } catch (error) {
    console.error(
      "Submit feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to submit feedback.",
    });
  }
}

// ======================================================
// VERIFY COMPLAINT FOR FEEDBACK
// ======================================================

async function verifyComplaintForFeedback(
  req,
  res
) {
  try {
    const reference = String(
      req.params.referenceId || ""
    ).trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message:
          "Complaint reference ID is required.",
      });
    }

    const complaint =
      await Complaint.findOne({
        referenceId: reference,
      }).select(
        "referenceId title status category isAnonymous createdAt"
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message:
          "Complaint not found.",
      });
    }

    const existing =
      await Feedback.findOne({
        complaint: complaint._id,
      });

    const status = String(
      complaint.status || ""
    ).toLowerCase();

    const isResolved =
      status === "resolved" ||
      status === "closed";

    const alreadySubmitted =
      Boolean(existing);

    const eligible =
      isResolved &&
      !alreadySubmitted;

    return res.json({
      success: true,

      data: {
        complaint,
        eligible,
        alreadySubmitted,
      },
    });
  } catch (error) {
    console.error(
      "Verify feedback complaint error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to verify complaint.",
    });
  }
}

// ======================================================
// GET MY FEEDBACKS
// STUDENT
// ======================================================


async function getMyFeedbacks(req, res) {
   console.log("🔥🔥 GET MY FEEDBACKS CALLED 🔥🔥");
  try {
    // --------------------------------------------------
    // USER MUST BE LOGGED IN
    // --------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // --------------------------------------------------
    // FIND COMPLAINTS BELONGING TO CURRENT STUDENT
    // --------------------------------------------------

    const complaints = await Complaint.find({
      submittedBy: req.user._id,
    }).select("_id");
    console.log("MY USER ID:", req.user._id);
console.log("MY COMPLAINTS:", complaints);

    const complaintIds = complaints.map(
      (complaint) => complaint._id
    );

    // --------------------------------------------------
    // FIND MY FEEDBACKS
    //
    // Includes:
    // 1. Non-anonymous feedback submitted by the user
    // 2. Anonymous feedback submitted for complaints
    //    belonging to the current user
    // --------------------------------------------------

    const feedbacks = await Feedback.find({
      $or: [
        {
          submittedBy: req.user._id,
        },
        {
          complaint: {
            $in: complaintIds,
          },
        },
      ],
    })
      .populate(
        "complaint",
        "referenceId title status category"
      )
      .sort({
        createdAt: -1,
      });
      console.log("MY FEEDBACKS:", feedbacks);

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        feedbacks,
      },
    });
  } catch (error) {
    console.error(
      "Get my feedbacks error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load your feedbacks.",
    });
  }
}

// ======================================================
// ADMIN - LIST FEEDBACK
// ======================================================

async function listFeedback(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      rating = "",
      category = "",
    } = req.query;

    const safePage = Math.max(
      1,
      Number(page) || 1
    );

    const safeLimit = Math.min(
      100,
      Math.max(
        1,
        Number(limit) || 20
      )
    );

    const filter = {};

    // --------------------------------------------------
    // RATING FILTER
    // --------------------------------------------------

    if (
      rating &&
      rating !== "All"
    ) {
      filter.rating = Number(rating);
    }

    // --------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------

    if (
      category &&
      category !== "All"
    ) {
      filter.category = category;
    }

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    if (search.trim()) {
      const q = search.trim();

      filter.$or = [
        {
          referenceId: {
            $regex: q,
            $options: "i",
          },
        },
        {
          complaintReferenceId: {
            $regex: q,
            $options: "i",
          },
        },
        {
          comment: {
            $regex: q,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------
    // FETCH FEEDBACK
    // --------------------------------------------------

    const [items, total] =
      await Promise.all([
        Feedback.find(filter)
          .populate(
            "complaint",
            "referenceId title status category"
          )
          .populate(
            "submittedBy",
            "name email rollNumber"
          )
          .sort({
            createdAt: -1,
          })
          .skip(
            (safePage - 1) *
              safeLimit
          )
          .limit(safeLimit),

        Feedback.countDocuments(
          filter
        ),
      ]);

    // --------------------------------------------------
    // ANALYTICS
    // --------------------------------------------------

    const allRatings =
      await Feedback.find(
        filter
      )
        .select(
          "rating anonymous"
        )
        .lean();

    const averageRating =
      allRatings.length
        ? Number(
            (
              allRatings.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.rating
                  ),
                0
              ) /
              allRatings.length
            ).toFixed(1)
          )
        : 0;

    const anonymousCount =
      allRatings.filter(
        (item) =>
          item.anonymous
      ).length;

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.json({
      success: true,

      data: {
        feedback: items,

        analytics: {
          total,
          averageRating,
          anonymousCount,
        },

        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          pages: Math.ceil(
            total / safeLimit
          ),
        },
      },
    });
  } catch (error) {
    console.error(
      "List feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load feedback.",
    });
  }
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  verifyComplaintForFeedback,
  submitFeedback,
  getMyFeedbacks,
  listFeedback,
};