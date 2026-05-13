const express = require('express');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }
  const bookings = await Booking.find(filter).populate('car', 'name image price').sort('-createdAt');
  res.json(bookings);
});

router.get('/stats', protect, async (req, res) => {
  const match = {};
  if (req.user.role !== 'admin') {
    match.user = req.user._id;
  }

  const total = await Booking.countDocuments(match);
  const byStatus = await Booking.aggregate([
    { $match: match },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({ total, byStatus });
});

router.get('/:id', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('car', 'name image price');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(booking);
});

router.post('/', protect, async (req, res) => {
  const { car: carId, startDate, endDate } = req.body;

  const car = await Car.findById(carId);
  if (!car) return res.status(404).json({ message: 'Car not found' });

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalPrice = days * car.price;

  const conflict = await Booking.findOne({
    car: carId,
    status: { $in: ['pending', 'confirmed'] },
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  });

  if (conflict) {
    return res.status(400).json({ message: 'Car not available for selected dates' });
  }

  const booking = await Booking.create({
    user: req.user._id,
    car: carId,
    startDate,
    endDate,
    totalPrice,
  });

  res.status(201).json(booking);
});

router.put('/:id/cancel', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
});

router.put('/:id/status', protect, admin, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

module.exports = router;
