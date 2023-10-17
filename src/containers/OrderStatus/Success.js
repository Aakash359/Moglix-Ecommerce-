import React, {useEffect, useState} from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProductListView from '../../components/Common/ProductListView';
import {setCart} from '../../redux/actions/cart';
import {updateCartApi} from '../../services/cart';
import styles from './style';
import {Header} from '../../components/Common/Header';
import Dimension from '../../redux/constants/dimensions';
import Modal from 'react-native-modal';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
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

const SuccessScreen = props => {
  const successParams =
    props.route.params.response && props.route.params.response.data;
  const invoiceType = props.route.params.invoiceType;
  const dispatch = useDispatch();
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const paymentMethod = modeMap.hasOwnProperty(successParams.mode)
    ? modeMap[successParams.mode]
    : '';
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [ratingModal, setRatingModal] = useState(false);
  const openRatingModal = () => {
    setRatingModal(!ratingModal);
  };

  const onEmptyCart = async () => {
    let emptyCart = {
      cart: {
        cartId: cart.cart.cartId,
        sessionId: cart.cart.sessionId,
        agentId: cart.cart['agentId'],
        userId: auth.userId,
        isPersistant: true,
        createdAt: null,
        updatedAt: null,
        closedAt: null,
        orderId: null,
        totalAmount: null,
        totalOffer: 0,
        totalAmountWithOffer: 0,
        taxes: 0,
        totalAmountWithTaxes: null,
        shippingCharges: null,
        currency: null,
        isGift: false,
        giftMessage: null,
        giftPackingCharges: 0,
        totalPayableAmount: null,
      },
      itemsList: [],
      addressList: null,
      payment: null,
      deliveryMethod: null,
      offersList: null,
    };
    const {data} = await updateCartApi(emptyCart, sessionId, token);
    dispatch(setCart(data));
  };

  const rateMoglix = () => {
    /* InAppReview.RequestInAppReview(); */
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:payment success',
      'myapp.channel': 'purchase',
      'myapp.ctaname': 'rate 5 star',
      'myapp.subSection': 'moglix:payment success',
      '&&events': 'event39',
    });
    if (Platform.OS == 'android') {
      Linking.openURL(
        'http://play.google.com/store/apps/details?id=com.moglix.online&hl=en',
      );
    } else {
      Linking.openURL(
        'https://apps.apple.com/in/app/moglix-best-industrial-app/id1493763517',
      );
    }
  };

  useEffect(() => {
    adjustSuccessEvent();
    webEngageSucessEvent();
    adobeSuccessTrackEvent();
    clickStreamPageLoad();
    dispatch(setOrderedTime(new Date().getTime()));

    return () => {
      onEmptyCart();
    };
  }, []);

  const adjustSuccessEvent = () => {
    var adjustEvent = new AdjustEvent('t7loox');
    let prices = [];
    let msns = [];
    let totalQuantity = 0;

    (itemsList || []).forEach(item => {
      prices.push(item.productUnitPrice);
      msns.push(item.productId);
      totalQuantity = totalQuantity + item.productQuantity;
    });

    adjustEvent.addPartnerParameter('id', msns.join('|'));
    adjustEvent.addPartnerParameter('price', prices.join('|'));
    adjustEvent.addPartnerParameter('quantity', String(totalQuantity));
    adjustEvent.addPartnerParameter(
      'orderId',
      String(successParams && successParams.orderId),
    );
    adjustEvent.addPartnerParameter('currency', 'INR');
    adjustEvent.setRevenue(successParams && successParams.orderAmount, 'INR');
    adjustEvent.setTransactionId('' + successParams.orderId);
    trackAdjust(adjustEvent);
  };

  const webEngageSucessEvent = () => {
    let webEngageObj = {
      'Category Code': '',
      Currency: 'INR',
      GST: invoiceType === 'retail' ? 'NO' : 'YES',
      'Parent Category Code': '',
      'Payment Mode': modeMap.hasOwnProperty(successParams.mode)
        ? modeMap[successParams.mode]
        : '',
      'Product Array': [],
      'Product Id': '',
      'Product Name': '',
      'Shipping Cost': 0,
      'Total Price': 0,
      'Total Quantity': 0,
      'Transaction Id': '',
    };
    let categoryCodes = [];
    let parentCategoryCodes = [];
    let productIds = [];
    let productNames = [];
    let totalShipping = 0;
    let totalPrice = 0;
    let totalQuantity = 0;
    if (successParams.orderId) {
      webEngageObj['Transaction Id'] = successParams.orderId;
    }

    let arr = [];
    if (itemsList && itemsList.length > 0) {
      for (let i = 0; i < itemsList.length; i++) {
        let obj = {
          item_category: itemsList[i].categoryCode,
          item_name: itemsList[i].productName,
          item_id: itemsList[i].productId,
          price: itemsList[i].totalPayableAmount,
          productImg: itemsList[i].productImg,
        };
        if (itemsList[i].taxonomyCode) {
          let categories = itemsList[i].taxonomyCode.split('/');
          categoryCodes.push(categories[categories.length - 1]);
          parentCategoryCodes.push(categories[0]);
        }
        let wobj = {
          name: obj.item_name,
          id: obj.item_id,
          price: obj.price,
          quantity: itemsList[i].productQuantity,
          image: obj.productImg,
          'screen url': 'moglix://product/' + obj.item_id,
        };
        webEngageObj['Product Array'].push(wobj);
        productIds.push(obj.item_id);
        productNames.push(obj.item_name);
        totalShipping += itemsList[i].shipping ? itemsList[i].shipping : 0;
        totalPrice += itemsList[i].totalPayableAmount
          ? itemsList[i].totalPayableAmount
          : 0;
        totalQuantity += wobj.quantity ? wobj.quantity : 0;
        arr.push(obj);
      }
      webEngageObj['Category Code'] = categoryCodes.join(',');
      webEngageObj['Parent Category Code'] = parentCategoryCodes.join(',');
      webEngageObj['Product Id'] = productIds.join(',');
      webEngageObj['Product Name'] = productNames.join(',');
      webEngageObj['Shipping Cost'] = totalShipping;
      webEngageObj['Total Price'] = totalPrice;
      webEngageObj['Total Quantity'] = totalQuantity;
    }

    webEngageTracking('checkoutCompleted', webEngageObj);
  };

  const adobeSuccessTrackEvent = () => {
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

    trackStateAdobe('moglix:payment success', {
      'myapp.pageName': 'moglix:payment success',
      'myapp.channel': 'purchase',
      'myapp.subSection': 'moglix:payment success',
      'myapp.couponCodeID': couponId.toString(),
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
      'myapp.totalDiscount': `${cartOffer}`,
      'myapp.totalQuantity': `${totalQuantity}`,
      'myapp.totalPrice': `${Math.ceil(
        cart.cart.totalAmount + cart.cart.shippingCharges - cartOffer,
      )}`,
      'myapp.productPrice': prices.join('|'),
      'myapp.shippingCharges': cart.cart.shippingCharges,
      'myapp.brand': brand.join('|'),
      'myapp.paymentMethod': modeMap.hasOwnProperty(successParams.mode)
        ? modeMap[successParams.mode]
        : '',
      'myapp.invoiceType': invoiceType,
      'myapp.transactionID': `${successParams.orderId}`,
      '&&products': products.join(','),
      '&&events': 'purchase,event23:' + `${successParams.orderId}`,
    });
  };

  const clickStreamPageLoad = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    (itemsList || []).forEach(item => {
      totalPrice = totalPrice + item.productUnitPrice;
      totalQuantity = totalQuantity + item.productQuantity;
    });

    let dataTracking = {
      event_type: 'page_load',
      label: 'order_completed',
      page_type: 'order_confirmation',
      channel: 'Checkout',
      url: ` https://www.moglix.com/order-confirmation?mode=${paymentMethod}&orderId=${successParams.orderId}&transactionAmount=${successParams.orderAmount}`,
      invoiceType: invoiceType,
      paymentMode: modeMap.hasOwnProperty(successParams.mode)
        ? modeMap[successParams.mode]
        : '',
      totalPrice: totalPrice,
      totalQuantity: totalQuantity,
    };
    sendClickStreamData(dataTracking);
  };

  return (
    <View>
      {/* <Header navigation={props.navigation} showLogo /> */}
      <ScrollView>
        <View style={styles.successWrap}>
          <View style={styles.topWrap}>
            <Text numberOfLines={1} style={styles.SuccessText}>
              Order Placed Successfully
            </Text>
            <Image
              style={styles.successImg}
              source={require('../../assets/images/order_placed1.png')}
              resizeMode="contain"
            />
            <Text style={styles.FailureNormaltext}>
              Hi {auth.userName}! Thank you for your order. We’ll send a
              confirmation when your order ships.
            </Text>
          </View>
        </View>
        <View style={styles.prodListHorz}>
          <View style={styles.orderIdRow}>
            <Text style={styles.ordId}>Order ID : {successParams.orderId}</Text>
            <Text style={styles.ordItemCounts}>
              {cart.itemsList.length} Items
            </Text>
          </View>
          <ScrollView horizontal={true}>
            {(cart.itemsList || []).map((item, index) => (
              <ProductListView
                key={index}
                parentStyles={styles.prodListView}
                fromHome
                item={item}
                navigation={props.navigation}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.successWrap}>
          <View style={styles.cartOrderView}>
            <View style={styles.cartView}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Orders')}
                style={[styles.viewOrderBtn, styles.cartOrderBtn]}>
                <Text style={[styles.viewOrderBtnText, styles.btnText]}>
                  VIEW ORDER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Home')}
                style={[styles.shopMoreBtn, styles.cartOrderBtn]}>
                <Text style={[styles.shopMoreBtnText, styles.btnText]}>
                  SHOP MORE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rateWrap}>
            <View style={styles.rateContent}>
              <Image
                source={require('../../assets/images/rate_us_star.png')}
                style={styles.rateusImg}
              />
              <View style={styles.rateText}>
                <Text style={styles.rateusBoldtext}>Like the Moglix App !</Text>
                <Text style={styles.rateusSmalltext}>
                  {Platform.OS == 'android'
                    ? 'Rate us on Play Store.'
                    : 'Rate us on App Store.'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.shopMoreBtn} onPress={rateMoglix}>
              <Text style={styles.shopMoreBtnText}>RATE US</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal isVisible={ratingModal}>
        <View style={styles.ratingModalInner}>
          <Text style={styles.rateModalHeading}>Did you like the app?</Text>
          <Image
            source={require('../../assets/images/star_rating.png')}
            style={styles.modalcoupenImg}
            resizeMode="contain"
          />
          <Text style={styles.userText}>
            Hi <Text style={styles.boldName}>{auth.userName},</Text>
            {'\n'}take a minute to rate this app{'\n'} and help support to
            improve more {'\n'}new features
          </Text>
          <TouchableOpacity onPress={rateMoglix} style={styles.rateUsBtn}>
            <Text style={styles.rateUsBtnText}>RATE US NOW</Text>
          </TouchableOpacity>
          <View style={styles.rateActions}>
            <TouchableOpacity onPress={openRatingModal}>
              <Text style={styles.actionText}>NO,THANKS</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openRatingModal}>
              <Text style={styles.actionText}>REMIND ME LATER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SuccessScreen;
