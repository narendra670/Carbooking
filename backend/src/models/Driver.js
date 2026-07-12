const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  license: { type: String, required: true },
  photo: { type: String, default: '/placeholder-driver.jpg' },
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  totalTrips: { type: Number, default: 0 },
  experience: { type: Number, default: 1 },
  languages: [{ type: String, default: ['Hindi', 'English'] }],
  available: { type: Boolean, default: true },
  currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
