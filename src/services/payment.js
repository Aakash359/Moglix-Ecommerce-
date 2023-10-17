import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getPaymentMethodsStatus = (gateWay, sessionId, token) =>
  axios.get(`${BASE_URL}payment/getPaymentMethodsStatus`, {
    params: {gateWay: gateWay},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getClusterEmiValues = (price, gateWay, sessionId, token) =>
  axios.get(`${BASE_URL}payment/getClusterEmiValues`, {
    params: {price, gateWay},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getPaymentId = (userId, sessionId, token) =>
  axios.get(`${BASE_URL}payment/getPaymentId`, {
    params: {userId: userId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const payApi = (payload, sessionid, token) =>
  axios.post(
    `${BASE_URL}payment/pay`,
    {...payload},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const getPrePaidDiscountApi = (payload, sessionid, token) =>
  axios.post(
    `${BASE_URL}payment/getPrepaidDiscount`,
    {...payload},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );
