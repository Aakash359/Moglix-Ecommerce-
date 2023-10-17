import {STATE_STATUS} from '../constants';
import {RECENTLY_VIEWED_ACTIONS} from '../constants/recentlyViewed';

const initialState = {
  data: [],
  status: STATE_STATUS.UNFETCHED,
};

export const recentlyViewedReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case RECENTLY_VIEWED_ACTIONS.FETCH_RECENTLY_VIEWED:
      return {
        ...state,
        status: STATE_STATUS.FETCHING,
      };
    case RECENTLY_VIEWED_ACTIONS.FETCHED_RECENTLY_VIEWED:
      return {
        ...state,
        data: payload.data.data || [],
        status: STATE_STATUS.FETCHED,
      };
    case RECENTLY_VIEWED_ACTIONS.FAILED_FETCH_RECENTLY_VIEWED:
      return {
        ...state,
        status: STATE_STATUS.FAILED_FETCH,
        error,
      };

    default:
      return state;
  }
};
