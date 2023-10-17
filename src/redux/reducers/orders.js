import {STATE_STATUS} from '../constants';
import {AUTH_ACTIONS} from '../constants/auth';
import {ORDER_ACTIONS} from '../constants/orders';

const initialState = {
  status: STATE_STATUS.UNFETCHED,
  orders: [],
  params: {
    initialDateRange: 'Last 6 months',
    initialStatus: 'all',
  },
  pageIndex: 0,
  activeOrder: [],
  orderedTime: '',
};

export const ordersReducer = (state = initialState, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case ORDER_ACTIONS.EMPTY_ORDERS:
      return {
        ...state,
        orders: [],
        status: STATE_STATUS.UNFETCHED,
      };
    case ORDER_ACTIONS.FETCH_ORDERS:
      if (payload.params.pageNo === 0) {
        return {
          ...state,
          status: STATE_STATUS.FETCHING,
          params: payload.params,
          // orders: [],
        };
      }
      return {
        ...state,
        status: STATE_STATUS.FETCHING,
      };
    case ORDER_ACTIONS.FETCHED_ORDERS:
      if (payload.params.pageNo === 0) {
        return {
          ...state,
          status: STATE_STATUS.FETCHED,
          maxPage: (payload.data.orderCount || 1) / payload.params.pageSize,
          orders: payload.data.itemDetails,
          pageIndex: payload.params.pageNo + 1,
        };
      }
      return {
        ...state,
        status: STATE_STATUS.FETCHED,
        maxPage: (payload.data.orderCount || 1) / payload.params.pageSize,
        orders: [...state['orders'], ...payload.data.itemDetails],
        pageIndex: payload.params.pageNo + 1,
      };
    case ORDER_ACTIONS.FAILED_FETCH_ORDERS:
      return {
        ...state,
        status: STATE_STATUS.FAILED_FETCH,
        error: error,
      };

    case ORDER_ACTIONS.FETCH_ORDER_DETAILS:
      return {
        ...state,
        // activeOrder: [],
      };
    case ORDER_ACTIONS.FETCHED_ORDER_DETAILS:
      return {
        ...state,
        activeOrder: payload.data,
      };
    case ORDER_ACTIONS.FAILED_FETCH_ORDER_DETAILS:
      return {
        ...state,
        // activeOrder: [],
      };

    case ORDER_ACTIONS.SET_ORDERED_TIME:
      return {
        ...state,
        orderedTime: payload.data,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        status: STATE_STATUS.UNFETCHED,
        orders: [],
        params: {},
        pageIndex: 0,
        activeOrder: [],
        orderedTime: '',
      };
    default:
      return state;
  }
};
