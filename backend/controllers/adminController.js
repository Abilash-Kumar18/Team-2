const User = require('../models/User');

// @desc    Create Faculty Account
// @route   POST /api/admin/create-faculty
// @access  Private/Admin
const createFaculty = async (req, res, next) => {
  let { name, email, password } = req.body;

  try {
    // NoSQL Injection prevention
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400);
      throw new Error('Invalid input types. All fields must be strings.');
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, email, password)');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      role: 'faculty',
      name,
      email,
      password,
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFaculty,
};
