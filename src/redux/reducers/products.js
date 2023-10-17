import {STATE_STATUS} from '../constants';
import {PRODUCTS_ACTIONS} from '../constants/products';

const initialState = {};

export const productsReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case PRODUCTS_ACTIONS.FETCH_PRODUCT:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          productBO: {
            status: STATE_STATUS.FETCHING,
            data: {},
          },
        },
      };
    case PRODUCTS_ACTIONS.FETCHED_PRODUCT:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          productBO: {
            status: STATE_STATUS.FETCHED,
            data: payload.productBO,
          },
        },
      };
    case PRODUCTS_ACTIONS.FAILED_FETCH_PRODUCT:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          productBO: {
            status: STATE_STATUS.FAILED_FETCH,
            data: {},
            error,
          },
        },
      };

    case PRODUCTS_ACTIONS.FETCH_PRODUCT_REVIEW:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          review: {
            status: STATE_STATUS.FETCHING,
            data: {},
          },
        },
      };
    case PRODUCTS_ACTIONS.FETCHED_PRODUCT_REVIEW:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          review: {
            status: STATE_STATUS.FETCHED,
            data: payload.reviews,
          },
        },
      };
    case PRODUCTS_ACTIONS.FAILED_FETCH_PRODUCT_REVIEW:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          review: {
            status: STATE_STATUS.FAILED_FETCH,
            data: {},
            error,
          },
        },
      };

    case PRODUCTS_ACTIONS.FETCH_PRODUCT_QUESTION:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          question: {
            status: STATE_STATUS.FETCHING,
            data: {},
          },
        },
      };
    case PRODUCTS_ACTIONS.FETCHED_PRODUCT_QUESTION:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          question: {
            status: STATE_STATUS.FETCHED,
            data: payload.questions,
          },
        },
      };
    case PRODUCTS_ACTIONS.FAILED_FETCH_PRODUCT_QUESTION:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          question: {
            status: STATE_STATUS.FAILED_FETCH,
            data: {},
            error,
          },
        },
      };

    case PRODUCTS_ACTIONS.SET_SHIPPING_VALUE:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          shippingValue: {
            status: STATE_STATUS.FETCHED,
            data: payload.data,
          },
        },
      };

    case PRODUCTS_ACTIONS.SET_SIMILAR_PRODUCTS:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          similarProducts: {
            status: STATE_STATUS.FETCHED,
            data: payload.data,
          },
        },
      };

    case PRODUCTS_ACTIONS.SET_RELATED_CATEGORIES:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          relatedCategories: {
            status: STATE_STATUS.FETCHED,
            data: payload.data,
          },
        },
      };

    case PRODUCTS_ACTIONS.SET_FBT_PRODUCTS:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          fbtProducts: {
            status: STATE_STATUS.FETCHED,
            data: payload.data,
          },
        },
      };

    case PRODUCTS_ACTIONS.SET_PRODUCT_EMI:
      let newData = {
        ...payload.data.credit_card,
        ...payload.data.debit_card,
      };

      let bankKeys = Object.keys(newData);
      let result = bankKeys.map(_ => {
        let emiKeys = Object.keys(newData[_]);
        return emiKeys.map(__ => {
          return newData[_][__] || {};
        });
      });
      result = result.flat();
      result = result
        .filter(emiOptions => emiOptions && emiOptions.emiAmount)
        .map(emiOptions => emiOptions.emiAmount);
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          emi: {
            status: STATE_STATUS.FETCHED,
            data: {
              ...payload.data,
              minEmiAmount: Math.min(...result),
            },
          },
        },
      };

    case PRODUCTS_ACTIONS.SET_PRODUCT_OFFER:
      return {
        ...state,
        [`${payload.msn}`]: {
          ...state[payload.msn],
          offer: {
            status: STATE_STATUS.FETCHED,
            data: payload.data,
          },
        },
      };

    default:
      return state;
  }
};
