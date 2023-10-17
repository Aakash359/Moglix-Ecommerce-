import {ORDER_ACTIONS} from '../../redux/constants/orders';

export const fetchOrders = (params, sessionId, token) => {
  return {
    type: ORDER_ACTIONS.FETCH_ORDERS,
    payload: {params, sessionId, token},
  };
};

export const fetchedOrders = (data, params) => {
  return {
    type: ORDER_ACTIONS.FETCHED_ORDERS,
    payload: {
      data,
      params,
    },
  };
};

export const emptyOrders = () => {
  return {
    type: ORDER_ACTIONS.EMPTY_ORDERS,
  };
};

export const failedFetchOrders = error => {
  return {
    type: ORDER_ACTIONS.FAILED_FETCH_ORDERS,
    error,
  };
};

export const fetchOrderDetails = (userId, orderId, sessionId, token) => {
  return {
    type: ORDER_ACTIONS.FETCH_ORDER_DETAILS,
    payload: {userId, orderId, sessionId, token},
  };
};

export const fetchedOrderDetails = (userId, orderId, data) => {
  return {
    type: ORDER_ACTIONS.FETCHED_ORDER_DETAILS,
    payload: {
      userId,
      orderId,
      data,
    },
  };
};

export const failedFetchOrderDetails = (userId, orderId, error) => {
  return {
    type: ORDER_ACTIONS.FAILED_FETCH_ORDER_DETAILS,
    error,
    payload: {
      userId,
      orderId,
    },
  };
};

export const setOrderedTime = data => {
  return {
    type: ORDER_ACTIONS.SET_ORDERED_TIME,
    payload: {
      data,
    },
  };
};
