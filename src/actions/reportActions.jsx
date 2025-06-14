import * as reportAPI from '../api/reports';
import * as types from '../constants/reportConstants';

// USER STATEMENT ACTIONS
export const getUserStatement = (userId, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_USER_STATEMENT_REQUEST });
    
    const { data } = await reportAPI.getUserStatement(userId, params);
    
    dispatch({
      type: types.GET_USER_STATEMENT_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_USER_STATEMENT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getMyStatement = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_MY_STATEMENT_REQUEST });
    
    const { data } = await reportAPI.getMyStatement(params);
    
    dispatch({
      type: types.GET_MY_STATEMENT_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_MY_STATEMENT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// ADMIN REPORTING ACTIONS
export const getAdminTransactionReport = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ADMIN_TRANSACTIONS_REQUEST });
    
    const { data } = await reportAPI.getAdminTransactionReport(params);
    
    dispatch({
      type: types.GET_ADMIN_TRANSACTIONS_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_ADMIN_TRANSACTIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getAdminAnalytics = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ADMIN_ANALYTICS_REQUEST });
    
    const { data } = await reportAPI.getAdminAnalytics(params);
    
    dispatch({
      type: types.GET_ADMIN_ANALYTICS_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_ADMIN_ANALYTICS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getRealtimeMetrics = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_REALTIME_METRICS_REQUEST });
    
    const { data } = await reportAPI.getRealtimeMetrics();
    
    dispatch({
      type: types.GET_REALTIME_METRICS_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_REALTIME_METRICS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getFraudInsights = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_FRAUD_INSIGHTS_REQUEST });
    
    const { data } = await reportAPI.getFraudInsights(params);
    
    dispatch({
      type: types.GET_FRAUD_INSIGHTS_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_FRAUD_INSIGHTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// DATA EXPORT ACTIONS
export const exportAllTransactions = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.EXPORT_TRANSACTIONS_REQUEST });
    
    const { data } = await reportAPI.exportAllTransactions(params);
    
    dispatch({
      type: types.EXPORT_TRANSACTIONS_SUCCESS,
      payload: data
    });
    
    // If it's a file download, handle the blob
    if (data instanceof Blob || params.format !== 'json') {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_export.${params.format || 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    
    return data;
  } catch (error) {
    dispatch({
      type: types.EXPORT_TRANSACTIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const exportUserTransactions = (userId, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.EXPORT_USER_TRANSACTIONS_REQUEST });
    
    const { data } = await reportAPI.exportUserTransactions(userId, params);
    
    dispatch({
      type: types.EXPORT_USER_TRANSACTIONS_SUCCESS,
      payload: data
    });
    
    // If it's a file download, handle the blob
    if (data instanceof Blob || params.format !== 'json') {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user_${userId}_transactions.${params.format || 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    
    return data;
  } catch (error) {
    dispatch({
      type: types.EXPORT_USER_TRANSACTIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// CUSTOM REPORT ACTIONS
export const generateCustomReport = (reportData) => async (dispatch) => {
  try {
    dispatch({ type: types.GENERATE_CUSTOM_REPORT_REQUEST });
    
    const { data } = await reportAPI.generateCustomReport(reportData);
    
    dispatch({
      type: types.GENERATE_CUSTOM_REPORT_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GENERATE_CUSTOM_REPORT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// SCHEDULED REPORTS ACTIONS
export const scheduleReport = (scheduleData) => async (dispatch) => {
  try {
    dispatch({ type: types.SCHEDULE_REPORT_REQUEST });
    
    const { data } = await reportAPI.scheduleReport(scheduleData);
    
    dispatch({
      type: types.SCHEDULE_REPORT_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.SCHEDULE_REPORT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getScheduledReports = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SCHEDULED_REPORTS_REQUEST });
    
    const { data } = await reportAPI.getScheduledReports();
    
    dispatch({
      type: types.GET_SCHEDULED_REPORTS_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_SCHEDULED_REPORTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const updateScheduledReport = (scheduleId, scheduleData) => async (dispatch) => {
  try {
    dispatch({ type: types.UPDATE_SCHEDULED_REPORT_REQUEST });
    
    const { data } = await reportAPI.updateScheduledReport(scheduleId, scheduleData);
    
    dispatch({
      type: types.UPDATE_SCHEDULED_REPORT_SUCCESS,
      payload: { scheduleId, data }
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.UPDATE_SCHEDULED_REPORT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const deleteScheduledReport = (scheduleId) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_SCHEDULED_REPORT_REQUEST });
    
    await reportAPI.deleteScheduledReport(scheduleId);
    
    dispatch({
      type: types.DELETE_SCHEDULED_REPORT_SUCCESS,
      payload: scheduleId
    });
    
    return scheduleId;
  } catch (error) {
    dispatch({
      type: types.DELETE_SCHEDULED_REPORT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getScheduledReport = (scheduleId) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SCHEDULED_REPORT_REQUEST });
    
    const { data } = await reportAPI.getScheduledReport(scheduleId);
    
    dispatch({
      type: types.GET_SCHEDULED_REPORT_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_SCHEDULED_REPORT_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// UTILITY ACTIONS
export const getReportsHealth = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_REPORTS_HEALTH_REQUEST });
    
    const { data } = await reportAPI.getReportsHealth();
    
    dispatch({
      type: types.GET_REPORTS_HEALTH_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_REPORTS_HEALTH_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const getReportsConfig = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_REPORTS_CONFIG_REQUEST });
    
    const { data } = await reportAPI.getReportsConfig();
    
    dispatch({
      type: types.GET_REPORTS_CONFIG_SUCCESS,
      payload: data
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_REPORTS_CONFIG_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

// HELPER ACTIONS FOR COMMON USE CASES
export const getDailyTransactionSummary = (date) => async (dispatch) => {
  return dispatch(getAdminTransactionReport({
    startDate: `${date}T00:00:00.000Z`,
    endDate: `${date}T23:59:59.999Z`,
    type: 'daily',
    groupBy: 'status'
  }));
};

export const getMonthlyStatement = (userId, year, month) => async (dispatch) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return dispatch(getUserStatement(userId, {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'monthly',
    format: 'json'
  }));
};

export const getMyMonthlyStatement = (year, month) => async (dispatch) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return dispatch(getMyStatement({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    type: 'monthly',
    format: 'json'
  }));
};

export const getPaymentMethodBreakdown = (startDate, endDate) => async (dispatch) => {
  return dispatch(getAdminTransactionReport({
    startDate,
    endDate,
    groupBy: 'paymentMethod'
  }));
};

export const getWeeklyAnalytics = () => async (dispatch) => {
  return dispatch(getAdminAnalytics({ period: '7d' }));
};

export const getMonthlyAnalytics = () => async (dispatch) => {
  return dispatch(getAdminAnalytics({ period: '30d' }));
};

export const getRecentFraudInsights = () => async (dispatch) => {
  return dispatch(getFraudInsights({ period: '24h' }));
};

// CLEARING ACTIONS
export const clearReportErrors = () => ({
  type: types.CLEAR_REPORT_ERRORS
});

export const clearUserStatement = () => ({
  type: types.CLEAR_USER_STATEMENT
});

export const clearMyStatement = () => ({
  type: types.CLEAR_MY_STATEMENT
});

export const clearAdminReports = () => ({
  type: types.CLEAR_ADMIN_REPORTS
});

export const clearCustomReport = () => ({
  type: types.CLEAR_CUSTOM_REPORT
});

export const clearExportData = () => ({
  type: types.CLEAR_EXPORT_DATA
});

export const clearScheduledReports = () => ({
  type: types.CLEAR_SCHEDULED_REPORTS
});

export const setReportLoading = (loadingType) => ({
  type: types.SET_REPORT_LOADING,
  payload: loadingType
});

export const clearReportLoading = () => ({
  type: types.CLEAR_REPORT_LOADING
});