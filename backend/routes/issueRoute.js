// backend/routes/issueRoute.js
// REPLACE YOUR ENTIRE FILE WITH THIS UPDATED VERSION

const express = require("express");
const router = express.Router();

const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssuesByCategory,
  updateIssueStatus,
  getIssuesByStatus,
  assignIssueToDepartment,
  getMyIssues, // make sure this exists in issueController.js
} = require("../controllers/issueController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// =========================================
// CREATE ISSUE WITH IMAGE UPLOAD
// Field name must be "image"
// =========================================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("citizen", "authority"),
  upload.single("image"),
  createIssue
);

// =========================================
// GET CURRENT USER'S ISSUES
// IMPORTANT: must come before "/:id"
// =========================================
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("citizen"),
  getMyIssues
);

// =========================================
// OTHER ROUTES
// =========================================
router.get("/", authMiddleware, getAllIssues);

router.get(
  "/category/:category",
  authMiddleware,
  getIssuesByCategory
);

router.get(
  "/status/:status",
  authMiddleware,
  getIssuesByStatus
);

router.get("/:id", authMiddleware, getIssueById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("citizen", "authority"),
  updateIssue
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("department", "authority"),
  updateIssueStatus
);

router.put(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("authority"),
  assignIssueToDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("authority"),
  deleteIssue
);

module.exports = router;