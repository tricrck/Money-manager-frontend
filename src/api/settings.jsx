import api from './axios';

export const getSettings = () => api.get('/settings');
export const updateSettings = (settingsData) => api.put('/settings', settingsData);
export const resetSettings = () => api.get('/settings/reset');
export const getServerInfo = () => api.get('/settings/server-info');
export const getDBInfo = () => api.get('/settings/db-info');