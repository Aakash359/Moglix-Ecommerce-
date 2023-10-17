// dependencies
import {put, call, fork, takeLatest, takeEvery} from 'redux-saga/effects';
// constants
import {LISTINGPAGE_ACTIONS} from '../constants/listing';
// api call
import {getListing, getCategoryById} from '../../services/listing';
// actions
import {
  fetchedProductSearchResult,
  failedFetchProductSearchResult,
} from '../actions/listing';

function* fetchProductSearchResult({payload: {params}}) {
  try {
    let newParams = {...params};
    if (params.listingType === 'Brand' && params.category) {
      delete newParams.str;
    }

    const {data, error} = yield call(getListing, newParams);
    let categoryRes = {};
    if (params.listingType === 'Category' && params.pageIndex === 0) {
      categoryRes = yield call(getCategoryById, params.str);
    }
    if (error) {
      yield put(failedFetchProductSearchResult(params, error));
    } else {
      if (params.listingType === 'Category' && params.pageIndex === 0) {
        yield put(
          fetchedProductSearchResult(
            {
              ...params,
              filter: data.buckets,
              categoriesRecommended: data.categoriesRecommended,
            },
            {...data.productSearchResult, categoryRes: categoryRes.data},
          ),
        );
      } else {
        yield put(
          fetchedProductSearchResult(
            {
              ...params,
              filter: data.buckets,
              categoriesRecommended: data.categoriesRecommended,
            },
            data.productSearchResult,
          ),
        );
      }
    }
  } catch (error) {
    yield put(failedFetchProductSearchResult(params, error));
  }
}

export default fork(function* () {
  yield takeEvery(LISTINGPAGE_ACTIONS.FETCH_LISTING, fetchProductSearchResult);
});
