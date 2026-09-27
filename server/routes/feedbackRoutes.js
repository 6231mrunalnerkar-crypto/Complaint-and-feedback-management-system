const router = require("express").Router();

const controller =
  require("../controllers/feedbackController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ======================================================
// VERIFY COMPLAINT
// Public - user complaint verify kar sakta hai
// ======================================================

router.get(
  "/verify/:referenceId",
  controller.verifyComplaintForFeedback
);

// ======================================================
// MY FEEDBACKS
// IMPORTANT: /my MUST COME BEFORE /
// ======================================================

router.get(
  "/my",
  protect,
  authorize("student"),
  controller.getMyFeedbacks
);

// ======================================================
// SUBMIT FEEDBACK
// ======================================================

router.post(
  "/",
  (req, res, next) => {
    const authHeader =
      req.headers.authorization;

    // Anonymous user
    if (!authHeader) {
      return controller.submitFeedback(
        req,
        res,
        next
      );
    }

    // Logged-in user
    return protect(
      req,
      res,
      next
    );
  },
  controller.submitFeedback
);

// ======================================================
// ADMIN FEEDBACK
// ======================================================

router.get(
  "/",
  protect,
  authorize("admin"),
  controller.listFeedback
);

module.exports = router;