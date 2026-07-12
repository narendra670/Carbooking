import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarsListingPage from './pages/CarsListingPage';
import CarDetailsPage from './pages/CarDetailsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ComparePage from './pages/ComparePage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsListingPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
