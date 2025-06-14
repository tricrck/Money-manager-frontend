import api from './axios';

// USER STATEMENT ROUTES
export const getUserStatement = (userId, params = {}) => 
  api.get(`/reports/user/${userId}/statement`, { params });

export const getMyStatement = (params = {}) => 
  api.get('/reports/my-statement', { params });

// ADMIN REPORTING ROUTES
export const getAdminTransactionReport = (params = {}) => 
  api.get('/reports/admin/transactions', { params });

export const getAdminAnalytics = (params = {}) => 
  api.get('/reports/admin/analytics', { params });

export const getRealtimeMetrics = () => 
  api.get('/reports/admin/metrics/realtime');

export const getFraudInsights = (params = {}) => 
  api.get('/reports/admin/fraud-insights', { params });

// DATA EXPORT ROUTES
export const exportAllTransactions = (params = {}) => 
  api.get('/reports/export/transactions', { params });

export const exportUserTransactions = (userId, params = {}) => 
  api.get(`/reports/export/user/${userId}/transactions`, { params });

// UTILITY ROUTES
export const getReportsHealth = () => 
  api.get('/reports/health');

export const getReportsConfig = () => 
  api.get('/reports/config');

// CUSTOM REPORT ROUTES
export const generateCustomReport = (reportData) => 
  api.post('/reports/custom', reportData);

// SCHEDULED REPORTS ROUTES
export const scheduleReport = (scheduleData) => 
  api.post('/reports/schedule', scheduleData);

export const getScheduledReports = () => 
  api.get('/reports/schedule');

export const updateScheduledReport = (scheduleId, scheduleData) => 
  api.put(`/reports/schedule/${scheduleId}`, scheduleData);

export const deleteScheduledReport = (scheduleId) => 
  api.delete(`/reports/schedule/${scheduleId}`);

export const getScheduledReport = (scheduleId) => 
  api.get(`/reports/schedule/${scheduleId}`);

// HELPER FUNCTIONS FOR COMMON REPORT TYPES

// Get daily transaction summary
export const getDailyTransactionSummary = (date) => 
  getAdminTransactionReport({
    startDate: `${date}T00:00:00.000Z`,
    endDate: `${date}T23:59:59.999Z`,
    type: 'daily',
    groupBy: 'status'
  });

// Get monthly user statement
export const getMonthlyStatement = (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return getUserStatement(userId, {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'monthly',
    format: 'json'
  });
};

// Get current user's monthly statement
export const getMyMonthlyStatement = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return getMyStatement({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'monthly',
    format: 'json'
  });
};

// Get payment method breakdown
export const getPaymentMethodBreakdown = (startDate, endDate) => 
  getAdminTransactionReport({
    startDate,
    endDate,
    groupBy: 'paymentMethod'
  });

// Get successful transactions only
export const getSuccessfulTransactions = (userId, params = {}) => 
  getUserStatement(userId, {
    ...params,
    status: 'success'
  });

// Get failed transactions for analysis
export const getFailedTransactions = (startDate, endDate) => 
  getAdminTransactionReport({
    startDate,
    endDate,
    status: 'failed',
    groupBy: 'paymentMethod'
  });

// Export user transactions as CSV
export const exportUserTransactionsCSV = (userId, startDate, endDate) => 
  exportUserTransactions(userId, {
    format: 'csv',
    startDate,
    endDate,
    includeMetadata: true
  });

// Export all transactions as Excel
export const exportAllTransactionsExcel = (startDate, endDate, filters = {}) => 
  exportAllTransactions({
    format: 'excel',
    startDate,
    endDate,
    includeMetadata: true,
    ...filters
  });

// Get fraud insights for the last 24 hours
export const getRecentFraudInsights = () => 
  getFraudInsights({ period: '24h' });

// Get weekly analytics
export const getWeeklyAnalytics = () => 
  getAdminAnalytics({ period: '7d' });

// Get monthly analytics
export const getMonthlyAnalytics = () => 
  getAdminAnalytics({ period: '30d' });

// Generate transaction volume report
export const generateTransactionVolumeReport = (startDate, endDate) => 
  generateCustomReport({
    filters: {
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      status: 'success'
    },
    grouping: {
      field: 'paymentMethod',
      aggregation: 'sum',
      valueField: 'amount'
    },
    fields: ['transactionId', 'amount', 'paymentMethod', 'createdAt']
  });

// Generate high-value transactions report
export const generateHighValueTransactionsReport = (minAmount, startDate, endDate) => 
  generateCustomReport({
    filters: {
      amount: { $gte: minAmount },
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      status: 'success'
    },
    grouping: {
      field: 'paymentMethod',
      aggregation: 'count'
    },
    fields: ['userId', 'transactionId', 'amount', 'paymentMethod', 'createdAt']
  });

// Schedule daily transaction report
export const scheduleDailyTransactionReport = (recipients) => 
  scheduleReport({
    reportType: 'admin_transactions',
    schedule: '0 8 * * *', // 8 AM daily
    recipients,
    parameters: {
      type: 'daily',
      format: 'csv',
      includeMetadata: true
    }
  });

// Schedule weekly analytics report
export const scheduleWeeklyAnalyticsReport = (recipients) => 
  scheduleReport({
    reportType: 'analytics',
    schedule: '0 9 * * 1', // 9 AM every Monday
    recipients,
    parameters: {
      period: '7d',
      format: 'pdf'
    }
  });

// Schedule monthly user statement
export const scheduleMonthlyUserStatement = (recipients, userId) => 
  scheduleReport({
    reportType: 'user_statement',
    schedule: '0 6 1 * *', // 6 AM on 1st of every month
    recipients,
    parameters: {
      userId,
      type: 'monthly',
      format: 'pdf'
    }
  });