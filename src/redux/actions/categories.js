import {CATEGORIES_ACTIONS} from '../constants/categories';

export const fetchCategoryByCode = code => {
  return {
    type: CATEGORIES_ACTIONS.FETCH_CATEGORY_BY_CODE,
    payload: {
      code,
    },
  };
};

export const fetchedCategoryByCode = (code, data) => {
  return {
    type: CATEGORIES_ACTIONS.FETCHED_CATEGORY_BY_CODE,
    payload: {
      code,
      data,
    },
  };
};

export const failedFetchCategoryByCode = (code, error) => {
  return {
    type: CATEGORIES_ACTIONS.FAILED_FETCH_CATEGORY_BY_CODE,
    payload: {
      code,
    },
    error,
  };
};
