const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = async () => {
  try {
    const mongoose = require('mongoose');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const eventRoutes = require('./routes/eventRoutes');
const scanRoutes = require('./routes/scanRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

// Load environment variables if package installed
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined!');
  process.exit(1);
}

connectDB();

const app = express();

app.use(helmet());

// Dynamic CORS configuration to allow all localhost ports during development
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') || 
      origin.startsWith('http://127.0.0.1:') || 
      origin === 'https://team-2-frontend-pink.vercel.app'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    message: 'Too many attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

app.get('/', (req, res) => {
  res.send('Event Management API is running...');
});

// Fallback middlewares
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

module.exports = app;
