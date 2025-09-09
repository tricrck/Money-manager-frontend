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
    USER_PASSWORD_RESET_FAIL,
    SEND_OTP_REQUEST,
    SEND_OTP_SUCCESS,
    SEND_OTP_FAIL,
    VERIFY_OTP_REQUEST,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_FAIL,
    RESEND_OTP_REQUEST,
    RESEND_OTP_SUCCESS,
    RESEND_OTP_FAIL,
    CHECK_VERIFICATION_STATUS_REQUEST,
    CHECK_VERIFICATION_STATUS_SUCCESS,
    CHECK_VERIFICATION_STATUS_FAIL,
    SOCIAL_AUTH_REQUEST,
    SOCIAL_AUTH_SUCCESS,
    SOCIAL_AUTH_FAIL,
    USER_SESSIONS_FAIL,
    USER_SESSIONS_SUCCESS,
    USER_SESSIONS_REQUEST,
    USER_SESSION_REVOKE_REQUEST,
    USER_SESSION_REVOKE_SUCCESS,
    USER_SESSION_REVOKE_FAIL
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
  
      // Store tokens + user info
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
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
  
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
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
  
  export const logout = (sessionExpired = false) => async (dispatch) => {

    const { data } = await api.logoutUser();

    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('skipPhoneVerification');
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

export const sendOTP = (phoneNumber) => async (dispatch) => {
  try {
    dispatch({ type: SEND_OTP_REQUEST });

    const { data } = await api.sendOTP(phoneNumber);

    dispatch({
      type: SEND_OTP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEND_OTP_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Verify OTP
export const verifyOTP = (phoneNumber, otp) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_OTP_REQUEST });

    const { data } = await api.verifyOTP(phoneNumber, otp);

    dispatch({
      type: VERIFY_OTP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: VERIFY_OTP_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Resend OTP
export const resendOTP = (phoneNumber) => async (dispatch) => {
  try {
    dispatch({ type: RESEND_OTP_REQUEST });

    const { data } = await api.resendOTP(phoneNumber);

    dispatch({
      type: RESEND_OTP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RESEND_OTP_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Check Verification Status
export const checkVerificationStatus = (phoneNumber) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_VERIFICATION_STATUS_REQUEST });

    const { data } = await api.checkVerificationStatus(phoneNumber);

    dispatch({
      type: CHECK_VERIFICATION_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHECK_VERIFICATION_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

 // Social Auth Actions
  export const initiateSocialAuth = (provider) => (dispatch) => {
    try {
      dispatch({ type: SOCIAL_AUTH_REQUEST, payload: { provider } });
      
      // Redirect to OAuth provider
      switch (provider) {
        case 'google':
          api.initiateGoogleAuth();
          break;
        case 'facebook':
          api.initiateFacebookAuth();
          break;
        case 'twitter':
          api.initiateTwitterAuth();
          break;
        default:
          throw new Error('Invalid social auth provider');
      }
    } catch (error) {
      dispatch({
        type: SOCIAL_AUTH_FAIL,
        payload: error.message,
      });
    }
  };

  // Handle social auth success (called from callback page)
  export const handleSocialAuthSuccess = (token) => async (dispatch) => {
    try {
      dispatch({ type: SOCIAL_AUTH_REQUEST });

      // Store the token
      localStorage.setItem('accessToken', token);
      
      // Get user profile with the token
      const { data } = await api.getUserProfile();

      dispatch({
        type: SOCIAL_AUTH_SUCCESS,
        payload: data,
      });

      // Store user info
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // For social auth, we might not have refresh tokens initially
      // You might want to call a refresh endpoint to get proper tokens

    } catch (error) {
      dispatch({
        type: SOCIAL_AUTH_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      
      // Clear any stored tokens on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
    }
  };

  // Get active user sessions
export const getUserSessions = () => async (dispatch) => {
  try {
    dispatch({ type: 'USER_SESSIONS_REQUEST' });

    const { data } = await api.getUserSessions();

    dispatch({
      type: 'USER_SESSIONS_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'USER_SESSIONS_FAIL',
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Revoke a specific session
export const revokeSession = (sessionId) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_SESSION_REVOKE_REQUEST' });

    const { data } = await api.revokeSession(sessionId);

    dispatch({
      type: 'USER_SESSION_REVOKE_SUCCESS',
      payload: data,
    });

    // Refresh sessions list after revoking one
    dispatch(getUserSessions());
  } catch (error) {
    dispatch({
      type: 'USER_SESSION_REVOKE_FAIL',
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};