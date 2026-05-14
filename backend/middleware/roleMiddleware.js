// middleware/roleMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware must run before this middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User information not found.",
      });
    }

    // Check whether user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to access this resource.",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;