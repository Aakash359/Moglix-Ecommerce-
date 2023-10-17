import {PAYMENT_ACTIONS} from '../constants/payment';

export const fetchPaymentMethods = (gateWay, sessionId, token) => {
  return {
    type: PAYMENT_ACTIONS.FETCH_PAYMENT_METHODS,
    payload: {
      gateWay,
      sessionId,
      token,
    },
  };
};

export const fetchedPaymentMethods = (gateWay, data) => {
  return {
    type: PAYMENT_ACTIONS.FETCHED_PAYMENT_METHODS,
    payload: {
      gateWay,
      data,
    },
  };
};

export const failedFetchPaymentMethods = (gateWay, error) => {
  return {
    type: PAYMENT_ACTIONS.FAILED_FETCHED_PAYMENT_METHODS,
    payload: {
      gateWay,
    },
    error,
  };
};
