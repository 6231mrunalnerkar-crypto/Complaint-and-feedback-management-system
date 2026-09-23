const { Complaint } = require("../models/Complaint");

// ======================================================
// CREATE COMPLAINT
// ======================================================
async function createComplaint(req, res) {
  try {
    const {
      title,
      description,
      category,
      priority,
      isAnonymous = false,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Complaint title and description are required.",
      });
    }

    // If logged-in user exists
    const user = req.user || null;

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category: category || "Other",
      priority: priority || "Medium",

      submittedBy: user ? user._id : null,

      submitterType: user
        ? user.role === "student"
          ? "student"
          : "guest"
        : "anonymous",

      isAnonymous: Boolean(isAnonymous),

      submittedSnapshot: {
        name: isAnonymous
          ? "Anonymous"
          : user?.name || user?.fullName || "",

        email: isAnonymous ? "" : user?.email || "",

        rollNumber: isAnonymous
          ? ""
          : user?.rollNumber || "",

        phone: isAnonymous
          ? ""
          : user?.phone || "",
      },

      status: "Submitted",

      statusHistory: [
        {
          status: "Submitted",
          changedAt: new Date(),
          changedBy: "System",
          changedByUserId: user ? user._id : null,
          notes: "Complaint submitted successfully.",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint: {
        id: complaint._id,
        referenceId: complaint.referenceId,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        createdAt: complaint.createdAt,
      },
      referenceId: complaint.referenceId,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit complaint.",
    });
  }
}

// ======================================================
// PUBLIC TRACK COMPLAINT
// ======================================================
async function trackPublicComplaint(req, res) {
  try {
    const referenceId = String(req.params.referenceId || "")
      .trim()
      .toUpperCase();

    console.log("Tracking complaint:", referenceId);

    if (!referenceId) {
      return res.status(400).json({
        success: false,
        message: "Complaint reference ID is required.",
      });
    }

    const complaint = await Complaint.findOne({
      referenceId: referenceId,
    })
      .select(
        "referenceId title description category priority status createdAt updatedAt statusHistory responses resolutionDetails resolvedAt"
      )
      .lean();

    if (!complaint) {
      console.log("Complaint not found:", referenceId);

      return res.status(404).json({
        success: false,
        message: `No complaint found with Reference ID "${referenceId}".`,
      });
    }

    console.log("Complaint found:", complaint.referenceId);

    return res.status(200).json({
      success: true,
      message: "Complaint found.",
      complaint,
    });
  } catch (error) {
    console.error("Track complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track complaint.",
    });
  }
}

// ======================================================
// GET ALL COMPLAINTS
// ======================================================
async function listComplaints(req, res) {
  try {
    const user = req.user;

    let filter = {};

    // Student can see only their complaints
    if (user && user.role === "student") {
      filter.submittedBy = user._id;
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("List complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
}

// ======================================================
// GET SINGLE COMPLAINT
// ======================================================
async function getComplaint(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Student can access only their own complaint
    if (
      req.user.role === "student" &&
      String(complaint.submittedBy) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this complaint.",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint.",
    });
  }
}

// ======================================================
// GET STATISTICS
// ======================================================
async function getStats(req, res) {
  try {
    const user = req.user;

    let filter = {};

    if (user.role === "student") {
      filter.submittedBy = user._id;
    }

    const complaints = await Complaint.find(filter).lean();

    const total = complaints.length;

    const pending = complaints.filter(
      (c) =>
        c.status === "Submitted" ||
        c.status === "Under Review"
    ).length;

    const inProgress = complaints.filter(
      (c) => c.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
      (c) =>
        c.status === "Resolved" ||
        c.status === "Closed"
    ).length;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint statistics.",
    });
  }
}

// ======================================================
// STAFF LIST
// ======================================================
async function getStaffList(req, res) {
  try {
    const User = require("../models/User");

    const staff = await User.find({
      role: "staff",
      accountStatus: "Active",
    })
      .select("_id name email")
      .lean();

    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("Staff list error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff.",
    });
  }
}

// ======================================================
// ASSIGN COMPLAINT
// ======================================================
async function assignComplaint(req, res) {
  try {
    const { staffId, department } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.assignedStaff = staffId || null;
    complaint.assignedDepartment =
      department || complaint.assignedDepartment;

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint assigned successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Assign complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign complaint.",
    });
  }
}

// ======================================================
// UPDATE PRIORITY
// ======================================================
async function updatePriority(req, res) {
  try {
    const { priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.priority = priority;

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Priority updated successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Priority update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update priority.",
    });
  }
}

// ======================================================
// UPDATE STATUS
// ======================================================
async function updateStatus(req, res) {
  try {
    const { status, notes = "" } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.status = status;

    complaint.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user.name || req.user.email || "Staff",
      changedByUserId: req.user._id,
      notes,
    });

    if (status === "Resolved" || status === "Closed") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Status update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
    });
  }
}

// ======================================================
// ADD UPDATE / RESPONSE
// ======================================================
async function addUpdate(req, res) {
  try {
    const { message, isInternal = false } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Update message is required.",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.responses.push({
      userId: req.user._id,
      user: req.user.name || req.user.email || "Staff",
      role: req.user.role,
      message,
      isInternal,
    });

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Update added successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Add update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add update.",
    });
  }
}

// ======================================================
// RESOLVE COMPLAINT
// ======================================================
async function resolveComplaint(req, res) {
  try {
    const { resolutionSummary = "" } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.status = "Resolved";

    complaint.resolvedAt = new Date();

    complaint.resolutionDetails = {
      ...complaint.resolutionDetails,
      resolvedBy: req.user._id,
      resolutionSummary,
    };

    complaint.statusHistory.push({
      status: "Resolved",
      changedAt: new Date(),
      changedBy: req.user.name || req.user.email || "Staff",
      changedByUserId: req.user._id,
      notes: resolutionSummary,
    });

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Resolve complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resolve complaint.",
    });
  }
}

module.exports = {
  createComplaint,
  trackPublicComplaint,
  listComplaints,
  getComplaint,
  getStats,
  getStaffList,
  assignComplaint,
  updatePriority,
  updateStatus,
  addUpdate,
  resolveComplaint,
};