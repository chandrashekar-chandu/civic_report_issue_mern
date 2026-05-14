// backend/models/Activity.js
// REPLACE YOUR ENTIRE FILE WITH THIS UPDATED VERSION

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        // Issue actions
        "Created a new issue",
        "Updated issue details",
        "Deleted an issue",

        // Status updates
        "Updated issue status to Pending",
        "Updated issue status to Assigned",
        "Updated issue status to In Progress",
        "Updated issue status to Resolved",
        "Updated issue status to Rejected",

        // Department actions
        "Assigned issue to Department",

        // Comment actions
        "Added a comment",
      ],
    },

    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;