import {WISHLIST_ACTIONS} from '../constants/wishlist';

export const fetchWishlist = (userId, userType, sessionId, token) => {
  return {
    type: WISHLIST_ACTIONS.FETCH_WISHLIST,
    payload: {
      userId,
      userType,
      sessionId,
      token,
    },
  };
};

export const fetchedWishlist = data => {
  return {
    type: WISHLIST_ACTIONS.FETCHED_WISHLIST,
    payload: {
      data,
    },
  };
};

export const failedFetchWishlist = error => {
  return {
    type: WISHLIST_ACTIONS.FAILED_FETCH_WISHLIST,
    payload: {
      error,
    },
  };
};

export const updateWishlist = (
  productData,
  sessionId,
  token,
  actionType,
  showToast,
) => {
  return {
    type: WISHLIST_ACTIONS.UPDATE_WISHLIST,
    payload: {
      productData,
      sessionId,
      token,
      actionType,
      showToast,
    },
  };
};

export const updatedWishlist = () => {
  return {
    type: WISHLIST_ACTIONS.UPDATED_WISHLIST,
  };
};

export const failedupdateWishlist = () => {
  return {
    type: WISHLIST_ACTIONS.FAILED_UPDATE_WISHLIST,
  };
};
