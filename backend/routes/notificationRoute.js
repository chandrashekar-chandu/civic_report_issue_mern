const express = require("express");
const router = express.Router();

const {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create notification (Authority only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("authority"),
  createNotification
);

// Get notifications of logged-in user
router.get("/", authMiddleware, getMyNotifications);

// Mark a single notification as read
router.put("/:id/read", authMiddleware, markNotificationAsRead);

// Mark all notifications as read
router.put("/read-all", authMiddleware, markAllNotificationsAsRead);

// Delete notification
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;