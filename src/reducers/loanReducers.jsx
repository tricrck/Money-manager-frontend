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
    LOAN_UPDATE_RESET,
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
    LOAN_APPLY_LATE_FEES_RESET,
    LOAN_DEFAULT_REQUEST,
    LOAN_DEFAULT_SUCCESS,
    LOAN_DEFAULT_FAIL,
    LOAN_DEFAULT_RESET,
    LOAN_USER_LIST_REQUEST,
    LOAN_USER_LIST_SUCCESS,
    LOAN_USER_LIST_FAIL,
    LOAN_GROUP_LIST_REQUEST,
    LOAN_GROUP_LIST_SUCCESS,
    LOAN_GROUP_LIST_FAIL,
    LOAN_APPLY_REQUEST,
    LOAN_APPLY_SUCCESS,
    LOAN_APPLY_FAIL,
    LOAN_APPLY_RESET,
    LOAN_ADD_GUARANTOR_REQUEST,
    LOAN_ADD_GUARANTOR_SUCCESS,
    LOAN_ADD_GUARANTOR_FAIL,
    LOAN_ADD_GUARANTOR_RESET,
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
  
  export const loanCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_CREATE_REQUEST:
        return { loading: true };
      case LOAN_CREATE_SUCCESS:
        return { loading: false, success: true, loan: action.payload };
      case LOAN_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  // Loan Document Upload Reducer
  export const loanDocumentUploadReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_DOCUMENT_UPLOAD_REQUEST:
        return { loading: true };
      case LOAN_DOCUMENT_UPLOAD_SUCCESS:
        return { loading: false, success: true, document: action.payload };
      case LOAN_DOCUMENT_UPLOAD_FAIL:
        return { loading: false, error: action.payload };
      case LOAN_DOCUMENT_UPLOAD_RESET:
        return {};
      default:
        return state;
    }
  };

  // Loan Document Remove Reducer
  export const loanDocumentRemoveReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_DOCUMENT_REMOVE_REQUEST:
        return { loading: true };
      case LOAN_DOCUMENT_REMOVE_SUCCESS:
        return { loading: false, success: true };
      case LOAN_DOCUMENT_REMOVE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const loanListReducer = (state = { loans: [] }, action) => {
    switch (action.type) {
      case LOAN_LIST_REQUEST:
        return { loading: true, loans: [] };
      case LOAN_LIST_SUCCESS:
        return { loading: false, loans: action.payload };
      case LOAN_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const loanDetailsReducer = (state = { loan: {} }, action) => {
    switch (action.type) {
      case LOAN_DETAILS_REQUEST:
        return { ...state, loading: true };
      case LOAN_DETAILS_SUCCESS:
        return { loading: false, loan: action.payload };
      case LOAN_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const loanUpdateReducer = (state = { loan: {} }, action) => {
    switch (action.type) {
      case LOAN_UPDATE_REQUEST:
        return { loading: true };
      case LOAN_UPDATE_SUCCESS:
        return { loading: false, success: true, loan: action.payload };
      case LOAN_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case LOAN_UPDATE_RESET:
        return { loan: {} };
      default:
        return state;
    }
  };
  
  export const loanDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_DELETE_REQUEST:
        return { loading: true };
      case LOAN_DELETE_SUCCESS:
        return { loading: false, success: true };
      case LOAN_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const loanReviewReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_REVIEW_REQUEST:
        return { loading: true };
      case LOAN_REVIEW_SUCCESS:
        return { loading: false, success: true, review: action.payload };
      case LOAN_REVIEW_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const loanDisburseReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_DISBURSE_REQUEST:
        return { loading: true };
      case LOAN_DISBURSE_SUCCESS:
        return { loading: false, success: true, disbursement: action.payload };
      case LOAN_DISBURSE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const loanRepayReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAN_REPAY_REQUEST:
        return { loading: true };
      case LOAN_REPAY_SUCCESS:
        return { loading: false, success: true, repayment: action.payload };
      case LOAN_REPAY_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const loanStatisticsReducer = (state = { statistics: {} }, action) => {
    switch (action.type) {
      case LOAN_STATISTICS_REQUEST:
        return { loading: true };
      case LOAN_STATISTICS_SUCCESS:
        return { loading: false, statistics: action.payload };
      case LOAN_STATISTICS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  // Apply late fees reducer
export const loanApplyLateFeesReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAN_APPLY_LATE_FEES_REQUEST:
      return { loading: true };
    case LOAN_APPLY_LATE_FEES_SUCCESS:
      return { loading: false, success: true, loan: action.payload };
    case LOAN_APPLY_LATE_FEES_FAIL:
      return { loading: false, error: action.payload };
    case LOAN_APPLY_LATE_FEES_RESET:
      return {};
    default:
      return state;
  }
};

// Mark loan as defaulted reducer
export const loanDefaultReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAN_DEFAULT_REQUEST:
      return { loading: true };
    case LOAN_DEFAULT_SUCCESS:
      return { loading: false, success: true, loan: action.payload };
    case LOAN_DEFAULT_FAIL:
      return { loading: false, error: action.payload };
    case LOAN_DEFAULT_RESET:
      return {};
    default:
      return state;
  }
};

// User loans list reducer
export const userLoansListReducer = (state = { loans: [] }, action) => {
  switch (action.type) {
    case LOAN_USER_LIST_REQUEST:
      return { loading: true, loans: [] };
    case LOAN_USER_LIST_SUCCESS:
      return { loading: false, loans: action.payload };
    case LOAN_USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Group loans list reducer
export const groupLoansListReducer = (state = { loans: [] }, action) => {
  switch (action.type) {
    case LOAN_GROUP_LIST_REQUEST:
      return { loading: true, loans: [] };
    case LOAN_GROUP_LIST_SUCCESS:
      return { loading: false, loans: action.payload };
    case LOAN_GROUP_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Apply for loan reducer
export const loanApplyReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAN_APPLY_REQUEST:
      return { loading: true };
    case LOAN_APPLY_SUCCESS:
      return { loading: false, success: true, loan: action.payload };
    case LOAN_APPLY_FAIL:
      return { loading: false, error: action.payload };
    case LOAN_APPLY_RESET:
      return {};
    default:
      return state;
  }
};

// Add guarantor reducer
export const loanAddGuarantorReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAN_ADD_GUARANTOR_REQUEST:
      return { loading: true };
    case LOAN_ADD_GUARANTOR_SUCCESS:
      return { loading: false, success: true, loan: action.payload };
    case LOAN_ADD_GUARANTOR_FAIL:
      return { loading: false, error: action.payload };
    case LOAN_ADD_GUARANTOR_RESET:
      return {};
    default:
      return state;
  }
};

// Guarantor approval reducer
export const loanGuarantorApprovalReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAN_GUARANTOR_APPROVAL_REQUEST:
      return { loading: true };
    case LOAN_GUARANTOR_APPROVAL_SUCCESS:
      return { loading: false, success: true, loan: action.payload };
    case LOAN_GUARANTOR_APPROVAL_FAIL:
      return { loading: false, error: action.payload };
    case LOAN_GUARANTOR_APPROVAL_RESET:
      return {};
    default:
      return state;
  }
};