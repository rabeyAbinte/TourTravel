import express from 'express';
import { register, login, getProfile, updateProfile, getAllUsers, updateUserRole, toggleBanUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authMiddleware, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authMiddleware, updateProfile);

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// @route   PUT /api/auth/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);

// @route   PUT /api/auth/users/:id/ban
// @desc    Toggle user ban status (Admin only)
// @access  Private/Admin
router.put("/users/:id/ban", authMiddleware, adminMiddleware, toggleBanUser);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset link
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", resetPassword);

export default router;
