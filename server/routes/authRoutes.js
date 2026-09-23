const router = require("express").Router();
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", upload.single("identityProof"), register);
router.post("/login", login);
router.get("/me", protect, me);

module.exports = router;