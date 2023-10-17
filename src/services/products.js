import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getProduct = msn =>
  axios.get(`${BASE_URL}product/getProductGroup`, {
    params: {
      productId: msn,
      fetchGroup: true,
    },
  });

export const getProductReview = msn =>
  axios.post(`${BASE_URL}reviews/getReviews`, {
    review_type: 'PRODUCT_REVIEW',
    item_type: 'PRODUCT',
    item_id: msn.toLowerCase(),
    user_id: '',
  });

export const getProductQuestion = msn =>
  axios.get(`${BASE_URL}quest/getQuest`, {
    params: {
      itemId: msn.toLowerCase(),
    },
  });

export const getProductBuyCount = msn =>
  axios.get(`${BASE_URL}cmsapi/productStatusCount`, {
    params: {
      productId: msn,
      timeInterval: 10,
    },
  });

export const getShippingValue = param =>
  axios.post(`${BASE_URL}shipping/getShippingValue`, param);

export const getSimilarProducts = params =>
  axios.get(`${BASE_URL}search/similarproducts`, {
    params: {
      ...params,
    },
  });

export const getRelatedCategories = params =>
  axios.get(`${BASE_URL}category/mostSold`, {
    params: {
      ...params,
    },
  });

export const getEmi = params =>
  axios.get(`${BASE_URL}payment/getClusterEmiValues`, {
    params: {
      ...params,
    },
  });

export const getOffer = params =>
  axios.get(`${BASE_URL}category/getcategoryExtras`, {
    params: {requestType: 'mobikwikpdp'},
  });

export const getProductLogistics = (body, sessionId, token) =>
  axios.post(`${BASE_URL}logistics/getProductLogistics`, body, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const getFbtProductsApi = (msn, sessionId, token) =>
  axios.get(`${BASE_URL}product/getProductFbtDetails`, {
    params: {productId: msn},
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const writeReview = (data, sessionId, token) =>
  axios.post(`${BASE_URL}reviews/setReviews`, data, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const askQuestion = (data, sessionId, token) =>
  axios.post(`${BASE_URL}quest/setQuest`, data, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });
