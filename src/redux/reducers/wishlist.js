import {STATE_STATUS} from '../constants';
import {AUTH_ACTIONS} from '../constants/auth';
import {WISHLIST_ACTIONS} from '../constants/wishlist';

const initialState = {
  status: STATE_STATUS.UNFETCHED,
  data: [],
  updateStatus: STATE_STATUS.NOT_UPDATED,
};

export const wishlistReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case WISHLIST_ACTIONS.FETCH_WISHLIST:
      return {
        ...state,
        status: STATE_STATUS.FETCHING,
        updateStatus: STATE_STATUS.NOT_UPDATED,
      };
    case WISHLIST_ACTIONS.FETCHED_WISHLIST:
      return {
        ...state,
        status: STATE_STATUS.FETCHED,
        data: payload.data,
      };
    case WISHLIST_ACTIONS.FAILED_FETCH_WISHLIST:
      return {
        ...state,
        status: STATE_STATUS.FAILED_FETCH,
        error: error,
      };
    case WISHLIST_ACTIONS.UPDATE_WISHLIST:
      return {
        ...state,
        updateStatus: STATE_STATUS.UPDATING,
      };
    case WISHLIST_ACTIONS.UPDATED_WISHLIST:
      return {
        ...state,
        updateStatus: STATE_STATUS.UPDATED,
      };
    case WISHLIST_ACTIONS.FAILED_UPDATE_WISHLIST:
      return {
        ...state,
        updateStatus: STATE_STATUS.FAILED_UPDATE,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        status: STATE_STATUS.UNFETCHED,
        data: [],
        updateStatus: STATE_STATUS.NOT_UPDATED,
      };

    default:
      return state;
  }
};
