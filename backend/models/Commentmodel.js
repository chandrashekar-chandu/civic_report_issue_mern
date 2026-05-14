const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // The issue to which this comment belongs
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    // The user (citizen, department officer, or authority)
    // who wrote the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Comment text
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Optional attachment (image/document URL or path)
    attachment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;