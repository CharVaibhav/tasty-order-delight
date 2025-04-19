const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getVerificationEmailTemplate, getPasswordResetEmailTemplate } = require('../utils/emailTemplates');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate password
    const passwordValidation = User.schema.methods.isPasswordValid(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.message,
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - Tasty Order Delight',
        html: getVerificationEmailTemplate(user.name, verificationUrl),
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
      });
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent',
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user found with that email',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset - Tasty Order Delight',
        html: getPasswordResetEmailTemplate(user.name, resetUrl),
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent',
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Validate new password
    const passwordValidation = User.schema.methods.isPasswordValid(req.body.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.message,
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Changed Successfully - Tasty Order Delight',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333; text-align: center;">Password Changed Successfully</h2>
            <p style="color: #666;">Hi ${user.name},</p>
            <p style="color: #666;">Your password has been successfully changed. If you did not make this change, please contact our support team immediately.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Error sending password change confirmation email:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email address',
      });
    }

    // Create token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
}; 