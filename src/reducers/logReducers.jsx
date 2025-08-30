import {
  LOGS_LIST_REQUEST,
  LOGS_LIST_SUCCESS,
  LOGS_LIST_FAIL,
  LOGS_FILTER_UPDATE,
  LOGS_CLEAR_FILTERS
} from '../constants/logConstants'

const initialState = {
  logs: [],
  filteredLogs: [],
  loading: false,
  error: null,
  filters: {
    level: 'all',
    search: '',
    dateRange: null
  }
}

export const logsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGS_LIST_REQUEST:
      return { ...state, loading: true }
    
    case LOGS_LIST_SUCCESS:
      return { 
        ...state, 
        loading: false,
        logs: action.payload,
        filteredLogs: applyFilters(action.payload, state.filters)
      }
    
    case LOGS_LIST_FAIL:
      return { ...state, loading: false, error: action.payload }
    
    case LOGS_FILTER_UPDATE:
      const newFilters = { ...state.filters, ...action.payload }
      return {
        ...state,
        filters: newFilters,
        filteredLogs: applyFilters(state.logs, newFilters)
      }
    
    case LOGS_CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        filteredLogs: state.logs
      }
    
    default:
      return state
  }
}

const applyFilters = (logs, filters) => {
  return logs.filter(log => {
    // Filter by level (string or numeric support)
    if (filters.level !== 'all') {
      const levelMatch =
        log.levelName?.toUpperCase() === filters.level.toUpperCase() ||
        String(log.level) === String(filters.level)
      if (!levelMatch) return false
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const messageMatch = log.message?.toLowerCase().includes(searchTerm) || false
      const sourceMatch = log.source?.toLowerCase().includes(searchTerm) || false
      if (!messageMatch && !sourceMatch) return false
    }

    // Filter by date range
    if (filters.dateRange) {
      const logDate = new Date(log.date || log.timestamp) // prefer ISO "date"
      if (logDate < filters.dateRange.from || logDate > filters.dateRange.to) {
        return false
      }
    }

    return true
  })
}
