import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { carsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CarAvailabilityCalendar from '../components/CarAvailabilityCalendar';
import ReviewSection from '../components/ReviewSection';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, count: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setError('');
        const { data } = await carsAPI.getById(id);
        setCar(data);
      } catch (error) {
        setError('Failed to load car details. Make sure the backend server is running.');
      }
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const { data } = await reviewsAPI.getCarReviews(id);
        setReviewStats(data.stats || { avgRating: 0, count: 0 });
      } catch (error) {}
    };
    fetchReviewStats();
  }, [id]);

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(car.used_car_sku_id);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (error) {
    return <div className="text-center py-20"><p className="text-red-500 text-lg mb-2">{error}</p><button onClick={() => window.location.reload()} className="text-primary-600 font-medium hover:underline">Retry</button><Link to="/cars" className="ml-4 text-primary-600 font-medium hover:underline">Back to Cars</Link></div>;
  }

  if (!car) {
    return <div className="text-center py-20"><p className="text-gray-500 text-lg">Car not found</p><Link to="/cars" className="text-primary-600">Back to Cars</Link></div>;
  }

  const isWishlisted = user?.wishlist?.includes(car.used_car_sku_id);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative">
              <img src={car.image || '/placeholder-car.jpg'} alt={car.model} className="w-full h-80 md:h-96 object-cover rounded-xl shadow-lg" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{car.bodyType}</span>
                {reviewStats.count > 0 && (
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {reviewStats.avgRating.toFixed(1)} ({reviewStats.count})
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6">
              <CarAvailabilityCalendar carId={id} />
            </div>
          </div>

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
                {car.features && car.features.length > 0 ? car.features.map((f, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{f}</span>
                )) : <span className="text-gray-400 text-sm">No features listed</span>}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to={`/booking/${car.used_car_sku_id}`} className="flex-1 btn-primary text-white py-3 rounded-lg font-semibold text-center text-lg">Book Now</Link>
              <button onClick={() => navigate('/compare')} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">Compare</button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex gap-2 mb-6 border-b pb-2">
            {['overview', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-t-lg font-medium capitalize transition ${activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {tab === 'reviews' ? `Reviews (${reviewStats.count})` : 'Overview'}
              </button>
            ))}
          </div>
          {activeTab === 'reviews' && <ReviewSection carId={id} />}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">About this car</h3>
              <p className="text-gray-600 leading-relaxed">
                The {car.oem} {car.model} {car.variant_name ? `(${car.variant_name})` : ''} is a {car.year} {car.bodyType.toLowerCase()} with {car.fuelType.toLowerCase()} engine and {car.transmission.toLowerCase()} transmission.
                With {car.km} km on the odometer and seating for {car.seating} passengers, this car offers a mileage of {car.mileage} kmpl.
                Available for just ₹{car.dailyRate}/day, it's perfect for your next trip.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {car.features && car.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
