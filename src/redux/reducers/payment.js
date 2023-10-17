import {STATE_STATUS} from '../constants';
import {PAYMENT_ACTIONS} from '../constants/payment';

const initialState = {
  payu: {
    data: {
      NB: {},
      UPI: {},
      WALLET: {},
    },
    status: STATE_STATUS.UNFETCHED,
  },
  razorpay: {
    data: {
      NB: {},
      UPI: {},
      WALLET: {},
    },
    status: STATE_STATUS.UNFETCHED,
  },
};

export const paymentReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case PAYMENT_ACTIONS.FETCH_PAYMENT_METHODS:
      return {
        ...state,
        [`${payload.gateWay}`]: {
          status: STATE_STATUS.FETCHING,
        },
      };
    case PAYMENT_ACTIONS.FETCHED_PAYMENT_METHODS:
      return {
        ...state,
        [`${payload.gateWay}`]: {
          status: STATE_STATUS.FETCHED,
          data: {...state[payload.gateWay].data, ...payload.data},
        },
      };
    case PAYMENT_ACTIONS.FAILED_FETCHED_PAYMENT_METHODS:
      return {
        ...state,
        [`${payload.gateWay}`]: {
          status: STATE_STATUS.FAILED_FETCH,
          error: error,
        },
      };
    default:
      return state;
  }
};
