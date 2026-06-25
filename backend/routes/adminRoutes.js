const express = require('express');
const router = express.Router();
const { createFaculty } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect route: Only authenticated users with 'admin' role can create faculty accounts.
router.post('/create-faculty', protect, authorizeRoles('admin'), createFaculty);

module.exports = router;
