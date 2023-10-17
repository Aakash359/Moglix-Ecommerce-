// dependencies
import {put, call, fork, takeEvery} from 'redux-saga/effects';
// constants
import {ADDRESS_ACTIONS} from '../constants/address';
// api call
import {
  getAddressByInvoiceType,
  updateAddressByInvoiceTypeApi,
} from '../../services/address';
// actions
import {
  fetchedAddressByInvoiceType,
  failedFetchAddressByInvoiceType,
  updatedAddressByInvoiceType,
  failedUpdateAddressByInvoiceType,
  setShippingAddress,
  setBillingAddress,
} from '../actions/address';

function* fetchAddressByInvoiceType({
  payload: {userId, invoiceType, sessionId, token},
}) {
  try {
    const {data, error} = yield call(
      getAddressByInvoiceType,
      userId,
      invoiceType,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedFetchAddressByInvoiceType(invoiceType, error));
    } else {
      let shippingAddresses = data.addressList.filter(
        _ => _.addressType.addressType == 'shipping',
      );
      let billingAddresses = data.addressList.filter(
        _ => _.addressType.addressType == 'billing',
      );
      if (shippingAddresses.length) {
        yield put(
          setShippingAddress(invoiceType, shippingAddresses[0].idAddress),
        );
      }
      if (invoiceType == 'tax' && billingAddresses.length) {
        yield put(
          setBillingAddress(invoiceType, billingAddresses[0].idAddress),
        );
      }
      yield put(fetchedAddressByInvoiceType(invoiceType, data));
    }
  } catch (error) {
    yield put(failedFetchAddressByInvoiceType(invoiceType, error));
  }
}

function* updateAddressByInvoiceType({
  payload: {userId, invoiceType, address, sessionId, token},
}) {
  try {
    const {data, error} = yield call(
      updateAddressByInvoiceTypeApi,
      address,
      sessionId,
      token,
    );
    if (error) {
      yield put(failedUpdateAddressByInvoiceType(invoiceType, error));
    } else {
      if (data.status) {
        yield put(updatedAddressByInvoiceType(invoiceType, data));
        let shippingAddresses = data.addressList.filter(
          _ => _.addressType.addressType == 'shipping',
        );
        let billingAddresses = data.addressList.filter(
          _ => _.addressType.addressType == 'billing',
        );
        if (shippingAddresses.length) {
          yield put(
            setShippingAddress(invoiceType, shippingAddresses[0].idAddress),
          );
        }
        if (invoiceType == 'tax' && billingAddresses.length) {
          yield put(
            setBillingAddress(invoiceType, billingAddresses[0].idAddress),
          );
        }
      } else {
        yield put(
          failedUpdateAddressByInvoiceType(invoiceType, data.statusDescription),
        );
      }
    }
  } catch (error) {
    console.log(error);
    yield put(failedUpdateAddressByInvoiceType(invoiceType, error));
  }
}

export default fork(function* () {
  yield takeEvery(
    ADDRESS_ACTIONS.FETCH_ADDRESS_BY_INVOICETYPE,
    fetchAddressByInvoiceType,
  );
  yield takeEvery(
    ADDRESS_ACTIONS.UPDATE_ADDRESS_BY_INVOICETYPE,
    updateAddressByInvoiceType,
  );
});
