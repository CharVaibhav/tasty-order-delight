const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');
const {
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter
} = require('../middleware/rateLimiter');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authLimiter, login);

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', protect, getMe);

// @route   GET /api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', emailVerificationLimiter, verifyEmail);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', passwordResetLimiter, forgotPassword);

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset user password
// @access  Public
router.put('/reset-password/:token', passwordResetLimiter, resetPassword);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router; 