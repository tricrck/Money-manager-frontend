import axios from 'axios';
import store from '../store';
import { logout } from '../actions/userActions';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    const status = error.response?.status;

    if ([401, 403, 419, 440, 500].includes(status) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/auth/refresh`, { refreshToken });

        localStorage.setItem('accessToken', res.data.accessToken);


        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.warn('Refresh token failed, logging out');
        console.log(err);
        store.dispatch(logout(true));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
