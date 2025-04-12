import api from './axios';

export const createLoan = (loanData) => api.post('/loans', loanData);
export const getLoans = () => api.get('/loans');
export const getLoan = (loanId) => api.get(`/loans/${loanId}`);
export const updateLoan = (loanId, loanData) => api.put(`/loans/${loanId}`, loanData);
export const deleteLoan = (loanId) => api.delete(`/loans/${loanId}`);
export const reviewLoan = (loanId, reviewData) => api.post(`/loans/${loanId}/review`, reviewData);
export const disburseLoan = (loanId, disbursementData) => api.post(`/loans/${loanId}/disburse`, disbursementData);
export const applyLateFees = (loanId, lateFeeData) => api.post(`/loans/${loanId}/late-fees`, lateFeeData);
export const markLoanAsDefaulted = (loanId, defaultData) => api.post(`/loans/${loanId}/default`, defaultData);
export const getLoanStatistics = () => api.get('/loans/statistics');
export const getUserLoans = (userId) => api.get(`/loans/user/${userId}`);
export const getGroupLoans = (groupId) => api.get(`/loans/group/${groupId}`);
export const applyForLoan = (groupId, loanData) => api.post(`/loans/apply/${groupId}`, loanData);
export const addGuarantor = (loanId, guarantorId) => api.post(`/loans/${loanId}/guarantor/${guarantorId}`);
export const guarantorApproval = (loanId, guarantorId, approvalData) => api.post(`/loans/${loanId}/guarantor/${guarantorId}/approval`, approvalData);
export const repayLoan = (loanId, repaymentData) => api.post(`/loans/${loanId}/repay`, repaymentData);