import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kisan_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if unauthorized
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // localStorage.removeItem('kisan_token');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
  getNotifications: () => api.get('/api/user/notifications'),
  markNotificationRead: (id) => api.put(`/api/user/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/api/user/notifications/read-all'),
};

export const weatherService = {
  getWeather: (params) => api.get('/api/weather', { params }),
  getDistricts: () => api.get('/api/weather/districts'),
};

export const cropService = {
  getCrops: (params) => api.get('/api/crops', { params }),
  getCropById: (id) => api.get(`/api/crops/${id}`),
  getCategories: () => api.get('/api/crops/categories'),
  getSeasons: () => api.get('/api/crops/seasons'),
};

export const diseaseService = {
  getDiseases: (params) => api.get('/api/diseases', { params }),
  getDiseaseById: (id) => api.get(`/api/diseases/${id}`),
  getCropsList: () => api.get('/api/diseases/crops-list'),
};

export const marketService = {
  getPrices: (params) => api.get('/api/market-prices', { params }),
  getPriceHistory: (params) => api.get('/api/market-prices/history', { params }),
  getFilters: () => api.get('/api/market-prices/filters'),
};

export const soilService = {
  getSoilTypes: () => api.get('/api/soil'),
  getSoilTypeById: (id) => api.get(`/api/soil/${id}`),
  getRecommendation: (data) => api.post('/api/soil/recommend', data),
};

export const newsService = {
  getNews: (params) => api.get('/api/news', { params }),
  getNewsById: (id) => api.get(`/api/news/${id}`),
  getCategories: () => api.get('/api/news/categories'),
};

export const schemeService = {
  getSchemes: (params) => api.get('/api/schemes', { params }),
  getSchemeById: (id) => api.get(`/api/schemes/${id}`),
};

export const aiService = {
  chat: (data) => api.post('/api/ai/chat', data),
  diagnose: (formData) => api.post('/api/ai/diagnose', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHistory: (params) => api.get('/api/ai/history', { params }),
};

export const adminService = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: () => api.get('/api/admin/users'),
  toggleUserActive: (id) => api.put(`/api/admin/users/${id}/toggle-active`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  
  createCrop: (data) => api.post('/api/admin/crops', data),
  updateCrop: (id, data) => api.put(`/api/admin/crops/${id}`, data),
  deleteCrop: (id) => api.delete(`/api/admin/crops/${id}`),
  
  createDisease: (data) => api.post('/api/admin/diseases', data),
  updateDisease: (id, data) => api.put(`/api/admin/diseases/${id}`, data),
  deleteDisease: (id) => api.delete(`/api/admin/diseases/${id}`),
  
  createNews: (data) => api.post('/api/admin/news', data),
  updateNews: (id, data) => api.put(`/api/admin/news/${id}`, data),
  deleteNews: (id) => api.delete(`/api/admin/news/${id}`),
  
  createScheme: (data) => api.post('/api/admin/schemes', data),
  updateScheme: (id, data) => api.put(`/api/admin/schemes/${id}`, data),
  deleteScheme: (id) => api.delete(`/api/admin/schemes/${id}`),
  
  createMarketPrice: (data) => api.post('/api/admin/market-prices', data),
  deleteMarketPrice: (id) => api.delete(`/api/admin/market-prices/${id}`),
};

export default api;
