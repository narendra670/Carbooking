import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/CarCard';

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistCars, setWishlistCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.getWishlist();
        setWishlistCars(data);
      } catch (err) {
        setError('Failed to load wishlist');
      }
      setLoading(false);
    };
    fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist</h2>
        <p className="text-gray-500 mb-6">Login to see your saved cars</p>
        <Link to="/login" className="btn-primary text-white px-6 py-3 rounded-lg font-medium">Login to Continue</Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
            <p className="text-gray-500">{wishlistCars.length} car{wishlistCars.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary-600 font-medium hover:underline">Retry</button>
          </div>
        ) : wishlistCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 mb-4">Browse cars and add your favorites</p>
            <Link to="/cars" className="btn-primary text-white px-6 py-3 rounded-lg font-medium">Browse Cars</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistCars.map(car => <CarCard key={car.used_car_sku_id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
