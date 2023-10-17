import {ADDRESS_ACTIONS} from '../constants/address';

export const fetchAddressByInvoiceType = (
  userId,
  invoiceType,
  sessionId,
  token,
) => {
  return {
    type: ADDRESS_ACTIONS.FETCH_ADDRESS_BY_INVOICETYPE,
    payload: {
      userId,
      invoiceType,
      sessionId,
      token,
    },
  };
};

export const fetchedAddressByInvoiceType = (invoiceType, data) => {
  return {
    type: ADDRESS_ACTIONS.FETCHED_ADDRESS_BY_INVOICETYPE,
    payload: {
      invoiceType,
      data,
    },
  };
};

export const failedFetchAddressByInvoiceType = (invoiceType, error) => {
  return {
    type: ADDRESS_ACTIONS.FAILED_FETCH_ADDRESS_BY_INVOICETYPE,
    payload: {
      invoiceType,
    },
    error,
  };
};

export const setShippingAddress = (invoiceType, addressId) => {
  return {
    type: ADDRESS_ACTIONS.SET_SHIPPING_ADDRESS,
    payload: {
      invoiceType,
      addressId,
    },
  };
};

export const setBillingAddress = (invoiceType, addressId) => {
  return {
    type: ADDRESS_ACTIONS.SET_BILLING_ADDRESS,
    payload: {
      invoiceType,
      addressId,
    },
  };
};

export const updateAddressByInvoiceType = (
  userId,
  invoiceType,
  address,
  sessionId,
  token,
) => {
  return {
    type: ADDRESS_ACTIONS.UPDATE_ADDRESS_BY_INVOICETYPE,
    payload: {
      userId,
      invoiceType,
      address,
      sessionId,
      token,
    },
  };
};

export const updatedAddressByInvoiceType = (invoiceType, data) => {
  return {
    type: ADDRESS_ACTIONS.UPDATED_ADDRESS_BY_INVOICETYPE,
    payload: {
      invoiceType,
      data,
    },
  };
};

export const failedUpdateAddressByInvoiceType = (invoiceType, error) => {
  return {
    type: ADDRESS_ACTIONS.FAILED_UPDATE_ADDRESS_BY_INVOICETYPE,
    payload: {
      invoiceType,
    },
    error,
  };
};
