const express = require("express");
const router = express.Router();

const {
  getActivitiesByIssue,
  getActivitiesByUser,
  getAllActivities,
} = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get all activities performed by the currently logged-in user
// GET /api/activities/my
router.get("/my", authMiddleware, getActivitiesByUser);

// Get all activities related to a specific issue
// GET /api/activities/issue/:issueId
router.get("/issue/:issueId", authMiddleware, getActivitiesByIssue);

// Get all activities in the system (Authority only)
// GET /api/activities
router.get(
  "/",
  authMiddleware,
  roleMiddleware("authority"),
  getAllActivities
);

module.exports = router;