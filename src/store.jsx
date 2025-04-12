import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import {
  userLoginReducer,
  userRegisterReducer,
  userListReducer,
  userDetailsReducer,
  userUpdateReducer,
  userDeleteReducer,
} from './reducers/userReducers';
import {
  loanCreateReducer,
  loanListReducer,
  loanDetailsReducer,
  loanUpdateReducer,
  loanDeleteReducer,
  loanReviewReducer,
  loanDisburseReducer,
  loanRepayReducer,
  loanStatisticsReducer,
  loanApplyLateFeesReducer,
  loanDefaultReducer,
  userLoansListReducer,
  groupLoansListReducer,
  loanApplyReducer,
  loanAddGuarantorReducer,
  loanGuarantorApprovalReducer
} from './reducers/loanReducers';
import {
  groupCreateReducer,
  groupListReducer,
  myGroupsReducer,
  groupDetailsReducer,
  groupUpdateReducer,
  groupAccountsUpdateReducer,
  groupTransferOwnershipReducer,
  groupAddMembersReducer,
  groupUpdateMemberReducer,
  groupRemoveMemberReducer,
  groupLeaveReducer,
} from './reducers/groupReducers';
import {
  walletDetailsReducer,
  walletUpdateReducer,
  walletDepositReducer,
  walletWithdrawReducer,
} from './reducers/walletReducers';
import {
  mpesaPaymentReducer,
  mpesaQueryReducer,
  mpesaWithdrawalReducer,
  mpesaWithdrawalStatusReducer,
  mpesaBalanceReducer,
  stripePaymentReducer,
  stripePaymentDetailsReducer,
  stripePayoutReducer,
  stripePayoutDetailsReducer,
  stripeBalanceReducer,
} from './reducers/paymentReducers';

  


const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,

  loanCreate: loanCreateReducer,
  loanList: loanListReducer,
  loanDetails: loanDetailsReducer,
  loanUpdate: loanUpdateReducer,
  loanDelete: loanDeleteReducer,
  loanReview: loanReviewReducer,
  loanDisburse: loanDisburseReducer,
  loanRepay: loanRepayReducer,
  loanStatistics: loanStatisticsReducer,
  loanApplyLateFees: loanApplyLateFeesReducer,
  loanDefault: loanDefaultReducer,
  userLoansList: userLoansListReducer,
  groupLoansList: groupLoansListReducer,
  loanApply: loanApplyReducer,
  loanAddGuarantor: loanAddGuarantorReducer,
  loanGuarantorApproval: loanGuarantorApprovalReducer,

  groupCreate: groupCreateReducer,
  groupList: groupListReducer,
  myGroups: myGroupsReducer,
  groupDetails: groupDetailsReducer,
  groupUpdate: groupUpdateReducer,
  groupAccountsUpdate: groupAccountsUpdateReducer,
  groupTransferOwnership: groupTransferOwnershipReducer,
  groupAddMembers: groupAddMembersReducer,
  groupUpdateMember: groupUpdateMemberReducer,
  groupRemoveMember: groupRemoveMemberReducer,
  groupLeave: groupLeaveReducer,

  walletDetails: walletDetailsReducer,
  walletUpdate: walletUpdateReducer,
  walletDeposit: walletDepositReducer,
  walletWithdraw: walletWithdrawReducer,

  mpesaPayment: mpesaPaymentReducer,
  mpesaQuery: mpesaQueryReducer,
  mpesaWithdrawal: mpesaWithdrawalReducer,
  mpesaWithdrawalStatus: mpesaWithdrawalStatusReducer,
  mpesaBalance: mpesaBalanceReducer,
  stripePayment: stripePaymentReducer,
  stripePaymentDetails: stripePaymentDetailsReducer,
  stripePayout: stripePayoutReducer,
  stripePayoutDetails: stripePayoutDetailsReducer,
  stripeBalance: stripeBalanceReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const preloadedState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;