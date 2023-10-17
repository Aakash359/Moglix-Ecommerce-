import {SEARCH_ACTIONS} from '../constants/search';

export const setSearchSuggestion = (key, data) => {
  return {
    type: SEARCH_ACTIONS.SET_SEARCH_SUGGESTION,
    payload: {
      key,
      data,
    },
  };
};

export const fetchTrendingCat = code => {
  return {
    type: SEARCH_ACTIONS.FETCH_TRENDING_CAT,
    payload: {
      code,
    },
  };
};

export const fetchedTrendingCat = (code, data) => {
  return {
    type: SEARCH_ACTIONS.FETCHED_TRENDING_CAT,
    payload: {
      code,
      data,
    },
  };
};

export const failedFetchTrendingCat = (code, error) => {
  return {
    type: SEARCH_ACTIONS.FAILED_FETCH_TRENDING_CAT,
    payload: {
      code,
    },
    error,
  };
};
