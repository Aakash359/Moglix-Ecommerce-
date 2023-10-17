// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {SEARCH_ACTIONS} from '../constants/search';
// api call
import {getTrendingCategories} from '../../services/search';
// actions
import {fetchedTrendingCat, failedFetchTrendingCat} from '../actions/search';

function* fetchTrendingCat({payload: {code}}) {
  try {
    const {data, error} = yield call(getTrendingCategories, code);
    if (error) {
      yield put(failedFetchTrendingCat(code, error));
    } else {
      yield put(fetchedTrendingCat(code, data));
    }
  } catch (error) {
    yield put(failedFetchTrendingCat(code, error));
  }
}

export default fork(function* () {
  yield takeEvery(SEARCH_ACTIONS.FETCH_TRENDING_CAT, fetchTrendingCat);
});
