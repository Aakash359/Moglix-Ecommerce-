import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {fetchPaymentMethods} from '../../redux/actions/payment';
import {updateCart} from '../../redux/actions/cart';
import Creditdebit from './Creditdebit';
import Cod from './Cod';
import NetBanking from './NetBanking';
import Wallet from './Wallet';
import UPI from './UPI';
import PaytmUPI from './PaytmUPI';
import EMI from './EMI';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PAYMENT_MODES} from '../../constants/index';
import {STATE_STATUS} from '../../redux/constants';
import {getPaymentId, payApi} from '../../services/payment';
import styles from './style';
import {applyThousandSeparator} from '../../generic';
import colors from '../../redux/constants/colors';
import Toast from 'react-native-toast-message';
import TextCarousel from 'react-native-text-carousel';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';

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

const PaymentScreen = props => {
  let scrollRef = useRef();
  const {shoppingCartDto, address, servicable} = props.route.params;
  const invoiceType =
    shoppingCartDto.addressList[0].invoiceType === 'retail' ? 'retail' : 'tax';
  const gateWay =
    shoppingCartDto.addressList[0].invoiceType === 'retail'
      ? 'payu'
      : 'razorpay';

  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const paymentDetails = useSelector(
    state => (state.paymentReducer[gateWay] || {}).data || {},
  );
  const paymentDetailsStatus = useSelector(
    state =>
      (state.paymentReducer[gateWay] || {}).status || STATE_STATUS.UNFETCHED,
  );

  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});

  let paymentRef = useRef();

  const dispatch = useDispatch();

  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentMethods(gateWay, sessionId, token));
  }, []);

  useEffect(() => {
    if (paymentDetailsStatus == STATE_STATUS.FETCHED) {
      let catL1 = [];
      let catL2 = [];
      let catL3 = [];
      let prices = [];
      let msns = [];
      let brand = [];
      let products = [];
      let totalQuantity = 0;
      let quantities = [];
      if (itemsList && itemsList.length) {
        (itemsList || []).forEach(item => {
          let cats = item.taxonomyCode.split('/');
          prices.push(item.productUnitPrice);
          msns.push(item.productId);
          brand.push(item.brandName);
          quantities.push(item.productQuantity);
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
      }
      let couponId = '';
      let cartOffer;
      if (!cart.cart.totalOffer) {
        cartOffer = 0;
      } else {
        cartOffer = cart.cart.totalOffer;
      }
      if (cart.offersList && cart.offersList.length) {
        couponId = cart.offersList[0].offerId;
      }
      trackStateAdobe('moglix:order checkout:payment methods', {
        'myapp.pageName': 'moglix:order checkout:payment methods',
        'myapp.channel': 'checkout',
        'myapp.subSection': 'moglix:order checkout:payment',
        'myapp.productCategoryL1': catL1.join('|'),
        'myapp.productCategoryL2': catL2.join('|'),
        'myapp.productCategoryL3': catL3.join('|'),
        'myapp.productID': msns.join('|'),
        'myapp.totalDiscount': `${cartOffer}`,
        'myapp.totalQuantity': `${totalQuantity}`,
        'myapp.couponCodeID': couponId,
        'myapp.quantity': quantities.join('|'),
        'myapp.totalPrice': `${Math.ceil(
          cart.cart.totalAmount + cart.cart.shippingCharges - cartOffer,
        )}`,
        'myapp.productPrice': prices.join('|'),
        'myapp.invoiceType': invoiceType,
        'myapp.brand': brand.join('|'),
        '&&events': 'event15',
        '&&products': products.join(','),
      });
      clickStreamPageLoad();
    }
  }, [paymentDetailsStatus]);

  // validateCheckout(() => {
  //   props.navigation.navigate('Failure');
  // })

  const clickStreamPageLoad = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    if (itemsList && itemsList.length) {
      itemsList.forEach(item => {
        totalPrice = totalPrice + item.totalPayableAmount;
        totalQuantity = totalQuantity + item.productQuantity;
      });
    }
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'Payment Page',
      channel: 'Checkout',
      price: totalPrice,
      quantity: totalQuantity,
      invoiceType: invoiceType,
    };
    sendClickStreamData(dataTracking);
  };

  const clickStreamPageCheckoutStarted = successParams => {
    let totalPrice = 0;
    let totalQuantity = 0;
    if (itemsList && itemsList.length) {
      itemsList.forEach(item => {
        totalPrice = totalPrice + item.totalPayableAmount;
        totalQuantity = totalQuantity + item.productQuantity;
      });
    }
    let dataTracking = {
      event_type: 'page_load',
      label: 'checkout_started',
      page_type: 'Checkout',
      channel: 'Checkout',
      price: totalPrice,
      quantity: totalQuantity,
      paymentMode: modeMap.hasOwnProperty(successParams)
        ? modeMap[successParams]
        : '',
    };
    sendClickStreamData(dataTracking);
  };

  const pay = async () => {
    if (selectedPaymentMode && selectedPaymentMode != 'Cash On Delivery') {
      if (paymentRef && paymentRef.current && paymentRef.current.payRequest) {
        paymentRef.current.payRequest();
      }
    } else {
      if (selectedPaymentMode == 'Cash On Delivery') {
        if (cart && cart.cart && cart.cart.totalPayableAmount < 300) {
          Toast.show({
            type: 'error',
            text2: 'COD not available below Rs.300',
            visibilityTime: 2000,
            autoHide: true,
          });
        } else if (cart && cart.cart && cart.cart.totalPayableAmount > 25000) {
          Toast.show({
            type: 'error',
            text2: 'COD not available above Rs.25000',
            visibilityTime: 2000,
            autoHide: true,
          });
        } else {
          try {
            setLoader(true);
            const {data} = await getPaymentId(userId, sessionId, token);
            let validatorObj = {
              mode: 'COD',
              paymentId: 13,
              platformCode: 'online',
              requestParams: null,
              transactionId: data.data.transactionId,
              validatorRequest: {
                shoppingCartDto: {
                  ...shoppingCartDto,

                  offersList: shoppingCartDto.offersList?.length
                    ? shoppingCartDto.offersList
                    : null,

                  cart: {
                    ...shoppingCartDto.cart,
                    createdAt: null,
                    updatedAt: null,
                    totalOffer: shoppingCartDto.cart.totalOffer || 0,
                    totalAmountWithOffer:
                      shoppingCartDto.cart.totalAmountWithOffer || 0,
                    taxes: shoppingCartDto.cart.taxes || 0,
                    isGift: shoppingCartDto.cart.isGift || false,
                    giftPackingCharges:
                      shoppingCartDto.cart.giftPackingCharges || 0,
                    currency: 'INR',
                  },
                  payment: {
                    paymentMethodId: 13,
                    type: 'COD',
                  },
                },
              },
            };
            const {data: objectRes} = await payApi(
              validatorObj,
              sessionId,
              token,
            );
            if (objectRes.data && objectRes.data.status == 'success') {
              setLoader(false);
              webEngageCheckoutEvent(objectRes.data);
              clickStreamPageCheckoutStarted(objectRes.data);
              props.navigation.navigate('Success', {
                response: objectRes,
                invoiceType: invoiceType,
              });
            } else {
              setLoader(false);
              Toast.show({
                type: 'error',
                text2: data.description,
                visibilityTime: 2000,
                autoHide: true,
              });
            }
          } catch (error) {
            setLoader(false);
            console.log(error);
          }
        }
      } else {
        setLoader(false);
        Toast.show({
          type: 'error',
          text2: 'Select a payment method',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  const webEngageCheckoutEvent = successParams => {
    let webEngageObj = {
      'Category Code': '',
      Currency: 'INR',
      GST: invoiceType === 'retail' ? 'NO' : 'YES',
      'Parent Category Code': '',
      'Payment Mode': modeMap.hasOwnProperty(successParams)
        ? modeMap[successParams]
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

    webEngageTracking('checkoutStarted', webEngageObj);
    webEngageScreenTracking('PaymentScreen', {
      price: totalPrice,
    });
  };

  const updateCartObj = updatedCart => {
    dispatch(updateCart(updatedCart));
  };

  return (
    <View style={styles.selectAddPage}>
      <View style={styles.headerView}>
        <View style={styles.headerFlex}>
          <MaterialCommunityIcon
            onPress={() => props.navigation.goBack()}
            name={'arrow-left'}
            style={styles.headerIcon}
            size={24}
          />
          <Text style={styles.filtHeading}>Payments</Text>
        </View>
      </View>
      <View style={styles.bottomHeaderWrap}>
        <View style={styles.bottomHeaderTop}>
          <View style={styles.textWrap}>
            <Text style={styles.headerTitle}>Address</Text>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.headerTitle}>Payment</Text>
          </View>
        </View>
        <View style={styles.ProgressBar}>
          <View style={[styles.greenLine, styles.Pwidth1]}></View>
          <View style={styles.greenDot}></View>
          <View style={[styles.greenLine, styles.Pwidth2]}></View>
          <View style={styles.greenDot}></View>
          <View style={[styles.greenLine, styles.Pwidth2]}></View>
          <View style={styles.greenDot}></View>
          <View style={[styles.greenLine, styles.Pwidth1]}></View>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        style={[styles.paymentElementWrap, styles.scrollViewPg]}>
        <View style={styles.headingWrap} />
        {/* <Text style={styles.headingTitle}>Payment Mode</Text> */}
        <View style={styles.paymentElementInner}>
          {PAYMENT_MODES.map((_, key) => (
            <>
              <TouchableOpacity
                key={key}
                onPress={() => {
                  // cart && cart.cart && cart.cart.totalPayableAmount) || 0
                  if (
                    _.title == 'EMI' &&
                    ((cart && cart.cart && cart.cart.totalPayableAmount) || 0) <
                      3000
                  ) {
                    Toast.show({
                      type: 'error',
                      text2: 'Not available below Rs.3000',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                  } else if (
                    _.title == 'Cash On Delivery' &&
                    ((cart && cart.cart && cart.cart.totalPayableAmount) || 0) <
                      300
                  ) {
                    Toast.show({
                      type: 'error',
                      text2: 'COD not available below Rs.300',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                  } else if (
                    _.title == 'Cash On Delivery' &&
                    ((cart && cart.cart && cart.cart.totalPayableAmount) || 0) >
                      25000
                  ) {
                    Toast.show({
                      type: 'error',
                      text2: 'COD not available above Rs. 25000',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                  } else if (_.title == 'Cash On Delivery' && !servicable) {
                    Toast.show({
                      type: 'error',
                      text2: 'COD not available on this order',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                  } else if (_.title == 'EMI') {
                    props.navigation.navigate('Emi', {
                      paymentRef,
                      shoppingCartDto,
                      invoiceType,
                      gateWay,
                      sessionId,
                      token,
                    });
                  } else {
                    setSelectedPaymentMode(
                      selectedPaymentMode == _.title ? null : _.title,
                    );
                  }
                }}
                style={styles.paymentElement}>
                <View style={styles.payTypeRow}>
                  {_.title == 'Paytm UPI' ? (
                    <Image
                      source={require('../../assets/images/paytm.png')}
                      style={styles.paytmUpiRoundLogo}
                      resizeMode="contain"
                    />
                  ) : _.title == 'UPI' ? (
                    <Image
                      source={require('../../assets/images/bhim_upi1.png')}
                      style={styles.UpiRoundLogo}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={_.icon}
                      size={24}
                      color={colors.PrimaryTextColor}
                    />
                  )}

                  <Text style={styles.paymentElementTxt}>{_.title}</Text>
                </View>
                {_.title == 'EMI' ? (
                  <View style={{right: 105}}>
                    <View style={styles.emiAnimationText}>
                      <TextCarousel interval={1300}>
                        <TextCarousel.Item>
                          <View>
                            <Text style={styles.animatedtext}>
                              Buy now pay later
                            </Text>
                          </View>
                        </TextCarousel.Item>
                        <TextCarousel.Item>
                          <View>
                            <Text style={styles.animatedtext}>
                              use debit/credit card
                            </Text>
                          </View>
                        </TextCarousel.Item>
                        <TextCarousel.Item>
                          <View>
                            <Text style={styles.animatedtext}>
                              with 0% interest
                            </Text>
                          </View>
                        </TextCarousel.Item>
                        <TextCarousel.Item>
                          <View>
                            <Text style={styles.animatedtext}>
                              In easy installments
                            </Text>
                          </View>
                        </TextCarousel.Item>
                      </TextCarousel>
                    </View>
                  </View>
                ) : null}
                {_.isAccordion && (
                  <MaterialCommunityIcon
                    name={
                      _.title == selectedPaymentMode
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={24}
                    color={colors.PrimaryTextColor}
                  />
                )}
              </TouchableOpacity>
              {_.title == selectedPaymentMode && selectedPaymentMode == 'EMI'
                ? props.navigation.navigate('Emi', {
                    paymentRef,
                    shoppingCartDto,
                    invoiceType,
                    gateWay,
                    sessionId,
                    token,
                  })
                : null}
              {_.title == selectedPaymentMode &&
              selectedPaymentMode == 'Credit/Debit Card' ? (
                <Creditdebit
                  setLoader={setLoader}
                  ref={paymentRef}
                  shoppingCartDto={shoppingCartDto}
                  sessionId={sessionId}
                  token={token}
                  navigation={props.navigation}
                  invoiceType={invoiceType}
                  updateCartObj={updateCartObj}
                />
              ) : null}
              {_.title == selectedPaymentMode &&
              selectedPaymentMode == 'Net Banking' ? (
                <NetBanking
                  setLoader={setLoader}
                  paymentDetails={paymentDetails.NB}
                  ref={paymentRef}
                  shoppingCartDto={shoppingCartDto}
                  sessionId={sessionId}
                  token={token}
                  navigation={props.navigation}
                  invoiceType={invoiceType}
                />
              ) : null}
              {_.title == selectedPaymentMode &&
              selectedPaymentMode == 'Wallet' ? (
                <Wallet
                  setLoader={setLoader}
                  paymentDetails={paymentDetails.WALLET}
                  ref={paymentRef}
                  shoppingCartDto={shoppingCartDto}
                  sessionId={sessionId}
                  token={token}
                  navigation={props.navigation}
                  invoiceType={invoiceType}
                />
              ) : null}
              {_.title == selectedPaymentMode &&
              selectedPaymentMode == 'UPI' ? (
                <UPI
                  setLoader={setLoader}
                  paymentDetails={paymentDetails.UPI}
                  ref={paymentRef}
                  shoppingCartDto={shoppingCartDto}
                  sessionId={sessionId}
                  token={token}
                  navigation={props.navigation}
                  invoiceType={invoiceType}
                />
              ) : null}
              {_.title == selectedPaymentMode &&
              selectedPaymentMode == 'Paytm UPI' ? (
                <PaytmUPI
                  setLoader={setLoader}
                  ref={paymentRef}
                  shoppingCartDto={shoppingCartDto}
                  sessionId={sessionId}
                  token={token}
                  navigation={props.navigation}
                  invoiceType={invoiceType}
                />
              ) : null}
              {_.title == selectedPaymentMode &&
              selectedPaymentMode == 'Cash On Delivery' ? (
                <Cod
                  servicable={servicable}
                  auth={auth}
                  address={address}
                  ref={paymentRef}
                  amountPayable={`₹${applyThousandSeparator(
                    (cart && cart.cart && cart.cart.totalPayableAmount) || 0,
                  )}`}
                />
              ) : null}
            </>
          ))}
          {/* <TouchableOpacity onPress={() => pay()}>
            <Text style={{ color: 'red', fontSize: 16, fontWeight: '600' }}>
              PAY COD
        </Text>
          </TouchableOpacity> */}
        </View>
        <View style={[styles.card, styles.paymentWrap]}>
          <Text style={styles.payHeading}>Payment Summary</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amtTextLabel}>Total Amount</Text>
            <Text style={styles.amtText}>
              ₹
              {applyThousandSeparator(
                itemsList.reduce(
                  (acc, curr) =>
                    acc + curr.priceWithoutTax * curr.productQuantity,
                  0,
                ),
              )}
            </Text>
          </View>
          <View style={[styles.amountRow, styles.noBorder]}>
            <Text style={styles.amtTextLabel}>Total Tax</Text>
            <Text style={styles.amtText}>
              ₹
              {applyThousandSeparator(
                itemsList.reduce(
                  (acc, curr) =>
                    acc +
                    (curr.productUnitPrice - curr.priceWithoutTax) *
                      curr.productQuantity,
                  0,
                ),
              )}
            </Text>
          </View>
          <View style={[styles.amountRow, styles.noBorder]}>
            <Text style={styles.amtTextLabel}>Total Shipping</Text>
            <Text style={styles.amtText}>
              ₹{(cart && cart.cart && cart.cart.shippingCharges) || 0}
            </Text>
          </View>
          <View style={[styles.amountRow, styles.noBorder]}>
            <Text style={styles.amtTextLabel}>Total Coupon Discount</Text>
            <Text style={(styles.amtText, styles.greenAmtText)}>
              - ₹{((cart && cart.cart && cart.cart.totalOffer) || 0).toFixed(0)}
            </Text>
          </View>
          <View style={styles.totalAmountRow}>
            <Text style={styles.totalAmtTextLabel}>Amount Payable</Text>
            <Text style={styles.totalAmtText}>
              ₹
              {applyThousandSeparator(
                Number(
                  itemsList.reduce(
                    (acc, curr) =>
                      acc + curr.priceWithoutTax * curr.productQuantity,
                    0,
                  ),
                ) +
                  Number(
                    itemsList.reduce(
                      (acc, curr) =>
                        acc +
                        (curr.productUnitPrice - curr.priceWithoutTax) *
                          curr.productQuantity,
                      0,
                    ),
                  ) +
                  Number(
                    (cart && cart.cart && cart.cart.shippingCharges) || 0,
                  ) -
                  Number((cart && cart.cart && cart.cart.totalOffer) || 0),
              )}
            </Text>
          </View>
        </View>
        <View style={styles.parentWraper}>
          <View style={styles.TopCatWrap}>
            <View style={styles.TopCatImgWrap}>
              <Image
                source={require('../../assets/images/AuthenticPrd.png')}
                style={styles.TopCatImg}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.TopCatName} numberOfLines={2}>
              Authentic Products
            </Text>
          </View>
          <View style={styles.TopCatWrap}>
            <View style={styles.TopCatImgWrap}>
              <Image
                source={require('../../assets/images/secure-payment.png')}
                style={styles.TopCatImg}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.TopCatName}>Secure Payments</Text>
          </View>
          <View style={styles.TopCatWrap}>
            <View style={styles.TopCatImgWrap}>
              <Image
                source={require('../../assets/images/Return7.png')}
                style={styles.TopCatImg}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.TopCatName}>Upto 7 days returnable</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <View style={styles.leftAmt}>
          <View style={styles.amtWrap}>
            <Text style={styles.payable}>Amount Payable</Text>
            <MaterialCommunityIcon
              onPress={() => scrollRef?.current.scrollToEnd({animated: true})}
              name={'information'}
              style={styles.infoIcon}
              size={16}
            />
          </View>
          <Text style={styles.totalAmtinBottom}>
            ₹
            {applyThousandSeparator(
              Number(
                itemsList.reduce(
                  (acc, curr) =>
                    acc + curr.priceWithoutTax * curr.productQuantity,
                  0,
                ),
              ) +
                Number(
                  itemsList.reduce(
                    (acc, curr) =>
                      acc +
                      (curr.productUnitPrice - curr.priceWithoutTax) *
                        curr.productQuantity,
                    0,
                  ),
                ) +
                Number((cart && cart.cart && cart.cart.shippingCharges) || 0) -
                Number((cart && cart.cart && cart.cart.totalOffer) || 0),
            )}
          </Text>
        </View>
        <TouchableOpacity
          onPress={pay}
          disabled={!selectedPaymentMode || loader}
          style={[
            styles.redBtn,
            {
              backgroundColor: !selectedPaymentMode
                ? colors.lightGrayText
                : colors.RedThemeColor,
            },
          ]}>
          {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
          <Text style={[styles.redBtnText]}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;
