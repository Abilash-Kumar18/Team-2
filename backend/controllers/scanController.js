const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Scan QR and check-in attendee
// @route   POST /api/scan
// @access  Private/Admin
const checkInAttendee = async (req, res, next) => {
  const { qrCodeData } = req.body;

  try {
    let parsedData;
    try {
      parsedData = JSON.parse(qrCodeData);
    } catch (e) {
      res.status(400);
      throw new Error('Invalid QR code format');
    }

    const { userId, eventId } = parsedData;

    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
    }).populate('user', 'name email').populate('event', 'title date');

    if (!registration) {
      res.status(404);
      throw new Error('No registration found for this event and user');
    }

    if (registration.checkedIn) {
      res.status(400);
      return res.json({
        success: false,
        message: 'Attendee is already checked in',
        registration,
      });
    }

    registration.checkedIn = true;
    registration.checkInTime = new Date();
    await registration.save();

    res.json({
      success: true,
      message: 'Attendee successfully checked in',
      registration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkInAttendee,
};
