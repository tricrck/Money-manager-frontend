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

// Settings Get Reducer
export const settingsGetReducer = (state = { settings: {} }, action) => {
  switch (action.type) {
    case SETTINGS_GET_REQUEST:
      return { loading: true, settings: {} };
    case SETTINGS_GET_SUCCESS:
      return { loading: false, settings: action.payload };
    case SETTINGS_GET_FAIL:
      return { loading: false, error: action.payload, settings: {} };
    default:
      return state;
  }
};

// Settings Update Reducer
export const settingsUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE_REQUEST:
      return { loading: true };
    case SETTINGS_UPDATE_SUCCESS:
      return { loading: false, success: true, settings: action.payload };
    case SETTINGS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Settings Reset Reducer
export const settingsResetReducer = (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_RESET_REQUEST:
      return { loading: true };
    case SETTINGS_RESET_SUCCESS:
      return { loading: false, success: true, settings: action.payload };
    case SETTINGS_RESET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Server Info Get Reducer
export const serverInfoGetReducer = (state = { serverInfo: {} }, action) => {
  switch (action.type) {
    case SERVER_INFO_GET_REQUEST:
      return { loading: true, serverInfo: {} };
    case SERVER_INFO_GET_SUCCESS:
      return { loading: false, serverInfo: action.payload };
    case SERVER_INFO_GET_FAIL:
      return { loading: false, error: action.payload, serverInfo: {} };
    default:
      return state;
  }
};

// Database Info Get Reducer
export const dbInfoGetReducer = (state = { dbInfo: {} }, action) => {
  switch (action.type) {
    case DB_INFO_GET_REQUEST:
      return { loading: true, dbInfo: {} };
    case DB_INFO_GET_SUCCESS:
      return { loading: false, dbInfo: action.payload };
    case DB_INFO_GET_FAIL:
      return { loading: false, error: action.payload, dbInfo: {} };
    default:
      return state;
  }
};