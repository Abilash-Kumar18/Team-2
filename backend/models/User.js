const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['student', 'organizer', 'faculty', 'admin'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    regNo: {
      type: String,
      required: function() {
        return this.role === 'student' || this.role === 'organizer';
      },
      trim: true,
    },
    deptYear: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
      trim: true,
    },
    clubName: {
      type: String,
      required: function() {
        return this.role === 'organizer';
      },
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to match passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
