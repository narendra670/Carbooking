const express = require('express');
const router = express.Router();
const { createReview, getCarReviews, getUserReviews, deleteReview } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createReview);
router.get('/car/:carId', getCarReviews);
router.get('/user', auth, getUserReviews);
router.delete('/:id', auth, deleteReview);

module.exports = router;
