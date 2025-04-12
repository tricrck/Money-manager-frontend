import {
    WALLET_DETAILS_REQUEST,
    WALLET_DETAILS_SUCCESS,
    WALLET_DETAILS_FAIL,
    WALLET_UPDATE_REQUEST,
    WALLET_UPDATE_SUCCESS,
    WALLET_UPDATE_FAIL,
    WALLET_DEPOSIT_REQUEST,
    WALLET_DEPOSIT_SUCCESS,
    WALLET_DEPOSIT_FAIL,
    WALLET_WITHDRAW_REQUEST,
    WALLET_WITHDRAW_SUCCESS,
    WALLET_WITHDRAW_FAIL,
  } from '../constants/walletConstants';
  
  export const walletDetailsReducer = (state = { wallet: {} }, action) => {
    switch (action.type) {
      case WALLET_DETAILS_REQUEST:
        return { ...state, loading: true };
      case WALLET_DETAILS_SUCCESS:
        return { loading: false, wallet: action.payload };
      case WALLET_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const walletUpdateReducer = (state = {}, action) => {
    switch (action.type) {
      case WALLET_UPDATE_REQUEST:
        return { loading: true };
      case WALLET_UPDATE_SUCCESS:
        return { loading: false, success: true, wallet: action.payload };
      case WALLET_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const walletDepositReducer = (state = {}, action) => {
    switch (action.type) {
      case WALLET_DEPOSIT_REQUEST:
        return { loading: true };
      case WALLET_DEPOSIT_SUCCESS:
        return { loading: false, success: true, deposit: action.payload };
      case WALLET_DEPOSIT_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const walletWithdrawReducer = (state = {}, action) => {
    switch (action.type) {
      case WALLET_WITHDRAW_REQUEST:
        return { loading: true };
      case WALLET_WITHDRAW_SUCCESS:
        return { loading: false, success: true, withdrawal: action.payload };
      case WALLET_WITHDRAW_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };