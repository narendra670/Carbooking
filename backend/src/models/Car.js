const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  used_car_sku_id: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  oem: { type: String, required: true },
  variant_name: { type: String },
  price: { type: Number, required: true },
  formatted_price: { type: String },
  image: { type: String },
  year: { type: Number },
  km: { type: String },
  fuelType: { type: String },
  transmission: { type: String },
  bodyType: { type: String },
  city: { type: String },
  locality: { type: String },
  owner: { type: Number },
  isAvailable: { type: Boolean, default: true },
  mileage: { type: Number, default: 0 },
  seating: { type: Number, default: 5 },
  features: [{ type: String }],
  dailyRate: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
