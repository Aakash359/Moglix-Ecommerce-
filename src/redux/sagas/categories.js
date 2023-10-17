// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {CATEGORIES_ACTIONS} from '../constants/categories';
// api call
import {getCategoryByCode} from '../../services/categories';
// actions
import {
  fetchedCategoryByCode,
  failedFetchCategoryByCode,
} from '../actions/categories';

function* fetchCategoriesByCode({payload: {code}}) {
  try {
    const {data, error} = yield call(getCategoryByCode, code);
    if (error) {
      yield put(failedFetchCategoryByCode(code, error));
    } else {
      yield put(fetchedCategoryByCode(code, data));
    }
  } catch (error) {
    yield put(failedFetchCategoryByCode(code, error));
  }
}

export default fork(function* () {
  yield takeEvery(
    CATEGORIES_ACTIONS.FETCH_CATEGORY_BY_CODE,
    fetchCategoriesByCode,
  );
});
