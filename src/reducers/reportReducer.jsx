import * as types from '../constants/reportConstants';

// Initial state
const initialState = {
  // User Statement
  userStatement: {
    data: null,
    loading: false,
    error: null
  },
  myStatement: {
    data: null,
    loading: false,
    error: null
  },
  
  // Admin Reports
  adminTransactions: {
    data: null,
    loading: false,
    error: null
  },
  adminAnalytics: {
    data: null,
    loading: false,
    error: null
  },
  realtimeMetrics: {
    data: null,
    loading: false,
    error: null
  },
  fraudInsights: {
    data: null,
    loading: false,
    error: null
  },
  
  // Export Data
  exportData: {
    transactions: null,
    userTransactions: null,
    loading: false,
    error: null
  },
  
  // Custom Reports
  customReport: {
    data: null,
    loading: false,
    error: null
  },
  
  // Scheduled Reports
  scheduledReports: {
    list: [],
    currentReport: null,
    loading: false,
    error: null
  },
  
  // Utility
  reportsHealth: {
    data: null,
    loading: false,
    error: null
  },
  reportsConfig: {
    data: null,
    loading: false,
    error: null
  },
  
  // Global loading state
  globalLoading: false,
  globalError: null
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    // USER STATEMENT CASES
    case types.GET_USER_STATEMENT_REQUEST:
      return {
        ...state,
        userStatement: {
          ...state.userStatement,
          loading: true,
          error: null
        }
      };
    
    case types.GET_USER_STATEMENT_SUCCESS:
      return {
        ...state,
        userStatement: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_USER_STATEMENT_FAIL:
      return {
        ...state,
        userStatement: {
          ...state.userStatement,
          loading: false,
          error: action.payload
        }
      };
    
    case types.GET_MY_STATEMENT_REQUEST:
      return {
        ...state,
        myStatement: {
          ...state.myStatement,
          loading: true,
          error: null
        }
      };
    
    case types.GET_MY_STATEMENT_SUCCESS:
      return {
        ...state,
        myStatement: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_MY_STATEMENT_FAIL:
      return {
        ...state,
        myStatement: {
          ...state.myStatement,
          loading: false,
          error: action.payload
        }
      };
    
    // ADMIN TRANSACTION CASES
    case types.GET_ADMIN_TRANSACTIONS_REQUEST:
      return {
        ...state,
        adminTransactions: {
          ...state.adminTransactions,
          loading: true,
          error: null
        }
      };
    
    case types.GET_ADMIN_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        adminTransactions: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_ADMIN_TRANSACTIONS_FAIL:
      return {
        ...state,
        adminTransactions: {
          ...state.adminTransactions,
          loading: false,
          error: action.payload
        }
      };
    
    // ADMIN ANALYTICS CASES
    case types.GET_ADMIN_ANALYTICS_REQUEST:
      return {
        ...state,
        adminAnalytics: {
          ...state.adminAnalytics,
          loading: true,
          error: null
        }
      };
    
    case types.GET_ADMIN_ANALYTICS_SUCCESS:
      return {
        ...state,
        adminAnalytics: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_ADMIN_ANALYTICS_FAIL:
      return {
        ...state,
        adminAnalytics: {
          ...state.adminAnalytics,
          loading: false,
          error: action.payload
        }
      };
    
    // REALTIME METRICS CASES
    case types.GET_REALTIME_METRICS_REQUEST:
      return {
        ...state,
        realtimeMetrics: {
          ...state.realtimeMetrics,
          loading: true,
          error: null
        }
      };
    
    case types.GET_REALTIME_METRICS_SUCCESS:
      return {
        ...state,
        realtimeMetrics: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_REALTIME_METRICS_FAIL:
      return {
        ...state,
        realtimeMetrics: {
          ...state.realtimeMetrics,
          loading: false,
          error: action.payload
        }
      };
    
    // FRAUD INSIGHTS CASES
    case types.GET_FRAUD_INSIGHTS_REQUEST:
      return {
        ...state,
        fraudInsights: {
          ...state.fraudInsights,
          loading: true,
          error: null
        }
      };
    
    case types.GET_FRAUD_INSIGHTS_SUCCESS:
      return {
        ...state,
        fraudInsights: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_FRAUD_INSIGHTS_FAIL:
      return {
        ...state,
        fraudInsights: {
          ...state.fraudInsights,
          loading: false,
          error: action.payload
        }
      };
    
    // EXPORT TRANSACTIONS CASES
    case types.EXPORT_TRANSACTIONS_REQUEST:
      return {
        ...state,
        exportData: {
          ...state.exportData,
          loading: true,
          error: null
        }
      };
    
    case types.EXPORT_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        exportData: {
          ...state.exportData,
          transactions: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.EXPORT_TRANSACTIONS_FAIL:
      return {
        ...state,
        exportData: {
          ...state.exportData,
          loading: false,
          error: action.payload
        }
      };
    
    // EXPORT USER TRANSACTIONS CASES
    case types.EXPORT_USER_TRANSACTIONS_REQUEST:
      return {
        ...state,
        exportData: {
          ...state.exportData,
          loading: true,
          error: null
        }
      };
    
    case types.EXPORT_USER_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        exportData: {
          ...state.exportData,
          userTransactions: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.EXPORT_USER_TRANSACTIONS_FAIL:
      return {
        ...state,
        exportData: {
          ...state.exportData,
          loading: false,
          error: action.payload
        }
      };
    
    // CUSTOM REPORT CASES
    case types.GENERATE_CUSTOM_REPORT_REQUEST:
      return {
        ...state,
        customReport: {
          ...state.customReport,
          loading: true,
          error: null
        }
      };
    
    case types.GENERATE_CUSTOM_REPORT_SUCCESS:
      return {
        ...state,
        customReport: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GENERATE_CUSTOM_REPORT_FAIL:
      return {
        ...state,
        customReport: {
          ...state.customReport,
          loading: false,
          error: action.payload
        }
      };
    
    // SCHEDULE REPORT CASES
    case types.SCHEDULE_REPORT_REQUEST:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: true,
          error: null
        }
      };
    
    case types.SCHEDULE_REPORT_SUCCESS:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          list: [...state.scheduledReports.list, action.payload],
          loading: false,
          error: null
        }
      };
    
    case types.SCHEDULE_REPORT_FAIL:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: false,
          error: action.payload
        }
      };
    
    // GET SCHEDULED REPORTS CASES
    case types.GET_SCHEDULED_REPORTS_REQUEST:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: true,
          error: null
        }
      };
    
    case types.GET_SCHEDULED_REPORTS_SUCCESS:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          list: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_SCHEDULED_REPORTS_FAIL:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: false,
          error: action.payload
        }
      };
    
    // UPDATE SCHEDULED REPORT CASES
    case types.UPDATE_SCHEDULED_REPORT_REQUEST:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: true,
          error: null
        }
      };
    
    case types.UPDATE_SCHEDULED_REPORT_SUCCESS:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          list: state.scheduledReports.list.map(report =>
            report.id === action.payload.scheduleId
              ? { ...report, ...action.payload.data }
              : report
          ),
          loading: false,
          error: null
        }
      };
    
    case types.UPDATE_SCHEDULED_REPORT_FAIL:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: false,
          error: action.payload
        }
      };
    
    // DELETE SCHEDULED REPORT CASES
    case types.DELETE_SCHEDULED_REPORT_REQUEST:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: true,
          error: null
        }
      };
    
    case types.DELETE_SCHEDULED_REPORT_SUCCESS:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          list: state.scheduledReports.list.filter(report => report.id !== action.payload),
          loading: false,
          error: null
        }
      };
    
    case types.DELETE_SCHEDULED_REPORT_FAIL:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: false,
          error: action.payload
        }
      };
    
    // GET SINGLE SCHEDULED REPORT CASES
    case types.GET_SCHEDULED_REPORT_REQUEST:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: true,
          error: null
        }
      };
    
    case types.GET_SCHEDULED_REPORT_SUCCESS:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          currentReport: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_SCHEDULED_REPORT_FAIL:
      return {
        ...state,
        scheduledReports: {
          ...state.scheduledReports,
          loading: false,
          error: action.payload
        }
      };
    
    // REPORTS HEALTH CASES
    case types.GET_REPORTS_HEALTH_REQUEST:
      return {
        ...state,
        reportsHealth: {
          ...state.reportsHealth,
          loading: true,
          error: null
        }
      };
    
    case types.GET_REPORTS_HEALTH_SUCCESS:
      return {
        ...state,
        reportsHealth: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_REPORTS_HEALTH_FAIL:
      return {
        ...state,
        reportsHealth: {
          ...state.reportsHealth,
          loading: false,
          error: action.payload
        }
      };
    
    // REPORTS CONFIG CASES
    case types.GET_REPORTS_CONFIG_REQUEST:
      return {
        ...state,
        reportsConfig: {
          ...state.reportsConfig,
          loading: true,
          error: null
        }
      };
    
    case types.GET_REPORTS_CONFIG_SUCCESS:
      return {
        ...state,
        reportsConfig: {
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case types.GET_REPORTS_CONFIG_FAIL:
      return {
        ...state,
        reportsConfig: {
          ...state.reportsConfig,
          loading: false,
          error: action.payload
        }
      };
    
    // CLEARING ACTIONS
    case types.CLEAR_REPORT_ERRORS:
      return {
        ...state,
        userStatement: { ...state.userStatement, error: null },
        myStatement: { ...state.myStatement, error: null },
        adminTransactions: { ...state.adminTransactions, error: null },
        adminAnalytics: { ...state.adminAnalytics, error: null },
        realtimeMetrics: { ...state.realtimeMetrics, error: null },
        fraudInsights: { ...state.fraudInsights, error: null },
        exportData: { ...state.exportData, error: null },
        customReport: { ...state.customReport, error: null },
        scheduledReports: { ...state.scheduledReports, error: null },
        reportsHealth: { ...state.reportsHealth, error: null },
        reportsConfig: { ...state.reportsConfig, error: null },
        globalError: null
      };
    
    case types.CLEAR_USER_STATEMENT:
      return {
        ...state,
        userStatement: {
          data: null,
          loading: false,
          error: null
        }
      };
    
    case types.CLEAR_MY_STATEMENT:
      return {
        ...state,
        myStatement: {
          data: null,
          loading: false,
          error: null
        }
      };
    
    case types.CLEAR_ADMIN_REPORTS:
      return {
        ...state,
        adminTransactions: {
          data: null,
          loading: false,
          error: null
        },
        adminAnalytics: {
          data: null,
          loading: false,
          error: null
        },
        realtimeMetrics: {
          data: null,
          loading: false,
          error: null
        },
        fraudInsights: {
          data: null,
          loading: false,
          error: null
        }
      };
    
    case types.CLEAR_CUSTOM_REPORT:
      return {
        ...state,
        customReport: {
          data: null,
          loading: false,
          error: null
        }
      };
    
    case types.CLEAR_EXPORT_DATA:
      return {
        ...state,
        exportData: {
          transactions: null,
          userTransactions: null,
          loading: false,
          error: null
        }
      };
    
    case types.CLEAR_SCHEDULED_REPORTS:
      return {
        ...state,
        scheduledReports: {
          list: [],
          currentReport: null,
          loading: false,
          error: null
        }
      };
    
    case types.SET_REPORT_LOADING:
      return {
        ...state,
        globalLoading: true,
        [action.payload]: {
          ...state[action.payload],
          loading: true
        }
      };
    
    case types.CLEAR_REPORT_LOADING:
      return {
        ...state,
        globalLoading: false
      };
    
    default:
      return state;
  }
};

export default reportReducer;