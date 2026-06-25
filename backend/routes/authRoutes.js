const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerOrganizer,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/student', registerStudent);
router.post('/register/organizer', registerOrganizer);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);

module.exports = router;
