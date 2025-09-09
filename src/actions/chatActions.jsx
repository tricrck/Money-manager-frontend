import {
  CHAT_SEND_MESSAGE_REQUEST,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_SEND_MESSAGE_FAIL,
  CHAT_GET_MESSAGES_REQUEST,
  CHAT_GET_MESSAGES_SUCCESS,
  CHAT_GET_MESSAGES_FAIL,
  CHAT_MARK_AS_READ_REQUEST,
  CHAT_MARK_AS_READ_SUCCESS,
  CHAT_MARK_AS_READ_FAIL,
  CHAT_GET_UNREAD_COUNT_REQUEST,
  CHAT_GET_UNREAD_COUNT_SUCCESS,
  CHAT_GET_UNREAD_COUNT_FAIL,
  CHAT_ALL_GET_MESSAGES_REQUEST,
  CHAT_ALL_GET_MESSAGES_SUCCESS,  
  CHAT_ALL_GET_MESSAGES_FAIL
} from '../constants/chatConstants';

import {
  sendMessage,
  getMessages,
  markAsRead,
  getUnreadCount,
  getAllSupportMessages
} from '../api/chat';

// Send a message to support
export const sendChatMessage = (messageData) => async (dispatch) => {
  try {
    dispatch({ type: CHAT_SEND_MESSAGE_REQUEST });

    const { data } = await sendMessage(messageData);

    dispatch({
      type: CHAT_SEND_MESSAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHAT_SEND_MESSAGE_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// Get chat messages for a specific conversation
export const getChatMessages = (conversationId, page = 1, limit = 50) => async (dispatch) => {
  try {
    dispatch({ type: CHAT_GET_MESSAGES_REQUEST });

    // Pass conversationId to the API call
    const { data } = await getMessages({ conversationId, page, limit });

    dispatch({
      type: CHAT_GET_MESSAGES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHAT_GET_MESSAGES_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// Mark messages as read for a specific conversation
export const markMessagesAsRead = (conversationData) => async (dispatch) => {
  try {
    dispatch({ type: CHAT_MARK_AS_READ_REQUEST });

    // Pass conversationId in the request body
    const { data } = await markAsRead(conversationData);

    dispatch({
      type: CHAT_MARK_AS_READ_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHAT_MARK_AS_READ_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// Get unread message count
export const getUnreadCountAction = () => async (dispatch) => {
  try {
    dispatch({ type: CHAT_GET_UNREAD_COUNT_REQUEST });

    const { data } = await getUnreadCount();

    dispatch({
      type: CHAT_GET_UNREAD_COUNT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHAT_GET_UNREAD_COUNT_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// Get all support messages (for admin) with filters
export const getAllSupportMessagesAction = (filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: CHAT_ALL_GET_MESSAGES_REQUEST });
    
    // Pass filters like page, limit, status, priority
    const { data } = await getAllSupportMessages(filters);
    
    dispatch({
      type: CHAT_ALL_GET_MESSAGES_SUCCESS,
      payload: data, // Extract the data from the wrapped response
    });
  } catch (error) {
    dispatch({
      type: CHAT_ALL_GET_MESSAGES_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};