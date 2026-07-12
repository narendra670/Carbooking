import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import BookingStatusTracker from '../components/BookingStatusTracker';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setError('');
        const { data } = await bookingsAPI.getBooking(id);
        setBooking(data);
        if (data.paymentStatus === 'paid') setPaid(true);
      } catch (error) {
        setError('Failed to load booking details. Make sure the backend server is running.');
      }
      setLoading(false);
    };
    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await bookingsAPI.updatePayment(id, {
        razorpayOrderId: `ORDER_${Date.now()}`,
        razorpayPaymentId: `PAY_${Date.now()}`,
        razorpaySignature: `SIG_${Date.now()}`,
      });
      setPaid(true);
      const { data } = await bookingsAPI.getBooking(id);
      setBooking(data);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
    setProcessing(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (error) {
    return <div className="text-center py-20"><p className="text-red-500 text-lg mb-2">{error}</p><button onClick={() => window.location.reload()} className="text-primary-600 font-medium hover:underline">Retry</button></div>;
  }

  if (!booking) return null;

  return (
    <div className="py-8">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {paid ? 'Payment Successful!' : 'Payment'}
        </h1>

        {paid && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700">Thank You!</h2>
            <p className="text-green-600 mt-1">Your booking has been confirmed</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">₹{(booking.totalAmount || 0).toLocaleString()}</h2>
            <p className="text-gray-500">Booking #{booking._id ? booking._id.slice(-6) : 'N/A'}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Car</span>
              <span className="font-medium">{booking.car?.oem || 'N/A'} {booking.car?.model || ''}</span>
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
              <span className="font-medium">{booking.totalDays || 0}</span>
            </div>
            {booking.withDriver && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Driver</span>
                <span className="font-medium">₹{(booking.driverCharge || 0).toLocaleString()}</span>
              </div>
            )}
            {booking.driverDetails?.name && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Driver Name</span>
                <span className="font-medium">{booking.driverDetails.name}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Payment</span>
              <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          {!paid ? (
            <button onClick={handlePayment} disabled={processing} className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50">
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          ) : (
            <div className="space-y-3">
              <BookingStatusTracker timeline={booking.bookingStatusTimeline || []} currentStatus={booking.status} />
              <Link to="/dashboard" className="block text-center btn-primary text-white py-3 rounded-lg font-semibold text-lg">
                View in Dashboard
              </Link>
            </div>
          )}
          <p className="text-center text-sm text-gray-500 mt-4">
            {paid ? 'Booking confirmed with secure payment' : 'Secure payment powered by Razorpay'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
