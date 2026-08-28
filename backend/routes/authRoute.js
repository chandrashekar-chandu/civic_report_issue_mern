const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getMe,
  updateUserDepartment,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/update-department", authMiddleware, updateUserDepartment);

module.exports = router;