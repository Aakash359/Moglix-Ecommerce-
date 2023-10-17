import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  InteractionManager,
} from 'react-native';
import {fetchOrders, fetchOrderDetails} from '../../redux/actions/orders';
import {useSelector, useDispatch} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';
import styles from './style';
import Header from '../../components/Common/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import OrderFilterModal from '../../components/Common/OrderFilterModal';
import {
  applyThousandSeparator,
  ORDER_STATUSES,
  DATE_RANGES,
} from '../../generic';
import {
  webEngageTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import {getProduct} from '../../services/products';
import {addtoCart} from '../../generic/Cart';

const OrdersScreen = props => {
  const ordersData = useSelector(state => (state.ordersReducer || {}).orders);
  const ordersParams = useSelector(
    state => (state.ordersReducer || {}).params || {},
  );
  const ordersStatus = useSelector(state => (state.ordersReducer || {}).status);
  const maxPage = useSelector(state => (state.ordersReducer || {}).maxPage);
  const activeOrders = useSelector(
    state => (state.ordersReducer || {}).activeOrder || [],
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );
  const pageNo = useSelector(
    state => (state.ordersReducer || {}).pageIndex || 0,
  );

  const orderUpdateTime = useSelector(
    state => (state.ordersReducer || {}).orderedTime,
  );

  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState('');
  const [OrderFilterModalVisible, setOrderFilterModalVisible] = useState(false);
  const [initialDateRange, setInitialDateRange] = useState('Last 6 months');
  const [initialStatus, setInitialStatus] = useState('all');
  const [buyAgainLoading, setIsBuyAgainLoading] = useState(false);

  const dispatch = useDispatch();

  // useFocusEffect(
  //   useCallback(() => {
  //     InteractionManager.runAfterInteractions(() => {
  //       fetchOrdersData(0);
  //     });
  //   }, [props.navigation, authenticated]),
  // );

  useEffect(() => {
    if (search && search.length > 3 && !loader) {
      setLoader(true);
      fetchOrdersData(0);
    } else if (!search && search !== ordersParams.productName) {
      setLoader(true);
      fetchOrdersData(0);
    }
  }, [search]);

  const onSearch = () => {
    if (search && search.length > 1 && !loader) {
      setLoader(true);
      fetchOrdersData(0);
    }
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (authenticated == 'true') {
        trackStateAdobe('moglix:account dashboard-myorders', {
          pageName: 'moglix:account dashboard-myorders',
          channel: 'moglix:home',
          subSection: 'moglix:account dashboard-myorders',
        });
        clickStreamPageLoad();
      }
    });
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      fetchOrdersData(0);
    });
  }, [orderUpdateTime]);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'my_orders',
      channel: 'Dashboard',
    };
    sendClickStreamData(dataTracking);
  };

  const onBuyAgain = async order_params => {
    setIsBuyAgainLoading(true);
    const productBoData = await getProduct(order_params.product_msn);
    let productData = {...productBoData.data.productBO};

    await addtoCart(
      cart,
      order_params.product_msn,
      productData,
      dispatch,
      sessionId,
      token,
      props.navigation,
      order_params.Quantity,
      false,
      true,
      false,
      'true',
      false,
      () => {
        adobeBuyAgainTrackEvent(productData, order_params);
        clickStreamBuyAgainEvent(productData, order_params);
        webEngageBuyAgainEvent(productData, order_params);
      },
    );
    setIsBuyAgainLoading(false);
  };

  const webEngageBuyAgainEvent = (productData, order_params) => {
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
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.discount,
      'Image URL': `https://cdn.moglix.com/${
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn].images &&
        productData.productPartDetails[order_params.product_msn].images[0] &&
        productData.productPartDetails[order_params.product_msn].images[0]
          .links &&
        productData.productPartDetails[order_params.product_msn].images[0].links
          .medium
      }`,
      Price:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.priceWithoutTax,
      'Product Id': order_params.product_msn,
      'Product Name': productData && productData.productName,
      Quantity: order_params.Quantity || 1,
      'Retail Price':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.mrp,
    };

    webEngageTracking('addedToCart', webengageAddBuyObj);
  };

  const adobeBuyAgainTrackEvent = (productData, order_params) => {
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
      'myapp.linkpagename': 'moglix:account dashboard-myorders',
      'myapp.ctaname': 'add to cart_BUYAGAIN',
      'myapp.channel': 'orderdetails',
      'myapp.subSection': 'moglix:account dashboard-myorders',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': order_params.product_msn,
      'myapp.productPrice': order_params.price_without_tax,
      'myapp.quantity': order_params.Quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags,
      'myapp.parentID': productData.partNumber,
      '&&products':
        ';' +
        productData.partNumber +
        ';' +
        order_params.Quantity +
        ';' +
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.sellingPrice *
          order_params.Quantity +
        ';',
      '&&events': 'scAdd,event7',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const clickStreamBuyAgainEvent = (productData, order_params) => {
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
      label: 'add_to_cart_buyagain',
      page_type: 'order_details_page',
      channel: 'OrderDetails',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[order_params.product_msn] &&
          productData.productPartDetails[order_params.product_msn]
            .productPriceQuantity &&
          productData.productPartDetails[order_params.product_msn]
            .productPriceQuantity.india &&
          productData.productPartDetails[order_params.product_msn]
            .productPriceQuantity.india.sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData.outOfStock,
      quantity: order_params.Quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  const fetchOrdersData = pageIndex => {
    if (authenticated == 'true') {
      let parsedFromDate = new Date(
        DATE_RANGES.find(_ => _.title == initialDateRange).fromDate,
      );
      // let parsedToDate = ;
      // DATE_RANGES.find(_ => _.title == initialDateRange).toDate,
      let parsedToDate = DATE_RANGES.find(
        _ => _.title == initialDateRange,
      ).toDate;
      dispatch(
        fetchOrders(
          {
            customerId: userId,
            pageNo: pageIndex,
            productName: search,
            status: initialStatus == 'all' ? '' : initialStatus,
            toDate: `${parsedToDate.getFullYear()}-${
              String(parsedToDate.getMonth() + 1).length > 1
                ? parsedToDate.getMonth() + 1
                : 0 + String(parsedToDate.getMonth() + 1)
            }-${
              String(parsedToDate.getDate()).length > 1
                ? parsedToDate.getDate()
                : 0 + String(parsedToDate.getDate())
            }`,
            fromDate: `${parsedFromDate.getFullYear()}-${
              String(parsedFromDate.getMonth() + 1).length > 1
                ? parsedFromDate.getMonth() + 1
                : 0 + String(parsedFromDate.getMonth() + 1)
            }-${
              String(parsedFromDate.getDate()).length > 1
                ? parsedFromDate.getDate()
                : 0 + String(parsedFromDate.getDate())
            }`,
            pageSize: 10,
          },
          sessionId,
          token,
        ),
      );
    }
  };

  //handling loader
  useEffect(() => {
    if (ordersStatus === STATE_STATUS.FETCHED && loader) {
      setLoader(false);
    }
  }, [ordersStatus]);

  //onEndReached api hit
  const endReachedfetchListing = () => {
    if (
      ordersStatus === STATE_STATUS.FETCHED &&
      ordersStatus !== STATE_STATUS.FETCHING &&
      pageNo < maxPage &&
      !loader
    ) {
      fetchOrdersData(pageNo);
    }
  };

  const ORDERS_PROGRESS = {
    ACCEPTED: '20%',
    PACKED: '60%',
    PROCESSING: '40%',
    SHIPPED: '80%',
  };

  const onClearFilter = () => {
    console.log('dewfewfewefwefew');
    setInitialDateRange('Last 6 months');
    setInitialStatus('all');
    setOrderFilterModalVisible(false);
  };

  const renderOrderStatus = product => {
    if (
      [
        'PAYMENT PENDING',
        'PAYMENT FAILED',
        'DELIVERED',
        'EXCHANGE REQUESTED',
        'EXCHANGE REJECTED',
        'RETURN REJECTED',
        'RETURN REQUESTED',
        'EXCHANGE APPROVED',
        'RETURN APPROVED',
        'CANCELLED',
        'STATUS PENDING',
        'RETURN TO ORIGIN',
        'EXCHANGE DONE',
        'RETURN DONE',
        'RETURN PICKED',
        'EXCHANGE PICKED',
      ].includes(product.itemStatus)
    ) {
      return (
        <View style={styles.footerCardItem}>
          <View style={styles.orderDate}>
            <View style={styles.wrapView}>
              <Text style={styles.orderStatus}>{product.itemStatus}</Text>
            </View>

            <Text style={styles.date}>
              {product.lastUpdatedAt
                ? product.lastUpdatedAt.split(' ')[0]
                : null}
            </Text>
          </View>
          {['DELIVERED', 'CANCELLED', 'RETURN DONE'].includes(
            product.itemStatus,
          ) ? (
            <TouchableOpacity
              onPress={() =>
                onBuyAgain({
                  product_msn: product.productId,
                  price_without_tax: product.price,
                  Quantity: product.quantity,
                })
              }
              style={styles.buyagain}>
              {/* {buyAgainLoading && (
                <ActivityIndicator
                  size={'small'}
                  color={colors.RedThemeColor}
                />
              )} */}
              <Text style={styles.buyagaintext}>BUY AGAIN</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return (
        <View style={styles.footerCardItem}>
          <View style={styles.orderDate}>
            <View style={styles.wrapView1}>
              <Text style={styles.orderStatus}>{product.itemStatus}</Text>
            </View>
            <Text style={styles.date}>
              {product.lastUpdatedAt
                ? product.lastUpdatedAt.split(' ')[0]
                : null}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.dot, styles.greenDot]}></View>
            <View style={[styles.progressLine]}>
              <View
                style={[
                  styles.progressGreenLine,
                  {width: ORDERS_PROGRESS[product.itemStatus] || '30%'},
                ]}></View>
            </View>
            <View style={styles.dot}></View>
          </View>
          <View style={styles.etDate}>
            <Text style={styles.orderStatus}>ETD</Text>
            <Text style={styles.date}>
              {product.estimatedDelivery
                ? product.estimatedDelivery.split(' ')[0]
                : null}
            </Text>
          </View>
          {/* <TouchableOpacity style={styles.buyagain}>
            <Text style={styles.buyagaintext}>BUY AGAIN</Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.orderWrap}>
      <TouchableOpacity style={styles.cardView}>
        <Text style={styles.orderNumText}>Order No. {item.orderId}</Text>
        <Text style={styles.orderNumText}>{item.items.length} Item(s)</Text>
      </TouchableOpacity>
      {item.items.map((singleProduct, singleProductKey) => (
        <TouchableOpacity
          style={styles.prodCard}
          onPress={() => {
            dispatch(fetchOrderDetails(userId, item.orderId, sessionId, token));
            props.navigation.push('OrderDetails', {
              order: {...singleProduct},
            });
          }}
          key={singleProductKey}>
          <View style={styles.prodDetailWrap}>
            <Image
              source={{uri: singleProduct.productImageUrl}}
              style={styles.leftImageIcon}
              resizeMode="contain"
            />
            <View style={styles.prodDetail}>
              <Text style={styles.prodName} numberOfLines={2}>
                {singleProduct.productName}
              </Text>
              <View style={styles.priceqty}>
                <View style={styles.priceCol}>
                  <Text style={styles.price}>
                    ₹{applyThousandSeparator(singleProduct.price)}{' '}
                  </Text>
                  <Text style={styles.qty}>({singleProduct.quantity} Qty)</Text>
                </View>
                <FAIcon name={'angle-right'} size={24} />
              </View>
            </View>
          </View>
          {renderOrderStatus(singleProduct)}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLoader = () => (
    <View style={{height: '100%'}}>
      <ActivityIndicator
        size={'large'}
        color={'red'}
        style={styles.activityIndicator}
      />
    </View>
  );

  const renderOrders = () => (
    <FlatList
      data={ordersData || []}
      keyExtractor={(item, index) => `${index}-item`}
      renderItem={renderItem}
      onEndReachedThreshold={0.9}
      onEndReached={endReachedfetchListing}
      ListFooterComponent={
        ordersStatus == STATE_STATUS.FETCHING ? renderLoader : null
      }
      ListEmptyComponent={listEmptyComponent}
    />
  );

  const listEmptyComponent = () =>
    ordersStatus == STATE_STATUS.FETCHED ||
    ordersStatus == STATE_STATUS.UNFETCHED ? (
      <View style={styles.noOrders}>
        <View style={styles.whiteBgWithImage}>
          <Image
            source={require('../../assets/images/noorders.png')}
            style={styles.noOrderImage}
            resizeMode="contain"
          />
          <Text style={styles.noOrderText}>
            {authenticated == 'true'
              ? 'No orders currently'
              : 'Please sign In to view you orders'}
          </Text>
          {authenticated != 'true' && (
            <TouchableOpacity
              onPress={() => props.navigation.push('Auth')}
              style={styles.redBtn}>
              <Text style={styles.BtnText}>SIGN IN</Text>
            </TouchableOpacity>
          )}
        </View>
        {authenticated == 'true' ? (
          <Text style={styles.noOrderContent}>
            You don’t have any active orders. When you place a order you will
            see your order status here.
          </Text>
        ) : null}
      </View>
    ) : null;

  const renderListing = () => {
    if (authenticated != 'true' && ordersStatus == STATE_STATUS.UNFETCHED) {
      return renderOrders();
    } else if (
      loader ||
      (pageNo == 0 &&
        [STATE_STATUS.UNFETCHED, STATE_STATUS.FETCHING].includes(ordersStatus))
    ) {
      return renderLoader();
    } else {
      return renderOrders();
    }
  };

  useEffect(() => {
    if (!loader && initialDateRange && initialStatus) {
      setLoader(true);
      fetchOrdersData(0);
    }
  }, [initialStatus, initialDateRange]);

  const applyFilter = (dateFilter, statusFilter) => {
    setInitialDateRange(dateFilter);
    setInitialStatus(statusFilter);
    setOrderFilterModalVisible(false);
  };

  return (
    <View style={styles.orderViewWrap}>
      <Header
        navigation={props.navigation}
        // showBack
        showCart
        showWishlist
        showSearch
        showLargeSearch
        // showText={'My Orders'}
      />
      {/* <View style={styles.myOrderHead}>
        <Text style={styles.myOrderTxt}>My Orders</Text>
      </View> */}

      {authenticated == 'true' && (
        <View style={styles.orderSearchWrap}>
          <View style={styles.LogoRow}>
            <FeatherIcon
              name={'search'}
              size={22}
              color={'#000'}
              onPress={onSearch}
            />
            <TextInput
              style={styles.searchText}
              placeholder={'Search orders by product name'}
              placeholderTextColor={'grey'}
              value={search}
              onChangeText={text => setSearch(text)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.listWrapInner}
              onPress={() => setOrderFilterModalVisible(true)}>
              <MaterialCommunityIcon name="filter-variant" size={22} />
              <Text style={styles.listHeaderText}>Filters</Text>
              {initialStatus !== 'all' ||
              initialDateRange !== 'Last 6 months' ? (
                <View style={styles.filterCountWrap}>
                  <Text style={styles.filterCountText}>
                    {initialStatus !== 'all' &&
                    initialDateRange !== 'Last 6 months'
                      ? 2
                      : 1}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <ScrollView> */}
      {renderListing()}
      {/* </ScrollView> */}
      {/* Show Filter Modal in New Design by Monika  */}
      {OrderFilterModalVisible && (
        <OrderFilterModal
          isVisible={OrderFilterModalVisible}
          onClearFilter={onClearFilter}
          onApplyFilter={applyFilter}
          initialDateRange={initialDateRange}
          initialStatus={initialStatus}
          onClose={() => setOrderFilterModalVisible(false)}
        />
      )}
    </View>
  );
};

export default OrdersScreen;
