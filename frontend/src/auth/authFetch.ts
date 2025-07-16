import axios from 'axios';

const BASE_URL = 'https://bigbikeblitz-backend.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  // Only attach token if not /auth or /register
  const isAuthOrRegister = config.url?.includes('/auth') || config.url?.includes('/register');
  if (!isAuthOrRegister) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api; 