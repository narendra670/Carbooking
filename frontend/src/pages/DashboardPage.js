import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError('');
        const { data } = await bookingsAPI.getUserBookings();
        setBookings(data);
      } catch (error) {
        setError('Failed to load bookings. Make sure the backend server is running.');
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'active') return b.status === 'pending' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (!user) {
    return <div className="text-center py-20"><Link to="/login" className="text-primary-600">Please login to view dashboard</Link></div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500' },
            { label: 'Active', value: stats.active, color: 'bg-green-500' },
            { label: 'Completed', value: stats.completed, color: 'bg-purple-500' },
            { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['active', 'completed', 'cancelled', 'all'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-medium capitalize transition ${activeTab === tab ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary-600 font-medium hover:underline">Retry</button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <Link to="/cars" className="mt-4 inline-block text-primary-600 font-medium">Browse Cars</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <img src={booking.car?.image || '/placeholder-car.jpg'} alt={booking.car?.model || 'Car'} className="w-24 h-24 object-cover rounded-lg" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{booking.car?.oem || 'N/A'} {booking.car?.model || ''}</h3>
                      <p className="text-gray-500">{new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{booking.totalDays || 0} days {booking.withDriver && '• With Driver'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'N/A'}
                    </span>
                    <span className="text-xl font-bold text-primary-600">₹{(booking.totalAmount || 0).toLocaleString()}</span>
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button onClick={() => handleCancel(booking._id)} className="text-red-500 text-sm font-medium hover:text-red-600">Cancel Booking</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
