import {AUTH_ACTIONS} from '../constants/auth';
export const fetchAuth = () => {
  return {
    type: AUTH_ACTIONS.FETCH_AUTH,
  };
};

export const fetchedAuth = data => {
  return {
    type: AUTH_ACTIONS.FETCHED_AUTH,
    payload: {
      data,
    },
  };
};

export const failedFetchAuth = error => {
  return {
    type: AUTH_ACTIONS.FAILED_FETCH_AUTH,
    error,
  };
};

export const setAuth = data => {
  return {
    type: AUTH_ACTIONS.SET_AUTH,
    payload: {
      data,
    },
  };
};

export const logout = () => {
  return {
    type: AUTH_ACTIONS.LOGOUT,
  };
};

export const updateUser = userName => {
  return {
    type: AUTH_ACTIONS.UPDATE_USER,
    payload: {
      userName,
    },
  };
};

export const setFcmToken = data => {
  return {
    type: AUTH_ACTIONS.SET_FCM_TOKEN,
    payload: {
      data,
    },
  };
};
