import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getPurchaseList = (userId, userType, sessionId, token) =>
  axios.get(`${BASE_URL}purchase/getPurchaseList`, {
    params: {idUser: userId, userType: userType},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const addPurchaseList = (productData, sessionid, token) =>
  axios.post(
    `${BASE_URL}purchase/addPurchaseList`,
    {...productData},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const removeFromPurchaseList = (productData, sessionid, token) =>
  axios.post(
    `${BASE_URL}purchase/removePurchaseList`,
    {...productData},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );
