const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true, // fixed typo: tirm -> trim
    },

    // A department can handle MULTIPLE categories,
    // so this should be an array of strings.
    categoriesHandled: [
      {
        type: String,
        enum: [
          "Road",
          "Electricity",
          "Sanitation",
          "Potholes",
          "Garbage",
          "Drainage",
          "Street Light",
          "Water",
          "Sewage",
          "Traffic Signal",
          "Public Safety",
          "Illegal Dumping",
          "Tree Fallen",
          "Encroachment",
          "Noise Pollution",
          "Air Pollution",
          "Others",
        ],
        trim: true,
      },
    ],

    // A department can have MULTIPLE officers,
    // so this should be an array of ObjectIds.
    officerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;