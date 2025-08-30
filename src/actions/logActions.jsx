import {
  LOGS_LIST_REQUEST,
  LOGS_LIST_SUCCESS,
  LOGS_LIST_FAIL,
  LOGS_FILTER_UPDATE,
  LOGS_CLEAR_FILTERS
} from '../constants/logConstants'
import * as logActions from '../api/logs'

export const listLogs = () => async (dispatch) => {
  try {
    dispatch({ type: LOGS_LIST_REQUEST })

    const { data } = await logActions.getLogs()

    dispatch({
      type: LOGS_LIST_SUCCESS,
      payload: data.data
    })
  } catch (error) {
    dispatch({
      type: LOGS_LIST_FAIL,
      payload: error.response?.data?.message || error.message
    })
  }
}

export const updateLogsFilter = (filters) => (dispatch) => {
  dispatch({
    type: LOGS_FILTER_UPDATE,
    payload: filters
  })
}

export const clearLogsFilters = () => (dispatch) => {
  dispatch({ type: LOGS_CLEAR_FILTERS })
}