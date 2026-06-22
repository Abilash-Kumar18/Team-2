const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).populate('organizer', 'name email');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (event) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
  const { title, description, date, location, capacity } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      organizer: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    const alreadyRegistered = await Registration.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (alreadyRegistered) {
      res.status(400);
      throw new Error('Already registered for this event');
    }

    const totalRegistrations = await Registration.countDocuments({ event: event._id });
    if (totalRegistrations >= event.capacity) {
      res.status(400);
      throw new Error('Event capacity reached');
    }

    // QR code data containing user and event ID
    const qrCodeData = JSON.stringify({
      userId: req.user._id,
      eventId: event._id,
    });

    const registration = new Registration({
      event: event._id,
      user: req.user._id,
      qrCodeData,
    });

    const savedRegistration = await registration.save();
    res.status(201).json(savedRegistration);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
};
