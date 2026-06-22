const express = require('express');
const router = express.Router();
const { checkInAttendee } = require('../controllers/scanController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, checkInAttendee);

module.exports = router;
