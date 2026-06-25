const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/event_management';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(uri);
    console.log('Connected successfully.');

    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@college.edu';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log(`Admin user with email "${adminEmail}" already exists.`);
      process.exit(0);
    }

    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'adminPassword123';
    // Create admin user. Password will be hashed automatically by schema pre-save hook
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isApproved: true,
    });

    console.log('\n=============================================');
    console.log('Admin user seeded successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('=============================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
