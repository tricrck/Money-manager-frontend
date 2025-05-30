import axios from 'axios';
import store from '../store'; // Import your Redux store
import { logout } from '../actions/userActions';

const api = axios.create({
  baseURL: 'https://money-manager-backend-iczs.onrender.com/api',
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


api.interceptors.response.use(
  // Success handler - return response as-is
  (response) => response,
  // Error handler - check for 401 and logout if needed
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Session expired - logging out');
      
      // Dispatch logout action
      store.dispatch(logout(true)); // Pass true to indicate session expired
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default api;