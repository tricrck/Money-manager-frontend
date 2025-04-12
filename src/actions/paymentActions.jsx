import {
    MPESA_PAYMENT_REQUEST,
    MPESA_PAYMENT_SUCCESS,
    MPESA_PAYMENT_FAIL,
    MPESA_PAYMENT_RESET,
    MPESA_QUERY_REQUEST,
    MPESA_QUERY_SUCCESS,
    MPESA_QUERY_FAIL,
    MPESA_WITHDRAWAL_REQUEST,
    MPESA_WITHDRAWAL_SUCCESS,
    MPESA_WITHDRAWAL_FAIL,
    MPESA_WITHDRAWAL_STATUS_REQUEST,
    MPESA_WITHDRAWAL_STATUS_SUCCESS,
    MPESA_WITHDRAWAL_STATUS_FAIL,
    MPESA_BALANCE_REQUEST,
    MPESA_BALANCE_SUCCESS,
    MPESA_BALANCE_FAIL,
    STRIPE_PAYMENT_REQUEST,
    STRIPE_PAYMENT_SUCCESS,
    STRIPE_PAYMENT_FAIL,
    STRIPE_PAYMENT_RESET,
    STRIPE_PAYMENT_DETAILS_REQUEST,
    STRIPE_PAYMENT_DETAILS_SUCCESS,
    STRIPE_PAYMENT_DETAILS_FAIL,
    STRIPE_PAYOUT_REQUEST,
    STRIPE_PAYOUT_SUCCESS,
    STRIPE_PAYOUT_FAIL,
    STRIPE_PAYOUT_DETAILS_REQUEST,
    STRIPE_PAYOUT_DETAILS_SUCCESS,
    STRIPE_PAYOUT_DETAILS_FAIL,
    STRIPE_BALANCE_REQUEST,
    STRIPE_BALANCE_SUCCESS,
    STRIPE_BALANCE_FAIL,
    PAYMENT_STATUS_REQUEST,
    PAYMENT_STATUS_SUCCESS,
    PAYMENT_STATUS_FAIL,
    PAYMENT_STATUS_RESET,
  } from '../constants/paymentConstants';
  import * as api from '../api/payments';
  
  // M-Pesa Actions
  export const initiateMpesaPayment = (paymentData) => async (dispatch) => {
    try {
      dispatch({ type: MPESA_PAYMENT_REQUEST });
  
      const { data } = await api.mpesaPayment(paymentData);
  
      dispatch({
        type: MPESA_PAYMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MPESA_PAYMENT_FAIL,
        payload:
          error.errorMessage && error.errorCode
            ? error.requestId
            : error.id,
      });
    }
  };
  
  export const queryMpesaTransaction = (transactionId) => async (dispatch) => {
    try {
      dispatch({ type: MPESA_QUERY_REQUEST });
  
      const { data } = await api.mpesaQuery(transactionId);
  
      dispatch({
        type: MPESA_QUERY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MPESA_QUERY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const initiateMpesaWithdrawal = (withdrawalData) => async (dispatch) => {
    try {
      dispatch({ type: MPESA_WITHDRAWAL_REQUEST });
  
      const { data } = await api.mpesaWithdrawal(withdrawalData);
  
      dispatch({
        type: MPESA_WITHDRAWAL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MPESA_WITHDRAWAL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const checkMpesaWithdrawalStatus = (transactionId) => async (dispatch) => {
    try {
      dispatch({ type: MPESA_WITHDRAWAL_STATUS_REQUEST });
  
      const { data } = await api.mpesaWithdrawalStatus(transactionId);
  
      dispatch({
        type: MPESA_WITHDRAWAL_STATUS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MPESA_WITHDRAWAL_STATUS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const checkMpesaBalance = () => async (dispatch) => {
    try {
      dispatch({ type: MPESA_BALANCE_REQUEST });
  
      const { data } = await api.mpesaCheckBalance();
  
      dispatch({
        type: MPESA_BALANCE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MPESA_BALANCE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  // Stripe Actions
  export const initiateStripePayment = (paymentData) => async (dispatch) => {
    console.log('Payment Data:', paymentData); // Log the payment data
    try {
      dispatch({ type: STRIPE_PAYMENT_REQUEST });
  
      const { data } = await api.stripePayment(paymentData);
  
      dispatch({
        type: STRIPE_PAYMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STRIPE_PAYMENT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const getStripePaymentDetails = (paymentIntentId) => async (dispatch) => {
    try {
      dispatch({ type: STRIPE_PAYMENT_DETAILS_REQUEST });
  
      const { data } = await api.stripePaymentDetails(paymentIntentId);
  
      dispatch({
        type: STRIPE_PAYMENT_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STRIPE_PAYMENT_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const initiateStripePayout = (payoutData) => async (dispatch) => {
    try {
      dispatch({ type: STRIPE_PAYOUT_REQUEST });
  
      const { data } = await api.stripePayout(payoutData);
  
      dispatch({
        type: STRIPE_PAYOUT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STRIPE_PAYOUT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const getStripePayoutDetails = (payoutId) => async (dispatch) => {
    try {
      dispatch({ type: STRIPE_PAYOUT_DETAILS_REQUEST });
  
      const { data } = await api.stripePayoutDetails(payoutId);
  
      dispatch({
        type: STRIPE_PAYOUT_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STRIPE_PAYOUT_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const checkStripeBalance = () => async (dispatch) => {
    try {
      dispatch({ type: STRIPE_BALANCE_REQUEST });
  
      const { data } = await api.stripeCheckBalance();
  
      dispatch({
        type: STRIPE_BALANCE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: STRIPE_BALANCE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
// Check payment status
export const checkPaymentStatus = (paymentId, paymentType) => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_STATUS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    let response;

    if (paymentType === 'mpesa') {
      response = await mpesaQuery(paymentId); // transactionId
    } else if (paymentType === 'stripe') {
      response = await stripePaymentDetails(paymentId); // paymentIntentId
    } else {
      throw new Error('Unsupported payment type');
    }

    dispatch({
      type: PAYMENT_STATUS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: PAYMENT_STATUS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


// Handle successful payment and add to wallet
export const handleSuccessfulPayment = (userId, paymentData, paymentDetails) => async (dispatch, getState) => {
  // 1. Update wallet with deposit
  dispatch(depositToWallet(userId, {
    amount: Number(paymentDetails.amount),
    paymentMethod: paymentData.paymentMethod,
    paymentReference: paymentDetails.transactionId || paymentDetails.paymentIntentId,
    description: paymentData.description || `Wallet deposit via ${paymentData.paymentMethod}`,
  }));
  
  // 2. Reset payment state
  setTimeout(() => {
    dispatch(resetPaymentState());
  }, 3000);
};

export const resetPaymentState = () => (dispatch) => {
  dispatch({ type: 'MPESA_PAYMENT_RESET' });
  dispatch({ type: 'STRIPE_PAYMENT_RESET' });
  dispatch({ type: 'PAYMENT_STATUS_RESET' });
};