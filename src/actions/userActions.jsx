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
    USER_PROFILE_PICTURE_UPLOAD_REQUEST,
    USER_PROFILE_PICTURE_UPLOAD_SUCCESS,
    USER_PROFILE_PICTURE_UPLOAD_FAIL,
    USER_PASSWORD_RESET_LINK_REQUEST,
    USER_PASSWORD_RESET_LINK_SUCCESS,
    USER_PASSWORD_RESET_LINK_FAIL,
    USER_PASSWORD_RESET_REQUEST,
    USER_PASSWORD_RESET_SUCCESS,
    USER_PASSWORD_RESET_FAIL
  } from '../constants/userConstants';
  import {
  SAVE_PUSH_TOKEN_REQUEST,
  SAVE_PUSH_TOKEN_SUCCESS,
  SAVE_PUSH_TOKEN_FAIL,
} from '../constants/pushConstants';
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

  export const uploadProfilePicture = (userId, formData) => async (dispatch) => {
    console.log('Uploading profile picture for user:', userId);
    console.log('FormData:', formData);
    try {
      dispatch({ type: USER_PROFILE_PICTURE_UPLOAD_REQUEST });

      const { data } = await api.uploadProfilePicture(userId, formData);

      dispatch({
        type: USER_PROFILE_PICTURE_UPLOAD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_PROFILE_PICTURE_UPLOAD_FAIL,
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
    window.location.href = '/home';
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

  export const sendResetLink = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_PASSWORD_RESET_LINK_REQUEST });

    const { data } = await api.sendPasswordResetLink(email);

    dispatch({
      type: USER_PASSWORD_RESET_LINK_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: USER_PASSWORD_RESET_LINK_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// Reset password using token
export const resetPassword = (token, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: USER_PASSWORD_RESET_REQUEST });

    const { data } = await api.resetPassword(token, newPassword);

    dispatch({
      type: USER_PASSWORD_RESET_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: USER_PASSWORD_RESET_FAIL,
      payload:
        error.response?.data?.error,
    });
  }
};

export const savePushToken = (token) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_PUSH_TOKEN_REQUEST });

    const { data } = await api.pushToken(token);
    console.log('Push token saved:', data);

    dispatch({
      type: SAVE_PUSH_TOKEN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SAVE_PUSH_TOKEN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};