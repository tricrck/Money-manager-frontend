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

import {
  getUserEvents,
  markEventComplete,
  getUserFines,
  waiveFine,
} from '../api/events';

// Get user events
export const getUserEventsAction = (params) => async (dispatch) => {
  try {
    dispatch({ type: EVENTS_GET_REQUEST });

    const { data } = await getUserEvents(params);

    dispatch({
      type: EVENTS_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EVENTS_GET_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Mark event as complete
export const markEventCompleteAction = (eventId, eventData) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_MARK_COMPLETE_REQUEST });

    const { data } = await markEventComplete(eventId, eventData);

    dispatch({
      type: EVENT_MARK_COMPLETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EVENT_MARK_COMPLETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get user fines
export const getUserFinesAction = () => async (dispatch) => {
  try {
    dispatch({ type: FINES_GET_REQUEST });

    const { data } = await getUserFines();

    dispatch({
      type: FINES_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINES_GET_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Waive fine
export const waiveFineAction = (eventId, reasonData) => async (dispatch) => {
  try {
    dispatch({ type: FINE_WAIVE_REQUEST });

    const { data } = await waiveFine(eventId, reasonData);

    dispatch({
      type: FINE_WAIVE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINE_WAIVE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
