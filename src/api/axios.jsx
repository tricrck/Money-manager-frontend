import axios from 'axios';

const api = axios.create({
  baseURL: 'https://money-manager-backend-wja6.onrender.com/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('x-auth-token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;