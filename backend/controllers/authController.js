import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Generate secure random token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #0d9488;
            margin: 0;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #0d9488;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #0f766e;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tour & Travel Bangladesh</h1>
          </div>
          
          <h2>Reset Your Password</h2>
          
          <p>We received a request to reset your password for your Tour & Travel Bangladesh account. Click the button below to set a new password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #0d9488;">${resetUrl}</p>
          
          <div class="warning">
            <strong>Important:</strong> This link will expire in 30 minutes for your security.
          </div>
          
          <p>If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Tour & Travel Bangladesh. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Reset Your Password - Tour & Travel Bangladesh',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, message: "Registration successful" });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Your account has been banned. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role || 'user' }, message: "Login successful" });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    await user.save();

    res.json({ ...user.toObject(), password: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ ...user.toObject(), password: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Toggle user ban status (Admin only)
// @route   PUT /api/auth/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot ban an admin user" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ ...user.toObject(), password: undefined, message: user.isBanned ? "User banned" : "User unbanned" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return res.json({ message: "If an account with this email exists, a password reset link has been sent." });
    }

    // Generate a secure random reset token
    const resetToken = generateResetToken();
    
    // Hash the token before storing (for security)
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(resetToken, salt);
    
    // Set token expiration (30 minutes)
    const resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    // Store hashed token and expiration in user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send email with the raw (unhashed) token
    const emailSent = await sendResetEmail(email, resetToken);
    
    if (!emailSent) {
      console.error('Failed to send reset email to:', email);
      // Still return success to not reveal email existence
    }

    res.json({ message: "If an account with this email exists, a password reset link has been sent." });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Find user with a reset token (we need to check all users since token is hashed)
    const users = await User.find({ resetPasswordToken: { $ne: null } });
    
    let user = null;
    let tokenValid = false;

    // Check each user's hashed token against the provided token
    for (const u of users) {
      if (u.resetPasswordToken) {
        const isMatch = await bcrypt.compare(token, u.resetPasswordToken);
        if (isMatch) {
          user = u;
          tokenValid = true;
          break;
        }
      }
    }

    if (!user || !tokenValid) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Check if token has expired
    if (user.resetPasswordExpires < new Date()) {
      // Clear expired token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
