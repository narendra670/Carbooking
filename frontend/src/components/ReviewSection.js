import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, size = 'w-5 h-5', interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition`}
        >
          <svg className={`${size} ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const ReviewSection = ({ carId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const fetchReviews = async () => {
    try {
      const { data } = await reviewsAPI.getCarReviews(carId);
      setReviews(data.reviews || []);
      setStats(data.stats || { avgRating: 0, count: 0 });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating || !formData.comment) return;
    setSubmitting(true);
    try {
      await reviewsAPI.create({ carId, ...formData });
      setFormData({ rating: 0, title: '', comment: '' });
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewsAPI.delete(reviewId);
      fetchReviews();
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    percentage: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 animate-slideIn">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <StarRating rating={formData.rating} interactive onChange={(r) => setFormData(prev => ({ ...prev, rating: r }))} size="w-7 h-7" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Summarize your experience" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
            <textarea value={formData.comment} onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} placeholder="Tell us about your experience..." rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 resize-none" required />
          </div>
          <button type="submit" disabled={submitting || !formData.rating} className="btn-primary text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:border-r md:pr-6">
            <div className="text-5xl font-bold text-gray-800">{stats.avgRating ? stats.avgRating.toFixed(1) : '0.0'}</div>
            <StarRating rating={Math.round(stats.avgRating || 0)} size="w-5 h-5" />
            <p className="text-gray-500 mt-1">{stats.count} review{stats.count !== 1 ? 's' : ''}</p>
            <div className="mt-4 space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-gray-600">{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="w-6 text-gray-500 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">{review.user?.name?.charAt(0) || 'U'}</span>
                        </div>
                        <span className="font-medium text-gray-800">{review.user?.name || 'Anonymous'}</span>
                      </div>
                      <StarRating rating={review.rating} size="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      {user && (user.id === review.user?._id || user.role === 'admin') && (
                        <button onClick={() => handleDelete(review._id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                      )}
                    </div>
                  </div>
                  {review.title && <p className="font-medium text-gray-700 mt-2">{review.title}</p>}
                  <p className="text-gray-600 mt-1 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { StarRating };
export default ReviewSection;
