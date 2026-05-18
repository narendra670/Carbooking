import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { carsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await carsAPI.getById(id);
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
      }
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  const handleWishlist = async () => {
    if (user) {
      await toggleWishlist(car.used_car_sku_id);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!car) {
    return <div className="text-center py-20"><p className="text-gray-500 text-lg">Car not found</p><Link to="/cars" className="text-primary-600">Back to Cars</Link></div>;
  }

  const isWishlisted = user?.wishlist?.includes(car.used_car_sku_id);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <img src={car.image || '/placeholder-car.jpg'} alt={car.model} className="w-full h-80 md:h-96 object-cover rounded-xl shadow-lg" />
          </div>

          {/* Details */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{car.oem} {car.model}</h1>
                <p className="text-gray-500">{car.variant_name}</p>
              </div>
              <button onClick={handleWishlist} className={`p-3 rounded-full ${isWishlisted ? 'bg-red-500' : 'bg-gray-100'} hover:bg-red-500 transition`}>
                <svg className={`w-6 h-6 ${isWishlisted ? 'text-white' : 'text-gray-700'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-xl">
              <span className="text-4xl font-bold text-primary-600">₹{car.dailyRate}</span>
              <span className="text-gray-500 text-lg">/day</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: 'Year', value: car.year },
                { label: 'Kilometers', value: `${car.km} km` },
                { label: 'Fuel Type', value: car.fuelType },
                { label: 'Transmission', value: car.transmission },
                { label: 'Body Type', value: car.bodyType },
                { label: 'Owner', value: `${car.owner}${car.owner === 1 ? 'st' : car.owner === 2 ? 'nd' : 'rd'} Owner` },
                { label: 'Mileage', value: `${car.mileage} kmpl` },
                { label: 'Seating', value: `${car.seating} seats` },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{f}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to={`/booking/${car.used_car_sku_id}`} className="flex-1 btn-primary text-white py-3 rounded-lg font-semibold text-center text-lg">Book Now</Link>
              <button onClick={() => navigate('/compare')} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">Compare</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
