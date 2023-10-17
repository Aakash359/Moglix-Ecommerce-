// dependencies
import {put, call, fork, takeEvery, all} from 'redux-saga/effects';
// constants
import {WISHLIST_ACTIONS} from '../constants/wishlist';
// api call
import {
  getPurchaseList,
  addPurchaseList,
  removeFromPurchaseList,
} from '../../services/wishlist';
// actions
import {
  failedFetchWishlist,
  failedupdateWishlist,
  fetchedWishlist,
  updatedWishlist,
  fetchWishlist,
} from '../actions/wishlist';
import Toast from 'react-native-toast-message';

function* getWishList({payload: {userId, userType, sessionId, token}}) {
  try {
    const {data, error} = yield call(
      getPurchaseList,
      userId,
      userType,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedFetchWishlist(error));
    } else {
      yield put(fetchedWishlist(data.data));
    }
  } catch (error) {
    yield put(failedFetchWishlist(error));
  }
}

function* updateWishlist({
  payload: {productData, sessionId, token, actionType, showToast},
}) {
  try {
    const {data, error} = yield call(
      actionType == 'add' ? addPurchaseList : removeFromPurchaseList,
      productData,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedupdateWishlist());
    } else {
      yield put(
        fetchWishlist(
          productData.idUser,
          productData.userType,
          sessionId,
          token,
        ),
      );
      yield put(updatedWishlist());
      if (actionType == 'add' || showToast) {
        Toast.show({
          type: 'success',
          text2:
            actionType == 'add'
              ? 'Product added to wishlist'
              : 'Product removed from wishlist',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  } catch (error) {
    yield put(failedupdateWishlist());
  }
}

export default fork(function* () {
  yield all([
    takeEvery(WISHLIST_ACTIONS.FETCH_WISHLIST, getWishList),
    takeEvery(WISHLIST_ACTIONS.UPDATE_WISHLIST, updateWishlist),
  ]);
});
