import axios from 'axios';
import {BASE_URL} from '../redux/constants/index';

export const getSession = () => axios.get(`${BASE_URL}session/getSession`);

export const verifyUser = async data =>
  axios.post(`${BASE_URL}validation/verifycustomer`, data);

export const loginSendOtp = async data =>
  axios.post(`${BASE_URL}login/sendOTP`, {...data, device: 'app'});

export const validateOtp = async data =>
  axios.post(`${BASE_URL}login/validateotp`, data);

export const login = async (data, token, sessionId) =>
  axios.post(
    `${BASE_URL}login/authenticate`,
    {...data, device: 'app'},
    {
      headers: {
        // 'x-access-token': token,
        // 'x-request-id': sessionId,
      },
    },
  );

export const socialLogin = async data =>
  axios.post(`${BASE_URL}login/sociallogin`, data);

export const validateIdentity = async (data, token, sessionId) =>
  axios.post(`${BASE_URL}login/userVerify`, data, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const forgotPassword = async data =>
  axios.post(`${BASE_URL}login/forgetpassword`, data);

export const logout = (token, sessionid) =>
  axios.get(`${BASE_URL}login/logout`, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionid,
    },
  });

export const getCustomer = async (customerId, token, sessionId) =>
  axios.get(`${BASE_URL}customer/getcustomer?customerId=${customerId}`, {
    headers: {
      'x-access-token': token,
      'x-request-id': sessionId,
    },
  });

export const saveAppData = data =>
  axios.post(`${BASE_URL}appApi/setAppInfo`, data);

export const appDeviceAnalytics = data =>
  axios.post(`${BASE_URL}appApi/appdeviceanalytics`, data);

export const signup = async (data, token, sessionId) =>
  axios.post(
    `${BASE_URL}login/signup`,
    {...data, device: 'app'},
    {
      headers: {
        // 'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );

export const updateProfile = async (data, sessionId, token) =>
  axios.post(
    `${BASE_URL}customer/updatecustomer`,
    {...data},
    {
      headers: {
        'x-access-token': token,
        'x-request-id': sessionId,
      },
    },
  );
