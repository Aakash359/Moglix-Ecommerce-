// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {ORDER_ACTIONS} from '../constants/orders';
// api call
import {getOrdersByuserId, getOrderDetails} from '../../services/orders';
// actions
import {
  fetchedOrders,
  failedFetchOrders,
  fetchedOrderDetails,
  failedFetchOrderDetails,
  fetchOrderDetails,
} from '../actions/orders';

function* getOrders({
  payload: {
    params: {...allParams},
    sessionId,
    token,
  },
}) {
  try {
    const {data, error} = yield call(
      getOrdersByuserId,
      {...allParams},
      sessionId,
      token,
    );

    if (error) {
      yield put(failedFetchOrders(error));
    } else {
      if (data) {
        // if (data && data.data && data.data.length && pageNo == 0) {
        //   yield put(
        //     fetchOrderDetails(userId, data.data[0].orderId, sessionId, token),
        //   );
        // }
        yield put(fetchedOrders(data.data, {...allParams}));
      } else {
        yield put(fetchedOrders({data: {}, numberOfOrder: 1}, {...allParams}));
      }
    }
  } catch (error) {
    console.log(error);
    yield put(failedFetchOrders(error));
  }
}

function* fetchOrderDetail({payload: {userId, orderId, sessionId, token}}) {
  try {
    const {data, error} = yield call(
      getOrderDetails,
      userId,
      orderId,
      sessionId,
      token,
    );
    if (error) {
      console.log(error);
      yield put(failedFetchOrderDetails(userId, orderId, error));
    } else {
      yield put(fetchedOrderDetails(userId, orderId, data));
    }
  } catch (error) {
    console.log(error);
    yield put(failedFetchOrderDetails(userId, orderId, error));
  }
}

export default fork(function* () {
  yield takeEvery(ORDER_ACTIONS.FETCH_ORDERS, getOrders);
  yield takeEvery(ORDER_ACTIONS.FETCH_ORDER_DETAILS, fetchOrderDetail);
});
