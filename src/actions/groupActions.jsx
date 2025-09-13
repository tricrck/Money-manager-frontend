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
  import * as api from '../api/groups';
  
  export const createGroup = (groupData) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_CREATE_REQUEST });
      console.log(groupData)
  
      const { data } = await api.createGroup(groupData);
  
      dispatch({
        type: GROUP_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      let message;

      if (error.response?.data?.errors?.length) {
        // Collect all error messages into one string
        message = error.response.data.errors.map(err => `${err.path}: ${err.msg}`).join(', ');
      } else {
        message = error.response?.data?.message || error.message;
      }
      dispatch({
        type: GROUP_CREATE_FAIL,
        payload: message,
      });
    }
  };
  
  export const listGroups = () => async (dispatch) => {
    try {
      dispatch({ type: GROUP_LIST_REQUEST });
  
      const { data } = await api.getGroups();
  
      dispatch({
        type: GROUP_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const listMyGroups = () => async (dispatch) => {
    try {
      dispatch({ type: MY_GROUPS_REQUEST });
  
      const { data } = await api.getMyGroups();
  
      dispatch({
        type: MY_GROUPS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MY_GROUPS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const getGroupDetails = (id) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_DETAILS_REQUEST });
  
      const { data } = await api.getGroup(id);
  
      dispatch({
        type: GROUP_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const updateGroup = (group) => async (dispatch) => {
    console.log(group);
    try {
      dispatch({ type: GROUP_UPDATE_REQUEST });
  
      const { data } = await api.updateGroup(group._id, group);
  
      dispatch({
        type: GROUP_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const updateGroupAccounts = (groupId, accountsData) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_ACCOUNTS_UPDATE_REQUEST });
  
      const { data } = await api.updateGroupAccounts(groupId, accountsData);
  
      dispatch({
        type: GROUP_ACCOUNTS_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_ACCOUNTS_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const transferOwnership = (groupId, newOwnerId) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_TRANSFER_OWNERSHIP_REQUEST });
  
      const { data } = await api.transferOwnership(groupId, { newOwnerId });
  
      dispatch({
        type: GROUP_TRANSFER_OWNERSHIP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_TRANSFER_OWNERSHIP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const addGroupMembers = (groupId, members) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_ADD_MEMBERS_REQUEST });
  
      const { data } = await api.addGroupMembers(groupId, { members });
  
      dispatch({
        type: GROUP_ADD_MEMBERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_ADD_MEMBERS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const updateGroupMember = (groupId, memberId, memberData) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_UPDATE_MEMBER_REQUEST });
  
      const { data } = await api.updateGroupMember(groupId, memberId, memberData);
  
      dispatch({
        type: GROUP_UPDATE_MEMBER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_UPDATE_MEMBER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const removeGroupMember = (groupId, memberId) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_REMOVE_MEMBER_REQUEST });
  
      await api.removeGroupMember(groupId, memberId);
  
      dispatch({
        type: GROUP_REMOVE_MEMBER_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: GROUP_REMOVE_MEMBER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const leaveGroup = (groupId) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_LEAVE_REQUEST });
  
      await api.leaveGroup(groupId);
  
      dispatch({
        type: GROUP_LEAVE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: GROUP_LEAVE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  export const deleteGroup = (groupId) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_DELETE_REQUEST });
  
      await api.deleteGroup(groupId);
  
      dispatch({
        type: GROUP_DELETE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: GROUP_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  export const listPublicGroups = () => async (dispatch) => {
  try {
    dispatch({ type: GROUP_PUBLIC_LIST_REQUEST });

    const { data } = await api.getPublicGroups();

    dispatch({
      type: GROUP_PUBLIC_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_PUBLIC_LIST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const listMyInvitations = () => async (dispatch) => {
  try {
    dispatch({ type: GROUP_MY_INVITATIONS_REQUEST });

    const { data } = await api.getMyInvitations();

    dispatch({
      type: GROUP_MY_INVITATIONS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_MY_INVITATIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const inviteUser = (groupId, inviteData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_INVITE_USER_REQUEST });

    const { data } = await api.inviteUser(groupId, inviteData);

    dispatch({
      type: GROUP_INVITE_USER_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_INVITE_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const respondToInvitation = (groupId, invitationId, responseData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_RESPOND_INVITATION_REQUEST });

    const { data } = await api.respondToInvitation(groupId, invitationId, responseData);

    dispatch({
      type: GROUP_RESPOND_INVITATION_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_RESPOND_INVITATION_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const requestToJoin = (groupId, message = '') => async (dispatch) => {
  try {
    dispatch({ type: GROUP_JOIN_REQUEST_REQUEST });

    const { data } = await api.requestToJoin(groupId, { message });

    dispatch({
      type: GROUP_JOIN_REQUEST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_JOIN_REQUEST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const reviewJoinRequest = (groupId, userId, decision) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_REVIEW_JOIN_REQUEST_REQUEST });

    const { data } = await api.reviewJoinRequest(groupId, userId, { decision });

    dispatch({
      type: GROUP_REVIEW_JOIN_REQUEST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_REVIEW_JOIN_REQUEST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const getJoinRequests = (groupId) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_GET_JOIN_REQUESTS_REQUEST });

    const { data } = await api.getJoinRequests(groupId);

    dispatch({
      type: GROUP_GET_JOIN_REQUESTS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_GET_JOIN_REQUESTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const getMyJoinRequests = (groupId) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_GET_MY_JOIN_REQUESTS_REQUEST });

    const { data } = await api.getMyJoinRequests();

    dispatch({
      type: GROUP_GET_MY_JOIN_REQUESTS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_GET_MY_JOIN_REQUESTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const contributeFromWallet = (groupId, contributionData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_WALLET_CONTRIBUTION_REQUEST });

    const { data } = await api.contributeFromWallet(groupId, contributionData);

    dispatch({
      type: GROUP_WALLET_CONTRIBUTION_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_WALLET_CONTRIBUTION_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const recordCashContribution = (groupId, cashData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_CASH_CONTRIBUTION_REQUEST });

    const { data } = await api.recordCashContribution(groupId, cashData);

    dispatch({
      type: GROUP_CASH_CONTRIBUTION_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_CASH_CONTRIBUTION_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const recordMobileMoneyContribution = (groupId, mobileData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_MOBILE_CONTRIBUTION_REQUEST });

    const { data } = await api.recordMobileMoneyContribution(groupId, mobileData);

    dispatch({
      type: GROUP_MOBILE_CONTRIBUTION_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_MOBILE_CONTRIBUTION_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const getGroupContributions = (groupId) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_GET_CONTRIBUTIONS_REQUEST });

    const { data } = await api.getGroupContributions(groupId);

    dispatch({
      type: GROUP_GET_CONTRIBUTIONS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_GET_CONTRIBUTIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const getMemberContributions = (groupId, memberId) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_MEMBER_CONTRIBUTIONS_REQUEST });

    const { data } = await api.getMemberContributions(groupId, memberId);

    dispatch({
      type: GROUP_MEMBER_CONTRIBUTIONS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_MEMBER_CONTRIBUTIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const fundWallet = (groupId, fundData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_FUND_WALLET_REQUEST });

    const { data } = await api.fundWallet(groupId, fundData);

    dispatch({
      type: GROUP_FUND_WALLET_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_FUND_WALLET_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const payMember = (groupId, paymentData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_PAY_MEMBER_REQUEST });

    const { data } = await api.payMember(groupId, paymentData);

    dispatch({
      type: GROUP_PAY_MEMBER_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GROUP_PAY_MEMBER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const listUserGroups = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_GROUPS_REQUEST });

    const { data } = await api.getUserGroups(userId);

    dispatch({
      type: USER_GROUPS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_GROUPS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Accept external invitation
export const acceptExternalInvitation = (token, userData) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_ACCEPT_EXTERNAL_INVITATION_REQUEST });

    const { data } = await api.acceptExternalInvitation(token, userData);

    dispatch({
      type: GROUP_ACCEPT_EXTERNAL_INVITATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GROUP_ACCEPT_EXTERNAL_INVITATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get invitation details
export const getInvitationDetails = (token) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_INVITATION_DETAILS_REQUEST });

    const { data } = await api.getInvitationDetails(token);

    dispatch({
      type: GROUP_INVITATION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GROUP_INVITATION_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Resend invitation
export const resendInvitation = (groupId, invitationId) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_RESEND_INVITATION_REQUEST });

    const { data } = await api.resendInvitation(groupId, invitationId);

    dispatch({
      type: GROUP_RESEND_INVITATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GROUP_RESEND_INVITATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Cancel invitation
export const cancelInvitation = (groupId, invitationId) => async (dispatch) => {
  try {
    dispatch({ type: GROUP_CANCEL_INVITATION_REQUEST });

    await api.cancelInvitation(groupId, invitationId);

    dispatch({
      type: GROUP_CANCEL_INVITATION_SUCCESS,
      payload: invitationId, // could be useful for reducer to remove from state
    });
  } catch (error) {
    dispatch({
      type: GROUP_CANCEL_INVITATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};