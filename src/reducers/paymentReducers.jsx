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
  
  // M-Pesa Reducers
  export const mpesaPaymentReducer = (state = {}, action) => {
    switch (action.type) {
      case MPESA_PAYMENT_REQUEST:
        return { loading: true };
      case MPESA_PAYMENT_SUCCESS:
        return { loading: false, success: true, payment: action.payload };
      case MPESA_PAYMENT_FAIL:
        return { loading: false, error: action.payload };
      case MPESA_PAYMENT_RESET:
        return {};
      default:
        return state;
    }
  };
  
  export const mpesaQueryReducer = (state = {}, action) => {
    switch (action.type) {
      case MPESA_QUERY_REQUEST:
        return { loading: true };
      case MPESA_QUERY_SUCCESS:
        return { loading: false, transaction: action.payload };
      case MPESA_QUERY_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const mpesaWithdrawalReducer = (state = {}, action) => {
    switch (action.type) {
      case MPESA_WITHDRAWAL_REQUEST:
        return { loading: true };
      case MPESA_WITHDRAWAL_SUCCESS:
        return { loading: false, success: true, withdrawal: action.payload };
      case MPESA_WITHDRAWAL_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const mpesaWithdrawalStatusReducer = (state = {}, action) => {
    switch (action.type) {
      case MPESA_WITHDRAWAL_STATUS_REQUEST:
        return { loading: true };
      case MPESA_WITHDRAWAL_STATUS_SUCCESS:
        return { loading: false, status: action.payload };
      case MPESA_WITHDRAWAL_STATUS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const mpesaBalanceReducer = (state = {}, action) => {
    switch (action.type) {
      case MPESA_BALANCE_REQUEST:
        return { loading: true };
      case MPESA_BALANCE_SUCCESS:
        return { loading: false, balance: action.payload };
      case MPESA_BALANCE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  // Stripe Reducers
  export const stripePaymentReducer = (state = {}, action) => {
    switch (action.type) {
      case STRIPE_PAYMENT_REQUEST:
        return { loading: true };
      case STRIPE_PAYMENT_SUCCESS:
        return { loading: false, success: true, payment: action.payload };
      case STRIPE_PAYMENT_FAIL:
        return { loading: false, error: action.payload };
      case STRIPE_PAYMENT_RESET:
        return {};
      default:
        return state;
    }
  };
  
  export const stripePaymentDetailsReducer = (state = {}, action) => {
    switch (action.type) {
      case STRIPE_PAYMENT_DETAILS_REQUEST:
        return { loading: true };
      case STRIPE_PAYMENT_DETAILS_SUCCESS:
        return { loading: false, payment: action.payload };
      case STRIPE_PAYMENT_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const stripePayoutReducer = (state = {}, action) => {
    switch (action.type) {
      case STRIPE_PAYOUT_REQUEST:
        return { loading: true };
      case STRIPE_PAYOUT_SUCCESS:
        return { loading: false, success: true, payout: action.payload };
      case STRIPE_PAYOUT_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const stripePayoutDetailsReducer = (state = {}, action) => {
    switch (action.type) {
      case STRIPE_PAYOUT_DETAILS_REQUEST:
        return { loading: true };
      case STRIPE_PAYOUT_DETAILS_SUCCESS:
        return { loading: false, payout: action.payload };
      case STRIPE_PAYOUT_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const stripeBalanceReducer = (state = {}, action) => {
    switch (action.type) {
      case STRIPE_BALANCE_REQUEST:
        return { loading: true };
      case STRIPE_BALANCE_SUCCESS:
        return { loading: false, balance: action.payload };
      case STRIPE_BALANCE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  export const paymentStatusReducer = (state = {}, action) => {
    switch (action.type) {
      case PAYMENT_STATUS_REQUEST:
        return { loading: true };
      case PAYMENT_STATUS_SUCCESS:
        return { loading: false, success: true, status: action.payload };
      case PAYMENT_STATUS_FAIL:
        return { loading: false, error: action.payload };
      case PAYMENT_STATUS_RESET:
        return {};
      default:
        return state;
    }
  };