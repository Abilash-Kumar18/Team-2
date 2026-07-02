const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

// @desc    Get all events (public / with filters)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.status === 'upcoming') {
      // Approved events in the future
      query.status = 'Approved';
      query.dateTime = { $gte: new Date() };
    } else if (req.query.status === 'closed') {
      // Manually closed or in the past
      query.$or = [
        { status: 'Closed' },
        { dateTime: { $lt: new Date() } }
      ];
    } else if (req.query.status) {
      // Match explicit status if passed
      query.status = req.query.status;
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email role clubName')
      .sort({ dateTime: req.query.status === 'upcoming' ? 1 : -1 });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email role clubName');
    if (event) {
      res.status(200).json(event);
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
// @access  Private/Organizer/Faculty/Admin
const createEvent = async (req, res, next) => {
  const { title, category, organizerDept, dateTime, venue, maxParticipants, posterUrl, description, requestedFaculty } = req.body;

  try {
    if (!title || !category || !organizerDept || !dateTime || !venue || !maxParticipants) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const event = new Event({
      title,
      category,
      organizerDept,
      dateTime,
      venue,
      maxParticipants,
      posterUrl,
      description,
      createdBy: req.user._id,
      status: 'Pending Review',
      requestedFaculty,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private/Student
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // Check if event is approved
    if (event.status !== 'Approved') {
      res.status(400);
      throw new Error('Registration is not open for this event');
    }

    const alreadyRegistered = await Registration.findOne({
      eventId: event._id,
      studentId: req.user._id,
    });

    if (alreadyRegistered) {
      res.status(400);
      throw new Error('Already registered for this event');
    }

    const totalRegistrations = await Registration.countDocuments({ eventId: event._id });
    if (totalRegistrations >= event.maxParticipants) {
      res.status(400);
      throw new Error('Event capacity reached');
    }

    const registration = new Registration({
      eventId: event._id,
      studentId: req.user._id,
      status: 'Registered',
    });

    const savedRegistration = await registration.save();
    res.status(201).json(savedRegistration);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events awaiting approval
// @route   GET /api/events/pending
// @access  Private/Faculty/Admin
const getPendingEvents = async (req, res, next) => {
  try {
    const pendingEvents = await Event.find({ status: 'Pending' }).populate('createdBy', 'name email role clubName');
    res.status(200).json(pendingEvents);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event status (Approval workflow)
// @route   PUT /api/events/:id/status
// @access  Private/Faculty/Admin
const updateEventStatus = async (req, res, next) => {
  const { status } = req.body;
  
  try {
    if (!status || !['Approved', 'Rejected', 'Closed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid event status');
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    event.status = status;
    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered students for a specific event
// @route   GET /api/events/:eventId/registrations
// @access  Private/Organizer/Faculty/Admin
const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    let query = { eventId: req.params.eventId };
    if (req.query.status) {
      let statusParam = req.query.status;
      if (statusParam === 'Present') {
        statusParam = 'Checked-in';
      }
      query.status = statusParam;
    }

    const registrations = await Registration.find(query)
      .populate('studentId', 'name email regNo deptYear mobileNumber')
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event leaderboard (sort students by points descending)
// @route   GET /api/events/:eventId/leaderboard
// @access  Public
const getEventLeaderboard = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate('studentId', 'name regNo deptYear')
      .sort({ points: -1, scanTime: 1 });

    const topThree = registrations.slice(0, 3);
    const others = registrations.slice(3);

    res.status(200).json({
      success: true,
      topThree,
      others,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalize event attendance (compile present & absent lists)
// @route   POST /api/events/:eventId/attendance/finalize
// @access  Private/Organizer/Faculty/Admin
const finalizeEventAttendance = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    const registrations = await Registration.find({ eventId: event._id });

    const presentStudents = [];
    const absentStudents = [];

    registrations.forEach((reg) => {
      if (reg.status === 'Checked-in') {
        presentStudents.push({
          studentId: reg.studentId,
          scanTime: reg.scanTime || new Date(),
        });
      } else {
        absentStudents.push(reg.studentId);
      }
    });

    const attendance = await Attendance.findOneAndUpdate(
      { eventId: event._id },
      {
        eventId: event._id,
        presentStudents,
        absentStudents,
        markedBy: req.user._id,
        takenAt: new Date(),
      },
      { new: true, upsert: true }
    ).populate([
      { path: 'presentStudents.studentId', select: 'name email regNo deptYear mobileNumber' },
      { path: 'absentStudents', select: 'name email regNo deptYear mobileNumber' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Attendance successfully finalized',
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  getPendingEvents,
  updateEventStatus,
  getEventRegistrations,
  getEventLeaderboard,
  finalizeEventAttendance,
};
