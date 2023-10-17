import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  fetchAddressByInvoiceType,
  setShippingAddress,
} from '../../redux/actions/address';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {applyThousandSeparator} from '../../generic';
import {updateWishlist} from '../../redux/actions/wishlist';
import {
  removeProduct,
  updateQuantity,
  requestshippingValue,
  applyCouponCode,
  removePromo,
  viewOffers,
  validateCart,
  removeMultipleProducts,
} from '../../generic/Cart/index';
import {
  validateProductsService,
  getCustomerBusinessDetails,
  validate,
} from '../../services/address';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';
import {STATE_STATUS} from '../../redux/constants';
import colors from '../../redux/constants/colors';
import Cartcard from '../../components/Common/Cartcard';
import Coupons from '../../components/Common/Coupons';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';
import RemoveMultipleItems from '../../components/Common/RemoveMultipleItems';
import {setCartValidationMsg} from '../../services/cart';

const CheckoutScreen = props => {
  const scrollviewRef = useRef();
  const [servicable, setServicable] = useState(true);
  const [couponSuccessModal, setCouponSuccessModal] = useState(false);
  const [impCartDetails, setImpCartDetails] = useState(false);
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const cartStatus = useSelector(
    state => (state.cartReducer || {}).status || STATE_STATUS.FETCHING,
  );
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );

  const coupons = useSelector(state => (state.cartReducer || {}).coupons || []);
  const appliedPromo = useSelector(
    state => (state.cartReducer || {}).appliedCoupon || {},
  );

  const validationMsg = useSelector(state =>
    (((state.cartReducer || {}).data || {}).itemsList || [])
      .filter(_ => _.msg && _.msg.type)
      .map(_ => _.msg),
  );
  const retailaddressList = useSelector(
    state => ((state.addressReducer || {}).retail || {}).data || [],
  );
  const taxaddressList = useSelector(
    state => ((state.addressReducer || {}).tax || {}).data || [],
  );

  const addresses = useSelector(state => state.addressReducer || {});

  //state handling
  const [serviceabilityData, setserviceabilityData] = useState([]);

  const dispatch = useDispatch();

  const [invoiceType, setInvoiceType] = useState('retail');
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [initLoader, setInitLoader] = useState(true);
  const [showRemoveItems, setShowRemoveItems] = useState(false);

  let selectedAddressId = '';

  useEffect(async () => {
    try {
      // let shippingRes = await requestshippingValue(cart, sessionId, token);
      // validateCart(shippingRes, userId, sessionId, token, dispatch);
      if (
        !addresses.retail ||
        addresses.retail.status !== STATE_STATUS.FETCHED
      ) {
        dispatch(fetchAddressByInvoiceType(userId, 'retail', sessionId, token));
      }
      if (!addresses.tax || addresses.tax.status !== STATE_STATUS.FETCHED) {
        dispatch(fetchAddressByInvoiceType(userId, 'tax', sessionId, token));
      }

      adobeCheckoutTrackEvent();
      clickStreamPageLoad();
    } catch (error) {
      console.log(error);
      // validateCart(cart, userId, sessionId, token, dispatch);
    }
  }, []);

  useEffect(() => {
    if (
      addresses.retail &&
      addresses.retail.status == STATE_STATUS.FETCHED &&
      initLoader
    ) {
      setInitLoader(false);
      if (!addresses[invoiceType].activeShippingId) {
        props.navigation.navigate('UpdateAddress', {
          title: 'Delivery Address',
          invoiceType: invoiceType,
          addressKey: 'activeShippingId',
          address: {},
        });
      }
    }
  }, [addresses.retail.status]);

  useEffect(() => {
    if (
      !cart.noOfItems &&
      [STATE_STATUS.FETCHING, STATE_STATUS.UPDATED].includes(cartStatus)
    ) {
      if (props.route && props.route.params && props.route.params.fromBuyNow) {
        props.navigation.replace('Cart');
      } else {
        props.navigation.navigate('Cart');
      }
    }
  }, [cart.noOfItems]);

  useEffect(() => {
    if (
      addresses[invoiceType].activeShippingId &&
      // selectedAddressId != addresses[invoiceType].activeShippingId &&
      addresses[invoiceType].status == STATE_STATUS.FETCHED
    ) {
      selectedAddressId = addresses[invoiceType].activeShippingId;
      checkServiceability();
    }
  }, [addresses[invoiceType].activeShippingId, addresses[invoiceType].status]);

  const onMoveToWishlist = async productData => {
    const productObj = {
      brand: productData.brandName,
      category: productData.categoryCode,
      description: productData.productName,
      idProduct: productData.productId,
      idUser: userId,
      productName: productData.productName,
      userType: `business`,
    };
    await removeProduct(
      productData.productId,
      cart,
      itemsList,
      sessionId,
      token,
      dispatch,
    );
    dispatch(updateWishlist(productObj, sessionId, token, 'add'));
  };

  const checkServiceability = async () => {
    if (
      addresses[invoiceType].activeShippingId &&
      addresses[invoiceType].data.length
    ) {
      let selectedPin = addresses[invoiceType].data.find(
        _ => _.idAddress == addresses[invoiceType].activeShippingId,
      );
      let updatedItemsList = [...itemsList];
      updatedItemsList = updatedItemsList.map(_ => _.productId);
      let body = {
        productId: updatedItemsList,
        toPincode: selectedPin.postCode,
      };
      const {data} = await validateProductsService(body, sessionId, token);
      let msnIds = Object.keys(data.data);
      let codcheck = [...msnIds].filter(
        _ =>
          // _ => !data.data[_].aggregate.serviceable,
          // ||
          !data.data[_].aggregate.codAvailable,
      );

      msnIds = msnIds.filter(
        _ => !data.data[_].aggregate.serviceable,
        // ||
        // !data.data[_].aggregate.codAvailable,
      );

      setServicable(codcheck.length ? false : true);

      updatedItemsList = [...itemsList];
      updatedItemsList = updatedItemsList
        .filter(_ => msnIds.includes(_.productId))
        .map(_ => {
          return {
            ..._,
            msg: {
              type: 'unserviceable',
              data: {
                productName: _.productName,
                // text1: 'is unserviceable at your address.',
                text1: 'is not deliverable at your shipping address',
              },
            },
          };
        });
      setserviceabilityData(updatedItemsList);
    }
  };

  useEffect(() => {
    if (
      itemsList.length &&
      !(props.route && props.route.params && props.route.params.fromCart)
    ) {
      getFreeDeliveryState();
    }
    if (itemsList.length) {
      checkServiceability();
    }
    // if (
    //   (cartStatus == STATE_STATUS.FETCHED ||
    //     cartStatus == STATE_STATUS.UPDATED) &&
    //   cart.offersList &&
    //   cart.offersList.length
    //   // &&
    //   // !appliedPromo.promoId
    // ) {
    //   applyCouponCode(
    //     {promoId: cart.offersList[0].offerId},
    //     cart,
    //     sessionId,
    //     token,
    //     dispatch,
    //     true,
    //   );
    // }
  }, [itemsList.length]);

  const getFreeDeliveryState = async () => {
    let shippingRes = await requestshippingValue(cart, sessionId, token);
    validateCart(shippingRes, userId, sessionId, token, dispatch);
  };

  const updatecartQuantity = (msn, value) => {
    if (itemsList && itemsList.length) {
      (itemsList || []).forEach(it => {
        if (it.productId === msn) {
          if (value > it.productQuantity) {
            clickStreamIncrementQuantity(it, value);
          } else {
            clickStreamDecrementQuantity(it, value);
          }
        }
      });
    }

    updateQuantity(
      msn,
      value,
      cart,
      itemsList,
      sessionId,
      token,
      dispatch,
      userId,
    );
  };

  const clickStreamIncrementQuantity = (item, value) => {
    let taxo1 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[0]) || '';
    let taxo2 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[1]) || '';
    let taxo3 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[2]) || '';

    let dataTracking = {
      event_type: 'click',
      label: 'increment_quantity',
      channel: 'Checkout',
      page_type: 'address_page',
      product_name: item && item.productName,
      msn: item && item.productId,
      price: String(item && item.productUnitPrice),
      brand: item && item.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      quantity: value,
    };
    sendClickStreamData(dataTracking);
  };

  const clickStreamDecrementQuantity = (item, value) => {
    let taxo1 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[0]) || '';
    let taxo2 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[1]) || '';
    let taxo3 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[2]) || '';

    let dataTracking = {
      event_type: 'click',
      label: 'decrement_quantity',
      channel: 'Checkout',
      page_type: 'checkout_page',
      product_name: item && item.productName,
      msn: item && item.productId,
      price: String(item && item.productUnitPrice),
      brand: item && item.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      quantity: value,
    };
    sendClickStreamData(dataTracking);
  };

  const applyingCoupon = async _ => {
    await applyCouponCode(
      _,
      cart,
      sessionId,
      token,
      dispatch,
      false,
      true,
      setCouponSuccessModal,
    );
    setCouponModalVisible(false);
  };

  const adobeCheckoutTrackEvent = () => {
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
    let products = [];
    let totalQuantity = 0;
    if (itemsList && itemsList.length) {
      itemsList.forEach(item => {
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
    }
    let cartOffer;
    if (!cart.cart.totalOffer) {
      cartOffer = 0;
    } else {
      cartOffer = cart.cart.totalOffer;
    }
    trackStateAdobe('moglix:order checkout:address details', {
      'myapp.pageName': 'moglix:order checkout:address details',
      'myapp.channel': 'checkout ',
      'myapp.subSection': 'moglix:order checkout:address details',
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
      'myapp.brand': brand.join('|'),
      '&&events': 'event13',
      '&&products': products.join(','),
    });
  };

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
      page_type: 'address_page',
      channel: 'Checkout',
      price: totalPrice,
      quantity: totalQuantity,
    };
    sendClickStreamData(dataTracking);
  };

  const removeProductCart = async it => {
    await removeProduct(
      it.productId,
      cart,
      itemsList,
      sessionId,
      token,
      dispatch,
    );
    // let webengageRemoveObj = {
    //   Currency: 'INR',
    //   Price: it.totalPayableAmount,
    //   'Product Id': it.productId,
    //   'Product Image': it.productImg,
    //   'Product Name': it.productName,
    // };
    // webEngageTracking('removedfromCart', webengageRemoveObj);
    // webEngageUpdateCartEvent();
    // adoberemoveItemTrackEvent(it);
    clickStreamRemoveProduct(it);
  };

  const clickStreamRemoveProduct = item => {
    let taxo1 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[0]) || '';
    let taxo2 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[1]) || '';
    let taxo3 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[2]) || '';

    let dataTracking = {
      event_type: 'click',
      label: 'remove_from_cart',
      channel: 'Checkout',
      page_type: 'checkout_page',
      product_name: item && item.productName,
      msn: item && item.productId,
      price: String(item && item.productUnitPrice),
      brand: item && item.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
    };
    sendClickStreamData(dataTracking);
  };

  const renderitemsList = () => {
    return itemsList.length
      ? itemsList.map((_, i) => (
          <Cartcard
            {..._}
            authenticated={authenticated}
            onMoveToWishlist={onMoveToWishlist}
            navigation={props.navigation}
            updateQuantity={updatecartQuantity}
            hideCTA
            removeProduct={() => removeProductCart(_)}
          />
        ))
      : null;
  };

  const renderAppliedCoupon = () => {
    if (appliedPromo.promoId) {
      return (
        <View style={styles.promoAppliedView}>
          <View style={styles.leftPromoArea}>
            <MaterialCommunityIcon
              name={'ticket-confirmation'}
              style={styles.ticketIcon}
              size={24}
            />
            <View>
              <Text style={styles.promocode}>{appliedPromo.promoCode}</Text>
              <Text style={styles.promoSubText}>
                Coupon applied on your cart
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              removePromo(cart, itemsList, sessionId, token, dispatch)
            }>
            <Icon name={'close-circle'} size={24} color={'#979797'} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderValidationMsgs = () => {
    return cart.noOfItems &&
      (validationMsg.length || serviceabilityData.length) ? (
      <View style={styles.impUpdateCart}>
        <View style={styles.impUpdateCartText}>
          <Text style={styles.msgHeading}>
            Important update for your Cart items
          </Text>
          <TouchableOpacity
            style={styles.dropIcon}
            onPress={() => setImpCartDetails(!impCartDetails)}>
            <FAIcon
              name={impCartDetails ? 'angle-up' : 'angle-down'}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        {impCartDetails ? (
          <View>
            {serviceabilityData.length
              ? serviceabilityData.map(_ => (
                  <View style={styles.cartUpdateMsgList}>
                    <View style={styles.dot}></View>
                    <View style={styles.listText}>
                      <Text style={styles.listBlueText}>
                        {_.productName}
                        <Text style={styles.listGreyText}>
                          {' '}
                          in your cart is unserviceable at your address
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))
              : null}
            {validationMsg.length
              ? validationMsg.map((_, i) =>
                  _.type == 'price' ? (
                    <>
                      {/* <Text
                        style={{color: 'blue', fontSize: 12, fontWeight: '500'}}>
                        {_.data.productName}
                      </Text>
                      <Text
                        style={{color: '#000', fontSize: 12, fontWeight: '600'}}>
                        {_.data.text1} ₹ {_.data.oPrice} {_.data.text2} ₹{' '}
                        {_.data.nPrice}
                      </Text> */}
                      <View style={styles.cartUpdateMsgList}>
                        <View style={styles.dot}></View>
                        <View style={styles.listText}>
                          <Text style={styles.listBlueText}>
                            {_.data.productName}
                            <Text style={styles.listGreyText}>
                              {' '}
                              {_.data.text1}
                              {_.data.oPrice} {_.data.text2}
                              {_.data.nPrice}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.cartUpdateMsgList}>
                        <View style={styles.dot}></View>
                        <View style={styles.listText}>
                          <Text style={styles.listBlueText}>
                            {_.data.productName}
                            <Text style={styles.listGreyText}>
                              {' '}
                              {_.data.text1}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </>
                  ),
                )
              : null}
          </View>
        ) : null}
      </View>
    ) : null;
  };

  const toggleinvoiceType = () => {
    return (
      <TouchableOpacity
        style={styles.gstCard}
        onPress={() => {
          setInvoiceType(invoiceType == 'retail' ? 'tax' : 'retail');
          setserviceabilityData([]);
        }}>
        <Icon
          onPress={() => {
            setInvoiceType(invoiceType == 'retail' ? 'tax' : 'retail');
            setserviceabilityData([]);
          }}
          name={
            invoiceType != 'retail'
              ? 'checkbox-marked'
              : 'checkbox-blank-outline'
          }
          size={22}
          color={invoiceType != 'retail' ? '#278BED' : '#3C3C3C'}
          style={styles.checkBox}
        />
        <View style={styles.checkText}>
          <Text style={styles.getGstInvTitle}>Get GST Invoice</Text>
          <Text style={styles.getGstInvSubTitle}>
            Claim input tax credit on your purchase.
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAddress = () => {
    return invoiceType === 'retail'
      ? retailaddressList.length
        ? retailaddressList.map((_, i) => (
            <>
              <TouchableOpacity key={i}>
                <Text style={{color: '#000', fontSize: 12, fontWeight: '400'}}>
                  {_.addressCustomerName} | {_.phone} {`\n`}
                  {_.addressLine.split('|').join(' ')}, {_.city}
                  {_.state.name} {' - '}
                  {_.postCode}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  dispatch(setShippingAddress(invoiceType, _.idAddress))
                }>
                <Text style={{color: 'red', fontSize: 14, fontWeight: '600'}}>
                  DELIVER HERE
                </Text>
              </TouchableOpacity>
            </>
          ))
        : null
      : taxaddressList.length
      ? taxaddressList.map((_, i) => (
          <TouchableOpacity key={i}>
            <Text style={{color: '#000', fontSize: 12, fontWeight: '400'}}>
              {_.addressCustomerName} | {_.phone} {`\n`}
              {_.addressLine.split('|').join(' ')}, {_.city}
              {_.state.name} {' - '}
              {_.postCode}
            </Text>
          </TouchableOpacity>
        ))
      : null;
  };

  const validateCheckout = async () => {
    try {
      if (!addresses[invoiceType].activeShippingId) {
        props.navigation.navigate('UpdateAddress', {
          title: 'Delivery Address',
          invoiceType: invoiceType,
          addressKey: 'activeShippingId',
          address: {},
        });
        return;
      }
      if (invoiceType == 'tax' && !addresses[invoiceType].activeBillingId) {
        props.navigation.navigate('UpdateAddress', {
          title: 'Billing Address',
          invoiceType: invoiceType,
          addressKey: 'activeBillingId',
          address: {},
        });
        return;
      }

      if (
        validationMsg.filter(_ => _.type == 'oos').length ||
        serviceabilityData.length
      ) {
        setShowRemoveItems(true);
        return;
      }
      setLoader(true);
      const {data} = await getCustomerBusinessDetails(userId, sessionId, token);
      let shoppingCartDto = {
        ...cart,
        addressList: [
          {
            addressId: addresses[invoiceType].activeShippingId,
            invoiceType,
            type: 'shipping',
          },
        ],
        device: 'app',
        businessDetails: data.data
          ? {
              company: data.data?.companyName,
              gstin: data.data?.gstin,
              is_gstin: data.data?.isGstInvoice,
            }
          : null,
        deliveryMethod: {
          deliveryMethodId: 77,
          type: 'kjhlh',
        },
      };
      if (invoiceType == 'tax') {
        shoppingCartDto = {
          ...shoppingCartDto,
          addressList: [
            ...shoppingCartDto.addressList,
            {
              addressId: addresses[invoiceType].activeBillingId,
              invoiceType,
              type: 'billing',
            },
          ],
        };
      }
      const validateData = await validate(shoppingCartDto, sessionId, token);
      if (validateData.data.status) {
        props.navigation.navigate('Payment', {
          shoppingCartDto,
          address: addresses[invoiceType].data.find(
            _ => _.idAddress == addresses[invoiceType].activeShippingId,
          ),
          servicable: servicable,
        });
      } else {
        Toast.show({
          type: 'success',
          text2: validateData.data.statusDescription,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const renderActiveaddress = (title, addressKey) => {
    return (
      <View style={styles.addrWrap}>
        <Text style={styles.addrTitle}>{title}</Text>
        {(addresses[invoiceType].data || []).filter(
          _ => _.idAddress == addresses[invoiceType][addressKey],
        ).length ? (
          (addresses[invoiceType].data || [])
            .filter(_ => _.idAddress == addresses[invoiceType][addressKey])
            .map((_, i) => (
              <View key={i} style={styles.addrListWrap}>
                <Text style={styles.addrCustName}>{_.addressCustomerName}</Text>
                <Text style={styles.fullAddr}>
                  {_.addressLine}, {_.city}, {_.state.name}, {_.postCode}
                </Text>
                <Text style={styles.fullAddr}>Mobile: {_.phone}</Text>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('SelectAddress', {
                      invoiceType: invoiceType,
                      title,
                      addressKey,
                    })
                  }
                  style={styles.changeAddrBtn}>
                  <Text style={styles.changeAddrText}>
                    CHANGE OR ADD ADDRESS
                  </Text>
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('UpdateAddress', {
                title,
                invoiceType: invoiceType,
                addressKey,
                address: {},
              })
            }
            style={styles.topDeliveryAddress}>
            <MaterialCommunityIcon
              name={'plus'}
              color={colors.RedThemeColor}
              size={17}
            />
            <Text style={styles.topDeliveryAddressTxt}>ADD {title}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const goSummary = () => {
    scrollviewRef?.current.scrollToEnd({animated: true});
  };

  const removeMultipleItems = async msns => {
    await removeMultipleProducts(
      msns,
      cart,
      itemsList,
      sessionId,
      token,
      dispatch,
    );
  };

  const mutateCouponModal = () => {
    setCouponModalVisible(!couponModalVisible);
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
    let cartOffer;
    let products = [];
    let totalQuantity = 0;
    if (itemsList && itemsList.length) {
      (itemsList || []).forEach(item => {
        let cats =
          item && item.taxonomyCode ? item.taxonomyCode.split('/') : [];
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
    }
    if (!cart.cart.totalOffer) {
      cartOffer = 0;
    } else {
      cartOffer = cart.cart.totalOffer;
    }
    if (cart.offersList && cart.offersList.length) {
      let couponId = cart.offersList[0].offerId;
    }
    trackStateAdobe('moglix:checkout summary:coupon', {
      'myapp.pageName': 'checkout:coupon summary:coupon',
      'myapp.channel': 'checkout:coupon summary:coupon ',
      'myapp.subSection': 'checkout:coupon summary:coupon',
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
    });
  };

  return (
    <View style={styles.selectAddPage}>
      <View style={styles.headerView}>
        <View style={styles.headerFlex}>
          <MaterialCommunityIcon
            name={'arrow-left'}
            onPress={() => props.navigation.goBack()}
            style={styles.headerIcon}
            size={24}
          />
          <Text style={styles.filtHeading}>Select Address</Text>
        </View>
      </View>
      <View style={styles.bottomHeaderWrap}>
        <View style={styles.bottomHeaderTop}>
          <View style={styles.textWrap}>
            <Text style={styles.headerTitle}>Address</Text>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.grayheaderTitle}>Payment</Text>
          </View>
        </View>
        <View style={styles.ProgressBar}>
          <View style={[styles.greenLine, styles.Pwidth1]}></View>
          <View style={styles.greenDot}></View>
          <View style={[styles.greenLine, styles.Pwidth2]}></View>
          <View style={styles.greenDot}></View>
          <View style={[styles.grayLine, styles.Pwidth2]}></View>
          <View style={styles.grayDot}></View>
          <View style={[styles.grayLine, styles.Pwidth1]}></View>
        </View>
      </View>
      <ScrollView ref={scrollviewRef} style={styles.scrollViewPg}>
        <View style={styles.checkOutPage}>
          {renderValidationMsgs()}
          {toggleinvoiceType()}
          {renderActiveaddress('Delivery Address', 'activeShippingId')}
          {invoiceType == 'tax'
            ? renderActiveaddress('Billing Address', 'activeBillingId')
            : null}

          {/* {renderAddress()} */}
          {renderitemsList()}
          {renderAppliedCoupon()}
          {/* <TouchableOpacity
        onPress={() => viewOffers(userId, sessionId, token, dispatch)}>
        <Text style={{color: '#000', fontSize: 12, fontWeight: '500'}}>
          VIEW ALL OFFERS
        </Text>
      </TouchableOpacity> */}
          {!appliedPromo.promoId ? (
            <TouchableOpacity
              onPress={() => {
                if (authenticated != 'true') {
                  props.navigation.navigate('Auth');
                } else {
                  viewOffers(userId, sessionId, token, dispatch);
                  mutateCouponModal();
                }
              }}
              style={styles.applyCouponWrap}>
              <View style={styles.viewAllOffers}>
                <MaterialCommunityIcon
                  name={'ticket-confirmation'}
                  style={styles.couponIcon}
                  size={26}
                />
                <Text style={styles.applyText}>APPLY COUPON</Text>
              </View>
              <FAIcon name="angle-right" style={styles.arrowrightIcon} />
            </TouchableOpacity>
          ) : null}
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
                itemsList
                  .reduce(
                    (acc, curr) =>
                      acc +
                      (curr.productUnitPrice - curr.priceWithoutTax) *
                        curr.productQuantity,
                    0,
                  )
                  .toFixed(0),
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
      </ScrollView>
      <View style={styles.bottomAction}>
        <View style={styles.leftAmt}>
          <View style={styles.amtWrap}>
            <Text style={styles.payable}>Amount Payable</Text>
            <MaterialCommunityIcon
              name={'information'}
              onPress={goSummary}
              style={styles.infoIcon}
              size={16}
            />
          </View>
          <Text style={styles.totalAmtinBottom}>
            {' '}
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
          disabled={
            // serviceabilityData.length ||
            // validationMsg.filter(_ => _.type == 'oos').length ||
            loader
          }
          onPress={validateCheckout}
          style={[
            styles.redBtn,
            {
              backgroundColor: loader
                ? // ||
                  // validationMsg.filter(_ => _.type == 'oos').length
                  // ||
                  // serviceabilityData.length ||

                  colors.lightGrayText
                : colors.RedThemeColor,
            },
          ]}>
          {loader && <ActivityIndicator size={'small'} color={'#fff'} />}
          <Text
            style={[
              styles.redBtnText,
              // {
              //   color:
              //     !addresses[invoiceType].activeShippingId ||
              //     serviceabilityData.length ||
              //     validationMsg.filter(_ => _.type == 'oos').length
              //       ? ''
              //       : 'rgba(217, 35, 45, 1)',
              // },
            ]}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
      {/* Apply Coupon Modal according to design */}
      {couponModalVisible && (
        <Coupons
          couponModalVisible={couponModalVisible}
          setCouponModalVisible={setCouponModalVisible}
          coupons={coupons}
          applyCouponCode={applyingCoupon}
        />
      )}
      {showRemoveItems && (
        <RemoveMultipleItems
          visible={showRemoveItems}
          closePopup={() => setShowRemoveItems(false)}
          items={itemsList.filter(i =>
            [
              ...validationMsg.filter(_ => _.type == 'oos'),
              ...serviceabilityData,
            ]
              .map(_ => _.productId || _.msnid)
              .includes(i.productId),
          )}
          validationMsgsData={[
            ...validationMsg
              .filter(_ => _.type == 'oos')
              .map(_ => ({..._, msg: _})),
            ...serviceabilityData,
          ]}
          removeMultipleItems={removeMultipleItems}
        />
      )}
      {couponSuccessModal && (
        <Modal
          onBackdropPress={() => setCouponSuccessModal(false)}
          onBackButtonPress={() => setCouponSuccessModal(false)}
          isVisible={couponSuccessModal}>
          <TouchableOpacity
            style={styles.modalWrap}
            onPress={() => {
              setCouponSuccessModal(false);
            }}>
            <Image
              source={require('../../assets/images/Coupen.png')}
              style={styles.modalcoupenImg}
            />
            <Text style={styles.appliedCpnText}>
              ‘{appliedPromo.promoCode}’ applied
            </Text>
            <Text style={styles.saveAmounttext}>
              ₹{applyThousandSeparator(Math.floor(cart.cart.totalOffer))}
            </Text>
            <Text style={styles.normalText}>saving with this coupon</Text>
            <Text style={styles.greenText}>YAY!</Text>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default CheckoutScreen;
