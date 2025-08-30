import api from './axios';

export const getLogs = () => api.get('/logs');