import {STATE_STATUS} from '../constants';
import {ADDRESS_ACTIONS} from '../constants/address';
import {AUTH_ACTIONS} from '../constants/auth';

const initialState = {
  retail: {
    status: STATE_STATUS.UNFETCHED,
    data: [],
    activeShippingId: null,
  },
  tax: {
    status: STATE_STATUS.UNFETCHED,
    data: [],
    activeShippingId: null,
    activeBillingId: null,
  },
};

export const addressReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case ADDRESS_ACTIONS.FETCH_ADDRESS_BY_INVOICETYPE:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case ADDRESS_ACTIONS.FETCHED_ADDRESS_BY_INVOICETYPE:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          ...state[payload.invoiceType],
          status: STATE_STATUS.FETCHED,
          data: payload.data.addressList,
        },
      };
    case ADDRESS_ACTIONS.FAILED_FETCH_ADDRESS_BY_INVOICETYPE:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };
    case ADDRESS_ACTIONS.SET_SHIPPING_ADDRESS:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          ...state[`${payload.invoiceType}`],
          activeShippingId: payload.addressId,
        },
      };
    case ADDRESS_ACTIONS.SET_BILLING_ADDRESS:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          ...state[`${payload.invoiceType}`],
          activeBillingId: payload.addressId,
        },
      };

    case ADDRESS_ACTIONS.UPDATE_ADDRESS_BY_INVOICETYPE:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          ...state[payload.invoiceType],
          error: null,
          status: STATE_STATUS.FETCHING,
        },
      };
    case ADDRESS_ACTIONS.UPDATED_ADDRESS_BY_INVOICETYPE:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          ...state[payload.invoiceType],
          status: STATE_STATUS.FETCHED,
          data: payload.data.addressList,
          error: null,
        },
      };
    case ADDRESS_ACTIONS.FAILED_UPDATE_ADDRESS_BY_INVOICETYPE:
      return {
        ...state,
        [`${payload.invoiceType}`]: {
          ...state[payload.invoiceType],
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        retail: {
          status: STATE_STATUS.UNFETCHED,
          data: [],
          activeShippingId: null,
        },
        tax: {
          status: STATE_STATUS.UNFETCHED,
          data: [],
          activeShippingId: null,
          activeBillingId: null,
        },
      };

    default:
      return state;
  }
};
