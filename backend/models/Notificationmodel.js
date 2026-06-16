const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // User who will receive the notification
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200, // Increased from 50 to allow more descriptive messages
    },

    // Whether the notification has been read
    isRead: {
      type: Boolean,
      default: false,
    },

    // Type of notification
    type: {
      type: String,
      required: true,
      enum: [
        "Issue Assigned",
        "Status Updated",
        "Issue Resolved",
        "Issue Rejected",
        "Issue Escalated",
        "New Comment",
        "Verification",
        "System Alert",
      ],
      default: "System Alert",
    },

    // Optional reference to the related issue
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;