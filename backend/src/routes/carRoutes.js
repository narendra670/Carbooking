const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, getBudgetCars, getPurposeCars, compareCars, searchCars, getCarAvailability } = require('../controllers/carController');

router.get('/', getAllCars);
router.get('/search', searchCars);
router.get('/budget', getBudgetCars);
router.get('/purpose', getPurposeCars);
router.get('/compare', compareCars);
router.get('/:id/availability', getCarAvailability);
router.get('/:id', getCarById);

module.exports = router;
