const express = require('express');
const router = express.Router();
const { approveOrganizer } = require('../controllers/facultyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect route: Only authenticated users with 'faculty' role can approve organizers.
router.put('/approve-organizer/:id', protect, authorizeRoles('faculty'), approveOrganizer);

module.exports = router;
