import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
};

export const carsAPI = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  getBudget: (budget) => api.get('/cars/budget', { params: { budget } }),
  getPurpose: (purpose) => api.get('/cars/purpose', { params: { purpose } }),
  compare: (car1, car2) => api.get('/cars/compare', { params: { car1, car2 } }),
  search: (params) => api.get('/cars/search', { params }),
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  updatePayment: (id, data) => api.put(`/bookings/${id}/payment`, data),
  getAll: () => api.get('/bookings/admin/all'),
  updateStatus: (id, data) => api.put(`/bookings/admin/${id}/status`, data),
};

export default api;
