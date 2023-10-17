import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const updateAddressByInvoiceTypeApi = (address, sessionId, token) =>
  axios.post(
    `${BASE_URL}address/postAddress`,
    {...address},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );

export const getAddressByInvoiceType = (
  userId,
  invoiceType,
  sessionId,
  token,
) =>
  axios.get(`${BASE_URL}address/getAddressList`, {
    params: {customerId: userId, invoiceType},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const validateProductsService = (body, sessionId, token) =>
  axios.post(`${BASE_URL}logistics/validateProductsService`, body, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getCustomerBusinessDetails = (userId, sessionId, token) =>
  axios.get(`${BASE_URL}customer/getCustomerBusinessDetails`, {
    params: {customerId: userId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const validate = (shoppingCartDto, sessionid, token) =>
  axios.post(
    `${BASE_URL}validation/validate`,
    {shoppingCartDto: shoppingCartDto},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const validateGstin = (gstin, sessionId, token) =>
  axios.get(`${BASE_URL}address/getTaxpayerByGstin`, {
    params: {gstin},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const validatePincode = (pin, sessionId, token) =>
  axios.get(`${BASE_URL}address/getcitystatebyPincode`, {
    params: {pin},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });
