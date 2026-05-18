import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI } from '../services/api';
import CarCard from '../components/CarCard';
import BudgetRecommendation from '../components/BudgetRecommendation';
import AISuggestion from '../components/AISuggestion';

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await carsAPI.getAll({ sort: 'price-low' });
        setFeaturedCars(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchCity) params.city = searchCity;
    window.location.href = `/cars?${new URLSearchParams(params)}`;
  };

  const categories = [
    { name: 'SUV', icon: '🚙', desc: 'Spacious & Powerful', color: 'from-green-400 to-green-600' },
    { name: 'Sedan', icon: '🚗', desc: 'Comfort & Style', color: 'from-blue-400 to-blue-600' },
    { name: 'Hatchback', icon: '🚘', desc: 'Compact & Efficient', color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Ride</h1>
            <p className="text-xl md:text-2xl text-blue-100">Browse, compare, and book cars at the best prices</p>
          </div>
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="Enter city" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-800" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg">Search Cars</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link key={cat.name} to={`/cars?bodyType=${cat.name}`} className={`bg-gradient-to-br ${cat.color} rounded-xl p-8 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                <span className="text-5xl mb-4 block">{cat.icon}</span>
                <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                <p className="text-white/80">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Featured Cars</h2>
            <Link to="/cars" className="text-primary-600 font-medium hover:text-primary-700">View All →</Link>
          </div>
          {loading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map(car => <CarCard key={car.used_car_sku_id} car={car} />)}
            </div>
          )}
        </div>
      </section>

      {/* Smart Budget Recommendation */}
      <BudgetRecommendation />

      {/* AI Suggestion */}
      <AISuggestion />

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Choose CarBook</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '💰', title: 'Best Prices', desc: 'Competitive daily rates with no hidden charges' },
              { icon: '🔒', title: 'Secure Booking', desc: 'Safe online payments with encrypted transactions' },
              { icon: '🚗', title: 'Wide Selection', desc: 'Choose from SUVs, Sedans, and Hatchbacks' },
              { icon: '📱', title: 'Easy Management', desc: 'Book, track, and manage from your dashboard' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
