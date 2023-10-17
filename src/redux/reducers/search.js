import {STATE_STATUS} from '../constants';
import {SEARCH_ACTIONS} from '../constants/search';
const initialState = {
  all: {
    status: STATE_STATUS.UNFETCHED,
    categories: [],
  },
  suggestions: {},
};

export const searchReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case SEARCH_ACTIONS.FETCH_TRENDING_CAT:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case SEARCH_ACTIONS.FETCHED_TRENDING_CAT:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FETCHED,
          categories: payload.data.category,
        },
      };
    case SEARCH_ACTIONS.FAILED_FETCH_TRENDING_CAT:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };
    case SEARCH_ACTIONS.SET_SEARCH_SUGGESTION:
      return {
        ...state,
        suggestions: {
          [`${payload.key}`]: payload.data,
        },
      };
    default:
      return state;
  }
};
