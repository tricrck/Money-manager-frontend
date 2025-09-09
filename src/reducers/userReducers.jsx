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
    USER_SESSIONS_REQUEST,
    USER_SESSIONS_SUCCESS,
    USER_SESSIONS_FAIL,
   USER_SESSION_REVOKE_REQUEST,
   USER_SESSION_REVOKE_SUCCESS,
   USER_SESSION_REVOKE_FAIL,
  } from '../constants/userConstants';

  import {
  SAVE_PUSH_TOKEN_REQUEST,
  SAVE_PUSH_TOKEN_SUCCESS,
  SAVE_PUSH_TOKEN_FAIL,
} from '../constants/pushConstants';


  export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_REGISTER_REQUEST:
        return { loading: true };
      case USER_REGISTER_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_REGISTER_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const userProfilePictureUploadReducer = (state = { profile: {} }, action) => {
    switch (action.type) {
      case USER_PROFILE_PICTURE_UPLOAD_REQUEST:
        return { loading: true };
      case USER_PROFILE_PICTURE_UPLOAD_SUCCESS:
        return { loading: false, success: true, profile: action.payload };
      case USER_PROFILE_PICTURE_UPLOAD_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return { loading: true };
      case USER_LOGIN_SUCCESS:
        return { loading: false, userInfo: action.payload.user };
      case USER_LOGIN_FAIL:
        return { loading: false, error: action.payload };
      case SOCIAL_AUTH_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
          socialAuthProvider: action.payload?.provider
        };
      case SOCIAL_AUTH_SUCCESS:
        return {
          ...state,
          loading: false,
          userInfo: action.payload,
          error: null,
          socialAuthProvider: null
        };
      case SOCIAL_AUTH_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
          socialAuthProvider: null
        };
      case USER_LOGOUT:
        return {};
      default:
        return state;
    }
  };
  
  export const userListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
      case USER_LIST_REQUEST:
        return { loading: true };
      case USER_LIST_SUCCESS:
        return { loading: false, users: action.payload };
      case USER_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {
      case USER_DETAILS_REQUEST:
        return { ...state, loading: true };
      case USER_DETAILS_SUCCESS:
        return { loading: false, user: action.payload };
      case USER_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
      case USER_UPDATE_REQUEST:
        return { loading: true };
      case USER_UPDATE_SUCCESS:
        return { loading: false, success: true, user: action.payload };
      case USER_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_DELETE_REQUEST:
        return { loading: true };
      case USER_DELETE_SUCCESS:
        return { loading: false, success: true };
      case USER_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  // Reducer for sending reset link
export const passwordResetLinkReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PASSWORD_RESET_LINK_REQUEST:
      return { loading: true };
    case USER_PASSWORD_RESET_LINK_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_PASSWORD_RESET_LINK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for resetting password
export const passwordResetReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PASSWORD_RESET_REQUEST:
      return { loading: true };
    case USER_PASSWORD_RESET_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_PASSWORD_RESET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const pushTokenReducer = (state = {}, action) => {
  switch (action.type) {
    case SAVE_PUSH_TOKEN_REQUEST:
      return { loading: true };
    case SAVE_PUSH_TOKEN_SUCCESS:
      return { loading: false, success: true };
    case SAVE_PUSH_TOKEN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Send OTP Reducer
export const sendOTPReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_OTP_REQUEST:
      return { loading: true };
    case SEND_OTP_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case SEND_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Verify OTP Reducer
export const verifyOTPReducer = (state = {}, action) => {
  switch (action.type) {
    case VERIFY_OTP_REQUEST:
      return { loading: true };
    case VERIFY_OTP_SUCCESS:
      return { loading: false, success: true, verified: action.payload };
    case VERIFY_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Resend OTP Reducer
export const resendOTPReducer = (state = {}, action) => {
  switch (action.type) {
    case RESEND_OTP_REQUEST:
      return { loading: true };
    case RESEND_OTP_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case RESEND_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Check Verification Status Reducer
export const checkVerificationStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case CHECK_VERIFICATION_STATUS_REQUEST:
      return { loading: true };
    case CHECK_VERIFICATION_STATUS_SUCCESS:
      return { loading: false, verified: action.payload };
    case CHECK_VERIFICATION_STATUS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userSessionsReducer = (state = { sessions: [] }, action) => {
  switch (action.type) {
    case USER_SESSIONS_REQUEST:
      return { loading: true, sessions: [] };
    case USER_SESSIONS_SUCCESS:
      return { loading: false, sessions: action.payload };
    case USER_SESSIONS_FAIL:
      return { loading: false, error: action.payload, sessions: [] };
    default:
      return state;
  }
};

export const revokeSessionReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SESSION_REVOKE_REQUEST:
      return { loading: true };
    case USER_SESSION_REVOKE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_SESSION_REVOKE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
