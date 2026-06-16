// backend/controllers/commentController.js
// REPLACE YOUR ENTIRE FILE WITH THIS UPDATED VERSION

const Comment = require("../models/Commentmodel");
const Issue = require("../models/Issuemodel");
const { logActivity } = require("../controllers/activityController");

// ======================================================
// CREATE COMMENT
// Citizens can comment on their own issues.
// Departments and Authorities can comment on any issue.
// ======================================================
const createComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;

    // Validation
    if (!issueId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Issue ID and comment text are required",
      });
    }

    // Check issue existence
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // Authorization:
    // Citizen -> only on own issues
    // Department -> allowed
    // Authority -> allowed
    if (req.user.role === "citizen") {
      if (
        issue.reportedBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only comment on your own issues",
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      issueId,
      userId: req.user._id,
      text: text.trim(),
    });

    // Populate user details for frontend display
    const populatedComment =
      await Comment.findById(comment._id).populate(
        "userId",
        "name role"
      );

    // Log activity (optional)
    try {
      await logActivity(
        req.user._id,
        "Added a comment",
        issueId
      );
    } catch (error) {
      console.log(
        "Log Activity Error:",
        error.message
      );
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error(
      "Create Comment Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// GET COMMENTS FOR A SPECIFIC ISSUE
// ======================================================
const getCommentsByIssue = async (req, res) => {
  try {
    const comments = await Comment.find({
      issueId: req.params.issueId,
    })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(
      "Get Comments Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createComment,
  getCommentsByIssue,
};