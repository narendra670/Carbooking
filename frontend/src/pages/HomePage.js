import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI } from '../services/api';
import CarCard from '../components/CarCard';
import BudgetRecommendation from '../components/BudgetRecommendation';
import AISuggestion from '../components/AISuggestion';
import { useAuth } from '../context/AuthContext';

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const HomePage = () => {
  const { user } = useAuth();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [heroRef, heroInView] = useInView();
  const [catRef, catInView] = useInView();
  const [featRef, featInView] = useInView();
  const [howRef, howInView] = useInView();
  const [statRef, statInView] = useInView();
  const [testiRef, testiInView] = useInView();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await carsAPI.getAll({ sort: 'price-low' });
        setFeaturedCars(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {}
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchCity) params.city = searchCity;
    window.location.href = `/cars?${new URLSearchParams(params)}`;
  };

  const categories = [
    { name: 'SUV', icon: '🚙', desc: 'Spacious & Powerful', color: 'from-emerald-400 to-emerald-600', count: '7 Seater' },
    { name: 'Sedan', icon: '🚗', desc: 'Comfort & Style', color: 'from-blue-400 to-blue-600', count: '5 Seater' },
    { name: 'Hatchback', icon: '🚘', desc: 'Compact & Efficient', color: 'from-purple-400 to-purple-600', count: '4 Seater' },
  ];

  const howItWorks = [
    { step: '01', title: 'Search & Browse', desc: 'Find the perfect car from our wide selection of vehicles', icon: '🔍' },
    { step: '02', title: 'Choose Dates & Book', desc: 'Select your dates, add a driver if needed, and confirm', icon: '📅' },
    { step: '03', title: 'Drive & Enjoy', desc: 'Pick up your car and enjoy the ride worry-free', icon: '🛣️' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Marketing Manager', text: 'Amazing experience! The car was in perfect condition and the booking process was seamless. Will definitely use CarBook again.', rating: 5, avatar: 'PS' },
    { name: 'Amit Patel', role: 'Software Engineer', text: 'Best car rental platform I have used. Great prices, excellent customer support, and the driver option is a lifesaver!', rating: 5, avatar: 'AP' },
    { name: 'Neha Gupta', role: 'Business Owner', text: 'The AI suggestions helped me find the perfect family SUV. Highly recommend CarBook for hassle-free car rentals.', rating: 4, avatar: 'NG' },
  ];

  const brands = ['BMW', 'Toyota', 'Honda', 'Mercedes', 'Audi', 'Hyundai', 'Ford', 'Tata'];

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 md:py-32 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-blue-100">Trusted by 50,000+ happy customers</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">Perfect Ride</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto">
              Browse, compare, and book cars at the best prices. Your journey starts here.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl shadow-black/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Where are you going?</label>
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="Enter city name" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" />
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  Search Cars
                </button>
              </div>
            </div>
          </form>

          {/* Brand Logos */}
          <div className="mt-12 text-center">
            <p className="text-sm text-blue-200/60 mb-4">Popular Brands</p>
            <div className="flex flex-wrap justify-center gap-6">
              {brands.map(b => (
                <span key={b} className="text-white/30 font-bold text-lg hover:text-white/60 transition cursor-default">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statRef} className={`py-12 bg-white border-b transition-all duration-700 delay-100 ${statInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: '+', label: 'Cars Available', color: 'text-blue-600' },
              { value: 50000, suffix: '+', label: 'Happy Customers', color: 'text-emerald-600' },
              { value: 100, suffix: '+', label: 'Cities Covered', color: 'text-purple-600' },
              { value: 4, suffix: '.8 avg', label: 'Customer Rating', color: 'text-amber-600' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl md:text-4xl font-extrabold ${stat.color}`}>
                  <AnimatedCounter end={stat.value} />{stat.suffix}
                </div>
                <p className="text-gray-500 mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section ref={catRef} className={`py-16 bg-gray-50 transition-all duration-700 delay-100 ${catInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Browse by Category</h2>
            <p className="text-gray-500">Choose the perfect car type for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link key={cat.name} to={`/cars?bodyType=${cat.name}`} className={`group bg-gradient-to-br ${cat.color} rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <span className="text-6xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                <p className="text-white/80 mb-2">{cat.desc}</p>
                <span className="text-white/60 text-sm">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cars" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-100 transition hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Browse All Cars
            </Link>
            <Link to="/compare" className="flex items-center gap-2 bg-purple-50 text-purple-700 px-6 py-3 rounded-xl font-medium hover:bg-purple-100 transition hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Compare Cars
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 bg-amber-50 text-amber-700 px-6 py-3 rounded-xl font-medium hover:bg-amber-100 transition hover:shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section ref={featRef} className={`py-16 bg-white transition-all duration-700 ${featInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Featured Cars</h2>
              <p className="text-gray-500 mt-1">Handpicked cars at the best prices</p>
            </div>
            <Link to="/cars" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 transition">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No featured cars available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map(car => <CarCard key={car.used_car_sku_id} car={car} />)}
            </div>
          )}
        </div>
      </section>

      {/* Smart Budget Recommendation */}
      <BudgetRecommendation />

      {/* AI Suggestion */}
      <AISuggestion />

      {/* How It Works */}
      <section ref={howRef} className={`py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white transition-all duration-700 ${howInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-blue-200/70">Simple steps to get your perfect ride</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <span className="text-5xl font-extrabold text-white/10 group-hover:text-white/20 transition">{item.step}</span>
                <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                <p className="text-blue-200/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testiRef} className={`py-20 bg-gray-50 transition-all duration-700 ${testiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">What Our Customers Say</h2>
            <p className="text-gray-500">Real stories from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className={`w-5 h-5 ${j < t.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Why Choose CarBook</h2>
            <p className="text-gray-500">We make car rental simple, affordable, and reliable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '💰', title: 'Best Prices', desc: 'Competitive daily rates with no hidden charges', color: 'from-green-400 to-emerald-500' },
              { icon: '🔒', title: 'Secure Booking', desc: 'Safe online payments with encrypted transactions', color: 'from-blue-400 to-indigo-500' },
              { icon: '🚗', title: 'Wide Selection', desc: 'Choose from SUVs, Sedans, and Hatchbacks', color: 'from-purple-400 to-pink-500' },
              { icon: '📱', title: 'Easy Management', desc: 'Book, track, and manage from your dashboard', color: 'from-amber-400 to-orange-500' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 group hover:-translate-y-2 transition-transform duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of happy customers who trust CarBook for their travel needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition hover:shadow-lg">
              Browse Cars
            </Link>
            <Link to="/signup" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
