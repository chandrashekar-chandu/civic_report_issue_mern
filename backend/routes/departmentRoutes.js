const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// POST    /api/departments
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("authority"), createDepartment);

// GET     /api/departments
router.get("/", getAllDepartments);

// GET     /api/departments/:id
router.get("/:id", getDepartmentById);

// PUT     /api/departments/:id
router.put("/:id", updateDepartment);

// DELETE  /api/departments/:id
router.delete("/:id", deleteDepartment);

module.exports = router;