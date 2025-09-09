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
export const logoutUser = () => api.post('/users/logout');
// 🔹 OTP-related actions
export const sendOTP = (phoneNumber) => api.post('/users/send-otp', { phoneNumber });
export const verifyOTP = (phoneNumber, otp) => api.post('/users/verify-otp', { phoneNumber, otp });
export const resendOTP = (phoneNumber) => api.post('/users/resend-otp', { phoneNumber });
export const checkVerificationStatus = (phoneNumber) => api.get(`/users/verification-status/${phoneNumber}`);

// ====================== SESSIONS ======================
// Get all active sessions for current user
export const getUserSessions = () => api.get('/users/sessions');

// Revoke a specific session (logout from other device)
export const revokeSession = (sessionId) => api.delete(`/users/sessions/${sessionId}`);

// Social Auth - these redirect to backend OAuth endpoints
export const initiateGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/users/auth/google`;
};

export const initiateFacebookAuth = () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/users/auth/facebook`;
};

export const initiateTwitterAuth = () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/users/auth/twitter`;
};