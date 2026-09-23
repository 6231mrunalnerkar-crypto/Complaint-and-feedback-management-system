const mongoose = require("mongoose");

const STATUSES = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
  "Closed",
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const CATEGORIES = [
  "Academic",
  "Infrastructure",
  "Hostel",
  "Library",
  "Canteen",
  "Transportation",
  "Technical",
  "Faculty",
  "Administration",
  "Other",
  "Appliances",
  "Ragging / Bullying",
  "Harassment / Misconduct",
  "Campus Safety / Crime",
  "IT / Computer",
  "Transport",
  "Cleanliness / Sanitation",
  "Administration / Fees",
  "Faculty / Staff",
];

const historySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: STATUSES,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: String,
      default: "System",
    },
    changedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    user: {
      type: String,
      default: "System User",
    },
    role: {
      type: String,
      enum: ["student", "staff", "admin", "guest", "system"],
      default: "staff",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const complaintSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: CATEGORIES,
      default: "Other",
      index: true,
    },

    priority: {
      type: String,
      enum: PRIORITIES,
      default: "Medium",
      index: true,
    },

    status: {
      type: String,
      enum: STATUSES,
      default: "Submitted",
      index: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    submitterType: {
      type: String,
      enum: ["student", "anonymous", "guest"],
      default: "guest",
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    submittedSnapshot: {
      name: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      rollNumber: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
    },

    assignedDepartment: {
      type: String,
      default: "Unassigned",
      index: true,
    },

    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    responses: [responseSchema],

    statusHistory: [historySchema],

    resolutionDetails: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      resolutionSummary: {
        type: String,
        default: "",
      },
      feedbackRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      feedbackComments: {
        type: String,
        default: "",
      },
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({
  title: "text",
  description: "text",
  referenceId: "text",
  category: "text",
});

complaintSchema.index({
  createdAt: -1,
});

function makeReferenceId() {
  return `CMP-${new Date().getFullYear()}-${Date.now()
    .toString(36)
    .toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
}

/*
 * Mongoose 9 compatible middleware.
 * Mongoose 9 does not use the old `next()` callback
 * for pre middleware.
 */
complaintSchema.pre("validate", function () {
  if (!this.referenceId) {
    this.referenceId = makeReferenceId();
  }
});

module.exports = {
  Complaint: mongoose.model("Complaint", complaintSchema),
  STATUSES,
  PRIORITIES,
  CATEGORIES,
};