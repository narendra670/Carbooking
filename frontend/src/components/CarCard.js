import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';

const CarCard = ({ car, showCompare = false, onCompareToggle, isCompared = false }) => {
  const { user, toggleWishlist } = useAuth();
  const isWishlisted = user?.wishlist?.includes(car.used_car_sku_id);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, count: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await reviewsAPI.getCarReviews(car.used_car_sku_id);
        setReviewStats(data.stats || { avgRating: 0, count: 0 });
      } catch (error) {}
    };
    fetchStats();
  }, [car.used_car_sku_id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await toggleWishlist(car.used_car_sku_id);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCompareToggle(car);
  };

  return (
    <div className="car-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
      <div className="relative">
        <img src={car.image || '/placeholder-car.jpg'} alt={car.model} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button onClick={handleWishlist} className={`p-2 rounded-full ${isWishlisted ? 'bg-red-500 shadow-md' : 'bg-white/80 backdrop-blur-sm'} hover:bg-red-500 transition-all duration-200`}>
            <svg className={`w-5 h-5 ${isWishlisted ? 'text-white' : 'text-gray-700'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {showCompare && (
            <button onClick={handleCompare} className={`p-2 rounded-full ${isCompared ? 'bg-blue-500 shadow-md' : 'bg-white/80 backdrop-blur-sm'} hover:bg-blue-500 transition-all duration-200`}>
              <svg className={`w-5 h-5 ${isCompared ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">{car.bodyType}</span>
        </div>
        {reviewStats.count > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {reviewStats.avgRating.toFixed(1)} ({reviewStats.count})
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{car.oem} {car.model}</h3>
        <p className="text-sm text-gray-500 truncate">{car.variant_name}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.year}</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.fuelType}</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.transmission}</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.km} km</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-2xl font-bold text-primary-600">₹{car.dailyRate}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          <Link to={`/cars/${car.used_car_sku_id}`} className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
