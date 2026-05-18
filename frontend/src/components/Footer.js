import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-primary-400">Car</span>
              <span className="text-accent-400">Book</span>
            </h3>
            <p className="text-gray-400">Your trusted platform for car bookings. Browse, compare, and book your perfect ride.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-white transition">Browse Cars</Link></li>
              <li><Link to="/compare" className="text-gray-400 hover:text-white transition">Compare Cars</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Car Types</h4>
            <ul className="space-y-2">
              <li><Link to="/cars?bodyType=SUV" className="text-gray-400 hover:text-white transition">SUV</Link></li>
              <li><Link to="/cars?bodyType=Sedan" className="text-gray-400 hover:text-white transition">Sedan</Link></li>
              <li><Link to="/cars?bodyType=Hatchback" className="text-gray-400 hover:text-white transition">Hatchback</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@carbook.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: New Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 CarBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
