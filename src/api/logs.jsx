import api from './axios';

export const getLogs = () => api.get('/messages/admin/logs');