import {
  EVENTS_GET_REQUEST,
  EVENTS_GET_SUCCESS,
  EVENTS_GET_FAIL,
  EVENT_MARK_COMPLETE_REQUEST,
  EVENT_MARK_COMPLETE_SUCCESS,
  EVENT_MARK_COMPLETE_FAIL,
  FINES_GET_REQUEST,
  FINES_GET_SUCCESS,
  FINES_GET_FAIL,
  FINE_WAIVE_REQUEST,
  FINE_WAIVE_SUCCESS,
  FINE_WAIVE_FAIL,
} from '../constants/eventConstants';

export const eventsReducer = (state = { events: [] }, action) => {
  switch (action.type) {
    case EVENTS_GET_REQUEST:
      return { loading: true, events: [] };
    case EVENTS_GET_SUCCESS:
      return { loading: false, events: action.payload.events || [] };
    case EVENTS_GET_FAIL:
      return { loading: false, error: action.payload, events: [] };
    default:
      return state;
  }
};

export const eventCompleteReducer = (state = {}, action) => {
  switch (action.type) {
    case EVENT_MARK_COMPLETE_REQUEST:
      return { loading: true };
    case EVENT_MARK_COMPLETE_SUCCESS:
      return { loading: false, success: true, event: action.payload };
    case EVENT_MARK_COMPLETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const finesReducer = (state = { fines: [] }, action) => {
  switch (action.type) {
    case FINES_GET_REQUEST:
      return { loading: true, fines: [] };
    case FINES_GET_SUCCESS:
      return { loading: false, fines: action.payload.fines || [], totalUnpaidFines: action.payload.totalUnpaidFines };
    case FINES_GET_FAIL:
      return { loading: false, error: action.payload, fines: [] };
    default:
      return state;
  }
};

export const fineWaiveReducer = (state = {}, action) => {
  switch (action.type) {
    case FINE_WAIVE_REQUEST:
      return { loading: true };
    case FINE_WAIVE_SUCCESS:
      return { loading: false, success: true, event: action.payload.event };
    case FINE_WAIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
