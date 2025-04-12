import api from './axios';

export const getWallet = (userId) => api.get(`/wallet/${userId}`);
export const updateWallet = (userId, walletData) => api.put(`/wallet/${userId}`, walletData);
export const deposit = (userId, depositData) => api.post(`/wallet/deposit/${userId}`, depositData);
export const withdraw = (userId, withdrawData) => api.post(`/wallet/withdraw/${userId}`, withdrawData);