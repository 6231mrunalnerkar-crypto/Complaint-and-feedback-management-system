const router = require("express").Router();
const controller = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

router.patch("/me", protect, controller.updateProfile);

router.get("/", protect, authorize("admin"), controller.listUsers);
router.post("/staff", protect, authorize("admin"), controller.createStaff);
router.patch("/:id/status", protect, authorize("admin"), controller.updateUserStatus);

module.exports = router;