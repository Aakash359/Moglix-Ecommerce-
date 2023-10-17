import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchWishlist, updateWishlist} from '../../redux/actions/wishlist';
import {STATE_STATUS} from '../../redux/constants/index';
import ProductListView from '../../components/Common/ProductListView';
import ProductGridView from '../../components/Common/ProductGridView';
import colors from '../../redux/constants/colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addtoCart} from '../../generic/Cart';
import styles from './style';
import Header from '../../components/Common/Header';
import RfqRequirement from '../../components/Common/RfqRequirement';
import {
  trackAdjust,
  webEngageTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import RFQSuccess from '../../components/Common/RFQSuccess';
import Toast from 'react-native-toast-message';

const WishlistScreen = props => {
  const wishlistData =
    useSelector(state => state.wishlistReducer || {}).data || [];
  const wishlistStatus =
    useSelector(state => state.wishlistReducer || {}).status ||
    STATE_STATUS.FETCHING;
  const wishlistUpdateStatus =
    useSelector(state => state.wishlistReducer || {}).updateStatus ||
    STATE_STATUS.UPDATING;
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );

  const user = useSelector(state => (state.authReducer || {}).data || {});

  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});

  const [viewType, setViewType] = useState('view-grid');

  const [rfqRequirement, setRfqRequirement] = useState(false);
  const [rfqData, setRfqData] = useState({});
  const [parentLoader, setParentLoader] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlistStatus !== STATE_STATUS.FETCHED) {
      dispatch(fetchWishlist(userId, 'business', sessionId, token));
    }
  }, []);

  useEffect(() => {
    if (wishlistStatus == STATE_STATUS.FETCHED) {
      trackStateAdobe('moglix:account dashboard-purchase list', {
        pageName: 'moglix:account dashboard-purchase list',
        channel: 'moglix:wishlist',
        subSection: 'moglix:account dashboard-purchase list',
      });
      clickStreamPageLoad();
    }
  }, [wishlistStatus]);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'wishlist_page',
      channel: 'Wishlist',
    };
    sendClickStreamData(dataTracking);
  };

  const onRemoveFromWishlist = product => {
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
    dispatch(updateWishlist(data, sessionId, token, 'remove', true));
  };

  const addToCartFromWishlist = async product => {
    setParentLoader(true);
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
    dispatch(updateWishlist(data, sessionId, token, 'remove', false));
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
      false,
      false,
      false,
      navigateToCart,
    );
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
    setParentLoader(false);
  };

  const navigateToCart = () => {
    props.navigation.push('Cart');
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
      page_type: 'wishlist_page',
      channel: 'Wishlist',
      product_name: productData && productData.productName,
      msn: productData.partNumber || msn,
      price: String(
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
      'Image URL':
        'https://cdn.moglix.com/' + productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].images &&
        productData.productPartDetails[msn].images[0] &&
        productData.productPartDetails[msn].images[0].links &&
        productData.productPartDetails[msn].images[0].links.medium,
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
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'wishlist',
      'myapp.ctaname': 'add to cart',
      'myapp.channel': 'wishlist',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: wishlist`,
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

  const rfqRequirementFromWishList = item => {
    setRfqRequirement(!rfqRequirement);
    setRfqData(item);
  };

  const renderItemGrid = ({item}) => (
    <>
      <View style={styles.gridViewCard}>
        <TouchableOpacity
          style={styles.wishlistIcon}
          onPress={() => onRemoveFromWishlist(item)}>
          <MaterialCommunityIcon
            name={'cards-heart'}
            style={styles.heartIcon}
            size={26}
          />
        </TouchableOpacity>
        <ProductGridView item={item} navigation={props.navigation} />
        {!item.oos &&
        !(
          item &&
          item.productDetail &&
          item.productDetail.productBO &&
          item.productDetail.productBO.outOfStock
        ) ? (
          <TouchableOpacity
            style={styles.cartBtnTextForGrid}
            onPress={() => addToCartFromWishlist(item)}>
            <Text style={styles.cartBtnText}>ADD TO CART</Text>
          </TouchableOpacity>
        ) : null}
        {item.oos ||
        (item &&
          item.productDetail &&
          item.productDetail.productBO &&
          item.productDetail.productBO.outOfStock) ? (
          <TouchableOpacity
            onPress={() => rfqRequirementFromWishList(item)}
            style={[
              styles.cartBtnTextForGrid,
              {
                backgroundColor: '#fff',
                borderTopColor: '#fafafa',
                borderTopWidth: 4,
              },
            ]}>
            <Text style={[styles.cartBtnText, {color: colors.RedThemeColor}]}>
              ASK BEST PRICE
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
  const renderItemList = ({item}) => (
    <>
      <View style={styles.listViewCard}>
        {/* {!item.oos &&
        !(
          item &&
          item.productDetail &&
          item.productDetail.productBO &&
          item.productDetail.productBO.outOfStock
        ) ? (
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => addToCartFromWishlist(item)}>
            <Text style={styles.cartBtnText}>ADD TO CART</Text>
          </TouchableOpacity>
        ) : null} */}

        <ProductListView
          item={item}
          navigation={props.navigation}
          addToCartFromListing={addToCartFromWishlist}
          fromListing={false}
          fromWishlist
          parentLoader={parentLoader}
          rfqRequirementFromListing={rfqRequirementFromWishList}
        />
      </View>
    </>
  );
  const listEmptyComponent = () => (
    <View style={styles.noOrders}>
      <View style={styles.whiteBgWithImage}>
        <Text style={styles.noOrderText}>
          You haven't add any product in your wishlist.
        </Text>
        <Image
          source={require('../../assets/images/nosearchillustration.png')}
          style={styles.noOrderImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.wishListPg}>
        <Header
          showBack
          showText={'Wishlist'}
          showCart
          navigation={props.navigation}
        />
        {(wishlistData || []).length ? (
          <View style={styles.viewTypeWrap}>
            <Text style={styles.productCount}>
              {(wishlistData || []).length || 0} Product
            </Text>
            <TouchableOpacity
              onPress={() =>
                setViewType(
                  viewType == 'view-grid' ? 'format-list-text' : 'view-grid',
                )
              }>
              <MaterialCommunityIcon
                name={viewType}
                style={styles.viewTypeIcon}
                size={26}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {wishlistStatus === STATE_STATUS.FETCHING &&
        wishlistData.length == 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator
              size={'large'}
              color={colors.RedThemeColor}
              style={{alignSelf: 'center', marginVertical: 12}}
            />
          </View>
        ) : null}
        {wishlistStatus === STATE_STATUS.FETCHING &&
        wishlistData.length == 0 ? null : viewType == 'format-list-text' ? (
          <FlatList
            data={wishlistData}
            key={viewType}
            style={[
              styles.flatGridView,
              {flexWrap: wishlistData.length == 0 ? 'nowrap' : 'wrap'},
            ]}
            keyExtractor={(item, index) => `item-${index}`}
            renderItem={renderItemGrid}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            fromViewAll
            ListEmptyComponent={listEmptyComponent}
          />
        ) : (
          <FlatList
            data={wishlistData}
            key={viewType}
            style={styles.flatListView}
            keyExtractor={(item, index) => index}
            renderItem={renderItemList}
            showsVerticalScrollIndicator={false}
            fromViewAll
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>
      {rfqSuccess && (
        <RFQSuccess visible={rfqSuccess} onClose={() => setRfqSuccess(false)} />
      )}
      {rfqRequirement ? (
        <RfqRequirement
          showSuccess={() => setRfqSuccess(true)}
          rfqRequirement={rfqRequirement}
          setRfqRequirement={setRfqRequirement}
          user={user}
          sessionId={sessionId}
          token={token}
          userId={userId}
          fromListing
          rfqData={rfqData}
        />
      ) : null}
    </>
  );
};

export default WishlistScreen;
