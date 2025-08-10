import api from './axios';

export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUsers = () => api.get('/users');
export const getUser = (userId) => api.get(`/users/${userId}`);
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
export const uploadProfilePicture = (userId, formData) => api.post(`/users/upload-profile/${userId}`, formData);
export const sendPasswordResetLink = (email) => api.post('/users/send-reset-link', { email });
export const resetPassword = (token, newPassword) => api.post(`/users/reset-password/${token}`, { newPassword });
export const pushToken = (token) => api.post(`/messages/push-token`, { token });
