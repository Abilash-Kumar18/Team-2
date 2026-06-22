const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, registerForEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, admin, createEvent);

router.route('/:id')
  .get(getEventById);

router.route('/:id/register')
  .post(protect, registerForEvent);

module.exports = router;
