import {STATE_STATUS} from '../constants';
import {CATEGORIES_ACTIONS} from '../constants/categories';

const initialState = {
  all: {
    status: STATE_STATUS.UNFETCHED,
    data: [],
  },
};

export const categoriesReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case CATEGORIES_ACTIONS.FETCH_CATEGORY_BY_CODE:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case CATEGORIES_ACTIONS.FETCHED_CATEGORY_BY_CODE:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FETCHED,
          data: payload.data.categories,
        },
      };
    case CATEGORIES_ACTIONS.FAILED_FETCH_CATEGORY_BY_CODE:
      return {
        ...state,
        [`${payload.code}`]: {
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };
    default:
      return state;
  }
};
