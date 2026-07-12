import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CarAvailabilityCalendar from '../components/CarAvailabilityCalendar';
import DriverSelection from '../components/DriverSelection';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: '',
    withDriver: false,
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [calculating, setCalculating] = useState(false);

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
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleCalendarDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (!bookingData.pickupDate || (bookingData.pickupDate && bookingData.returnDate)) {
      setBookingData(prev => ({ ...prev, pickupDate: dateStr, returnDate: '' }));
    } else {
      const pickup = new Date(bookingData.pickupDate);
      if (date > pickup) {
        setBookingData(prev => ({ ...prev, returnDate: dateStr }));
      } else {
        setBookingData(prev => ({ ...prev, pickupDate: dateStr, returnDate: '' }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'withDriver' && !checked) setSelectedDriver(null);
  };

  const pickupDate = bookingData.pickupDate ? new Date(bookingData.pickupDate) : null;
  const returnDate = bookingData.returnDate ? new Date(bookingData.returnDate) : null;
  const totalDays = pickupDate && returnDate && returnDate > pickupDate ? Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)) : 0;
  const driverCharge = bookingData.withDriver ? 500 * totalDays : 0;
  const subtotal = car ? car.dailyRate * totalDays : 0;
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

      if (bookingData.withDriver && selectedDriver) {
        await bookingsAPI.assignDriver(data._id, {
          driverId: selectedDriver._id,
          driverName: selectedDriver.name,
          driverPhone: selectedDriver.phone,
          driverPhoto: selectedDriver.photo,
          driverRating: selectedDriver.rating,
        });
      }

      navigate(`/payment/${data._id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
    setCalculating(false);
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (error) {
    return <div className="text-center py-20"><p className="text-red-500 text-lg mb-2">{error}</p><button onClick={() => window.location.reload()} className="text-primary-600 font-medium hover:underline">Retry</button></div>;
  }

  if (!car) return null;

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Your Car</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <img src={car.image || '/placeholder-car.jpg'} alt={car.model} className="w-32 h-24 object-cover rounded-lg" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{car.oem} {car.model}</h2>
                  <p className="text-gray-500">{car.variant_name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.bodyType}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.fuelType}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.transmission}</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-2xl font-bold text-primary-600">₹{car.dailyRate}</span>
                  <span className="text-gray-500">/day</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Select Dates
              </h3>
              <CarAvailabilityCalendar carId={id} onSelectDates={handleCalendarDateSelect} selectedPickup={bookingData.pickupDate} selectedReturn={bookingData.returnDate} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                  <input type="date" name="pickupDate" value={bookingData.pickupDate} onChange={handleChange} min={today} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                  <input type="date" name="returnDate" value={bookingData.returnDate} onChange={handleChange} min={bookingData.pickupDate || today} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Add Driver
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">₹500/day extra</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="withDriver" checked={bookingData.withDriver} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
              {bookingData.withDriver && (
                <DriverSelection selectedDriver={selectedDriver} onDriverSelect={setSelectedDriver} />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h3>
              {totalDays > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Car</span>
                    <span className="font-medium">{car.oem} {car.model}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Pickup</span>
                    <span className="font-medium">{new Date(bookingData.pickupDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Return</span>
                    <span className="font-medium">{new Date(bookingData.returnDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">₹{car.dailyRate} x {totalDays} days</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {bookingData.withDriver && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Driver (₹500 x {totalDays} days)</span>
                      <span className="font-medium">₹{driverCharge.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedDriver && (
                    <div className="flex items-center gap-2 py-2 border-b">
                      <img src={selectedDriver.photo} alt="" className="w-8 h-8 rounded-full" />
                      <span className="text-sm text-gray-600">{selectedDriver.name}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6">Select dates to see pricing</p>
              )}
              <button onClick={handleBooking} disabled={totalDays <= 0 || calculating} className="w-full mt-6 btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition">
                {calculating ? 'Processing...' : totalDays > 0 ? `Proceed to Pay ₹${totalAmount.toLocaleString()}` : 'Select Dates'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
