// controllers/authController.js

const bcrypt = require("bcryptjs");
const User = require("../models/Usermodel");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const Department = require("../models/Departmentmodel");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, departmentId } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address (e.g. name@example.com)",
      });
    }

    // Validate phone number format
    const cleanPhone = phone.toString().trim().replace(/[\s-]/g, "");
    if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number (10 to 15 digits)",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or name",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user with departmentId if role is department
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "citizen",
      phone,
      departmentId: role === "department" ? departmentId || null : null,
    });

    // Link user to Department officerIds if applicable
    if (role === "department" && departmentId) {
      await Department.findByIdAndUpdate(departmentId, {
        $addToSet: { officerIds: user._id },
      });
    }

    // 5. Generate JWT token
    const token = generateToken(user._id);

    // 6. Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        departmentId: user.departmentId,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email }).populate("departmentId");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        departmentId: user.departmentId,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("departmentId");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update logged-in user department
// @route   PUT /api/auth/update-department
// @access  Private (Department users)
const updateUserDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Please select a department",
      });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { departmentId },
      { new: true }
    ).populate("departmentId");

    await Department.findByIdAndUpdate(departmentId, {
      $addToSet: { officerIds: req.user._id },
    });

    res.status(200).json({
      success: true,
      message: "Department linked successfully",
      user,
    });
  } catch (error) {
    console.error("Update User Department Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUserDepartment,
};