import {CART_ACTIONS} from '../constants/cart';

export const setCart = data => {
  return {
    type: CART_ACTIONS.SET_CART,
    payload: {
      data,
    },
  };
};

export const updateCart = data => {
  return {
    type: CART_ACTIONS.UPDATE_CART,
    payload: {
      data,
    },
  };
};

export const setCoupons = data => {
  return {
    type: CART_ACTIONS.SET_COUPONS,
    payload: {
      data,
    },
  };
};

export const applyCoupon = coupon => {
  return {
    type: CART_ACTIONS.APPLY_COUPON,
    payload: {
      coupon,
    },
  };
};
