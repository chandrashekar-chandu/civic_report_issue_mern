// models/Issuemodel.js

const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // Title of the complaint
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Detailed description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Complaint category
    category: {
      type: String,
      required: true,
      enum: [
        "Road",
        "Water",
        "Electricity",
        "Sanitation",
        "Street Light",
        "Other",
      ],
    },

    // Priority level
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    // Current status of the issue
    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    // Exact location information
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    // Optional image URL
    imageUrl: {
      type: String,
      default: "",
    },

    // Citizen who reported the issue
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Department assigned by authority
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;