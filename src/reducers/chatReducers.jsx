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
  CHAT_ALL_GET_MESSAGES_FAIL,
} from '../constants/chatConstants';

// Reducer: Send message
export const chatSendMessageReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT_SEND_MESSAGE_REQUEST:
      return { loading: true };
    case CHAT_SEND_MESSAGE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case CHAT_SEND_MESSAGE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer: Get messages
export const chatMessagesReducer = (
  state = { messages: [], pagination: {} },
  action
) => {
  switch (action.type) {
    case CHAT_GET_MESSAGES_REQUEST:
      return { loading: true, messages: state.messages };
    case CHAT_GET_MESSAGES_SUCCESS:
      return {
        loading: false,
        messages: action.payload.messages,
        pagination: action.payload.pagination,
      };
    case CHAT_GET_MESSAGES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer: Mark as read
export const chatMarkAsReadReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT_MARK_AS_READ_REQUEST:
      return { loading: true };
    case CHAT_MARK_AS_READ_SUCCESS:
      return { loading: false, success: true };
    case CHAT_MARK_AS_READ_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer: Unread count
export const chatUnreadCountReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case CHAT_GET_UNREAD_COUNT_REQUEST:
      return { loading: true, count: state.count };
    case CHAT_GET_UNREAD_COUNT_SUCCESS:
      return { loading: false, count: action.payload.count };
    case CHAT_GET_UNREAD_COUNT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer: Get all support messages (admin)
export const chatAllSupportMessagesReducer = (
    state = { messages: [], pagination: {} },
    action
  ) => {
    switch (action.type) {
        case CHAT_ALL_GET_MESSAGES_REQUEST:
        return { loading: true, messages: state.messages };
      case CHAT_ALL_GET_MESSAGES_SUCCESS:
        return {
            loading: false,
            messages: action.payload,
            pagination: action.payload.pagination,
        };
        case CHAT_ALL_GET_MESSAGES_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
    };
