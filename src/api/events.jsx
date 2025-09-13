import api from './axios';

// 📅 Calendar / Events API

// Get user events (optionally pass start & end date query params)
export const getUserEvents = (params) => api.get('/calender', { params });

// Mark an event as completed (with optional amount for contributions/payments)
export const markEventComplete = (eventId, data) =>
  api.put(`/calendar/events/${eventId}/complete`, data);

// Get all fines for the logged-in user
export const getUserFines = () => api.get('/calendar/fines');

// Waive a fine (admin only)
export const waiveFine = (eventId, reasonData) =>
  api.put(`/calendar/fines/${eventId}/waive`, reasonData);

// (Optional) – if you add pay fines route later
export const payFine = (eventId, paymentData) =>
  api.post(`/calendar/fines/${eventId}/pay`, paymentData);