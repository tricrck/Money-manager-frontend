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

  groupDeleteReducer,
  groupPublicListReducer,
  myGroupInvitationsReducer,
  groupInviteUserReducer,
  groupRespondInvitationReducer,
  groupJoinRequestReducer,
  groupReviewJoinRequestReducer,
  groupGetJoinRequestsReducer,
  groupWalletContributionReducer,
  groupCashContributionReducer,
  groupMobileContributionReducer,
  groupContributionsReducer,
  groupMemberContributionsReducer,
  groupFundWalletReducer,
  groupPayMemberReducer,
  groupGetMyJoinRequestsReducer,
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
import reportReducer from './reducers/reportReducer';
import {
  settingsGetReducer,
  settingsUpdateReducer,
  settingsResetReducer,
  serverInfoGetReducer,
  dbInfoGetReducer,
} from './reducers/settingReducer';
  


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
  groupDelete: groupDeleteReducer,
  groupPublicList: groupPublicListReducer,
  myGroupInvitations: myGroupInvitationsReducer,
  groupInviteUser: groupInviteUserReducer,
  groupRespondInvitation: groupRespondInvitationReducer,
  groupJoinRequest: groupJoinRequestReducer,
  groupReviewJoinRequest: groupReviewJoinRequestReducer,
  groupGetJoinRequests: groupGetJoinRequestsReducer,
  groupGetMyJoinRequests: groupGetMyJoinRequestsReducer,
  groupWalletContribution: groupWalletContributionReducer,
  groupCashContribution: groupCashContributionReducer,
  groupMobileContribution: groupMobileContributionReducer,
  groupContributions: groupContributionsReducer,
  groupMemberContributions: groupMemberContributionsReducer,
  groupFundWallet: groupFundWalletReducer,
  groupPayMember: groupPayMemberReducer,


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

  reports: reportReducer,

  settingsGet: settingsGetReducer,
  settingsUpdate: settingsUpdateReducer,
  settingsReset: settingsResetReducer,
  serverInfoGet: serverInfoGetReducer,
  dbInfoGet: dbInfoGetReducer,
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