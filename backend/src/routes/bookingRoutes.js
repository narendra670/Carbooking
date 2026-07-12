const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking, updatePayment, getAllBookings, updateBookingStatus, getBookingStatus, assignDriver } = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createBooking);
router.get('/', auth, getUserBookings);
router.get('/admin/all', auth, adminAuth, getAllBookings);
router.get('/:id/status', auth, getBookingStatus);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, cancelBooking);
router.put('/:id/payment', auth, updatePayment);
router.put('/:id/assign-driver', auth, assignDriver);
router.put('/admin/:id/status', auth, adminAuth, updateBookingStatus);

module.exports = router;
