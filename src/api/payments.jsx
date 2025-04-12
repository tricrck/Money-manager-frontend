import api from './axios';

// M-Pesa Endpoints
export const mpesaPayment = (paymentData) => api.post('/payments/mpesa', paymentData);
export const mpesaQuery = (transactionId) => api.get(`/payments/mpesa/transaction/${transactionId}`);
export const mpesaWithdrawal = (withdrawalData) => api.post('/payments/mpesa/withdrawal', withdrawalData);
export const mpesaWithdrawalStatus = (transactionId) => api.get(`/payments/mpesa/withdrawal/status/${transactionId}`);
export const mpesaCheckBalance = () => api.post('/payments/mpesa/checkbalance');

// Stripe Endpoints
export const stripePayment = (paymentData) => api.post('/payments/stripe', paymentData);
export const stripePaymentDetails = (paymentIntentId) => api.get(`/payments/stripe/payment/${paymentIntentId}`);
export const stripePayout = (payoutData) => api.post('/payments/stripe/payout', payoutData);
export const stripePayoutDetails = (payoutId) => api.get(`/payments/stripe/payout/${payoutId}`);
export const stripeCheckBalance = () => api.get('/payments/stripe/balance');