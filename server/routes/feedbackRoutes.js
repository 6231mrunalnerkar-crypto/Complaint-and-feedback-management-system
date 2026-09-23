const router = require("express").Router();
const controller = require("../controllers/feedbackController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/verify/:referenceId", controller.verifyComplaintForFeedback);
router.post("/", (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return controller.submitFeedback(req, res, next);
  return protect(req, res, next);
}, controller.submitFeedback);

router.get("/", protect, authorize("admin"), controller.listFeedback);

module.exports = router;