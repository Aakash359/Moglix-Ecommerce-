// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {RFQ_ACTIONS} from '../constants/rfqs';
// api call
import {getRfqs} from '../../services/rfqs';
// actions
import {fetchedRfq, failedFetchRfq} from '../actions/rfqs';

function* fetchRfqs({payload: {email, idCustomer, phone, sessionId, token}}) {
  try {
    const {data, error} = yield call(
      getRfqs,
      email,
      idCustomer,
      phone,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedFetchRfq(error));
    } else {
      yield put(fetchedRfq(data));
    }
  } catch (error) {
    yield put(failedFetchRfq(error));
  }
}

export default fork(function* () {
  yield takeEvery(RFQ_ACTIONS.FETCH_RFQ, fetchRfqs);
});
