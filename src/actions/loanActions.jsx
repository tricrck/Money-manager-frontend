import {
  LOAN_CREATE_REQUEST,
  LOAN_CREATE_SUCCESS,
  LOAN_CREATE_FAIL,
  LOAN_LIST_REQUEST,
  LOAN_LIST_SUCCESS,
  LOAN_LIST_FAIL,
  LOAN_DETAILS_REQUEST,
  LOAN_DETAILS_SUCCESS,
  LOAN_DETAILS_FAIL,
  LOAN_UPDATE_REQUEST,
  LOAN_UPDATE_SUCCESS,
  LOAN_UPDATE_FAIL,
  LOAN_DELETE_REQUEST,
  LOAN_DELETE_SUCCESS,
  LOAN_DELETE_FAIL,
  LOAN_REVIEW_REQUEST,
  LOAN_REVIEW_SUCCESS,
  LOAN_REVIEW_FAIL,
  LOAN_DISBURSE_REQUEST,
  LOAN_DISBURSE_SUCCESS,
  LOAN_DISBURSE_FAIL,
  LOAN_REPAY_REQUEST,
  LOAN_REPAY_SUCCESS,
  LOAN_REPAY_FAIL,
  LOAN_STATISTICS_REQUEST,
  LOAN_STATISTICS_SUCCESS,
  LOAN_STATISTICS_FAIL,
  LOAN_APPLY_LATE_FEES_REQUEST,
  LOAN_APPLY_LATE_FEES_SUCCESS,
  LOAN_APPLY_LATE_FEES_FAIL,
  LOAN_DEFAULT_REQUEST,
  LOAN_DEFAULT_SUCCESS,
  LOAN_DEFAULT_FAIL,
  LOAN_USER_LIST_REQUEST,
  LOAN_USER_LIST_SUCCESS,
  LOAN_USER_LIST_FAIL,
  LOAN_GROUP_LIST_REQUEST,
  LOAN_GROUP_LIST_SUCCESS,
  LOAN_GROUP_LIST_FAIL,
  LOAN_APPLY_REQUEST,
  LOAN_APPLY_SUCCESS,
  LOAN_APPLY_FAIL,
  LOAN_ADD_GUARANTOR_REQUEST,
  LOAN_ADD_GUARANTOR_SUCCESS,
  LOAN_ADD_GUARANTOR_FAIL,
  LOAN_GUARANTOR_APPROVAL_REQUEST,
  LOAN_GUARANTOR_APPROVAL_SUCCESS,
  LOAN_GUARANTOR_APPROVAL_FAIL,
  LOAN_GUARANTOR_APPROVAL_RESET,
  LOAN_DOCUMENT_UPLOAD_REQUEST,
  LOAN_DOCUMENT_UPLOAD_SUCCESS,
  LOAN_DOCUMENT_UPLOAD_FAIL,
  LOAN_DOCUMENT_UPLOAD_RESET,
  LOAN_DOCUMENT_REMOVE_REQUEST,
  LOAN_DOCUMENT_REMOVE_SUCCESS,
  LOAN_DOCUMENT_REMOVE_FAIL,
} from '../constants/loanConstants';
import * as api from '../api/loans';

export const createLoan = (loanData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_CREATE_REQUEST });

    const { data } = await api.createLoan(loanData);

    dispatch({
      type: LOAN_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    dispatch({
      type: LOAN_CREATE_FAIL,
      payload:
        error.response && error.response.data.error
          ? error.response.data.error
          : error.error,
    });
  }
};

export const uploadCollateralDocuments = (loanId, formData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_DOCUMENT_UPLOAD_REQUEST });

    const { data } = await api.uploadCollateralDocuments(loanId, formData);

    dispatch({
      type: LOAN_DOCUMENT_UPLOAD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_DOCUMENT_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const removeCollateralDocument = (loanId, docUrl) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_DOCUMENT_REMOVE_REQUEST });

    const { data } = await api.removeCollateralDocument(loanId, docUrl);

    dispatch({
      type: LOAN_DOCUMENT_REMOVE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_DOCUMENT_REMOVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listLoans = () => async (dispatch) => {
  try {
    dispatch({ type: LOAN_LIST_REQUEST });

    const { data } = await api.getLoans();

    dispatch({
      type: LOAN_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getLoanDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_DETAILS_REQUEST });

    const { data } = await api.getLoan(id);

    dispatch({
      type: LOAN_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateLoan = (id, submitData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_UPDATE_REQUEST });

    const { data } = await api.updateLoan(id, submitData);

    dispatch({
      type: LOAN_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteLoan = (id) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_DELETE_REQUEST });

    await api.deleteLoan(id);

    dispatch({ type: LOAN_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOAN_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const reviewLoan = (loanId, reviewData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_REVIEW_REQUEST });

    const { data } = await api.reviewLoan(loanId, reviewData);

    dispatch({
      type: LOAN_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const disburseLoan = (loanId, disbursementData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_DISBURSE_REQUEST });

    const { data } = await api.disburseLoan(loanId, disbursementData);

    dispatch({
      type: LOAN_DISBURSE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_DISBURSE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const repayLoan = (loanId, repaymentData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_REPAY_REQUEST });

    const { data } = await api.repayLoan(loanId, repaymentData);

    dispatch({
      type: LOAN_REPAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_REPAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getLoanStatistics = () => async (dispatch) => {
  try {
    dispatch({ type: LOAN_STATISTICS_REQUEST });

    const { data } = await api.getLoanStatistics();

    dispatch({
      type: LOAN_STATISTICS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_STATISTICS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const applyLateFees = (loanId, lateFeeData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_APPLY_LATE_FEES_REQUEST });

    const { data } = await api.applyLateFees(loanId, lateFeeData);

    dispatch({
      type: LOAN_APPLY_LATE_FEES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_APPLY_LATE_FEES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const markLoanAsDefaulted = (loanId, defaultData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_DEFAULT_REQUEST });

    const { data } = await api.markLoanAsDefaulted(loanId, defaultData);

    dispatch({
      type: LOAN_DEFAULT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_DEFAULT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserLoans = (userId) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_USER_LIST_REQUEST });

    const { data } = await api.getUserLoans(userId);

    dispatch({
      type: LOAN_USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getGroupLoans = (groupId) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_GROUP_LIST_REQUEST });

    const { data } = await api.getGroupLoans(groupId);

    dispatch({
      type: LOAN_GROUP_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_GROUP_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const applyForLoan = (groupId, loanData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_APPLY_REQUEST });

    const { data } = await api.applyForLoan(groupId, loanData);

    dispatch({
      type: LOAN_APPLY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_APPLY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addGuarantor = (loanId, guarantorId) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_ADD_GUARANTOR_REQUEST });

    const { data } = await api.addGuarantor(loanId, guarantorId);

    dispatch({
      type: LOAN_ADD_GUARANTOR_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_ADD_GUARANTOR_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const guarantorApproval = (loanId, guarantorId, approvalData) => async (dispatch) => {
  try {
    dispatch({ type: LOAN_GUARANTOR_APPROVAL_REQUEST });

    const { data } = await api.guarantorApproval(loanId, guarantorId, approvalData);

    dispatch({
      type: LOAN_GUARANTOR_APPROVAL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAN_GUARANTOR_APPROVAL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};