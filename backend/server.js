const express = require('express');
const cors = require('cors');
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
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scanRoutes = require('./routes/scanRoutes');

// Load environment variables if package installed
// require('dotenv').config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
  res.send('Event Management API is running...');
});

// Fallback middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
