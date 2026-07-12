const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 100 },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });

reviewSchema.index({ carId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
