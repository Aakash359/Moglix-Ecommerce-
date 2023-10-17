// dependencies
import {put, call, fork, takeEvery, all} from 'redux-saga/effects';

//constants
import {BRANDPAGE_ACTIONS} from '../constants/brandpage';

// api call
import {getBrandPageByLayoutCode, getBrandById} from '../../services/brandpage';
// actions
import {
  fetchedBrandLayoutByLayoutCode,
  failedFetchBrandLayoutByLayoutCode,
  fetchedBrandById,
  failedFetchBrandById,
} from '../actions/brandpage';

function* fetchBrandLayoutByLayoutCode({payload: {layoutCode}}) {
  try {
    const {data, error} = yield call(getBrandPageByLayoutCode, layoutCode);
    if (error) {
      yield put(failedFetchBrandLayoutByLayoutCode(layoutCode, error));
    } else {
      yield put(fetchedBrandLayoutByLayoutCode(layoutCode, data));
    }
  } catch (error) {
    yield put(failedFetchBrandLayoutByLayoutCode(layoutCode, error));
  }
}

function* fetchBrandById({payload: {code}}) {
  try {
    const {data, error} = yield call(getBrandById, code);
    if (error) {
      yield put(failedFetchBrandById(code, error));
    } else {
      yield put(fetchedBrandById(code, data));
    }
  } catch (error) {
    yield put(failedFetchBrandById(code, error));
  }
}

export default fork(function* () {
  yield all([
    takeEvery(
      BRANDPAGE_ACTIONS.FETCH_BRAND_LAYOUT_BY_LAYOUT_CODE,
      fetchBrandLayoutByLayoutCode,
    ),
    takeEvery(BRANDPAGE_ACTIONS.FETCH_BRAND_BY_ID, fetchBrandById),
  ]);
});
