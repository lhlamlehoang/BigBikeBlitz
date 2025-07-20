import axios from 'axios';
import { BACKEND_URL } from '../config';

const BASE_URL = BACKEND_URL;

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