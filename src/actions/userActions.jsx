import {
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
  } from '../constants/userConstants';
  import * as api from '../api/users';
  
  export const register = (userData) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
  
      const { data } = await api.registerUser(userData);
  
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });
  
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('x-auth-token', data.token);
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const login = (phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
  
      const { data } = await api.loginUser({ phoneNumber, password });
  
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
  
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('x-auth-token', data.token);
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const logout = (sessionExpired = false) => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('x-auth-token');
    dispatch({ type: USER_LOGOUT });
    
    // Optional: Dispatch notification about session expiry
    if (sessionExpired) {
      dispatch({
        type: 'SET_NOTIFICATION', // You'll need to define this action type
        payload: {
          message: 'Your session has expired. Please log in again.',
          type: 'info'
        }
      });
    }
    
    // Optional: Redirect to login page
    window.location.href = '/login';
  };
  
  export const listUsers = () => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LIST_REQUEST });
  
      const { data } = await api.getUsers();
  
      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_DETAILS_REQUEST });
  
      const { data } = await api.getUser(id);
  
      dispatch({
        type: USER_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const updateUser = (user) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_UPDATE_REQUEST });
  
      const { data } = await api.updateUser(user._id, user);
  
      dispatch({
        type: USER_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const deleteUser = (id) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_DELETE_REQUEST });
  
      await api.deleteUser(id);
  
      dispatch({ type: USER_DELETE_SUCCESS });
    } catch (error) {
      dispatch({
        type: USER_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };