import {RECENTLY_VIEWED_ACTIONS} from '../constants/recentlyViewed';

export const fetchRecentlyViewed = (customerId, token, sessionId) => {
  return {
    type: RECENTLY_VIEWED_ACTIONS.FETCH_RECENTLY_VIEWED,
    payload: {
      customerId,
      token,
      sessionId,
    },
  };
};

export const fetchedRecentlyViewed = data => {
  return {
    type: RECENTLY_VIEWED_ACTIONS.FETCHED_RECENTLY_VIEWED,
    payload: {
      data,
    },
  };
};

export const failedFetchRecentlyViewed = error => {
  return {
    type: RECENTLY_VIEWED_ACTIONS.FAILED_FETCH_RECENTLY_VIEWED,
    error,
  };
};

export const fetchSetRecentlyViewed = (
  productdata,
  customerId,
  token,
  sessionId,
) => {
  return {
    type: RECENTLY_VIEWED_ACTIONS.FETCH_SET_RECENTLY_VIEWED,
    payload: {
      productdata,
      customerId,
      token,
      sessionId,
    },
  };
};

export const fetchedSetRecentlyViewed = data => {
  return {
    type: RECENTLY_VIEWED_ACTIONS.FETCHED_SET_RECENTLY_VIEWED,
  };
};

export const failedFetchSetRecentlyViewed = error => {
  return {
    type: RECENTLY_VIEWED_ACTIONS.FAILED_FETCH_SET_RECENTLY_VIEWED,
    error,
  };
};
