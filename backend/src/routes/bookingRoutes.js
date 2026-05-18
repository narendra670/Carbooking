const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking, updatePayment, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createBooking);
router.get('/', auth, getUserBookings);
router.get('/admin/all', auth, adminAuth, getAllBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, cancelBooking);
router.put('/:id/payment', auth, updatePayment);
router.put('/admin/:id/status', auth, adminAuth, updateBookingStatus);

module.exports = router;
