import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import styles from './style';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  removeProduct,
  updateQuantity,
  validateCart,
  applyCouponCode,
  removePromo,
  requestshippingValue,
  viewOffers,
  addtoCart,
} from '../../generic/Cart/index';
import {updateWishlist} from '../../redux/actions/wishlist';
import Cartcard from '../../components/Common/Cartcard';
import Coupons from '../../components/Common/Coupons';
import {applyThousandSeparator} from '../../generic';
import Dimension from '../../redux/constants/dimensions';
import Fbt from '../../components/Common/Fbt';
import {getFbtProductsApi} from '../../services/products';
import {setFbtProducts} from '../../redux/actions/products';
import WishlistCart from '../../components/Common/Wishlist';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import {fetchLayoutByLayoutCode} from '../../redux/actions/homepage';
import {COMPONENTS_MAP} from '../../redux/constants/homepage';
import Category from '../../components/Common/Category';
import {STATE_STATUS} from '../../redux/constants';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import Modal from 'react-native-modal';
// import colors from 'native-base/lib/typescript/theme/base/colors';
import colors from '../../redux/constants/colors';

const CartScreen = props => {
  const [impCartDetails, setImpCartDetails] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponSuccessModal, setCouponSuccessModal] = useState(false);
  const countrydata = useSelector(state => state.masterReducer.data);
  const homepageData = useSelector(state => state.homepageReducer);
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const cartStatus = useSelector(
    state => (state.cartReducer || {}).status || {},
  );
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );

  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );

  const coupons = useSelector(state => (state.cartReducer || {}).coupons || []);
  const appliedPromo = useSelector(
    state => (state.cartReducer || {}).appliedCoupon || {},
  );

  const validationMsg = useSelector(state =>
    (((state.cartReducer || {}).data || {}).itemsList || [])
      .filter(_ => _.msg && _.msg.type && _.msg.type != 'shipping')
      .map(_ => _.msg),
  );
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [wishlistModal, setWishListModal] = useState(false);
  const wishlistData = (
    useSelector(state => state.wishlistReducer || {}).data || []
  ).filter(_ => !_.productDetail.productBO.outOfStock);

  const fbtProducts = useSelector(
    state =>
      (
        state.productsReducer[itemsList && itemsList.map(_ => _.productId)] ||
        {}
      ).fbtProducts || {},
  );
  const scrollviewRef = useRef();
  const dispatch = useDispatch();

  useEffect(async () => {
    // try {
    let reducerSource = homepageData[countrydata.searchpageLayoutCode];
    console.log(homepageData);
    if (!reducerSource || reducerSource.status != STATE_STATUS.FETCHED) {
      dispatch(fetchLayoutByLayoutCode(countrydata.searchpageLayoutCode));
    }
    if (cart.noOfItems == 1) {
      getFbtProducts();
    }
    // let shippingRes = await requestshippingValue(cart, sessionId, token);
    // validateCart(shippingRes, userId, sessionId, token, dispatch);
    webEngageViewCart();
    webEngageUpdateCartEvent();
    adobeCartTrackEvent();
    clickStreamPageLoad();
  }, []);

  // useEffect(() => {
  //   if (
  //     (cartStatus == STATE_STATUS.FETCHED ||
  //       cartStatus == STATE_STATUS.UPDATED) &&
  //     cart.offersList &&
  //     cart.offersList.length
  //     // &&
  //     // !appliedPromo.promoId
  //   ) {
  //     applyCouponCode(
  //       {promoId: cart.offersList[0].offerId},
  //       cart,
  //       sessionId,
  //       token,
  //       dispatch,
  //       true,
  //     );
  //   }
  // }, [itemsList.length]);

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
      page_type: 'cart_page',
      channel: 'Cart',
      price: totalPrice,
      quantity: totalQuantity,
    };
    sendClickStreamData(dataTracking);
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
      channel: 'Cart',
      page_type: 'cart_page',
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
      channel: 'Cart',
      page_type: 'cart_page',
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

  useEffect(() => {
    if (itemsList.length) {
      getFreeDeliveryState();
      adjustCartEvent();
    } else {
      if (cart && cart.offersList && cart.offersList.length) {
        applyCouponCode(
          {promoId: cart.offersList[0].offerId},
          cart,
          sessionId,
          token,
          dispatch,
          true,
        );
      }
    }
    if (itemsList.length == 0) {
      webEngageTracking('emptyCart', {});
    }
  }, [itemsList.length]);

  const getFreeDeliveryState = async () => {
    let shippingRes = await requestshippingValue(cart, sessionId, token);
    if (
      shippingRes &&
      shippingRes.cart &&
      shippingRes.cart.shippingCharges == 0
    ) {
      setFreeDelivery(true);
    }
    validateCart(shippingRes, userId, sessionId, token, dispatch);
  };

  const adjustCartEvent = () => {
    var adjustEvent = new AdjustEvent('2jtit1');
    let msns = [];
    let prices = [];
    let totalQuantity = 0;
    if (itemsList && itemsList.length) {
      itemsList.forEach(item => {
        prices.push(item.productUnitPrice);
        msns.push(item.productId);
        totalQuantity = totalQuantity + item.productQuantity;
      });
    }
    adjustEvent.addPartnerParameter('id', msns.join('|'));
    adjustEvent.addPartnerParameter('price', prices.join('|'));
    adjustEvent.addPartnerParameter('quantity', String(totalQuantity));
    trackAdjust(adjustEvent);
  };

  const webEngageViewCart = () => {
    let webengageObj = {
      Currency: 'INR',
      'Product Array': [],
    };
    let productIds = [];
    let productNames = [];
    let totalPrice = 0;
    let totalQuantity = 0;

    if (itemsList && itemsList.length > 0) {
      for (let i = 0; i < itemsList.length; i++) {
        let obj = {
          item_category: itemsList[i].categoryCode,
          item_name: itemsList[i].productName,
          item_id: itemsList[i].productId,
          price: itemsList[i].totalPayableAmount,
          productImg: itemsList[i].productImg,
        };
        productIds.push(obj.item_id);
        productNames.push(obj.item_name);
        totalPrice += obj.price;
        totalQuantity += itemsList[i].productQuantity;
        let wobj = {
          name: obj.item_name,
          id: obj.item_id,
          price: obj.price,
          quantity: itemsList[i].productQuantity,
          image: obj.productImg,
          url: 'https://www.moglix.com' + '/' + itemsList[i].productUrl,
        };
        webengageObj['Product Array'].push(wobj);
      }
    }
    webengageObj['Product Id'] = productIds.join(',');
    webengageObj['Product Name'] = productNames.join(',');
    webengageObj['Total Price'] = totalPrice;
    webengageObj['Total Quantity'] = totalQuantity;
    webEngageTracking('viewedCart', webengageObj);
    webEngageScreenTracking('CartScreen', {
      price: totalPrice,
    });
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
    let webengageRemoveObj = {
      Currency: 'INR',
      Price: it.totalPayableAmount,
      'Product Id': it.productId,
      'Product Image': it.productImg,
      'Product Name': it.productName,
    };
    webEngageTracking('removedfromCart', webengageRemoveObj);
    webEngageUpdateCartEvent();
    adoberemoveItemTrackEvent(it);
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
      channel: 'Cart',
      page_type: 'cart_page',
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

  const webEngageUpdateCartEvent = () => {
    let webengageUpdateObj = {
      Currency: 'INR',
      'Product Id': '',
      'Product Name': '',
      'Product Array': [],
    };
    let totalPrice = 0;
    let totalQuantity = 0;
    var arrMsn = [];
    var arrName = [];
    let prices = [];
    (itemsList || []).forEach(item => {
      let obj = {
        name: item.productName,
        id: item.productId,
        price: item.totalPayableAmount,
        quantity: item.productQuantity,
        image: item.productImg,
        url: 'https://www.moglix.com' + '/' + item.productUrl,
      };
      let msnObj = item.productId;
      let nameObj = item.productName;
      let priceObj = item.totalPayableAmount;
      arrName.push(nameObj);
      arrMsn.push(msnObj);
      prices.push(priceObj);
      webengageUpdateObj['Product Array'].push(obj);
      totalQuantity += item.productQuantity;
      totalPrice += item.totalPayableAmount;
    });
    webengageUpdateObj['Product Id'] = arrMsn.join(',');
    webengageUpdateObj['Product Name'] = arrName.join(',');
    webengageUpdateObj['Total Price'] = totalPrice;
    webengageUpdateObj['Total Quantity'] = totalQuantity;
    webEngageTracking('updateCart', webengageUpdateObj);
  };

  const adobeCartTrackEvent = () => {
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
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
    trackStateAdobe('moglix:cart summary', {
      'myapp.pageName': 'moglix:cart summary ',
      'myapp.channel': 'cart summary ',
      'myapp.subSection': 'moglix:cart summary ',
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
      'myapp.totalDiscount': `${cartOffer}`,
      'myapp.totalQuantity': `${totalQuantity}`,
      'myapp.couponCodeID': couponId,
      'myapp.totalPrice': `${Math.ceil(
        cart.cart.totalAmount + cart.cart.shippingCharges - cartOffer,
      )}`,
      'myapp.productPrice': prices.join('|'),
      'myapp.brand': brand.join('|'),
      '&&events': 'scView',
      '&&products': products.join(','),
      fbtVisible:
        cart.noOfItems == 1 &&
        fbtProducts &&
        fbtProducts.data &&
        fbtProducts.data.length
          ? 'YES'
          : 'NO',
    });
  };

  const adoberemoveItemTrackEvent = item => {
    let taxo1 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[0]) || '';
    let taxo2 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[1]) || '';
    let taxo3 =
      (item && item.taxonomyCode && item['taxonomyCode'].split('/')[2]) || '';
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:cart summary ',
      'myapp.ctaname': 'remove from cart ',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': item && item.productId,
      'myapp.quantity': item && item.productQuantity,
      'myapp.productPrice': item && item.productUnitPrice,
      'myapp.brand': item && item.brandName,
      '&&events': 'scRemove',
      '&&products':
        ';' +
        ((item && item.productId) || '') +
        ';' +
        ((item && item.productQuantity) || '') +
        ';' +
        ((item && item.productUnitPrice) || 0) *
          ((item && item.productQuantity) || 0) +
        ';',
    });
  };

  const renderitemsList = () => {
    return cart.noOfItems && itemsList.length
      ? itemsList.map((_, i) => (
          <View style={styles.cardWarp}>
            <Cartcard
              authenticated={authenticated}
              {..._}
              onMoveToWishlist={onMoveToWishlist}
              key={i}
              updateQuantity={updatecartQuantity}
              navigation={props.navigation}
              removeProduct={() => removeProductCart(_)}
            />
          </View>
        ))
      : null;
  };

  const renderAppliedCoupon = () => {
    if (appliedPromo.promoId && cart.noOfItems) {
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
            <MaterialCommunityIcon
              name={'close-circle'}
              size={24}
              color={'#979797'}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

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
    dispatch(updateWishlist(productObj, sessionId, token, 'add', true));
    clickStreamAddtoWishlist(productData);
  };

  const clickStreamAddtoWishlist = productData => {
    let taxo1 =
      (productData &&
        productData.taxonomyCode &&
        productData.taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.taxonomyCode &&
        productData.taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.taxonomyCode &&
        productData.taxonomyCode.split('/')[2]) ||
      '';

    let dataTracking = {
      event_type: 'click',
      label: 'add_to_wishlist',
      channel: 'Cart',
      page_type: 'cart_page',
      product_name: productData && productData.productName,
      msn: productData.productId,
      price: String(productData && productData.productUnitPrice),
      brand: productData.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData && productData.productQuantity,
    };
    sendClickStreamData(dataTracking);
  };

  const renderValidationMsgs = () => {
    return cart.noOfItems && validationMsg.length ? (
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

  const renderNoItemsInCart = () => {
    return !cart.noOfItems ? (
      <>
        <View style={styles.emptyCartImgWrap}>
          <Text style={styles.emptyText}>No items in your cart</Text>
          <Image
            source={require('../../assets/images/empty-cart.png')}
            style={styles.emptyCartImg}
            resizeMode="contain"
          />
          <Text style={[styles.emptyText, {marginBottom: 0}]}>
            Let's add some items
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Home')}
            style={styles.continueShoppingBtn}>
            <Text style={styles.continueShoppingText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
          {/* {/* {this.props.user.authenticated != 'true' ? ( */}
          {authenticated != 'true' ? (
            <View style={styles.signInonemptyCrt}>
              <TouchableOpacity
                onPress={() => props.navigation.push('Auth')}
                style={{marginTop: 20}}>
                <Text style={styles.signInNowText}>SIGN IN NOW</Text>
              </TouchableOpacity>
              <Text style={styles.signInText}>
                To see the items you added previously
              </Text>
            </View>
          ) : null}
          {/* // ) : null} */}
        </View>
        <View>{renderTopLayout()}</View>
      </>
    ) : null;
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

  const goSummary = () => {
    scrollviewRef?.current.scrollToEnd({animated: true});
  };

  const getFbtProducts = async () => {
    let msn = itemsList && itemsList[0] && itemsList[0].productId;
    const {data} = await getFbtProductsApi(msn, sessionId, token);
    if (data.data) {
      dispatch(setFbtProducts(msn, data.data));
    }
  };

  const addToCartFromWishlist = async product => {
    setIsLoading(true);
    const {idUser, idProduct, productName, userType, description, brand} =
      product;
    let data = {
      idUser,
      idProduct,
      productName,
      userType,
      description,
      brand,
    };
    dispatch(updateWishlist(data, sessionId, token, 'remove'));
    await addtoCart(
      cart,
      product.idProduct,
      product,
      dispatch,
      sessionId,
      token,
      {push: () => {}},
      1,
      true,
      true,
    );
    setIsLoading(false);
    setWishListModal(false);
    adjustAddEvent(
      product.idProduct,
      product && product.productDetail && product.productDetail.productBO,
      1,
    );
    webEngageAddBuyEvent(
      product.idProduct,
      product && product.productDetail && product.productDetail.productBO,
      1,
    );
    adobeAddCartTrackEvent(
      product.idProduct,
      product && product.productDetail && product.productDetail.productBO,
      1,
    );
    clickStreamAddCart(
      product.idProduct,
      product && product.productDetail && product.productDetail.productBO,
      1,
    );
  };

  const clickStreamAddCart = (msn, productData, quantity) => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';

    let dataTracking = {
      event_type: 'click',
      label: 'add_to_cart',
      page_type: 'cart_page',
      channel: 'Cart',
      product_name: productData && productData.productName,
      msn: productData.partNumber || msn,
      price: String(
        productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand: productData.brandDetails && productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      quantity:
        quantity ||
        (productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india.moq) ||
        1,
      oos: productData.outOfStock,
    };
    sendClickStreamData(dataTracking);
  };

  const adobeAddCartTrackEvent = (msn, productData, quantity) => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';
    let obj = {
      'myapp.linkpagename':
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'cart',
      'myapp.ctaname': 'add to cart',
      'myapp.channel': 'cart',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: cart`,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber || msn,
      'myapp.productPrice':
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.quantity': quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags || [],
      'myapp.parentID': productData.partNumber || msn,
      '&&products':
        ';' +
        productData.partNumber +
        ';' +
        quantity +
        ';' +
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice *
          quantity +
        ';',
      '&&events': 'scAdd,event7',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const adjustAddEvent = (msn, productData, quantity) => {
    var adjustEvent = new AdjustEvent('cxcov6');
    adjustEvent.addPartnerParameter('id', String(msn));
    adjustEvent.addPartnerParameter(
      'price',
      String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .priceWithoutTax,
      ),
    );
    adjustEvent.addPartnerParameter('quantity', String(quantity)),
      adjustEvent.addPartnerParameter('currency', 'INR'),
      trackAdjust(adjustEvent);
  };

  const webEngageAddBuyEvent = (msn, productData, quantity) => {
    let webengageAddBuyObj = {
      Brand: productData.brandDetails && productData.brandDetails.brandName,
      'Category Id':
        productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode,
      'Category Name':
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomy,
      Currency: 'INR',
      Discount:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.discount,
      'Image URL': `https://cdn.moglix.com/${
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].images &&
        productData.productPartDetails[msn].images[0] &&
        productData.productPartDetails[msn].images[0].links &&
        productData.productPartDetails[msn].images[0].links.medium
      }`,
      Price:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .priceWithoutTax,
      'Product Id': msn,
      'Product Name': productData && productData.productName,
      Quantity: quantity,
      'Retail Price':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.mrp,
    };

    webEngageTracking('addedToCart', webengageAddBuyObj);
  };

  const renderLoader = () => (
    <ActivityIndicator
      size={'small'}
      color={'red'}
      style={styles.activityIndicator}
    />
  );

  const renderError = () => (
    <View>
      <Text style={styles.centertext}>
        Something went wrong while fetching data
      </Text>
    </View>
  );

  const componentSelector = (component, componentId) => {
    switch (component.componentLabel) {
      case COMPONENTS_MAP.homepage_categories:
        return (
          <View>
            <Category
              key={componentId}
              fromScreen={'Cart'}
              mutateUI
              data={component.data}
              navigation={props.navigation}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderTopLayout = () => {
    let reducerSource = homepageData[countrydata.searchpageLayoutCode];
    console.log(reducerSource);
    let topLayoutData = reducerSource && reducerSource.data;
    let topLayoutStatus =
      (reducerSource && reducerSource.status) || STATE_STATUS.FETCHING;
    if (topLayoutStatus === STATE_STATUS.FETCHING) {
      return renderLoader();
    } else if (topLayoutStatus === STATE_STATUS.FETCHED) {
      return topLayoutData.map((component, componentId) =>
        componentSelector(component, componentId),
      );
    } else {
      return renderError();
    }
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
      couponId = cart.offersList[0].offerId;
    }
    trackStateAdobe('moglix:cart summary:coupon', {
      'myapp.pageName': 'moglix:cart summary:coupon',
      'myapp.channel': 'moglix:cart summary:coupon ',
      'myapp.subSection': 'moglix:cart summary:coupon',
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
    });
  };

  return (
    <View style={styles.mycartView}>
      <View style={styles.headerView}>
        <View style={styles.headerFlex}>
          <MaterialCommunityIcon
            onPress={() => props.navigation.goBack()}
            name={'arrow-left'}
            style={styles.headerIcon}
            size={24}
          />
          <Text style={styles.filtHeading}>My Cart</Text>
        </View>
        {cart.noOfItems ? (
          <View style={styles.headerFlex}>
            <Text style={styles.headTotAmount}>
              Amount : ₹
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
            <MaterialCommunityIcon
              name={'information'}
              style={styles.infoIcon}
              size={16}
              onPress={() => goSummary()}
            />
          </View>
        ) : null}
      </View>
      <ScrollView
        ref={scrollviewRef}
        style={{
          flex: 1,
          marginBottom: cart.itemsList && cart.itemsList.length ? 70 : 0,
          paddingHorizontal: 0,
        }}>
        <View style={styles.cartItems}>
          {cart.noOfItems ? (
            <Text style={styles.cartItemText}>
              {' '}
              {cart.noOfItems} item(s) in your cart
            </Text>
          ) : null}
          <View />
          {authenticated == 'true' && wishlistData.length ? (
            <TouchableOpacity
              onPress={() => {
                if (authenticated == 'true') {
                  setWishListModal(true);
                } else {
                  props.navigation.push('Auth');
                }
              }}
              style={styles.addtoWishlistBtn}>
              <Text style={styles.addWishlistText}>ADD FROM WISHLIST</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.withHorPadding}>
          {freeDelivery && itemsList.length ? (
            <View style={styles.shippingStripWrap}>
              {/* <Image
                source={require('App/Assets/Images/Revamp/shippingCar.png')}
                style={styles.shippingIcon}
                resizeMode="contain"
              /> */}
              <View style={styles.wrapView}>
                <MaterialCommunityIcon
                  name={'truck-fast'}
                  size={20}
                  style={styles.freeCar}
                  color={colors.green2}
                />
                <Text style={styles.shippingStripText1}>Yay! </Text>
                <Text style={styles.shippingStripText2}>Free delivery </Text>
                <Text style={styles.shippingStripText3}>on this order</Text>
              </View>
            </View>
          ) : null}

          {renderNoItemsInCart()}
          {renderValidationMsgs()}
          {renderitemsList()}
          {renderAppliedCoupon()}
        </View>
        {cart.noOfItems == 1 && fbtProducts.data ? (
          <View>
            <Fbt
              cartFBT={styles.fbtCartStyle}
              fromCart
              cartFBTWrap={styles.fbtWrapwithLightRed}
              msn={itemsList && itemsList.map(_ => _.productId)}
              sessionId={sessionId}
              token={token}
              navigation={props.navigation}
            />
          </View>
        ) : null}
        {cart.noOfItems && !appliedPromo.promoId ? (
          <TouchableOpacity
            onPress={() => {
              if (authenticated != 'true') {
                props.navigation.push('Auth');
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

        {cart.noOfItems ? (
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
              <Text style={styles.disText}>
                - ₹
                {((cart && cart.cart && cart.cart.totalOffer) || 0).toFixed(0)}
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
                  // (cart && cart.cart && cart.cart.totalPayableAmount) || 0,
                )}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {cart.noOfItems ? (
        <View style={styles.bottomAction}>
          <TouchableOpacity
            onPress={() => {
              if (authenticated == 'true') {
                props.navigation.push('Checkout', {
                  fromCart: true,
                });
              } else {
                props.navigation.push('Auth', {
                  proceedTocheckout: true,
                });
              }
            }}
            style={styles.redBtn}>
            <Text style={styles.redBtnText}>PROCEED TO CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* Apply Coupon Modal according to design */}
      {cart.noOfItems && authenticated == 'true' && couponModalVisible ? (
        <Coupons
          couponModalVisible={couponModalVisible}
          setCouponModalVisible={setCouponModalVisible}
          coupons={coupons}
          applyCouponCode={applyingCoupon}
        />
      ) : null}
      {wishlistModal && (
        <WishlistCart
          wishList={wishlistModal}
          setWishListModal={setWishListModal}
          wishlistData={wishlistData}
          navigation={props.navigation}
          addToCartFromWishlist={addToCartFromWishlist}
          isLoading={isLoading}
        />
      )}
      {couponSuccessModal && (
        <Modal
          onBackdropPress={() => setCouponSuccessModal(false)}
          onBackButtonPress={() => setCouponSuccessModal(false)}
          isVisible={couponSuccessModal}>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#EFEFF4',
              padding: Dimension.padding25,
              alignItems: 'center',
            }}
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

export default CartScreen;
