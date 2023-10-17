import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getRecentlyViewed = (customerId, sessionId, token) =>
  axios.get(
    `${BASE_URL}recentlyviewed/getRecentlyViewd?customerId=${customerId}`,
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );

export const setRecentlyViewed = (data, customerId, sessionId, token) =>
  axios.post(
    `https://apinew.moglix.com/nodeApi/v1/clickStream/setStreamData`,
    data,
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );
