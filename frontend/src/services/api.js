import axios from 'axios';
import fallbackCars from './fallbackCars';

const PRODUCTION_API_URL = 'https://carbooking-1-clao.onrender.com/api';

const getApiUrl = () => {
  let url = process.env.REACT_APP_API_URL;
  if (url) {
    url = url.replace(/\/$/, ''); // Remove trailing slash
    if (!url.endsWith('/api')) {
      url += '/api';
    }
    return url;
  }
  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_API_URL;
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateWishlist: (carId) => api.post('/auth/wishlist', { carId }),
  getWishlist: () => api.get('/auth/wishlist'),
};

export const carsAPI = {
  getAll: async (params) => {
    try {
      return await api.get('/cars', { params });
    } catch (error) {
      console.warn('Backend API failed, using fallback cars on frontend.', error);
      let filtered = fallbackCars;
      if (params) {
        if (params.brand) filtered = filtered.filter(c => c.oem.toLowerCase().includes(params.brand.toLowerCase()));
        if (params.search) filtered = filtered.filter(c => c.model.toLowerCase().includes(params.search.toLowerCase()) || c.oem.toLowerCase().includes(params.search.toLowerCase()));
        if (params.minPrice) filtered = filtered.filter(c => c.dailyRate >= Number(params.minPrice));
        if (params.maxPrice) filtered = filtered.filter(c => c.dailyRate <= Number(params.maxPrice));
      }
      return { data: filtered };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/cars/${id}`);
    } catch (error) {
      console.warn('Backend API failed, using fallback car on frontend.', error);
      const car = fallbackCars.find(c => c.used_car_sku_id === id);
      if (car) return { data: car };
      throw error;
    }
  },
  getBudget: async (budget) => {
    try {
      return await api.get('/cars/budget', { params: { budget } });
    } catch (error) {
      console.warn('Backend API failed, using fallback cars on frontend.', error);
      const filtered = fallbackCars.filter(c => c.dailyRate <= budget).sort((a, b) => a.dailyRate - b.dailyRate);
      return { data: filtered };
    }
  },
  getPurpose: async (purpose) => {
    try {
      return await api.get('/cars/purpose', { params: { purpose } });
    } catch (error) {
      console.warn('Backend API failed, using fallback cars on frontend.', error);
      let bodyTypes = [];
      if (purpose.toLowerCase() === 'family trip') bodyTypes = ['SUV'];
      else if (purpose.toLowerCase() === 'office work') bodyTypes = ['Sedan'];
      else if (purpose.toLowerCase() === 'solo travel') bodyTypes = ['Hatchback'];
      const filtered = fallbackCars.filter(c => bodyTypes.includes(c.bodyType));
      return { data: filtered };
    }
  },
  compare: async (car1, car2) => {
    try {
      return await api.get('/cars/compare', { params: { car1, car2 } });
    } catch (error) {
      console.warn('Backend API failed, using fallback cars on frontend.', error);
      const c1 = fallbackCars.find(c => c.used_car_sku_id === car1);
      const c2 = fallbackCars.find(c => c.used_car_sku_id === car2);
      return { data: { car1: c1, car2: c2 } };
    }
  },
  search: async (params) => {
    try {
      return await api.get('/cars/search', { params });
    } catch (error) {
      console.warn('Backend API failed, using fallback cars on frontend.', error);
      let filtered = fallbackCars;
      if (params && params.query) {
        const q = params.query.toLowerCase();
        filtered = filtered.filter(c => c.model.toLowerCase().includes(q) || c.oem.toLowerCase().includes(q) || c.bodyType.toLowerCase().includes(q));
      }
      return { data: filtered };
    }
  },
  getAvailability: async (id) => {
    try {
      return await api.get(`/cars/${id}/availability`);
    } catch (error) {
      console.warn('Backend API failed, assuming car is available.', error);
      return { data: { available: true } };
    }
  },
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  updatePayment: (id, data) => api.put(`/bookings/${id}/payment`, data),
  getAll: () => api.get('/bookings/admin/all'),
  updateStatus: (id, data) => api.put(`/bookings/admin/${id}/status`, data),
  getBookingStatus: (id) => api.get(`/bookings/${id}/status`),
  assignDriver: (id, data) => api.put(`/bookings/${id}/assign-driver`, data),
};

export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getCarReviews: (carId) => api.get(`/reviews/car/${carId}`),
  getUserReviews: () => api.get('/reviews/user'),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const driversAPI = {
  getAvailable: () => api.get('/drivers/available'),
  getById: (id) => api.get(`/drivers/${id}`),
  getAll: () => api.get('/drivers/all'),
  seed: () => api.post('/drivers/seed'),
};

export default api;
