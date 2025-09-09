import api from './axios';

// Send a new chat message
export const sendMessage = (messageData) => api.post('/chat/send', messageData);

// Get chat messages (with optional pagination and conversationId)
export const getMessages = ({ conversationId, page = 1, limit = 50 }) =>
  api.post(`/chat/messages`, { conversationId, page, limit });

// Mark messages as read for a conversation
export const markAsRead = (conversationData) =>
  api.put('/chat/mark-read', conversationData);

// Get unread message count
export const getUnreadCount = () => api.get('/chat/unread-count');

export const getAllSupportMessages = (filters = {}) =>
  api.post('/chat/support/messages', filters);