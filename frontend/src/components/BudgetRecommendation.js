import React, { useState } from 'react';
import { carsAPI } from '../services/api';
import CarCard from './CarCard';

const BudgetRecommendation = () => {
  const [budget, setBudget] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!budget) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await carsAPI.getBudget(budget);
      setCars(data);
    } catch (error) {
      console.error('Error fetching budget cars:', error);
    }
    setLoading(false);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Smart Budget Recommendation</h2>
          <p className="text-gray-600">Enter your daily budget and we'll find the best cars for you</p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter daily budget"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button type="submit" className="btn-primary text-white px-6 py-3 rounded-lg font-medium">
              Find Cars
            </button>
          </div>
        </form>
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}
        {searched && !loading && cars.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No cars found in this budget range. Try increasing your budget!</p>
          </div>
        )}
        {cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.slice(0, 6).map(car => (
              <CarCard key={car.used_car_sku_id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BudgetRecommendation;
