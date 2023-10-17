import {PRODUCTS_ACTIONS} from '../constants/products';

export const fetchProduct = msn => {
  return {
    type: PRODUCTS_ACTIONS.FETCH_PRODUCT,
    payload: {
      msn,
    },
  };
};

export const fetchedProduct = (msn, productBO) => {
  return {
    type: PRODUCTS_ACTIONS.FETCHED_PRODUCT,
    payload: {
      msn,
      productBO,
    },
  };
};

export const failedFetchProduct = (msn, error) => {
  return {
    type: PRODUCTS_ACTIONS.FAILED_FETCH_PRODUCT,
    payload: {msn},
    error,
  };
};

export const fetchProductReview = msn => {
  return {
    type: PRODUCTS_ACTIONS.FETCH_PRODUCT_REVIEW,
    payload: {
      msn,
    },
  };
};

export const fetchedProductReview = (msn, reviews) => {
  return {
    type: PRODUCTS_ACTIONS.FETCHED_PRODUCT_REVIEW,
    payload: {
      msn,
      reviews,
    },
  };
};

export const failedFetchProductReview = (msn, error) => {
  return {
    type: PRODUCTS_ACTIONS.FAILED_FETCH_PRODUCT_REVIEW,
    payload: {msn},
    error,
  };
};

export const fetchProductQuestion = msn => {
  return {
    type: PRODUCTS_ACTIONS.FETCH_PRODUCT_QUESTION,
    payload: {
      msn,
    },
  };
};

export const fetchedProductQuestion = (msn, questions) => {
  return {
    type: PRODUCTS_ACTIONS.FETCHED_PRODUCT_QUESTION,
    payload: {
      msn,
      questions,
    },
  };
};

export const failedFetchProductQuestion = (msn, error) => {
  return {
    type: PRODUCTS_ACTIONS.FAILED_FETCH_PRODUCT_QUESTION,
    payload: {msn},
    error,
  };
};

export const setProductShippingValue = (msn, data) => {
  return {
    type: PRODUCTS_ACTIONS.SET_SHIPPING_VALUE,
    payload: {msn, data},
  };
};

export const setProductSimilarProducts = (msn, data) => {
  return {
    type: PRODUCTS_ACTIONS.SET_SIMILAR_PRODUCTS,
    payload: {msn, data},
  };
};

export const setProductRelatedCategories = (msn, data) => {
  return {
    type: PRODUCTS_ACTIONS.SET_RELATED_CATEGORIES,
    payload: {msn, data},
  };
};

export const setProductEmi = (msn, data) => {
  return {
    type: PRODUCTS_ACTIONS.SET_PRODUCT_EMI,
    payload: {msn, data},
  };
};

export const setProductOffer = (msn, data) => {
  return {
    type: PRODUCTS_ACTIONS.SET_PRODUCT_OFFER,
    payload: {msn, data},
  };
};

export const setFbtProducts = (msn, data) => {
  return {
    type: PRODUCTS_ACTIONS.SET_FBT_PRODUCTS,
    payload: {msn, data},
  };
};
