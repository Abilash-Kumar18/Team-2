const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Approve Organizer Account
// @route   PUT /api/faculty/approve-organizer/:id
// @access  Private/Faculty
const approveOrganizer = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid organizer ID format');
    }

    const organizer = await User.findById(id);
    if (!organizer) {
      res.status(404);
      throw new Error('Organizer not found');
    }

    if (organizer.role !== 'organizer') {
      res.status(400);
      throw new Error('User is not an organizer');
    }

    organizer.isApproved = true;
    await organizer.save();

    res.json({
      success: true,
      message: 'Organizer approved successfully',
      user: {
        _id: organizer._id,
        role: organizer.role,
        name: organizer.name,
        email: organizer.email,
        isApproved: organizer.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  approveOrganizer,
};
