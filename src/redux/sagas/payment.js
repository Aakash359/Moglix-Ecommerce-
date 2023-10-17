// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {PAYMENT_ACTIONS} from '../constants/payment';
// api call
import {getPaymentMethodsStatus} from '../../services/payment';
// actions
import {
  fetchedPaymentMethods,
  failedFetchPaymentMethods,
} from '../actions/payment';

function* fetchPaymentMethodsStatus({payload: {gateWay, sessionId, token}}) {
  try {
    const {data, error} = yield call(
      getPaymentMethodsStatus,
      gateWay,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedFetchPaymentMethods(gateWay, error));
    } else {
      yield put(fetchedPaymentMethods(gateWay, data.data));
    }
  } catch (error) {
    yield put(failedFetchPaymentMethods(gateWay, error));
  }
}

export default fork(function* () {
  yield takeEvery(
    PAYMENT_ACTIONS.FETCH_PAYMENT_METHODS,
    fetchPaymentMethodsStatus,
  );
});
