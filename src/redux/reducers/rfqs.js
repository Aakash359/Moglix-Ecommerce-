import {STATE_STATUS} from '../constants';
import {AUTH_ACTIONS} from '../constants/auth';
import {RFQ_ACTIONS} from '../constants/rfqs';

const initialState = {
  status: STATE_STATUS.UNFETCHED,
  data: [],
};

export const rfqsReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case RFQ_ACTIONS.FETCH_RFQ:
      return {
        ...state,
        status: STATE_STATUS.FETCHING,
      };
    case RFQ_ACTIONS.FETCHED_RFQ:
      return {
        ...state,
        status: STATE_STATUS.FETCHED,
        data: payload.data.data,
      };
    case RFQ_ACTIONS.FAILED_FETCH_RFQ:
      return {
        ...state,
        status: STATE_STATUS.FAILED_FETCH,
        error: error,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        status: STATE_STATUS.UNFETCHED,
        data: [],
      };
    default:
      return state;
  }
};
