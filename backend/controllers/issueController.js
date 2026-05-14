const Issue = require("../models/Issuemodel");
const Department = require("../models/Departmentmodel");
const { logActivity } = require("./activityController");
const {
  createNotification,
} = require("./notificationController");

// backend/controllers/issueController.js
// REPLACE ONLY THE createIssue FUNCTION WITH THIS UPDATED VERSION

// const Issue = require("../models/Issuemodel");
const Activity = require("../models/Activitymodel");
// const Notification = require("../models/Notification");
const path = require("path");

// ==========================================
// CREATE ISSUE WITH MULTER IMAGE UPLOAD
// ==========================================
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
    } = req.body;

    // Parse location if sent as JSON string
    let parsedLocation = location;

    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch (error) {
        parsedLocation = {
          address: location,
          latitude: 17.0005,
          longitude: 81.8040,
        };
      }
    }

    // Image URL from uploaded file
    let imageUrl = "";

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${req.file.filename}`;
    }

    // Create issue
    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      location: parsedLocation,
      imageUrl,
      reportedBy: req.user._id,
    });

    // Log activity
    try {
      await logActivity(
        req.user._id,
        "Created a new issue",
        issue._id
      );
    } catch (error) {
      console.log(
        "Activity Log Error:",
        error.message
      );
    }

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue,
    });
  } catch (error) {
    console.error(
      "Create Issue Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      reportedBy: req.user._id,
    })
      .populate("assignedDepartment", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get My Issues Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "name email")
      .populate("assignedDepartment", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get All Issues Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedDepartment", "name");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    console.error("Get Issue Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (
      issue.reportedBy.toString() !==
        req.user._id.toString() &&
      req.user.role !== "authority"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this issue",
      });
    }

    Object.assign(issue, req.body);
    await issue.save();

    await logActivity(
      req.user._id,
      "Updated issue details",
      issue._id
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      issue,
    });
  } catch (error) {
    console.error("Update Issue Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const validStatuses = [
      "Pending",
      "Assigned",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Allow any department or authority user
    // Route-level middleware already enforces:
    // roleMiddleware("department", "authority")

    issue.status = status;

    if (status === "Resolved") {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    // Notify the citizen who created the issue
    await Notification.create({
      user: issue.createdBy,
      title: "Issue Status Updated",
      message: `Your issue "${issue.title}" status has been updated to "${status}".`,
      type: "status_update",
    });

    // Log activity (optional)
    try {
      await logActivity(
        req.user._id,
        "Updated issue status",
        `Updated issue "${issue.title}" to "${status}"`
      );
    } catch (err) {
      console.log("Log Activity Error:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue,
    });
  } catch (error) {
    console.error(
      "Update Issue Status Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error while updating issue status",
      error: error.message,
    });
  }
};

const assignIssueToDepartment = async (req, res) => {
  try {
    const { assignedDepartment } = req.body;

    const department = await Department.findById(
      assignedDepartment
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    issue.assignedDepartment = assignedDepartment;
    await issue.save();

    await logActivity(
      req.user._id,
      `Assigned issue to ${department.name}`,
      issue._id
    );

    if (issue.reportedBy) {
      await createNotification({
        body: {
          recipientId: issue.reportedBy._id,
          message: `Your issue "${issue.title}" has been assigned to ${department.name}.`,
          issueId: issue._id,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue assigned successfully",
      issue,
    });
  } catch (error) {
    console.error(
      "Assign Issue Error:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getIssuesByCategory = async (req, res) => {
  try {
    const issues = await Issue.find({
      category: req.params.category,
    });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error(
      "Get Issues By Category Error:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getIssuesByStatus = async (req, res) => {
  try {
    const issues = await Issue.find({
      status: req.params.status,
    });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error(
      "Get Issues By Status Error:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    await logActivity(
      req.user._id,
      "Deleted an issue",
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Delete Issue Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createIssue,
  getMyIssues,
  getAllIssues,
  getIssueById,
  updateIssue,
  updateIssueStatus,
  assignIssueToDepartment,
  getIssuesByCategory,
  getIssuesByStatus,
  deleteIssue,
};