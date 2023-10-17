import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getCartByUserId = (body, sessionId, token) =>
  axios.post(`${BASE_URL}cart/getCartByUser`, body, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getCartBySession = (sessionid, token) =>
  axios.get(`${BASE_URL}cart/getCartBySession`, {
    params: {sessionid},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });

export const updateCartApi = (body, sessionid, token) =>
  axios.post(
    `${BASE_URL}cart/updateCart`,
    {...body},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const getAllActivePromoCodes = (userId, sessionid, token) =>
  axios.get(`${BASE_URL}promoCode/getAllActivePromoCodes`, {
    params: {userId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });

export const getPromoCodeDetails = (promoCode, sessionid, token) =>
  axios.get(`${BASE_URL}promoCode/getPromoCodeDetails`, {
    params: {promoCode},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });

export const getPromoCodeDetailsById = (promoId, sessionid, token) =>
  axios.get(`${BASE_URL}promoCode/getPromoCodeDetails`, {
    params: {promoId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });

export const validatePromoCode = (shoppingCartDto, sessionid, token) =>
  axios.post(
    `${BASE_URL}promoCode/validatePromoCode`,
    {...shoppingCartDto},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const validateCartApi = (shoppingCartDto, sessionid, token) =>
  axios.post(
    `${BASE_URL}cart/validateCart`,
    {...shoppingCartDto},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const getCartValidationMsg = (userId, sessionid, token) =>
  axios.get(`${BASE_URL}cart/getCartValidationMessages`, {
    params: {userId},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });

export const setCartValidationMsg = (body, userId, sessionid, token) =>
  axios.post(
    `${BASE_URL}cart/setCartValidationMessages`,
    {data: body, userId},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionid,
      },
    },
  );

export const getShippingValue = (body, sessionid, token) =>
  axios.post(`${BASE_URL}shipping/getShippingValue`, body, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });
