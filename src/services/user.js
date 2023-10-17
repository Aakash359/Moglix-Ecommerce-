import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getCustomerBusinessDetailsApi = (customerId, sessionId, token) =>
  axios.get(`${BASE_URL}customer/getCustomerBusinessDetails`, {
    params: {customerId, userType: 'business'},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const addUpdateCustomerApi = (payload, sessionid, token) =>
  axios.post(
    `${BASE_URL}customer/addUpdateCustomer`,
    {...payload},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const changePasswordApi = (payload, sessionId, token) =>
  axios.post(
    `${BASE_URL}login/updatepassword`,
    {...payload},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );
