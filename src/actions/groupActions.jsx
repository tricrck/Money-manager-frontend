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
  import * as api from '../api/groups';
  
  export const createGroup = (groupData) => async (dispatch) => {
    try {
      dispatch({ type: GROUP_CREATE_REQUEST });
  
      const { data } = await api.createGroup(groupData);
  
      dispatch({
        type: GROUP_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GROUP_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
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