import {HOMEPAGE_ACTIONS} from '../constants/homepage';

export const fetchLayoutByLayoutCode = layoutCode => {
  return {
    type: HOMEPAGE_ACTIONS.FETCH_LAYOUT_BY_LAYOUT_CODE,
    payload: {
      layoutCode,
    },
  };
};

export const fetchedLayoutByLayoutCode = (layoutCode, data) => {
  return {
    type: HOMEPAGE_ACTIONS.FETCHED_LAYOUT_BY_LAYOUT_CODE,
    payload: {
      layoutCode,
      data,
    },
  };
};

export const failedFetchLayoutByLayoutCode = (layoutCode, error) => {
  return {
    type: HOMEPAGE_ACTIONS.FAILED_FETCH_LAYOUT_BY_LAYOUT_CODE,
    payload: {
      layoutCode,
    },
    error,
  };
};

export const setSearchedCategory = data => {
  return {
    type: HOMEPAGE_ACTIONS.SET_SEARCHED_CATEGORY,
    payload: {
      data,
    },
  };
};
