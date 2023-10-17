// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {RECENTLY_VIEWED_ACTIONS} from '../constants/recentlyViewed';
// api call
import {
  getRecentlyViewed,
  setRecentlyViewed,
} from '../../services/recentlyViewed';
// actions
import {
  fetchRecentlyViewed,
  fetchedRecentlyViewed,
  failedFetchRecentlyViewed,
  fetchedSetRecentlyViewed,
  failedFetchSetRecentlyViewed,
} from '../actions/recentlyViewed';

function* fetchRecentlyViewedData({payload: {customerId, sessionId, token}}) {
  try {
    const {data, error} = yield call(
      getRecentlyViewed,
      customerId,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedFetchRecentlyViewed(error));
    } else {
      yield put(fetchedRecentlyViewed(data));
    }
  } catch (error) {
    yield put(failedFetchRecentlyViewed(error));
  }
}

function* fetchSetRecentlyViewed({
  payload: {productdata, customerId, sessionId, token},
}) {
  try {
    const {data, error} = yield call(
      setRecentlyViewed,
      productdata,
      customerId,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedFetchSetRecentlyViewed(error));
    } else {
      yield put(fetchRecentlyViewed(customerId, sessionId, token));
      yield put(fetchedSetRecentlyViewed(data));
    }
  } catch (error) {
    yield put(failedFetchSetRecentlyViewed(error));
  }
}

export default fork(function* () {
  yield takeEvery(
    RECENTLY_VIEWED_ACTIONS.FETCH_RECENTLY_VIEWED,
    fetchRecentlyViewedData,
  );
  yield takeEvery(
    RECENTLY_VIEWED_ACTIONS.FETCH_SET_RECENTLY_VIEWED,
    fetchSetRecentlyViewed,
  );
});
