const router = require("express").Router();

const controller = require("../controllers/feedbackController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ======================================================
// VERIFY COMPLAINT FOR FEEDBACK
// Public - complaint reference verify karne ke liye
// ======================================================

router.get(
  "/verify/:referenceId",
  controller.verifyComplaintForFeedback
);

// ======================================================
// MY FEEDBACKS
// Student - logged-in student's feedbacks
// IMPORTANT: /my MUST COME BEFORE /
// ======================================================
router.get(
  "/my",
  protect,
  controller.getMyFeedbacks
);


// ======================================================
// ADMIN - LIST ALL FEEDBACK
// ======================================================

router.get(
  "/",
  protect,
  authorize("admin"),
  (req, res, next) => {
    console.log("🔥 ADMIN /FEEDBACK ROUTE HIT 🔥");
    next();
  },
  controller.listFeedback
);

// ======================================================
// SUBMIT FEEDBACK
// ======================================================

router.post(
  "/",
  (req, res, next) => {
    const authHeader =
      req.headers.authorization;

    // No authorization header = anonymous feedback
    if (!authHeader) {
      return controller.submitFeedback(
        req,
        res,
        next
      );
    }

    // Authorization header present = logged-in user
    return protect(
      req,
      res,
      next
    );
  },
  controller.submitFeedback
);

module.exports = router;