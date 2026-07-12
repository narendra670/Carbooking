const express = require('express');
const router = express.Router();
const { getAvailableDrivers, getDriverById, getAllDrivers, seedDrivers, updateDriverAvailability } = require('../controllers/driverController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/available', getAvailableDrivers);
router.get('/all', auth, adminAuth, getAllDrivers);
router.post('/seed', seedDrivers);
router.put('/:id/availability', auth, adminAuth, updateDriverAvailability);
router.get('/:id', getDriverById);

module.exports = router;
