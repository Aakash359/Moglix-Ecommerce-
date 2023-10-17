import {STATE_STATUS} from '../constants';
import {HOMEPAGE_ACTIONS} from '../constants/homepage';

const initialState = {};

export const homepageReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case HOMEPAGE_ACTIONS.FETCH_LAYOUT_BY_LAYOUT_CODE:
      return {
        ...state,
        [`${payload.layoutCode}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case HOMEPAGE_ACTIONS.FETCHED_LAYOUT_BY_LAYOUT_CODE:
      return {
        ...state,
        [`${payload.layoutCode}`]: {
          status: STATE_STATUS.FETCHED,
          data: payload.data.data.data,
        },
      };
    case HOMEPAGE_ACTIONS.SET_SEARCHED_CATEGORY:
      return {
        ...state,
        searchedCategory: {
          data: payload.data,
        },
      };

    default:
      return state;
  }
};
