const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// GET  /api/events       — public (anyone can browse)
// POST /api/events       — organizer or admin only
router
  .route('/')
  .get(getEvents)
  .post(protect, authorizeRoles('organizer', 'admin'), createEvent);

// GET /api/events/:id    — public
router.route('/:id').get(getEventById);

// POST /api/events/:id/register — authenticated students
router.route('/:id/register').post(protect, authorizeRoles('student'), registerForEvent);

module.exports = router;
