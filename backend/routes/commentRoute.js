// backend/routes/commentRoute.js
// REPLACE YOUR ENTIRE FILE WITH THIS UPDATED VERSION

const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByIssue,
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// CREATE A COMMENT
// POST /api/comments
// ==========================================
router.post("/", authMiddleware, createComment);

// ==========================================
// GET ALL COMMENTS FOR A SPECIFIC ISSUE
// GET /api/comments/issue/:issueId
// ==========================================
router.get(
  "/issue/:issueId",
  authMiddleware,
  getCommentsByIssue
);

// ==========================================
// NOTE:
// If you previously had routes like router.put(...)
// or router.delete(...) without corresponding
// controller functions, they caused:
//
// TypeError: argument handler must be a function
//
// This simplified file removes those invalid routes.
// ==========================================

module.exports = router;