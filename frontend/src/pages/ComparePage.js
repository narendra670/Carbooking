import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { carsAPI } from '../services/api';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCars, setSelectedCars] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const addToCompare = async (carId) => {
    if (selectedCars.length >= 2) return;
    if (selectedCars.includes(carId)) return;

    const newSelected = [...selectedCars, carId];
    setSelectedCars(newSelected);

    if (newSelected.length === 2) {
      setLoading(true);
      try {
        const { data } = await carsAPI.compare(newSelected[0], newSelected[1]);
        setComparison(data);
      } catch (error) {
        console.error('Error comparing cars:', error);
      }
      setLoading(false);
    }
  };

  const removeFromCompare = (carId) => {
    setSelectedCars(prev => prev.filter(id => id !== carId));
    setComparison(null);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const { data } = await carsAPI.search({ query: searchTerm });
      setSearchResults(data);
      setShowSearch(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const specs = [
    { label: 'Model', key: 'model' },
    { label: 'Brand', key: 'oem' },
    { label: 'Body Type', key: 'bodyType' },
    { label: 'Year', key: 'year' },
    { label: 'Fuel Type', key: 'fuelType' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Mileage', key: 'mileage', format: v => `${v} kmpl` },
    { label: 'Seating', key: 'seating', format: v => `${v} seats` },
    { label: 'Daily Rate', key: 'dailyRate', format: v => `₹${v}` },
    { label: 'Kilometers', key: 'km', format: v => `${v} km` },
  ];

  const getValue = (car, spec) => {
    const val = car[spec.key];
    return spec.format ? spec.format(val) : val;
  };

  const isBetter = (specKey, car1Val, car2Val) => {
    if (typeof car1Val !== 'number' || typeof car2Val !== 'number') return null;
    const lowerBetter = ['dailyRate'];
    const higherBetter = ['mileage', 'seating', 'year'];
    if (lowerBetter.includes(specKey)) return car1Val < car2Val ? 'car1' : car1Val > car2Val ? 'car2' : null;
    if (higherBetter.includes(specKey)) return car1Val > car2Val ? 'car1' : car1Val < car2Val ? 'car2' : null;
    return null;
  };

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Compare Cars</h1>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search cars to compare..." className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch} className="btn-primary text-white px-6 py-2 rounded-lg">Search</button>
          </div>
        </div>

        {showSearch && searchResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Select cars to compare:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.filter(car => !selectedCars.includes(car.used_car_sku_id)).slice(0, 8).map(car => (
                <button key={car.used_car_sku_id} onClick={() => addToCompare(car.used_car_sku_id)} disabled={selectedCars.length >= 2} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-left">
                  <img src={car.image || '/placeholder-car.jpg'} alt={car.model} className="w-16 h-12 object-cover rounded" />
                  <div>
                    <p className="font-medium text-gray-800">{car.oem} {car.model}</p>
                    <p className="text-sm text-gray-500">₹{car.dailyRate}/day • {car.bodyType}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCars.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="text-gray-600 font-medium self-center">Selected:</span>
            {selectedCars.map(id => (
              <span key={id} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full flex items-center gap-2">
                Car {selectedCars.indexOf(id) + 1}
                <button onClick={() => removeFromCompare(id)} className="text-primary-800 hover:text-primary-900">×</button>
              </span>
            ))}
            {selectedCars.length < 2 && <span className="text-gray-400 text-sm self-center">Select {2 - selectedCars.length} more car(s)</span>}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        )}

        {comparison && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50">
              <div className="p-4"></div>
              <div className="p-4 text-center">
                <img src={comparison.car1.image || '/placeholder-car.jpg'} alt={comparison.car1.model} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-gray-800">{comparison.car1.oem} {comparison.car1.model}</h3>
              </div>
              <div className="p-4 text-center">
                <img src={comparison.car2.image || '/placeholder-car.jpg'} alt={comparison.car2.model} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-gray-800">{comparison.car2.oem} {comparison.car2.model}</h3>
              </div>
            </div>
            <div className="divide-y">
              {specs.map(spec => {
                const val1 = getValue(comparison.car1, spec);
                const val2 = getValue(comparison.car2, spec);
                const better = isBetter(spec.key, comparison.car1[spec.key], comparison.car2[spec.key]);
                return (
                  <div key={spec.label} className="grid grid-cols-3">
                    <div className="p-4 font-medium text-gray-700 bg-gray-50">{spec.label}</div>
                    <div className={`p-4 text-center ${better === 'car1' ? 'bg-green-50 font-bold text-green-700' : ''}`}>{val1}</div>
                    <div className={`p-4 text-center ${better === 'car2' ? 'bg-green-50 font-bold text-green-700' : ''}`}>{val2}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!comparison && !loading && (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">Select 2 cars to compare their specifications</p>
            <Link to="/cars" className="mt-4 inline-block text-primary-600 font-medium">Browse Cars</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
