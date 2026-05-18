import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await bookingsAPI.getBooking(id);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        navigate('/dashboard');
      }
      setLoading(false);
    };
    fetchBooking();
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!booking) return null;

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await bookingsAPI.updatePayment(id, {
        razorpayOrderId: `ORDER_${Date.now()}`,
        razorpayPaymentId: `PAY_${Date.now()}`,
        razorpaySignature: `SIG_${Date.now()}`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <div className="py-8">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Payment</h1>
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">₹{booking.totalAmount.toLocaleString()}</h2>
            <p className="text-gray-500">Booking #{booking._id.slice(-6)}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Car</span>
              <span className="font-medium">{booking.car.oem} {booking.car.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Pickup</span>
              <span className="font-medium">{new Date(booking.pickupDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Return</span>
              <span className="font-medium">{new Date(booking.returnDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Days</span>
              <span className="font-medium">{booking.totalDays}</span>
            </div>
            {booking.withDriver && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Driver</span>
                <span className="font-medium">₹{booking.driverCharge.toLocaleString()}</span>
              </div>
            )}
          </div>

          <button onClick={handlePayment} disabled={processing} className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50">
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">Secure payment powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
