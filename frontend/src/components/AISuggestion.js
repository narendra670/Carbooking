import React, { useState } from 'react';
import { carsAPI } from '../services/api';
import CarCard from './CarCard';

const AISuggestion = () => {
  const [purpose, setPurpose] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const purposes = [
    { value: 'family trip', label: 'Family Trip', icon: '👨‍👩‍👧‍👦', desc: 'Spacious SUVs for family comfort', color: 'bg-green-100 text-green-700' },
    { value: 'office work', label: 'Office Work', icon: '💼', desc: 'Professional sedans for daily commute', color: 'bg-blue-100 text-blue-700' },
    { value: 'solo travel', label: 'Solo Travel', icon: '🚗', desc: 'Compact hatchbacks for easy driving', color: 'bg-purple-100 text-purple-700' },
  ];

  const handleSubmit = async (selectedPurpose) => {
    setPurpose(selectedPurpose);
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await carsAPI.getPurpose(selectedPurpose);
      setCars(data);
    } catch (error) {
      console.error('Error fetching purpose cars:', error);
    }
    setLoading(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">AI-Powered Car Suggestions</h2>
          <p className="text-gray-600">Tell us your purpose, and we'll recommend the perfect car</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {purposes.map(p => (
            <button
              key={p.value}
              onClick={() => handleSubmit(p.value)}
              className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${purpose === p.value ? 'border-primary-500 bg-primary-50 scale-105' : 'border-gray-200 bg-white hover:border-primary-300'}`}
            >
              <span className="text-4xl mb-2">{p.icon}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.color}`}>{p.label}</span>
              <span className="text-xs text-gray-500 mt-2">{p.desc}</span>
            </button>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}
        {searched && !loading && cars.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recommended for {purposes.find(p => p.value === purpose)?.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.slice(0, 6).map(car => (
                <CarCard key={car.used_car_sku_id} car={car} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AISuggestion;
