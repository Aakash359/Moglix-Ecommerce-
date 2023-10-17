import {RFQ_ACTIONS} from '../constants/rfqs';

export const fetchRfq = (email, idCustomer, phone, sessionId, token) => {
  return {
    type: RFQ_ACTIONS.FETCH_RFQ,
    payload: {
      email,
      idCustomer,
      phone,
      sessionId,
      token,
    },
  };
};

export const fetchedRfq = data => {
  return {
    type: RFQ_ACTIONS.FETCHED_RFQ,
    payload: {
      data,
    },
  };
};

export const failedFetchRfq = error => {
  return {
    type: RFQ_ACTIONS.FAILED_FETCH_RFQ,
    error,
  };
};
