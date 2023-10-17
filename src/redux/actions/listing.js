import {LISTINGPAGE_ACTIONS} from '../../redux/constants/listing';

export const fetchProductSearchResult = params => {
  return {
    type: LISTINGPAGE_ACTIONS.FETCH_LISTING,
    payload: {params},
  };
};

export const fetchedProductSearchResult = (params, products) => {
  return {
    type: LISTINGPAGE_ACTIONS.FETCHED_LISTING,
    payload: {
      params,
      products,
    },
  };
};

export const failedFetchProductSearchResult = (params, error) => {
  return {
    type: LISTINGPAGE_ACTIONS.FAILED_FETCH_LISTING,
    payload: {params},
    error,
  };
};
