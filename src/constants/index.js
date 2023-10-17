import HomeScreen from '../containers/Home';
import CategoriesScreen from '../containers/Categories';
import OrdersScreen from '../containers/Orders';
import ProfileScreen from '../containers/Profile';
import BrandsScreen from '../containers/Brands';
import ProductScreen from '../containers/Product';
import ListingScreen from '../containers/Listing';
import CategoriesHomePageScreen from '../containers/CategoriesHomePage';
import WebViewScreen from '../containers/WebView';
import CarouselZoomer from '../components/Common/CarouselZoomer';
import SearchScreen from '../containers/Search';
import CartScreen from '../containers/Cart';
import CheckoutScreen from '../containers/Checkout';
import PaymentScreen from '../containers/Payment';
import EmiScreen from '../containers/Payment/EMI';
import WishlistScreen from '../containers/Wishlist';
import OrderDetailsScreen from '../containers/OrderDetails';
import SelectAddressScreen from '../containers/SelectAddress';
import FailureScreen from '../containers/OrderStatus/Failure';
import SuccessScreen from '../containers/OrderStatus/Success';
import UpdateAddressScreen from '../containers/UpdateAddress';
import BusinessDetailsScreen from '../containers/BusinessDetails';
import AuthScreen from '../containers/Auth/Auth';
import AuthEmailScreen from '../containers/Auth/AuthEmail';
import LoginWithOTPScreen from '../containers/Auth/LoginWithOTP';
import LoginWithPasswordScreen from '../containers/Auth/LoginWithPassword';
import ForgotPasswordScreen from '../containers/Auth/ForgotPassword';
import ResetPasswordScreen from '../containers/Auth/ResetPassword';
import VerifyOtpScreen from '../containers/Auth/VerifyOtp';
import SignupWithPhoneScreen from '../containers/Auth/SignupWithPhone';
import SignupWithEmailScreen from '../containers/Auth/SignupWithEmail';
import AccountScreen from '../containers/Account';
import RFQScreen from '../containers/RFQs';
import FaqScreen from '../containers/Faq/FaqScreen';
import ContactScreen from '../containers/Contact/ContactScreen';
import ChangePasswordScreen from '../containers/Account/ChangePassword';
import EmailPhoneVerify from '../containers/Auth/EmailPhoneVerify';
import VerifyEmailPhoneOtp from '../containers/Auth/VerifyEmailPhoneOtp';

export const BOTTOM_TAB_SCREENS = [
  {
    name: 'Home',
    component: HomeScreen,
    activeIcon: 'home',
    inactiveIcon: 'home',
    iconType: 'foundation',
  },
  {
    name: 'Categories',
    component: CategoriesScreen,
    activeIcon: 'format-list-text',
    inactiveIcon: 'format-list-text',
  },
  {
    name: 'Brands',
    component: BrandsScreen,
    activeIcon: 'tag-text',
    inactiveIcon: 'tag-text',
  },
  {
    name: 'Orders',
    component: OrdersScreen,
    activeIcon: 'text-box',
    inactiveIcon: 'text-box',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    activeIcon: 'account-circle',
    inactiveIcon: 'account-circle',
  },
];

export const COLORS = {
  primary: '#3f76b5',
  secondary: '',
  primaryText: '#000',
  secondaryText: '#3c3c3c',
  placeholder: '#979797',
  background: '#fafafa',
  border: '#e7e7e7',
  active: '#D9232D',
  inActive: '#C4C4C4',
  inActiveText: '#3c3c3c',
  font: 'Avenir',
};

export const APP_STACK_SCREENS = [
  {
    name: 'CategoriesHomePage',
    component: CategoriesHomePageScreen,
  },
  {
    name: 'Categories',
    component: CategoriesScreen,
    activeIcon: 'format-list-text',
    inactiveIcon: 'format-list-text',
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Product',
    component: ProductScreen,
  },
  {
    name: 'Listing',
    component: ListingScreen,
  },
  {
    name: 'CarouselZoomer',
    component: CarouselZoomer,
  },
  {
    name: 'Search',
    component: SearchScreen,
  },
  {
    name: 'Cart',
    component: CartScreen,
  },
  {
    name: 'Checkout',
    component: CheckoutScreen,
  },
  {
    name: 'Payment',
    component: PaymentScreen,
  },
  {
    name: 'Emi',
    component: EmiScreen,
  },
  {
    name: 'Wishlist',
    component: WishlistScreen,
  },
  {
    name: 'OrderDetails',
    component: OrderDetailsScreen,
  },
  {
    name: 'SelectAddress',
    component: SelectAddressScreen,
  },
  {
    name: 'Failure',
    component: FailureScreen,
  },
  {
    name: 'Success',
    component: SuccessScreen,
  },
  {
    name: 'Account',
    component: AccountScreen,
  },
  {
    name: 'UpdateAddress',
    component: UpdateAddressScreen,
  },
  {
    name: 'FaqScreen',
    component: FaqScreen,
  },
  {
    name: 'ContactScreen',
    component: ContactScreen,
  },
  {name: 'BusinessDetails', component: BusinessDetailsScreen},
  {name: 'RFQ', component: RFQScreen},
  {name: 'Auth', component: AuthScreen},
  {name: 'AuthEmail', component: AuthEmailScreen},
  {name: 'LoginWithOTP', component: LoginWithOTPScreen},
  {name: 'LoginWithPassword', component: LoginWithPasswordScreen},
  {name: 'ForgotPassword', component: ForgotPasswordScreen},
  {name: 'ResetPassword', component: ResetPasswordScreen},
  {name: 'VerifyOtp', component: VerifyOtpScreen},
  {name: 'SignupWithPhone', component: SignupWithPhoneScreen},
  {name: 'SignupWithEmail', component: SignupWithEmailScreen},
  {name: 'ChangePassword', component: ChangePasswordScreen},
  {name: 'EmailPhoneVerify', component: EmailPhoneVerify},
  {name: 'VerifyEmailPhoneOtp', component: VerifyEmailPhoneOtp},
];

export const States = [
  {label: 'State', value: ''},
  {label: 'Andhra Pradesh', value: '313'},
  {
    label: 'Arunachal Pradesh',
    value: '314',
  },
  {label: 'Assam', value: '315'},
  {label: 'Bihar', value: '316'},
  {label: 'Chhattisgarh', value: '317'},
  {label: 'Goa', value: '318'},
  {label: 'Gujarat', value: '319'},
  {label: 'Haryana', value: '320'},
  {
    label: 'Himachal Pradesh',
    value: '321',
  },
  {
    label: 'Jammu and Kashmir',
    value: '322',
  },
  {label: 'Jharkhand', value: '323'},
  {label: 'Karnataka', value: '324'},
  {label: 'Kerala', value: '325'},
  {label: 'Madhya Pradesh', value: '326'},
  {label: 'Maharashtra', value: '327'},
  {label: 'Manipur', value: '328'},
  {label: 'Manipur', value: '328'},
  {label: 'Meghalaya', value: '329'},
  {label: 'Mizoram', value: '330'},
  {label: 'Nagaland', value: '331'},
  {label: 'Odisha', value: '332'},
  {label: 'Punjab', value: '333'},
  {label: 'Rajasthan', value: '334'},
  {label: 'Sikkim', value: '335'},
  {label: 'Tamil Nadu', value: '336'},
  {label: 'Tripura', value: '337'},
  {label: 'Uttarakhand', value: '338'},
  {label: 'Uttar Pradesh', value: '339'},
  {label: 'West Bengal', value: '340'},
  {
    label: 'Andaman and Nicobar Islands',
    value: '341',
  },
  {label: 'Chandigarh', value: '342'},
  {
    label: 'Dadra and Nagar Haveli',
    value: '343',
  },
  {label: 'Daman and Diu', value: '344'},
  {label: 'Delhi', value: '345'},
  {label: 'Lakshadweep', value: '346'},
  {label: 'Puducherry', value: '347'},
  {label: 'Telangana', value: '348'},
];

const testingoos = {
  data: {
    MSN39YRM2V4N5Q: {
      updates: {priceWithoutTax: 0, mrp: 0, outOfStockFlag: 1},
      productDetails: {
        mrp: 0,
        sellingPrice: 0,
        oos: true,
        quantityAvailable: 0,
        incrementUnit: 1,
        moq: 1,
        productName: 'TEST-2',
        taxPercentage: 5,
        priceWithoutTax: 0,
        status: true,
        bulkPrices: {
          india: [
            {
              id: null,
              shoppingCartItemId: null,
              cartId: null,
              minQty: 2,
              maxQty: 4,
              discount: 0.2,
              active: true,
              bulkSPWithoutTax: 0,
              bulkSellingPrice: 0,
              categoryCode: 116111700,
              updatedOn: null,
              createdOn: null,
            },
            {
              id: null,
              shoppingCartItemId: null,
              cartId: null,
              minQty: 5,
              maxQty: 7,
              discount: 0.6,
              active: true,
              bulkSPWithoutTax: 0,
              bulkSellingPrice: 0,
              categoryCode: 116111700,
              updatedOn: null,
              createdOn: null,
            },
            {
              id: null,
              shoppingCartItemId: null,
              cartId: null,
              minQty: 8,
              maxQty: 10,
              discount: 1.2,
              active: true,
              bulkSPWithoutTax: 0,
              bulkSellingPrice: 0,
              categoryCode: 116111700,
              updatedOn: null,
              createdOn: null,
            },
            {
              id: null,
              shoppingCartItemId: null,
              cartId: null,
              minQty: 11,
              maxQty: 2147483647,
              discount: 1.99,
              active: true,
              bulkSPWithoutTax: 0,
              bulkSellingPrice: 0,
              categoryCode: 116111700,
              updatedOn: null,
              createdOn: null,
            },
          ],
        },
      },
    },
  },
  status: 200,
};

export const PAYMENT_MODES = [
  {
    title: 'EMI',
    screenName: 'EmiScreen',
    component: null,
    isAccordion: false,
    isAmountLess: false,
    icon: 'calendar-clock',
  },
  {
    title: 'Credit/Debit Card',
    screenName: 'Credit/Debit Card',
    isAccordion: true,
    icon: 'credit-card-multiple',
  },
  {
    title: 'Net Banking',
    screenName: 'Net Banking',
    isAccordion: true,
    icon: 'bank',
    imageIcon: '../../assets/images/NetBanking.png',
    iconType: 'imageico',
  },
  {
    title: 'Wallet',
    screenName: 'Wallet',
    isAccordion: true,
    icon: 'wallet',
  },
  {
    title: 'Cash On Delivery',
    screenName: 'CodScreen',
    isAccordion: true,
    icon: 'cash',
  },
  {
    title: 'UPI',
    screenName: 'UPI',
    isAccordion: true,
    icon: 'fast-forward',
    iconType: 'imageico',
    imageIcon: '../../assets/images/bhim_upi1.png',
  },
  {
    title: 'Paytm UPI',
    screenName: 'Paytm UPI',
    isAccordion: true,
    icon: 'contactless-payment',
    iconType: 'imageico',
    imageIcon: '../../assets/images/paytm.png',
  },
];

export const emiCards = [
  {title: 'Credit Cards', value: 'credit_card'},
  {title: 'Debit Cards', value: 'debit_card'},
];

export const SOCKET_URL = 'https://socket.moglix.com';

export const emiBanks = [
  {title: 7, value: 'AXIS Bank Credit Card'},
  {title: 15, value: 'HDFC Bank Credit Card'},
  {title: 21, value: 'ICICI Bank Credit Card'},
  {title: 'onecard', value: 'onecard'},
  {title: 'SCB', value: 'Standard Chartered Bank Credit Card'},
  {title: 'YES', value: 'YES Bank Credit Card'},
  {title: 'ICICID', value: 'ICICI Bank Debit Card'},
  {title: 'AXISD', value: 'Axis Bank Debit Card'},
  {title: 'BAJFIN', value: 'Bajaj Finserv No Cost EMI Card'},
  {title: 'BAJAJ', value: 'Bajaj Finserv No Cost EMI Card'},
  {title: 'BOBD', value: 'Bank of Baroda Debit Card'},
  {title: 'BOB', value: 'Bank of Baroda Credit Card'},
  {title: 'FEDED', value: 'Federal Bank Debit Card'},
  {title: 'HDFCD', value: 'HDFC Debit Card'},
  {title: 'KOTAK', value: 'Kotak Mahindra Bank Credit Card'},
  {title: 'HSBC', value: 'HSBC Bank Credit Card'},
  {title: 'RBL', value: 'ICICI Bank Debit Card'},
  {title: 'INDUS', value: 'IndusInd Bank Credit Card'},
  {title: 'AXIS', value: 'Axis Bank Credit Card'},
  {title: 'HDFC', value: 'HDFC Bank Credit Card'},
  {title: 'AMEX', value: 'American Express Bank Credit Card'},
  {title: 'KOTAKD', value: 'Kotak Bank Debit Card'},
  {title: 'ICIC', value: 'ICICI Bank Credit Card'},
  {title: 'INDB', value: 'Induslnd Bank Credit Card'},
  {title: 'KKBK', value: 'Kotak Mahindra Bank Credit Card'},
  {title: 'RATN', value: 'RBL Bank Credit Card'},
  {title: 'SCBL', value: 'Standard Chartered Bank Credit Card'},
  {title: 'UTIB', value: 'Axis Bank Credit Card'},
  {title: 'YESB', value: 'YES Bank Credit Card'},
  {title: 'SBIN', value: 'SBI Credit Card'},
  {title: 'SBI', value: 'State Bank of India Credit Card'},
  {title: 'CITI', value: 'CITI Bank Credit Card'},
  {title: 'ICICI', value: 'ICICI Credit Card'},
  {title: 'HDFCD', value: 'HDFC Debit Card'},
  {title: 'HDFC_DC', value: 'HDFC Debit Card'},
];

export const trackStatusKeyName = {
  accepted: 'Accepted',
  confirmed: 'Processed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  exchange_delivered: 'Delivered',
  exchange_re_ex_requested: 'Exchange Requested',
  exchange_re_ex_approved: 'Exchange Approved',
  exchange_re_ex_picked: 'Exchange Picked',
  // 'exchange_return_done': 'Exchange Done',
  return_delivered: 'Delivered',
  return_re_ex_requested: 'Return Requested',
  return_re_ex_approved: 'Return Approved',
  return_re_ex_picked: 'Return Picked',
  return_return_done: 'Return Done',
  forwardR_delivered: 'Delivered',
  forwardR_re_ex_requested: 'Return Requested',
  forwardR_re_ex_rejected: 'Rejected',
  forwardE_delivered: 'Delivered',
  forwardE_re_ex_requested: 'Exchange Requested',
  forwardE_re_ex_rejected: 'Rejected',
};

export const expMonsCcDc = [
  {key: '01', value: '01'},
  {key: '02', value: '02'},
  {key: '03', value: '03'},
  {key: '04', value: '04'},
  {key: '05', value: '05'},
  {key: '06', value: '06'},
  {key: '07', value: '07'},
  {key: '08', value: '08'},
  {key: '09', value: '09'},
  {key: '10', value: '10'},
  {key: '11', value: '11'},
  {key: '12', value: '12'},
];

export const expMons = [
  {key: '01', value: 'JAN'},
  {key: '02', value: 'FEB'},
  {key: '03', value: 'MAR'},
  {key: '04', value: 'APR'},
  {key: '05', value: 'MAY'},
  {key: '06', value: 'JUN'},
  {key: '07', value: 'JUL'},
  {key: '08', value: 'AUG'},
  {key: '09', value: 'SEP'},
  {key: '10', value: 'OCT'},
  {key: '11', value: 'NOV'},
  {key: '12', value: 'DEC'},
];

export const emailRegex =
  '^[a-zA-Z0-9]([\\._a-zA-Z0-9])*[a-zA-Z0-9]@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,6}(\\.[a-zA-Z]{2,6})?$';
export const gstinRegex =
  '^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$';
export const addressLineRegex = "^[a-zA-Z0-9_/,'()&-. ]+$";
