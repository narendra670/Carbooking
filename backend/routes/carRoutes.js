const express = require('express');
const Car = require('../models/Car');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { brand, search, minPrice, maxPrice } = req.query;
  const filter = {};

  if (brand) filter.brand = brand;
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const cars = await Car.find(filter);
  res.json(cars);
});

router.get('/brands', async (req, res) => {
  const brands = await Car.distinct('brand');
  res.json(brands);
});

router.get('/:id', async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

router.get('/:id/availability', async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: 'Car not found' });

  const Booking = require('../models/Booking');
  const { startDate, endDate } = req.query;

  const conflict = await Booking.findOne({
    car: req.params.id,
    status: { $in: ['pending', 'confirmed'] },
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  });

  res.json({ available: !conflict });
});

router.post('/', protect, admin, async (req, res) => {
  const car = await Car.create(req.body);
  res.status(201).json(car);
});

router.put('/:id', protect, admin, async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

router.delete('/:id', protect, admin, async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json({ message: 'Car removed' });
});

module.exports = router;
