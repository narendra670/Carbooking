import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: '',
    withDriver: false,
  });
  const [calculating, setCalculating] = useState(false);

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

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading || !car) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const pickupDate = bookingData.pickupDate ? new Date(bookingData.pickupDate) : null;
  const returnDate = bookingData.returnDate ? new Date(bookingData.returnDate) : null;
  const totalDays = pickupDate && returnDate && returnDate > pickupDate ? Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)) : 0;
  const driverCharge = bookingData.withDriver ? 500 * totalDays : 0;
  const subtotal = car.dailyRate * totalDays;
  const totalAmount = subtotal + driverCharge;

  const handleBooking = async () => {
    if (!pickupDate || !returnDate || totalDays <= 0) {
      alert('Please select valid pickup and return dates');
      return;
    }
    setCalculating(true);
    try {
      const { data } = await bookingsAPI.create({
        car: {
          used_car_sku_id: car.used_car_sku_id,
          model: car.model,
          oem: car.oem,
          price: car.price,
          image: car.image,
          year: car.year,
          bodyType: car.bodyType,
          dailyRate: car.dailyRate,
        },
        pickupDate: bookingData.pickupDate,
        returnDate: bookingData.returnDate,
        withDriver: bookingData.withDriver,
      });
      navigate(`/payment/${data._id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
    setCalculating(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Your Car</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Car Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <img src={car.image || '/placeholder-car.jpg'} alt={car.model} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-bold text-gray-800">{car.oem} {car.model}</h2>
            <p className="text-gray-500">{car.variant_name}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.bodyType}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.fuelType}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.transmission}</span>
            </div>
            <div className="mt-4 p-3 bg-primary-50 rounded-lg">
              <span className="text-2xl font-bold text-primary-600">₹{car.dailyRate}</span>
              <span className="text-gray-500">/day</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                <input type="date" name="pickupDate" value={bookingData.pickupDate} onChange={handleChange} min={today} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input type="date" name="returnDate" value={bookingData.returnDate} onChange={handleChange} min={bookingData.pickupDate || today} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" name="withDriver" checked={bookingData.withDriver} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                <div>
                  <label className="font-medium text-gray-700">Add Driver</label>
                  <p className="text-sm text-gray-500">₹500/day extra</p>
                </div>
              </div>
            </div>

            {totalDays > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">₹{car.dailyRate} × {totalDays} days</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {bookingData.withDriver && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver (₹500 × {totalDays} days)</span>
                    <span className="font-medium">₹{driverCharge.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button onClick={handleBooking} disabled={totalDays <= 0 || calculating} className="w-full mt-6 btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {calculating ? 'Processing...' : `Proceed to Pay ₹${totalAmount.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
