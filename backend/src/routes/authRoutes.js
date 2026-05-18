const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateWishlist } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/wishlist', auth, updateWishlist);

module.exports = router;
