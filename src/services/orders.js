import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getOrdersByuserId = (params, sessionId, token) =>
  axios.post(`${BASE_URL}checkout/getUserOrders`, params, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getOrderDetails = (userId, orderId, sessionId, token) =>
  axios.get(`${BASE_URL}order/orderDetails`, {
    params: {customerid: userId, orderid: orderId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getShipmentTracking = (shipmentId, sessionId, token) =>
  axios.get(`${BASE_URL}order/oderTracking`, {
    params: {shipmentId: shipmentId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getTransactionId = (userId, sessionId, token) =>
  axios.get(`${BASE_URL}payment/getReturnTransactionId`, {
    params: {userId: userId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const returnItem = (rData, sessionid, token) =>
  axios.post(
    `${BASE_URL}payment/returnRefund`,
    {...rData},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const cancelReasonsApi = (sessionId, token) =>
  axios.get(`${BASE_URL}order/cancelReasons`, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const cancelItem = (cData, sessionid, token) =>
  axios.post(
    `${BASE_URL}order/cancelOrder`,
    {...cData},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );
