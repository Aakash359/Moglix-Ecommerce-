import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getPageByLayoutCode = layoutCode =>
  axios.get(`${BASE_URL}homepage/getLayoutJsonByCode?${layoutCode}`);

export const rateApp = (data, sessionId, token) =>
  axios.post(`${BASE_URL}review/setAppFeedback`, data, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });
