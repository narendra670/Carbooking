import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wishlistCount = user?.wishlist?.length || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-700">Car</span>
            <span className="text-2xl font-bold text-primary-700">Book</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition">Home</Link>
            <Link to="/cars" className="text-gray-700 hover:text-primary-600 font-medium transition">Browse Cars</Link>
            <Link to="/compare" className="text-gray-700 hover:text-primary-600 font-medium transition">Compare</Link>
            {user ? (
              <>
                <Link to="/wishlist" className="relative text-gray-700 hover:text-primary-600 font-medium transition flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition">Admin</Link>
                )}
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition">Dashboard</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition">Login</Link>
                <Link to="/signup" className="btn-primary text-white px-4 py-2 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t animate-slideIn">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/cars" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">Browse Cars</Link>
            <Link to="/compare" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">Compare</Link>
            {user ? (
              <>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">
                  Wishlist {wishlistCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{wishlistCount}</span>}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">Admin</Link>
                )}
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left py-2 text-red-500 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2 text-primary-600 font-medium">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
