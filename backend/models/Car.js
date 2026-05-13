const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Car name is required'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
  },
  image: {
    type: String,
    default: '/placeholder.jpg',
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
  },
  fuel: {
    type: String,
    required: [true, 'Fuel type is required'],
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
  },
  price: {
    type: Number,
    required: [true, 'Daily price is required'],
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
