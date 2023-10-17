import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View, TouchableOpacity, Dimensions, Image} from 'react-native';
import Header from '../../components/Common/Header';
import Dimension from '../../redux/constants/dimensions';
import styles from './style';
import {
  trackAdjust,
  webEngageTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import {setOrderedTime} from '../../redux/actions/orders';

const modeMap = {
  CC: 'Credit Card',
  DC: 'Debit Card',
  COD: 'Cash On Delivery',
  NEFT: 'NEFT',
  NB: 'Net Banking',
  WALLET: 'Wallet',
  PAYTM: 'Paytm',
  'PAYTM-UPI': 'PAYTM-UPI',
  MOBIKWIK: 'Mobikwik',
  UPI: 'UPI [Tez]',
  CASH: 'PayU Wallet',
  RAZORPAY: 'RazorPay',
  EMI: 'EMI',
};

const FailureScreen = props => {
  const failureParams =
    props.route.params.response && props.route.params.response.response;

  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );

  const paymentMethod = modeMap.hasOwnProperty(failureParams.mode)
    ? modeMap[failureParams.mode]
    : '';

  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const dispatch = useDispatch();

  useEffect(() => {
    webEngageFailureEvent();
    adobeFailureTrackEvent();
    clickStreamPageLoad();
    dispatch(setOrderedTime(new Date().getTime()));
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'order_failure',
      page_type: 'order_confirmation',
      channel: 'Checkout',
      url: ` https://www.moglix.com/order-confirmation?mode=${paymentMethod}&orderId=${failureParams.orderId}&transactionAmount=${failureParams.orderAmountt}`,
      invoiceType: (props.route.params && props.route.params.invoiceType) || '',
      paymentMode: modeMap.hasOwnProperty(failureParams.mode)
        ? modeMap[failureParams.mode]
        : '',
    };
    sendClickStreamData(dataTracking);
  };

  const webEngageFailureEvent = () => {
    let webEngageObj = {};

    if (failureParams.orderId) {
      webEngageObj['Transaction Id'] = failureParams.orderId;
    }

    webEngageObj['Transaction Amount'] =
      failureParams && failureParams.orderAmount;
    webEngageObj['Parent Category Code'] = '';
    webEngageTracking('transactionFailure', webEngageObj);
  };

  const adobeFailureTrackEvent = () => {
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
    let products = [];
    let totalQuantity = 0;
    (itemsList || []).forEach(item => {
      let cats = item.taxonomyCode.split('/');
      prices.push(item.productUnitPrice);
      msns.push(item.productId);
      brand.push(item.brandName);
      totalQuantity = totalQuantity + item.productQuantity;
      products.push(
        ';' +
          item.productId +
          ';' +
          item.productQuantity +
          ';' +
          item.productUnitPrice * item.productQuantity +
          ';',
      );
      if (cats[0]) {
        catL1.push(cats[0]);
      }
      if (cats[1]) {
        catL2.push(cats[1]);
      }
      if (cats[2]) {
        catL3.push(cats[2]);
      }
    });

    let couponId = '';
    if (cart.offersList && cart.offersList.length) {
      couponId = cart.offersList[0].offerId;
    } else {
      couponId = '';
    }

    let cartOffer;
    if (!cart.cart.totalOffer) {
      cartOffer = 0;
    } else {
      cartOffer = cart.cart.totalOffer;
    }

    trackStateAdobe('moglix:payment failure', {
      'myapp.pageName': 'moglix:payment success',
      'myapp.channel': 'failure',
      'myapp.subSection': 'moglix:payment failure',
      'myapp.couponCodeID': couponId.toString(),
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
      'myapp.totalDiscount': cartOffer,
      'myapp.totalQuantity': totalQuantity,
      'myapp.totalPrice': Math.ceil(
        cart.cart.totalAmount + cart.cart.shippingCharges - cartOffer,
      ),
      'myapp.productPrice': prices.join('|'),
      'myapp.shippingCharges': cart.cart.shippingCharges,
      'myapp.brand': brand.join('|'),
      'myapp.paymentMethod': modeMap.hasOwnProperty(failureParams.mode)
        ? modeMap[failureParams.mode]
        : '',
      'myapp.invoiceType': '',
      'myapp.transactionID': `${failureParams.orderId}`,
      '&&products': products.join(','),
      '&&events': 'purchase,event23:' + `${failureParams.orderId}`,
    });
  };

  return (
    <View style={styles.failureView}>
      <Header navigation={props.navigation} showLogo showWishlist />
      <View style={styles.failureInnerView}>
        <View style={styles.topWrap}>
          <Text
            numberOfLines={1}
            style={[styles.SuccessText, styles.failureText]}>
            Transaction Declined
          </Text>
          <Text style={styles.FailureNormaltext}>
            Transaction was declined due to some technical{'\n'} reason/fault
          </Text>

          <Image
            style={styles.failureImg}
            resizeMode="contain"
            source={require('../../assets/images/transaction_decline1.png')}
          />
          <Text style={styles.FailureBoldtext}>
            We're having trouble processing {'\n'} your request.
          </Text>
          <Text style={styles.FailureSmalltext}>
            - This may be because our system is down temporarily.
          </Text>
          <Text style={styles.FailureSmalltext}>
            - May be there's a problem with the connection.
          </Text>
        </View>
        <View style={styles.cartOrderView}>
          <View style={styles.cartView}>
            <TouchableOpacity
              style={[styles.viewOrderBtn, styles.cartOrderBtn]}
              onPress={() => {
                props.navigation.replace('Orders');
              }}>
              <Text style={[styles.viewOrderBtnText, styles.btnText]}>
                VIEW ORDER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shopMoreBtn, styles.cartOrderBtn]}
              onPress={() => {
                props.navigation.navigate('Home');
              }}>
              <Text style={[styles.shopMoreBtnText, styles.btnText]}>
                SHOP MORE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FailureScreen;
