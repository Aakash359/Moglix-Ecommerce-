import {all} from 'redux-saga/effects';
import productsSage from './products';
import homepageSage from './homepage';
import brandpageSage from './brandpage';
import categoriesSage from './categories';
import listingsage from './listing';
import searchSage from './search';
import authSage from './auth';
import addressSage from './address';
import paymentSage from './payment';
import wishlistSage from './wishlist';
import orderSage from './orders';
import rfqSage from './rfqs';
import recentlyViewedSage from './recentlyViewed';

export default function* () {
  yield all([
    productsSage,
    homepageSage,
    brandpageSage,
    categoriesSage,
    listingsage,
    searchSage,
    authSage,
    addressSage,
    paymentSage,
    wishlistSage,
    orderSage,
    rfqSage,
    recentlyViewedSage,
  ]);
}
