import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { carsAPI } from '../services/api';
import CarCard from '../components/CarCard';

const CarsListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    bodyType: searchParams.get('bodyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCars();
  }, [searchParams]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
      const { data } = await carsAPI.getAll(params);
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
    setSearchParams(params);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ brand: '', fuelType: '', transmission: '', bodyType: '', minPrice: '', maxPrice: '', sort: '' });
    setSearchParams({});
  };

  const brands = [...new Set(cars.map(c => c.oem))].sort();
  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">All Cars ({cars.length})</h1>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters {activeFilterCount > 0 && <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>}
            </button>
            <select value={filters.sort} onChange={(e) => { handleFilterChange('sort', e.target.value); }} className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 animate-slideIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select value={filters.fuelType} onChange={(e) => handleFilterChange('fuelType', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select value={filters.transmission} onChange={(e) => handleFilterChange('transmission', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <select value={filters.bodyType} onChange={(e) => handleFilterChange('bodyType', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹/day)</label>
                <input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} placeholder="Min" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹/day)</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} placeholder="Max" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={applyFilters} className="btn-primary text-white px-6 py-2 rounded-lg font-medium">Apply Filters</button>
              <button onClick={resetFilters} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300">Reset</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
            <button onClick={resetFilters} className="mt-4 text-primary-600 font-medium">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => <CarCard key={car.used_car_sku_id} car={car} showCompare />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsListingPage;
