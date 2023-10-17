import {productsReducer} from './products';
import {masterReducer} from './master';
import {homepageReducer} from './homepage';
import {brandpageReducer} from './brandpage';
import {categoriesReducer} from './categories';
import {listingReducer} from './listing';
import {searchReducer} from './search';
import {authReducer} from './auth';
import {cartReducer} from './cart';
import {addressReducer} from './address';
import {paymentReducer} from './payment';
import {wishlistReducer} from './wishlist';
import {ordersReducer} from './orders';
import {rfqsReducer} from './rfqs';
import {recentlyViewedReducer} from './recentlyViewed';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  productsReducer,
  masterReducer,
  homepageReducer,
  brandpageReducer,
  categoriesReducer,
  listingReducer,
  searchReducer,
  authReducer,
  cartReducer,
  addressReducer,
  paymentReducer,
  wishlistReducer,
  ordersReducer,
  rfqsReducer,
  recentlyViewedReducer,
});

export default rootReducer;
