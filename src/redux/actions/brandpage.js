import {BRANDPAGE_ACTIONS} from '../constants/brandpage';
export const fetchBrandLayoutByLayoutCode = layoutCode => {
  return {
    type: BRANDPAGE_ACTIONS.FETCH_BRAND_LAYOUT_BY_LAYOUT_CODE,
    payload: {
      layoutCode,
    },
  };
};

export const fetchedBrandLayoutByLayoutCode = (layoutCode, data) => {
  return {
    type: BRANDPAGE_ACTIONS.FETCHED_BRAND_LAYOUT_BY_LAYOUT_CODE,
    payload: {
      layoutCode,
      data,
    },
  };
};

export const failedFetchBrandLayoutByLayoutCode = (layoutCode, error) => {
  return {
    type: BRANDPAGE_ACTIONS.FAILED_FETCH_BRAND_LAYOUT_BY_LAYOUT_CODE,
    payload: {
      layoutCode,
    },
    error,
  };
};

export const fetchBrandById = code => {
  return {
    type: BRANDPAGE_ACTIONS.FETCH_BRAND_BY_ID,
    payload: {
      code,
    },
  };
};

export const fetchedBrandById = (code, data) => {
  return {
    type: BRANDPAGE_ACTIONS.FETCHED_BRAND_BY_ID,
    payload: {
      code,
      data,
    },
  };
};

export const failedFetchBrandById = (code, error) => {
  return {
    type: BRANDPAGE_ACTIONS.FAILED_FETCH_BRAND_BY_ID,
    payload: {
      code,
    },
    error,
  };
};
