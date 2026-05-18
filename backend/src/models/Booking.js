const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: {
    used_car_sku_id: { type: String, required: true },
    model: { type: String, required: true },
    oem: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    year: { type: Number },
    bodyType: { type: String },
  },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  withDriver: { type: Boolean, default: false },
  driverCharge: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
