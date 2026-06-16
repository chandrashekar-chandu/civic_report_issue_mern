const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // Read Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Fetch complete user document, including departmentId
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("departmentId", "name");

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach full user object to request
    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token.",
    });
  }
};

module.exports = authMiddleware;