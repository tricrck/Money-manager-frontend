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