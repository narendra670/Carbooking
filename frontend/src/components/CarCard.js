import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CarCard = ({ car, showCompare = false, onCompareToggle, isCompared = false }) => {
  const { user, toggleWishlist } = useAuth();
  const isWishlisted = user?.wishlist?.includes(car.used_car_sku_id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await toggleWishlist(car.used_car_sku_id);
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
          <button onClick={handleWishlist} className={`p-2 rounded-full ${isWishlisted ? 'bg-red-500' : 'bg-white/80'} hover:bg-red-500 transition`}>
            <svg className={`w-5 h-5 ${isWishlisted ? 'text-white' : 'text-gray-700'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {showCompare && (
            <button onClick={handleCompare} className={`p-2 rounded-full ${isCompared ? 'bg-primary-500' : 'bg-white/80'} hover:bg-primary-500 transition`}>
              <svg className={`w-5 h-5 ${isCompared ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold">{car.bodyType}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{car.oem} {car.model}</h3>
        <p className="text-sm text-gray-500">{car.variant_name}</p>
        <div className="flex flex-wrap gap-2 mt-3">
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
