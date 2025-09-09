const initialState = {
  message: null,
  type: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    case 'CLEAR_NOTIFICATION':
      return initialState;
    default:
      return state;
  }
};