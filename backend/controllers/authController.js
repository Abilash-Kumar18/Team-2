const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Simulated email sender utilizing nodemailer setup
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASS || 'ethereal.pass',
    },
  });

  const fromName = process.env.SMTP_FROM_NAME || 'College Event Management';
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@collegeevents.com';

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">College Event Management</h2>
        <p>You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:</p>
        <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f7f7f7; display: inline-block; letter-spacing: 2px;">
          ${otp}
        </div>
        <p style="color: #777; font-size: 12px; margin-top: 20px;">This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  // Always log to console for development and test validation
  console.log(`\n--- [SIMULATED EMAIL SENT] ---`);
  console.log(`To: ${email}`);
  console.log(`OTP: ${otp}`);
  console.log(`-----------------------------\n`);

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.warn(`Nodemailer connection warning: ${error.message}. OTP logged to console.`);
    return { messageId: 'simulated-id' };
  }
};

// @desc    Register Student
// @route   POST /api/auth/register/student
// @access  Public
const registerStudent = async (req, res, next) => {
  let { name, regNo, deptYear, email, mobileNumber, password } = req.body;

  try {
    // 1. NoSQL Injection Prevention: Verify all inputs are strings
    if (
      (name !== undefined && typeof name !== 'string') ||
      (regNo !== undefined && typeof regNo !== 'string') ||
      (deptYear !== undefined && typeof deptYear !== 'string') ||
      (email !== undefined && typeof email !== 'string') ||
      (password !== undefined && typeof password !== 'string') ||
      (mobileNumber !== undefined && typeof mobileNumber !== 'string')
    ) {
      res.status(400);
      throw new Error('Invalid input types. All submitted fields must be strings.');
    }

    name = name ? name.trim() : '';
    regNo = regNo ? regNo.trim() : '';
    deptYear = deptYear ? deptYear.trim() : '';
    email = email ? email.trim().toLowerCase() : '';
    password = password ? password.trim() : '';
    mobileNumber = mobileNumber ? mobileNumber.trim() : '';

    // 2. Validation
    if (!name || !regNo || !deptYear || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, regNo, deptYear, email, password)');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      role: 'student',
      name,
      regNo,
      deptYear,
      email,
      mobileNumber,
      password,
      isApproved: true, // students are automatically approved
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        regNo: user.regNo,
        deptYear: user.deptYear,
        isApproved: user.isApproved,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Organizer
// @route   POST /api/auth/register/organizer
// @access  Public
const registerOrganizer = async (req, res, next) => {
  let { name, regNo, email, mobileNumber, clubName, password } = req.body;

  try {
    // 1. NoSQL Injection Prevention
    if (
      (name !== undefined && typeof name !== 'string') ||
      (regNo !== undefined && typeof regNo !== 'string') ||
      (email !== undefined && typeof email !== 'string') ||
      (clubName !== undefined && typeof clubName !== 'string') ||
      (password !== undefined && typeof password !== 'string') ||
      (mobileNumber !== undefined && typeof mobileNumber !== 'string')
    ) {
      res.status(400);
      throw new Error('Invalid input types. All submitted fields must be strings.');
    }

    name = name ? name.trim() : '';
    regNo = regNo ? regNo.trim() : '';
    email = email ? email.trim().toLowerCase() : '';
    clubName = clubName ? clubName.trim() : '';
    password = password ? password.trim() : '';
    mobileNumber = mobileNumber ? mobileNumber.trim() : '';

    // 2. Validation
    if (!name || !regNo || !clubName || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, regNo, clubName, email, password)');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      role: 'organizer',
      name,
      regNo,
      email,
      mobileNumber,
      clubName,
      password,
      isApproved: false, // organizers must be approved by faculty
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Waiting for faculty approval.',
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        regNo: user.regNo,
        clubName: user.clubName,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unified Login
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  let { email, password, role } = req.body;

  try {
    // 1. NoSQL Injection Prevention
    if (
      (email !== undefined && typeof email !== 'string') ||
      (password !== undefined && typeof password !== 'string') ||
      (role !== undefined && typeof role !== 'string')
    ) {
      res.status(400);
      throw new Error('Invalid input types. All fields must be strings.');
    }

    email = email ? email.trim().toLowerCase() : '';
    password = password ? password.trim() : '';
    role = role ? role.trim() : '';

    if (!email || !password || !role) {
      res.status(400);
      throw new Error('Please provide email, password, and role');
    }

    // 2. Match timing logic: Use a dummy comparison if user is not found to prevent user enumeration
    const user = await User.findOne({ email, role });
    const dummyHash = '$2b$10$abcdefghijklmnopqrstuvwxyza12345678901234567890123456789';

    if (!user) {
      // Fake bcrypt comparison to match the time taken by successful/unsuccessful password hashes
      await bcrypt.compare(password, dummyHash);
      res.status(401);
      throw new Error('Invalid email, password, or role');
    }

    // Compare actual password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email, password, or role');
    }

    // 3. Organizer Approval Check
    if (role === 'organizer' && !user.isApproved) {
      res.status(403);
      throw new Error('Approval pending from faculty');
    }

    res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  let { email } = req.body;

  try {
    if (email !== undefined && typeof email !== 'string') {
      res.status(400);
      throw new Error('Invalid input types. Email must be a string.');
    }

    email = email ? email.trim().toLowerCase() : '';
    if (!email) {
      res.status(400);
      throw new Error('Please provide email');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found with this email');
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save to user (valid for 10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Simulate sending email
    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: 'Password reset OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  let { email, otp } = req.body;

  try {
    if (
      (email !== undefined && typeof email !== 'string') ||
      (otp !== undefined && typeof otp !== 'string')
    ) {
      res.status(400);
      throw new Error('Invalid input types. Email and OTP must be strings.');
    }

    email = email ? email.trim().toLowerCase() : '';
    otp = otp ? otp.trim() : '';

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    // Generate temporary token for reset auth (expires in 15 minutes)
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is missing');
    }
    const tempToken = jwt.sign({ email, type: 'reset' }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    res.json({
      success: true,
      message: 'OTP verified successfully',
      tempToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  let { email, otp, newPassword } = req.body;

  try {
    if (
      (email !== undefined && typeof email !== 'string') ||
      (otp !== undefined && typeof otp !== 'string') ||
      (newPassword !== undefined && typeof newPassword !== 'string')
    ) {
      res.status(400);
      throw new Error('Invalid input types. All fields must be strings.');
    }

    email = email ? email.trim().toLowerCase() : '';
    otp = otp ? otp.trim() : '';
    newPassword = newPassword ? newPassword.trim() : '';

    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Please provide email, OTP, and newPassword');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    // Save the new password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  registerOrganizer,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserProfile,
};

