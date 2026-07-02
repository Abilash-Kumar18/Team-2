const express = require('express');
const router = express.Router();
const {
  getFacultyDashboard,
  getPendingEvents,
  updateEventStatus,
  getEventRegistrations,
  scanStudentQRPass,
  createAnnouncement,
  getFacultyReports,
  approveOrganizer,
} = require('../controllers/facultyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect all faculty routes
router.use(protect, authorizeRoles('faculty', 'admin'));

router.get('/dashboard', getFacultyDashboard);
router.get('/events/pending', getPendingEvents);
router.put('/events/:eventId/status', updateEventStatus);
router.get('/events/:eventId/registrations', getEventRegistrations);
router.post('/attendance/scan', scanStudentQRPass);
router.post('/announcements', createAnnouncement);
router.get('/reports', getFacultyReports);
router.put('/approve-organizer/:id', approveOrganizer);

module.exports = router;
