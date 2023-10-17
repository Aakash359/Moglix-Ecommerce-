import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getRfqs = (email, idCustomer, phone, sessionId, token) =>
  axios.post(
    `${BASE_URL}rfq/listRFQ`,
    {email, idCustomer, phone},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );

export const createRfqApi = (body, sessionId, token) =>
  axios.post(
    `${BASE_URL}rfq/createRfq`,
    {...body},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );
