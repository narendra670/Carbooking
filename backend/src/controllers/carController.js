const { fetchCarsFromApiify, getCarsByBudget, getCarsByPurpose } = require('../utils/apifyService');
const Car = require('../models/Car');

let cachedCars = null;
let lastFetch = null;

const getCachedOrFetch = async () => {
  const now = Date.now();
  if (cachedCars && lastFetch && (now - lastFetch) < 5 * 60 * 1000) {
    return cachedCars;
  }
  cachedCars = await fetchCarsFromApiify();
  lastFetch = now;
  return cachedCars;
};

exports.getAllCars = async (req, res) => {
  try {
    const { brand, fuelType, transmission, bodyType, minPrice, maxPrice, sort } = req.query;
    let cars = await getCachedOrFetch();

    if (brand) cars = cars.filter(c => c.oem.toLowerCase().includes(brand.toLowerCase()));
    if (fuelType) cars = cars.filter(c => c.fuelType.toLowerCase() === fuelType.toLowerCase());
    if (transmission) cars = cars.filter(c => c.transmission.toLowerCase() === transmission.toLowerCase());
    if (bodyType) cars = cars.filter(c => c.bodyType.toLowerCase() === bodyType.toLowerCase());
    if (minPrice) cars = cars.filter(c => c.dailyRate >= Number(minPrice));
    if (maxPrice) cars = cars.filter(c => c.dailyRate <= Number(maxPrice));

    if (sort === 'price-low') cars.sort((a, b) => a.dailyRate - b.dailyRate);
    else if (sort === 'price-high') cars.sort((a, b) => b.dailyRate - a.dailyRate);
    else if (sort === 'year-new') cars.sort((a, b) => b.year - a.year);

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const cars = await getCachedOrFetch();
    const car = cars.find(c => c.used_car_sku_id === req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBudgetCars = async (req, res) => {
  try {
    const { budget } = req.query;
    if (!budget) return res.status(400).json({ message: 'Budget is required' });
    const cars = await getCachedOrFetch();
    const budgetCars = getCarsByBudget(cars, Number(budget));
    res.json(budgetCars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPurposeCars = async (req, res) => {
  try {
    const { purpose } = req.query;
    if (!purpose) return res.status(400).json({ message: 'Purpose is required' });
    const cars = await getCachedOrFetch();
    const purposeCars = getCarsByPurpose(cars, purpose);
    res.json(purposeCars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.compareCars = async (req, res) => {
  try {
    const { car1, car2 } = req.query;
    if (!car1 || !car2) return res.status(400).json({ message: 'Both car IDs are required' });
    const cars = await getCachedOrFetch();
    const c1 = cars.find(c => c.used_car_sku_id === car1);
    const c2 = cars.find(c => c.used_car_sku_id === car2);
    if (!c1 || !c2) return res.status(404).json({ message: 'One or both cars not found' });
    res.json({ car1: c1, car2: c2 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchCars = async (req, res) => {
  try {
    const { query, city } = req.query;
    let cars = await getCachedOrFetch();
    if (query) {
      const q = query.toLowerCase();
      cars = cars.filter(c =>
        c.model.toLowerCase().includes(q) ||
        c.oem.toLowerCase().includes(q) ||
        c.bodyType.toLowerCase().includes(q)
      );
    }
    if (city) {
      cars = cars.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
    }
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
