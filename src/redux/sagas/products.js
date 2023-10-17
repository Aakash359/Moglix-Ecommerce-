// dependencies
import {put, call, fork, takeLatest} from 'redux-saga/effects';
// constants
import {PRODUCTS_ACTIONS} from '../constants/products';
// api call
import {
  getProduct,
  getProductReview,
  getProductQuestion,
} from '../../services/products';
// actions
import {
  fetchedProduct,
  failedFetchProduct,
  fetchedProductReview,
  failedFetchProductReview,
  fetchedProductQuestion,
  failedFetchProductQuestion,
} from '../actions/products';

import {setSearchedCategory} from '../actions/homepage';

function* fetchProduct({payload: {msn}}) {
  try {
    const {data, error} = yield call(getProduct, msn);
    if (error) {
      yield put(failedFetchProduct(msn, error));
    } else {
      yield put(fetchedProduct(msn, data.productBO));
      yield put(
        setSearchedCategory(
          data.productBO &&
            data.productBO.categoryDetails &&
            data.productBO.categoryDetails[0] &&
            data.productBO.categoryDetails[0].categoryName,
        ),
      );
    }
  } catch (error) {
    yield put(failedFetchProduct(msn, error));
  }
}

function* fetchProductReview({payload: {msn}}) {
  try {
    const {data, error} = yield call(getProductReview, msn);
    if (error) {
      yield put(failedFetchProductReview(msn, error));
    } else {
      yield put(fetchedProductReview(msn, data.data));
    }
  } catch (error) {
    yield put(failedFetchProductReview(msn, error));
  }
}

function* fetchProductQuestion({payload: {msn}}) {
  try {
    const {data, error} = yield call(getProductQuestion, msn);
    if (error) {
      yield put(failedFetchProductQuestion(msn, error));
    } else {
      yield put(fetchedProductQuestion(msn, data.data));
    }
  } catch (error) {
    yield put(failedFetchProductQuestion(msn, error));
  }
}

export default fork(function* () {
  yield takeLatest(PRODUCTS_ACTIONS.FETCH_PRODUCT, fetchProduct);
  yield takeLatest(PRODUCTS_ACTIONS.FETCH_PRODUCT_REVIEW, fetchProductReview);
  yield takeLatest(
    PRODUCTS_ACTIONS.FETCH_PRODUCT_QUESTION,
    fetchProductQuestion,
  );
});
