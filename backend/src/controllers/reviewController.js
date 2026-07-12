const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { carId, rating, title, comment, bookingId } = req.body;
    const existing = await Review.findOne({ user: req.user.id, carId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this car' });
    }
    const review = new Review({
      user: req.user.id, carId, rating, title, comment, bookingId,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;
    const reviews = await Review.find({ carId }).populate('user', 'name').sort({ createdAt: -1 });
    const avgResult = await Review.aggregate([
      { $match: { carId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const stats = avgResult.length > 0 ? { avgRating: avgResult[0].avgRating, count: avgResult[0].count } : { avgRating: 0, count: 0 };
    res.json({ reviews, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
