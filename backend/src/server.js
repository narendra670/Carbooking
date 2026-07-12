const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const driverRoutes = require('./routes/driverRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/drivers', driverRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Car Booking API is running' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
