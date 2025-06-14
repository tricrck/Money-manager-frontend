import {
  SETTINGS_GET_REQUEST,
  SETTINGS_GET_SUCCESS,
  SETTINGS_GET_FAIL,
  SETTINGS_UPDATE_REQUEST,
  SETTINGS_UPDATE_SUCCESS,
  SETTINGS_UPDATE_FAIL,
  SETTINGS_RESET_REQUEST,
  SETTINGS_RESET_SUCCESS,
  SETTINGS_RESET_FAIL,
  SERVER_INFO_GET_REQUEST,
  SERVER_INFO_GET_SUCCESS,
  SERVER_INFO_GET_FAIL,
  DB_INFO_GET_REQUEST,
  DB_INFO_GET_SUCCESS,
  DB_INFO_GET_FAIL,
} from '../constants/settingConstants';

import {
  getSettings as getSettingsAPI,
  updateSettings as updateSettingsAPI,
  resetSettings as resetSettingsAPI,
  getServerInfo as getServerInfoAPI,
  getDBInfo as getDBInfoAPI,
} from '../api/settings';

// Get Settings Action
export const getSettings = () => async (dispatch) => {
  try {
    dispatch({ type: SETTINGS_GET_REQUEST });

    const { data } = await getSettingsAPI();

    dispatch({
      type: SETTINGS_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SETTINGS_GET_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Update Settings Action
export const updateSettings = (settingsData) => async (dispatch) => {
  try {
    dispatch({ type: SETTINGS_UPDATE_REQUEST });

    const { data } = await updateSettingsAPI(settingsData);

    dispatch({
      type: SETTINGS_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SETTINGS_UPDATE_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Reset Settings Action
export const resetSettings = () => async (dispatch) => {
  try {
    dispatch({ type: SETTINGS_RESET_REQUEST });

    const { data } = await resetSettingsAPI();

    dispatch({
      type: SETTINGS_RESET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SETTINGS_RESET_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Get Server Info Action
export const getServerInfo = () => async (dispatch) => {
  try {
    dispatch({ type: SERVER_INFO_GET_REQUEST });

    const { data } = await getServerInfoAPI();

    dispatch({
      type: SERVER_INFO_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SERVER_INFO_GET_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Get Database Info Action
export const getDBInfo = () => async (dispatch) => {
  try {
    dispatch({ type: DB_INFO_GET_REQUEST });

    const { data } = await getDBInfoAPI();

    dispatch({
      type: DB_INFO_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DB_INFO_GET_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};