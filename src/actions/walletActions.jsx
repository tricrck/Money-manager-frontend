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
  import * as api from '../api/wallet';
  
  export const getWalletDetails = (userId) => async (dispatch) => {
    try {
      dispatch({ type: WALLET_DETAILS_REQUEST });
  
      const { data } = await api.getWallet(userId);
  
      dispatch({
        type: WALLET_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: WALLET_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const updateWallet = (userId, walletData) => async (dispatch) => {
    try {
      dispatch({ type: WALLET_UPDATE_REQUEST });
  
      const { data } = await api.updateWallet(userId, walletData);
  
      dispatch({
        type: WALLET_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: WALLET_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const depositToWallet = (userId, depositData) => async (dispatch) => {
    try {
      dispatch({ type: WALLET_DEPOSIT_REQUEST });
  
      const { data } = await api.deposit(userId, depositData);
  
      dispatch({
        type: WALLET_DEPOSIT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: WALLET_DEPOSIT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const withdrawFromWallet = (userId, withdrawData) => async (dispatch) => {
    try {
      dispatch({ type: WALLET_WITHDRAW_REQUEST });
  
      const { data } = await api.withdraw(userId, withdrawData);
  
      dispatch({
        type: WALLET_WITHDRAW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: WALLET_WITHDRAW_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };