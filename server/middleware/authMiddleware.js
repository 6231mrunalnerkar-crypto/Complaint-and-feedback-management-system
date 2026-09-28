const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = header.substring(7);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash -loginCodeHash");

    if (!user || user.accountStatus !== "Active") {
      return res.status(401).json({
        success: false,
        message: "User account is unavailable.",
      });
    }

    req.user = user;
    console.log("AUTH USER:", {
  id: user._id,
  email: user.email,
  role: user.role,
  accountStatus: user.accountStatus,
});
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}
function authorize(...roles) {
  return (req, res, next) => {
    console.log("AUTHORIZE CHECK:", {
      user: req.user?.email,
      role: req.user?.role,
      allowedRoles: roles,
    });

    if (!req.user || !roles.includes(req.user.role)) {
      console.log("❌ AUTHORIZATION FAILED");
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    console.log("✅ AUTHORIZATION PASSED");
    next();
  };
}
module.exports = { protect, authorize };