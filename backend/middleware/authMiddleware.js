// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with "Bearer "
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract token from "Bearer <token>"
      token = authHeader.split(" ")[1];
    }

    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and exclude password field
    const user = await User.findById(decoded.id).select("-password");

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach user object to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;