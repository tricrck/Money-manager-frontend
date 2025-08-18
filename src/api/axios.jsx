import axios from 'axios';
import store from '../store';
import { logout } from '../actions/userActions';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('x-auth-token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Simple response interceptor - handle only critical errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Authentication failed - logout and redirect
    if (error.response?.status === 401) {
      console.warn('Authentication failed - Session expired');
      
      if (store?.dispatch) {
        store.dispatch(logout());
      }
      
      localStorage.removeItem('x-auth-token');
      window.location.href = '/home';
      return Promise.reject(error);
    }
    
    // User not found on user-specific endpoints - likely deleted account
    if (error.response?.status === 404) {
      const url = error.config?.url || '';
      const isUserEndpoint = url.includes('/users/') || 
                            url.includes('/profile') ||
                            (url.includes('/users') && error.config?.method?.toLowerCase() === 'get');
      
      if (isUserEndpoint) {
        console.warn('User not found - Account may be invalid');
        
        if (store?.dispatch) {
          store.dispatch(logout());
        }
        
        localStorage.removeItem('x-auth-token');
        window.location.href = '/home';
        return Promise.reject(error);
      }
    }
    
    // Log other errors for debugging but don't retry
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, {
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;