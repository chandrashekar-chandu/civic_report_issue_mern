// backend/middleware/roleMiddleware.js

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Get current user role
      const userRole = req.user.role;

      // Check if role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden. You do not have permission to access this resource.",
        });
      }

      // Role is valid
      next();
    } catch (error) {
      console.error(
        "Role Middleware Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while checking user role.",
      });
    }
  };
};

module.exports = roleMiddleware;