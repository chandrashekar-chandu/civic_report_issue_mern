const Issue = require("../models/Issuemodel");
const Department = require("../models/Departmentmodel");
const User = require("../models/Usermodel");
const Notification = require("../models/Notificationmodel");
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

    // Update issue status
    issue.status = status;

    if (status === "Resolved") {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    // Send notification to the citizen
    if (issue.reportedBy) {
      try {
        const recipientId = issue.reportedBy._id || issue.reportedBy;
        let notifType = "Status Updated";
        if (status === "Resolved") notifType = "Issue Resolved";
        if (status === "Rejected") notifType = "Issue Rejected";
        if (status === "Assigned") notifType = "Issue Assigned";

        await Notification.create({
          userId: recipientId,
          message: `Your reported issue "${issue.title}" status has been updated to "${status}".`,
          issueId: issue._id,
          type: notifType,
        });
        console.log(`Notification sent to user ${recipientId} regarding status update to ${status}`);
      } catch (notificationError) {
        console.error("Notification Error:", notificationError.message);
      }
    }

    // Log activity
    try {
      await logActivity(
        req.user._id,
        "Updated issue status",
        issue._id
      );
    } catch (activityError) {
      console.log(
        "Activity Log Error:",
        activityError.message
      );
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
      message: error.message || "Server Error",
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
    issue.status = "Assigned";

    await issue.save();

    // Send notification to the citizen
    if (issue.reportedBy) {
      try {
        const recipientId = issue.reportedBy._id || issue.reportedBy;
        await Notification.create({
          userId: recipientId,
          message: `Your reported issue "${issue.title}" has been assigned to department "${department.name}".`,
          issueId: issue._id,
          type: "Issue Assigned",
        });
      } catch (err) {
        console.error("Notification Creation Error:", err.message);
      }
    }

    // Optional activity log
    try {
      await logActivity(
        req.user._id,
        "Assigned Department",
        issue._id
      );
    } catch (error) {
      console.log(
        "Activity Log Error:",
        error.message
      );
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
      message: error.message,
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
const getAssignedIssues = async (req, res) => {
  try {
    console.log("ROLE:", req.user.role);
    console.log("DEPARTMENT ID:", req.user.departmentId);

    // Only department users can access this
    if (req.user.role !== "department") {
      return res.status(403).json({
        success: false,
        message: "Only department users can access assigned issues",
      });
    }

    // Because departmentId is populated in authMiddleware,
    // it may be an object containing _id
    let departmentId =
      req.query.departmentId ||
      req.user.departmentId?._id ||
      req.user.departmentId;

    // Fallback 1: check if the user is listed in any Department's officerIds
    if (!departmentId) {
      const dept = await Department.findOne({ officerIds: req.user._id });
      if (dept) {
        departmentId = dept._id;
        await User.findByIdAndUpdate(req.user._id, { departmentId: dept._id });
      }
    }

    // Fallback 2: match department by user email or name
    if (!departmentId) {
      const userCleanName = (req.user.name || "").replace(/dept|department|officer|user/gi, "").trim();
      const dept = await Department.findOne({
        $or: [
          { email: req.user.email },
          ...(userCleanName.length > 2 ? [{ name: new RegExp(userCleanName, "i") }] : [])
        ]
      });
      if (dept) {
        departmentId = dept._id;
        await User.findByIdAndUpdate(req.user._id, { departmentId: dept._id });
        await Department.findByIdAndUpdate(dept._id, { $addToSet: { officerIds: req.user._id } });
      }
    }

    // Fallback 3: If there is only 1 department in the system, default to that department
    if (!departmentId) {
      const depts = await Department.find();
      if (depts.length === 1) {
        departmentId = depts[0]._id;
        await User.findByIdAndUpdate(req.user._id, { departmentId: depts[0]._id });
        await Department.findByIdAndUpdate(depts[0]._id, { $addToSet: { officerIds: req.user._id } });
      }
    }

    if (!departmentId) {
      return res.status(200).json({
        success: true,
        unlinked: true,
        count: 0,
        issues: [],
        message: "Your department account is not linked to a specific department yet. Please select your department.",
      });
    }

    const issues = await Issue.find({
      assignedDepartment: departmentId,
    })
      .populate("reportedBy", "name email")
      .populate("assignedDepartment", "name")
      .sort({ createdAt: -1 });

    console.log("FOUND:", issues.length);

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });

  } catch (error) {
    console.error("Get Assigned Issues Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
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
  
  // Export with the name expected by issueRoute.js
  assignDepartment: assignIssueToDepartment,
  getAssignedIssues,

  getIssuesByCategory,
  getIssuesByStatus,
  deleteIssue,
};