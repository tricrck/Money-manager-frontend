import {
    GROUP_CREATE_REQUEST,
    GROUP_CREATE_SUCCESS,
    GROUP_CREATE_FAIL,
    GROUP_LIST_REQUEST,
    GROUP_LIST_SUCCESS,
    GROUP_LIST_FAIL,
    MY_GROUPS_REQUEST,
    MY_GROUPS_SUCCESS,
    MY_GROUPS_FAIL,
    GROUP_DETAILS_REQUEST,
    GROUP_DETAILS_SUCCESS,
    GROUP_DETAILS_FAIL,
    GROUP_UPDATE_REQUEST,
    GROUP_UPDATE_SUCCESS,
    GROUP_UPDATE_FAIL,
    GROUP_ACCOUNTS_UPDATE_REQUEST,
    GROUP_ACCOUNTS_UPDATE_SUCCESS,
    GROUP_ACCOUNTS_UPDATE_FAIL,
    GROUP_TRANSFER_OWNERSHIP_REQUEST,
    GROUP_TRANSFER_OWNERSHIP_SUCCESS,
    GROUP_TRANSFER_OWNERSHIP_FAIL,
    GROUP_ADD_MEMBERS_REQUEST,
    GROUP_ADD_MEMBERS_SUCCESS,
    GROUP_ADD_MEMBERS_FAIL,
    GROUP_UPDATE_MEMBER_REQUEST,
    GROUP_UPDATE_MEMBER_SUCCESS,
    GROUP_UPDATE_MEMBER_FAIL,
    GROUP_REMOVE_MEMBER_REQUEST,
    GROUP_REMOVE_MEMBER_SUCCESS,
    GROUP_REMOVE_MEMBER_FAIL,
    GROUP_LEAVE_REQUEST,
    GROUP_LEAVE_SUCCESS,
    GROUP_LEAVE_FAIL,
    GROUP_DELETE_REQUEST,
    GROUP_DELETE_SUCCESS,
    GROUP_DELETE_FAIL,
    GROUP_PUBLIC_LIST_REQUEST,
    GROUP_PUBLIC_LIST_SUCCESS,
    GROUP_PUBLIC_LIST_FAIL,
    GROUP_MY_INVITATIONS_REQUEST,
    GROUP_MY_INVITATIONS_SUCCESS,
    GROUP_MY_INVITATIONS_FAIL,
    GROUP_INVITE_USER_REQUEST,
    GROUP_INVITE_USER_SUCCESS,
    GROUP_INVITE_USER_FAIL,
    GROUP_RESPOND_INVITATION_REQUEST,
    GROUP_RESPOND_INVITATION_SUCCESS,
    GROUP_RESPOND_INVITATION_FAIL,
    GROUP_JOIN_REQUEST_REQUEST,
    GROUP_JOIN_REQUEST_SUCCESS,
    GROUP_JOIN_REQUEST_FAIL,
    GROUP_REVIEW_JOIN_REQUEST_REQUEST,
    GROUP_REVIEW_JOIN_REQUEST_SUCCESS,
    GROUP_REVIEW_JOIN_REQUEST_FAIL,
    GROUP_GET_JOIN_REQUESTS_REQUEST,
    GROUP_GET_JOIN_REQUESTS_SUCCESS,
    GROUP_GET_JOIN_REQUESTS_FAIL,
    GROUP_WALLET_CONTRIBUTION_REQUEST,
    GROUP_WALLET_CONTRIBUTION_SUCCESS,
    GROUP_WALLET_CONTRIBUTION_FAIL,
    GROUP_CASH_CONTRIBUTION_REQUEST,
    GROUP_CASH_CONTRIBUTION_SUCCESS,
    GROUP_CASH_CONTRIBUTION_FAIL,
    GROUP_MOBILE_CONTRIBUTION_REQUEST,
    GROUP_MOBILE_CONTRIBUTION_SUCCESS,
    GROUP_MOBILE_CONTRIBUTION_FAIL,
    GROUP_GET_CONTRIBUTIONS_REQUEST,
    GROUP_GET_CONTRIBUTIONS_SUCCESS,
    GROUP_GET_CONTRIBUTIONS_FAIL,
    GROUP_MEMBER_CONTRIBUTIONS_REQUEST,
    GROUP_MEMBER_CONTRIBUTIONS_SUCCESS,
    GROUP_MEMBER_CONTRIBUTIONS_FAIL,
    GROUP_FUND_WALLET_REQUEST,
    GROUP_FUND_WALLET_SUCCESS,
    GROUP_FUND_WALLET_FAIL,
    GROUP_PAY_MEMBER_REQUEST,
    GROUP_PAY_MEMBER_SUCCESS,
    GROUP_PAY_MEMBER_FAIL,
    GROUP_GET_MY_JOIN_REQUESTS_REQUEST,
    GROUP_GET_MY_JOIN_REQUESTS_SUCCESS,
    GROUP_GET_MY_JOIN_REQUESTS_FAIL,
    USER_GROUPS_REQUEST,
    USER_GROUPS_SUCCESS,
    USER_GROUPS_FAIL,
    GROUP_ACCEPT_EXTERNAL_INVITATION_REQUEST,
    GROUP_ACCEPT_EXTERNAL_INVITATION_SUCCESS,
    GROUP_ACCEPT_EXTERNAL_INVITATION_FAIL,
    GROUP_INVITATION_DETAILS_REQUEST,
    GROUP_INVITATION_DETAILS_SUCCESS,
    GROUP_INVITATION_DETAILS_FAIL,
    GROUP_RESEND_INVITATION_REQUEST,
    GROUP_RESEND_INVITATION_SUCCESS,
    GROUP_RESEND_INVITATION_FAIL,
    GROUP_CANCEL_INVITATION_REQUEST,
    GROUP_CANCEL_INVITATION_SUCCESS,
    GROUP_CANCEL_INVITATION_FAIL,
  } from '../constants/groupConstants';
  
  export const groupCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_CREATE_REQUEST:
        return { loading: true };
      case GROUP_CREATE_SUCCESS:
        return { loading: false, success: true, group: action.payload };
      case GROUP_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupListReducer = (state = { groups: [] }, action) => {
    switch (action.type) {
      case GROUP_LIST_REQUEST:
        return { loading: true, groups: [] };
      case GROUP_LIST_SUCCESS:
        return { loading: false, groups: action.payload };
      case GROUP_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const myGroupsReducer = (state = { myGroups: [] }, action) => {
    switch (action.type) {
      case MY_GROUPS_REQUEST:
        return { loading: true, myGroups: [] };
      case MY_GROUPS_SUCCESS:
        return { loading: false, myGroups: action.payload };
      case MY_GROUPS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupDetailsReducer = (state = { group: {} }, action) => {
    switch (action.type) {
      case GROUP_DETAILS_REQUEST:
        return { ...state, loading: true };
      case GROUP_DETAILS_SUCCESS:
        return { loading: false, group: action.payload };
      case GROUP_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupUpdateReducer = (state = { group: {} }, action) => {
    switch (action.type) {
      case GROUP_UPDATE_REQUEST:
        return { loading: true };
      case GROUP_UPDATE_SUCCESS:
        return { loading: false, success: true, group: action.payload };
      case GROUP_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupAccountsUpdateReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_ACCOUNTS_UPDATE_REQUEST:
        return { loading: true };
      case GROUP_ACCOUNTS_UPDATE_SUCCESS:
        return { loading: false, success: true, accounts: action.payload };
      case GROUP_ACCOUNTS_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupTransferOwnershipReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_TRANSFER_OWNERSHIP_REQUEST:
        return { loading: true };
      case GROUP_TRANSFER_OWNERSHIP_SUCCESS:
        return { loading: false, success: true, group: action.payload };
      case GROUP_TRANSFER_OWNERSHIP_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupAddMembersReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_ADD_MEMBERS_REQUEST:
        return { loading: true };
      case GROUP_ADD_MEMBERS_SUCCESS:
        return { loading: false, success: true, group: action.payload };
      case GROUP_ADD_MEMBERS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupUpdateMemberReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_UPDATE_MEMBER_REQUEST:
        return { loading: true };
      case GROUP_UPDATE_MEMBER_SUCCESS:
        return { loading: false, success: true, group: action.payload };
      case GROUP_UPDATE_MEMBER_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupRemoveMemberReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_REMOVE_MEMBER_REQUEST:
        return { loading: true };
      case GROUP_REMOVE_MEMBER_SUCCESS:
        return { loading: false, success: true };
      case GROUP_REMOVE_MEMBER_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const groupLeaveReducer = (state = {}, action) => {
    switch (action.type) {
      case GROUP_LEAVE_REQUEST:
        return { loading: true };
      case GROUP_LEAVE_SUCCESS:
        return { loading: false, success: true };
      case GROUP_LEAVE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const groupDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_DELETE_REQUEST:
      return { loading: true };
    case GROUP_DELETE_SUCCESS:
      return { loading: false, success: true };
    case GROUP_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupPublicListReducer = (state = { groups: [] }, action) => {
  switch (action.type) {
    case GROUP_PUBLIC_LIST_REQUEST:
      return { loading: true, groups: [] };
    case GROUP_PUBLIC_LIST_SUCCESS:
      return { loading: false, groups: action.payload };
    case GROUP_PUBLIC_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const myGroupInvitationsReducer = (state = { invitations: [] }, action) => {
  switch (action.type) {
    case GROUP_MY_INVITATIONS_REQUEST:
      return { loading: true, invitations: [] };
    case GROUP_MY_INVITATIONS_SUCCESS:
      return { loading: false, invitations: action.payload };
    case GROUP_MY_INVITATIONS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupInviteUserReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_INVITE_USER_REQUEST:
      return { loading: true };
    case GROUP_INVITE_USER_SUCCESS:
      return { loading: false, success: true, invitation: action.payload };
    case GROUP_INVITE_USER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupRespondInvitationReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_RESPOND_INVITATION_REQUEST:
      return { loading: true };
    case GROUP_RESPOND_INVITATION_SUCCESS:
      return { loading: false, success: true, invitation: action.payload };
    case GROUP_RESPOND_INVITATION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupJoinRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_JOIN_REQUEST_REQUEST:
      return { loading: true };
    case GROUP_JOIN_REQUEST_SUCCESS:
      return { loading: false, success: true, joinRequest: action.payload };
    case GROUP_JOIN_REQUEST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupReviewJoinRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_REVIEW_JOIN_REQUEST_REQUEST:
      return { loading: true };
    case GROUP_REVIEW_JOIN_REQUEST_SUCCESS:
      return { loading: false, success: true, joinRequest: action.payload };
    case GROUP_REVIEW_JOIN_REQUEST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupGetJoinRequestsReducer = (state = { joinRequests: [] }, action) => {
  switch (action.type) {
    case GROUP_GET_JOIN_REQUESTS_REQUEST:
      return { loading: true, joinRequests: [] };
    case GROUP_GET_JOIN_REQUESTS_SUCCESS:
      return { loading: false, joinRequests: action.payload };
    case GROUP_GET_JOIN_REQUESTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupGetMyJoinRequestsReducer = (state = { joinRequests: [] }, action) => {
  switch (action.type) {
    case GROUP_GET_MY_JOIN_REQUESTS_REQUEST:
      return { loading: true, MyjoinRequests: [] };
    case GROUP_GET_MY_JOIN_REQUESTS_SUCCESS:
      return { loading: false, MyjoinRequests: action.payload };
    case GROUP_GET_MY_JOIN_REQUESTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupWalletContributionReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_WALLET_CONTRIBUTION_REQUEST:
      return { loading: true };
    case GROUP_WALLET_CONTRIBUTION_SUCCESS:
      return { loading: false, success: true, contribution: action.payload };
    case GROUP_WALLET_CONTRIBUTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupCashContributionReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_CASH_CONTRIBUTION_REQUEST:
      return { loading: true };
    case GROUP_CASH_CONTRIBUTION_SUCCESS:
      return { loading: false, success: true, contribution: action.payload };
    case GROUP_CASH_CONTRIBUTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupMobileContributionReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_MOBILE_CONTRIBUTION_REQUEST:
      return { loading: true };
    case GROUP_MOBILE_CONTRIBUTION_SUCCESS:
      return { loading: false, success: true, contribution: action.payload };
    case GROUP_MOBILE_CONTRIBUTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupContributionsReducer = (state = { contributions: [] }, action) => {
  switch (action.type) {
    case GROUP_GET_CONTRIBUTIONS_REQUEST:
      return { loading: true, contributions: [] };
    case GROUP_GET_CONTRIBUTIONS_SUCCESS:
      return { loading: false, contributions: action.payload };
    case GROUP_GET_CONTRIBUTIONS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupMemberContributionsReducer = (state = { contributions: [] }, action) => {
  switch (action.type) {
    case GROUP_MEMBER_CONTRIBUTIONS_REQUEST:
      return { loading: true, contributions: [] };
    case GROUP_MEMBER_CONTRIBUTIONS_SUCCESS:
      return { loading: false, contributions: action.payload };
    case GROUP_MEMBER_CONTRIBUTIONS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupFundWalletReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_FUND_WALLET_REQUEST:
      return { loading: true };
    case GROUP_FUND_WALLET_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case GROUP_FUND_WALLET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const groupPayMemberReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_PAY_MEMBER_REQUEST:
      return { loading: true };
    case GROUP_PAY_MEMBER_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case GROUP_PAY_MEMBER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userGroupsReducer = (state = { userGroups: [] }, action) => {
  switch (action.type) {
    case USER_GROUPS_REQUEST:
      return { loading: true, userGroups: [] };
    case USER_GROUPS_SUCCESS:
      return { loading: false, userGroups: action.payload };
    case USER_GROUPS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Accept external invitation
export const acceptExternalInvitationReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_ACCEPT_EXTERNAL_INVITATION_REQUEST:
      return { loading: true };
    case GROUP_ACCEPT_EXTERNAL_INVITATION_SUCCESS:
      return { loading: false, success: true, invitation: action.payload };
    case GROUP_ACCEPT_EXTERNAL_INVITATION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Get invitation details
export const invitationDetailsReducer = (state = { invitation: {} }, action) => {
  switch (action.type) {
    case GROUP_INVITATION_DETAILS_REQUEST:
      return { ...state, loading: true };
    case GROUP_INVITATION_DETAILS_SUCCESS:
      return { loading: false, invitation: action.payload };
    case GROUP_INVITATION_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Resend invitation
export const resendInvitationReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_RESEND_INVITATION_REQUEST:
      return { loading: true };
    case GROUP_RESEND_INVITATION_SUCCESS:
      return { loading: false, success: true, data: action.payload };
    case GROUP_RESEND_INVITATION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Cancel invitation
export const cancelInvitationReducer = (state = {}, action) => {
  switch (action.type) {
    case GROUP_CANCEL_INVITATION_REQUEST:
      return { loading: true };
    case GROUP_CANCEL_INVITATION_SUCCESS:
      return { loading: false, success: true, deletedInvitationId: action.payload };
    case GROUP_CANCEL_INVITATION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

