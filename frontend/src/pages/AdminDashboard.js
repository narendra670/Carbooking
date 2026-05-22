import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError('');
        const { data } = await bookingsAPI.getAll();
        setBookings(data);
      } catch (error) {
        setError('Failed to load bookings. Make sure the backend server is running.');
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'bookings' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            Bookings
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            Users
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="text-primary-600 font-medium hover:underline">Retry</button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">#{booking._id.slice(-6)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.user?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.car?.oem || 'N/A'} {booking.car?.model || ''}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{(booking.totalAmount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={booking.status} onChange={(e) => handleStatusUpdate(booking._id, e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">User management coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
