import {OrderedMap} from 'immutable';
import {STATE_STATUS} from '../constants';
import {AUTH_ACTIONS} from '../constants/auth';
import {CART_ACTIONS} from '../constants/cart';

const initialState = {
  status: STATE_STATUS.UNFETCHED,
  data: {},
  coupons: [],
  appliedCoupon: {},
};

export const cartReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  if (CART_ACTIONS.SET_COUPONS) {
  }
  switch (type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        status: STATE_STATUS.FETCHED,
        data: payload.data,
      };
    case CART_ACTIONS.UPDATE_CART:
      return {
        ...state,
        status: STATE_STATUS.UPDATED,
        data: {...payload.data},
      };
    case CART_ACTIONS.SET_COUPONS:
      return {
        ...state,
        coupons: [...payload.data].sort((a, b) =>
          a.promoCode > b.promoCode ? 1 : -1,
        ),
      };
    case CART_ACTIONS.APPLY_COUPON:
      return {
        ...state,
        appliedCoupon: payload.coupon,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        status: STATE_STATUS.UNFETCHED,
        data: {},
        coupons: [],
        appliedCoupon: {},
      };
    default:
      return state;
  }
};
