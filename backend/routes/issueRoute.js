const express = require("express");
const router = express.Router();

const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  assignDepartment,
  getAssignedIssues,
  getMyIssues,
} = require("../controllers/issueController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Create Issue (Citizen)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createIssue
);
router.get("/assigned", authMiddleware, getAssignedIssues);
// Get all issues
router.get("/", authMiddleware, getAllIssues);

// Get issues created by current user
router.get("/my-issues", authMiddleware, getMyIssues);

// Get issue by ID
router.get("/:id", authMiddleware, getIssueById);

// Assign department (Authority only)
router.put(
  "/:id/assign",
  authMiddleware,
  assignDepartment
);

// Update issue status
// NOTE: Only authentication is required here.
// No roleMiddleware is used.
router.put(
  "/:id/status",
  authMiddleware,
  updateIssueStatus
);

module.exports = router;