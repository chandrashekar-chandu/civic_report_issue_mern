// controllers/analyticsController.js

const Issue = require("../models/Issuemodel");

const getAnalytics = async (req, res) => {
  try {
    // Total number of issues
    const totalIssues = await Issue.countDocuments();

    // Group by status
    const issuesByStatus = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Group by category
    const issuesByCategory = await Issue.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Group by assigned department
    const issuesByDepartment = await Issue.aggregate([
      {
        $group: {
          _id: "$assignedDepartment",
          count: { $sum: 1 },
        },
      },
    ]);

    // Group by priority
    const issuesByPriority = await Issue.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalIssues,
      issuesByStatus,
      issuesByCategory,
      issuesByDepartment,
      issuesByPriority,
    });
  } catch (error) {
    console.error("Get Analytics Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAnalytics,
};