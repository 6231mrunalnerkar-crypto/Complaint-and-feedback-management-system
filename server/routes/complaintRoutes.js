const router = require("express").Router();

const controller = require("../controllers/complaintController");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ======================================================
// CREATE COMPLAINT
// ======================================================

router.post("/", (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token = anonymous/guest complaint
  if (!authHeader) {
    return controller.createComplaint(req, res);
  }

  // Token exists = authenticate user
  return protect(req, res, next);
}, controller.createComplaint);


// ======================================================
// PUBLIC TRACK COMPLAINT
// IMPORTANT: KEEP THIS BEFORE /:id
// ======================================================

router.get(
  "/track/:referenceId",
  controller.trackPublicComplaint
);


// ======================================================
// STATISTICS
// ======================================================

router.get(
  "/stats",
  protect,
  authorize("student", "staff", "admin"),
  controller.getStats
);


// ======================================================
// STAFF
// ======================================================

router.get(
  "/staff",
  protect,
  authorize("admin"),
  controller.getStaffList
);


// ======================================================
// LIST COMPLAINTS
// ======================================================

router.get(
  "/",
  protect,
  authorize("student", "staff", "admin"),
  controller.listComplaints
);


// ======================================================
// SINGLE COMPLAINT
// ======================================================

router.get(
  "/:id",
  protect,
  authorize("student", "staff", "admin"),
  controller.getComplaint
);


// ======================================================
// ADMIN ACTIONS
// ======================================================

router.patch(
  "/:id/assign",
  protect,
  authorize("admin"),
  controller.assignComplaint
);

router.patch(
  "/:id/priority",
  protect,
  authorize("admin"),
  controller.updatePriority
);


// ======================================================
// STAFF / ADMIN ACTIONS
// ======================================================

router.patch(
  "/:id/status",
  protect,
  authorize("staff", "admin"),
  controller.updateStatus
);

router.post(
  "/:id/updates",
  protect,
  authorize("staff", "admin"),
  controller.addUpdate
);

router.post(
  "/:id/resolve",
  protect,
  authorize("staff", "admin"),
  controller.resolveComplaint
);


module.exports = router;