// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {AUTH_ACTIONS} from '../constants/auth';
// api call
import {getSession, updateProfile} from '../../services/auth';
// actions
import {fetchedAuth, failedFetchAuth} from '../actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* fetchSession() {
  try {
    const {data, error} = yield call(getSession);

    if (error) {
      yield put(failedFetchAuth(error));
    } else {
      yield put(fetchedAuth(data));
      yield call(AsyncStorage.setItem('@user', JSON.stringify(data)));
    }
  } catch (error) {
    yield put(failedFetchAuth(error));
  }
}

export default fork(function* () {
  yield takeEvery(AUTH_ACTIONS.FETCH_AUTH, fetchSession);
});
