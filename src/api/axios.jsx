import axios from 'axios';
import store from '../store'; // Import your Redux store
import { logout } from '../actions/userActions';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('x-auth-token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Configuration
const INTERCEPTOR_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Base delay in ms
  retryDelayMultiplier: 2, // Exponential backoff
  timeoutThreshold: 30000, // 30 seconds
  enableDetailedLogging: true,
  enableMetrics: true,
  enableNotifications: true
};

// Metrics tracking
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  retriedRequests: 0,
  errorsByType: {},
  averageResponseTime: 0,
  slowestRequest: { url: '', time: 0 },
  fastestRequest: { url: '', time: Infinity }
};

// Request tracking
const activeRequests = new Map();
const requestHistory = [];

// Utility functions
const logger = {
  info: (message, data) => {
    if (INTERCEPTOR_CONFIG.enableDetailedLogging) {
    }
  },
  warn: (message, data) => {
    if (INTERCEPTOR_CONFIG.enableDetailedLogging) {
      console.warn(`🟡 [API-WARN] ${message}`, data || '');
    }
  },
  error: (message, data) => {
    if (INTERCEPTOR_CONFIG.enableDetailedLogging) {
      console.error(`🔴 [API-ERROR] ${message}`, data || '');
    }
  },
  success: (message, data) => {
    if (INTERCEPTOR_CONFIG.enableDetailedLogging) {
    }
  }
};

const showNotification = (type, title, message) => {
  if (!INTERCEPTOR_CONFIG.enableNotifications) return;
  
  // You can replace this with your preferred notification system
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message, icon: getIconForType(type) });
  } else {
    // Fallback to console or custom toast
    console.log(`${type.toUpperCase()}: ${title} - ${message}`);
  }
};

const getIconForType = (type) => {
  const icons = {
    error: '❌',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️'
  };
  return icons[type] || 'ℹ️';
};

const updateMetrics = (type, responseTime = 0, url = '') => {
  if (!INTERCEPTOR_CONFIG.enableMetrics) return;
  
  metrics.totalRequests++;
  
  if (type === 'success') {
    metrics.successfulRequests++;
    
    // Track response times
    if (responseTime > 0) {
      metrics.averageResponseTime = 
        (metrics.averageResponseTime * (metrics.successfulRequests - 1) + responseTime) / 
        metrics.successfulRequests;
      
      if (responseTime > metrics.slowestRequest.time) {
        metrics.slowestRequest = { url, time: responseTime };
      }
      
      if (responseTime < metrics.fastestRequest.time) {
        metrics.fastestRequest = { url, time: responseTime };
      }
    }
  } else if (type === 'error') {
    metrics.failedRequests++;
  } else if (type === 'retry') {
    metrics.retriedRequests++;
  }
};

const trackError = (errorType) => {
  if (!INTERCEPTOR_CONFIG.enableMetrics) return;
  
  metrics.errorsByType[errorType] = (metrics.errorsByType[errorType] || 0) + 1;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  if (!error.response) return true; // Network errors are retryable
  
  const status = error.response.status;
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  
  return retryableStatuses.includes(status);
};

const getErrorCategory = (error) => {
  if (!error.response) return 'NETWORK_ERROR';
  
  const status = error.response.status;
  
  if (status >= 400 && status < 500) return 'CLIENT_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  
  return 'UNKNOWN_ERROR';
};

const getDetailedErrorInfo = (error) => {
  const info = {
    timestamp: new Date().toISOString(),
    url: error.config?.url || 'Unknown',
    method: error.config?.method?.toUpperCase() || 'Unknown',
    status: error.response?.status || 'No Response',
    statusText: error.response?.statusText || 'No Status Text',
    message: error.message || 'Unknown Error',
    category: getErrorCategory(error),
    headers: error.response?.headers || {},
    data: error.response?.data || null,
    config: {
      timeout: error.config?.timeout,
      baseURL: error.config?.baseURL,
      params: error.config?.params
    }
  };
  
  return info;
};

// REQUEST INTERCEPTOR - Enhanced monitoring and preparation
api.interceptors.request.use(
  (config) => {
    const requestId = `${config.method}_${config.url}_${Date.now()}`;
    const startTime = performance.now();
    
    // Add request tracking
    activeRequests.set(requestId, {
      config,
      startTime,
      url: config.url,
      method: config.method?.toUpperCase()
    });
    
    // Add request ID to config for tracking
    config.requestId = requestId;
    
    // Enhanced logging
    logger.info(`Outgoing ${config.method?.toUpperCase()} request`, {
      url: config.url,
      requestId,
      headers: config.headers,
      params: config.params,
      timeout: config.timeout || 'default'
    });
    
    // Add retry count to config
    config.retryCount = config.retryCount || 0;
    
    // Add timestamp
    config.timestamp = new Date().toISOString();
    
    return config;
  },
  (error) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - God Mode Error Handling
api.interceptors.response.use(
  // SUCCESS HANDLER - Enhanced with metrics and logging
  (response) => {
    const requestId = response.config.requestId;
    const requestInfo = activeRequests.get(requestId);
    
    if (requestInfo) {
      const responseTime = performance.now() - requestInfo.startTime;
      
      // Update metrics
      updateMetrics('success', responseTime, response.config.url);
      
      // Enhanced success logging
      logger.success(`Request completed successfully`, {
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        responseTime: `${responseTime.toFixed(2)}ms`,
        dataSize: JSON.stringify(response.data).length + ' bytes'
      });
      
      // Clean up tracking
      activeRequests.delete(requestId);
      
      // Store in history
      requestHistory.push({
        type: 'success',
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString()
      });
      
      // Keep history manageable
      if (requestHistory.length > 100) {
        requestHistory.shift();
      }
    }
    
    return response;
  },
  
  // ERROR HANDLER - God Mode Implementation
  async (error) => {
    const errorInfo = getDetailedErrorInfo(error);
    const config = error.config || {};
    const requestId = config.requestId;
    
    // Update metrics
    updateMetrics('error');
    trackError(errorInfo.category);
    
    // Clean up active request tracking
    if (requestId) {
      activeRequests.delete(requestId);
    }
    
    // Comprehensive error logging
    logger.error('Request failed', errorInfo);
    
    // Store error in history
    requestHistory.push({
      type: 'error',
      url: errorInfo.url,
      method: errorInfo.method,
      status: errorInfo.status,
      category: errorInfo.category,
      message: errorInfo.message,
      timestamp: errorInfo.timestamp
    });
    
    // AUTHENTICATION ERRORS (401)
    if (error.response && error.response.status === 401) {
      logger.warn('Authentication failed - Session expired');
      
      showNotification('warning', 'Session Expired', 'You will be redirected to login');
      
      // Dispatch logout with detailed reason
      if (typeof store !== 'undefined' && store.dispatch) {
        store.dispatch(logout({
          reason: 'session_expired',
          timestamp: new Date().toISOString(),
          originalUrl: config.url
        }));
      }
      
      // Graceful redirect with delay
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
      
      return Promise.reject(error);
    }
    
    // FORBIDDEN ERRORS (403)
    else if (error.response && error.response.status === 403) {
      logger.warn('Access forbidden', { url: config.url, user: 'current_user' });
      
      showNotification('error', 'Access Denied', 'You do not have permission to access this resource');
      
      return Promise.reject(error);
    }
    
    // RATE LIMITING (429)
    else if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      
      logger.warn(`Rate limited - Retry after ${retryAfter} seconds`);
      
      showNotification('warning', 'Rate Limited', `Please wait ${retryAfter} seconds before retrying`);
      
      // Auto-retry after the specified delay
      if (config.retryCount < INTERCEPTOR_CONFIG.maxRetries) {
        config.retryCount++;
        updateMetrics('retry');
        
        logger.info(`Retrying request after rate limit (attempt ${config.retryCount})`);
        
        await sleep(retryAfter * 1000);
        return api(config);
      }
    }

    // NEW: Handle 404 errors for user-specific endpoints (indicates user no longer exists)
    else if (error.response && error.response.status === 404) {
      const url = config.url || '';
      const isUserEndpoint = url.includes('/users/') || 
                            url.includes('/profile') ||
                            (url.includes('/users') && config.method?.toLowerCase() === 'get');
      
      if (isUserEndpoint) {
        logger.warn('User not found - Account may have been deleted or session invalid');
        
        showNotification('warning', 'Account Not Found', 'Your account appears to be invalid. Redirecting to login...');
        
        // Dispatch logout with detailed reason
        if (typeof store !== 'undefined' && store.dispatch) {
          store.dispatch(logout({
            reason: 'user_not_found',
            timestamp: new Date().toISOString(),
            originalUrl: config.url
          }));
        }
        
        // Clear any stored auth tokens
        localStorage.removeItem('x-auth-token');
        
        // Graceful redirect with delay
        setTimeout(() => {
          window.location.href = '/home';
        }, 1500);
        
        return Promise.reject(error);
      } else {
        // Handle non-user 404s normally
        logger.warn('Resource not found', {
          url: config.url,
          method: config.method,
          responseData: error.response.data
        });
        
        showNotification('warning', 'Request Error', 'Resource not found');
      }
    }
    
    // SERVER ERRORS (5xx) - With intelligent retry
    else if (error.response && error.response.status >= 500) {
      const status = error.response.status;
      const errorMessage = `Server error ${status}: ${error.response.statusText}`;
      
      logger.error(errorMessage, {
        url: config.url,
        responseData: error.response.data,
        headers: error.response.headers
      });
      
      // Retry logic for server errors
      if (config.retryCount < INTERCEPTOR_CONFIG.maxRetries && isRetryableError(error)) {
        config.retryCount++;
        updateMetrics('retry');
        
        const delay = INTERCEPTOR_CONFIG.retryDelay * 
          Math.pow(INTERCEPTOR_CONFIG.retryDelayMultiplier, config.retryCount - 1);
        
        logger.info(`Retrying request due to server error (attempt ${config.retryCount}/${INTERCEPTOR_CONFIG.maxRetries}) - waiting ${delay}ms`);
        
        showNotification('info', 'Retrying Request', `Attempt ${config.retryCount} of ${INTERCEPTOR_CONFIG.maxRetries}`);
        
        await sleep(delay);
        return api(config);
      } else {
        showNotification('error', 'Server Error', 'Server is experiencing issues. Please try again later.');
      }
    }
    
    // CLIENT ERRORS (4xx)
    else if (error.response && error.response.status >= 400 && error.response.status < 500) {
      const status = error.response.status;
      const messages = {
        400: 'Bad request - Please check your input',
        404: 'Resource not found',
        409: 'Conflict - Resource already exists or is in use',
        422: 'Validation failed - Please check your data'
      };
      
      const message = messages[status] || `Client error ${status}`;
      
      logger.warn(message, {
        url: config.url,
        method: config.method,
        responseData: error.response.data
      });
      
      showNotification('warning', 'Request Error', message);
    }
    
    // NETWORK ERRORS (No response)
    else if (!error.response) {
      logger.error('Network error occurred', {
        message: error.message,
        code: error.code,
        url: config.url
      });
      
      // Retry network errors
      if (config.retryCount < INTERCEPTOR_CONFIG.maxRetries) {
        config.retryCount++;
        updateMetrics('retry');
        
        const delay = INTERCEPTOR_CONFIG.retryDelay * 
          Math.pow(INTERCEPTOR_CONFIG.retryDelayMultiplier, config.retryCount - 1);
        
        logger.info(`Retrying request due to network error (attempt ${config.retryCount}/${INTERCEPTOR_CONFIG.maxRetries}) - waiting ${delay}ms`);
        
        showNotification('info', 'Connection Issue', `Retrying... (${config.retryCount}/${INTERCEPTOR_CONFIG.maxRetries})`);
        
        await sleep(delay);
        return api(config);
      } else {
        showNotification('error', 'Network Error', 'Please check your internet connection and try again');
      }
    }
    
    // TIMEOUT ERRORS
    else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      logger.error('Request timeout', {
        url: config.url,
        timeout: config.timeout || 'default'
      });
      
      showNotification('warning', 'Request Timeout', 'The request took too long to complete');
    }
    
    // UNKNOWN ERRORS
    else {
      logger.error('Unknown error occurred', {
        error: error.message,
        stack: error.stack,
        config: config
      });
      
      showNotification('error', 'Unexpected Error', 'An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// UTILITY FUNCTIONS FOR MONITORING AND DEBUGGING

// Get current metrics
window.getAPIMetrics = () => {
  console.table(metrics);
  return metrics;
};

// Get request history
window.getRequestHistory = (limit = 20) => {
  return requestHistory.slice(-limit);
};

// Get active requests
window.getActiveRequests = () => {
  return Array.from(activeRequests.entries()).map(([id, info]) => ({
    id,
    ...info,
    duration: `${(performance.now() - info.startTime).toFixed(2)}ms`
  }));
};

// Clear metrics
window.clearAPIMetrics = () => {
  Object.keys(metrics).forEach(key => {
    if (typeof metrics[key] === 'number') {
      metrics[key] = 0;
    } else if (typeof metrics[key] === 'object') {
      if (key === 'slowestRequest') {
        metrics[key] = { url: '', time: 0 };
      } else if (key === 'fastestRequest') {
        metrics[key] = { url: '', time: Infinity };
      } else {
        metrics[key] = {};
      }
    }
  });
  
  requestHistory.length = 0;
  console.log('API metrics cleared');
};

// Configure interceptor
window.configureAPIInterceptor = (newConfig) => {
  Object.assign(INTERCEPTOR_CONFIG, newConfig);
  console.log('Interceptor configuration updated:', INTERCEPTOR_CONFIG);
};

export default api;