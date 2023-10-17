import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import {useDispatch, useSelector} from 'react-redux';
import SectionTitle from './SectionTitle';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductGridView from '../Common/ProductGridView';
import {addtoCart, bulkAddtoCart} from '../../generic/Cart/index';
import colors from '../../redux/constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

// import {useIsFocused} from '@react-navigation/native';

const Fbt = props => {
  const {cartFBT, cartFBTWrap} = props;
  const dispatch = useDispatch();
  const fbtProducts = useSelector(
    state => state.productsReducer[props.msn].fbtProducts || {},
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );

  const [fbtProductsData, setFbtProductsData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (fbtProducts.data) {
      let productsData = [
        {...props.productData, isParent: true, checked: true},
        ...fbtProducts.data.map(_ => ({..._, checked: !props.isModal})),
      ];
      setFbtProductsData([...productsData]);
    }
  }, []);

  const renderItemGrid = ({item}) => (
    <>
      <View style={[styles.fbtFlatListItem, cartFBT]}>
        {!props.fromCart && (
          <MaterialCommunityIcon
            name={item.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
            color={item.checked ? colors.BlueText : colors.PrimaryTextColor}
            size={28}
            onPress={() => selectedData(item.partNumber)}
          />
        )}
        <ProductGridView
          item={item}
          fromViewAll
          gridstyleFBT={styles.gridstyle}
          navigation={{
            ...props.navigation,
            push: (screen, params) => {
              props.navigation.push(screen, params);
              if (props.setIsModalVisible) {
                props.setIsModalVisible(false);
              }
            },
          }}
        />
        {!props.fromPdp && !(item && item.outOfStock) ? (
          <TouchableOpacity
            style={styles.addcartBtn}
            onPress={() => addProductToCart(item)}>
            <Text style={styles.addcartBtnText}>ADD TO CART</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );

  const selectedData = msn => {
    let currData = [...fbtProductsData];
    currData = currData.map(_ => ({
      ..._,
      checked: msn == _.partNumber ? !_.checked : _.checked,
    }));
    setFbtProductsData([...currData]);
  };

  const addProductsToCart = async () => {
    setLoader(true);
    await bulkAddtoCart(
      cart,
      fbtProductsData
        .filter(_ => _.checked)
        .map(_ => ({
          ..._,
          quantity: _.isParent ? props.quantity : 1,
        })),
      dispatch,
      sessionId,
      token,
      props.navigation,
    );
    adobeProductsAddCartEventTrack(fbtProductsData);
    clickStreamBuyTogether(fbtProductsData);
    setLoader(false);
  };

  const skiptoCart = async () => {
    setLoader(true);
    if (props.isModal) {
    }
    await addtoCart(
      cart,
      props.productData.partNumber,
      props.productData,
      dispatch,
      sessionId,
      token,
      props.navigation,
      props.quantity,
      false,
      true,
    );
    adobeAddCartTrackEvent(
      props.productData.partNumber,
      props.productData,
      props.quantity,
    );
    clickStreamAddCart(
      props.productData.partNumber,
      props.productData,
      props.quantity,
    );
    if (props.setIsModalVisible) {
      props.setIsModalVisible(false);
    }
    setLoader(false);
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
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: pdp`,
      'myapp.ctaname': 'skip & go to cart',
      'myapp.channel': 'pdp',
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

  const adobeProductsAddCartEventTrack = fbtProducts => {
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
    let products = [];
    let quantity = [];
    if (fbtProducts && fbtProducts.length) {
      (fbtProducts || []).forEach(item => {
        let cats =
          item && item.categoryDetails
            ? item.categoryDetails[0] &&
              item.categoryDetails[0].taxonomyCode &&
              item.categoryDetails[0].taxonomyCode.split('/')
            : [];
        prices.push(
          item.productPartDetails &&
            item.productPartDetails[item.partNumber] &&
            item.productPartDetails[item.partNumber].productPriceQuantity &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ] &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ].sellingPrice,
        );
        quantity.push(
          item.productPartDetails &&
            item.productPartDetails[item.partNumber] &&
            item.productPartDetails[item.partNumber].productPriceQuantity &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ] &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ].moq,
        );
        msns.push(item.partNumber);
        brand.push(item.brandDetails.brandName);
        products.push(
          ';' + item.partNumber + ';' + 1 + ';' + item.productPartDetails &&
            item.productPartDetails[item.partNumber] &&
            item.productPartDetails[item.partNumber].productPriceQuantity &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ] &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ].sellingPrice *
              1 +
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

    trackStateAdobe('moglix: add to cart_FBT', {
      'myapp.linkpagename':
        'moglix:' + catL1[0] + ':' + catL2[0] + ':' + catL3[0] + `: pdp`,
      'myapp.ctaname': 'moglix: add to cart_FBT',
      'myapp.channel': 'pdp',
      'myapp.subSection':
        'moglix:' + catL1[0] + ':' + catL2[0] + ':' + catL3[0] + `: pdp`,
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
      'myapp.quantity': quantity.join('|'),
      'myapp.brand': brand.join('|'),
    });
  };

  const clickStreamBuyTogether = fbtProducts => {
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
    let products = [];
    let quantity = [];
    let productNames = [];
    let oos = [];
    if (fbtProducts && fbtProducts.length) {
      (fbtProducts || []).forEach(item => {
        let cats =
          item && item.categoryDetails
            ? item.categoryDetails[0] &&
              item.categoryDetails[0].taxonomyCode &&
              item.categoryDetails[0].taxonomyCode.split('/')
            : [];
        prices.push(
          item.productPartDetails &&
            item.productPartDetails[item.partNumber] &&
            item.productPartDetails[item.partNumber].productPriceQuantity &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ] &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ].sellingPrice,
        );
        productNames.push(item.productName);
        quantity.push(
          item.productPartDetails &&
            item.productPartDetails[item.partNumber] &&
            item.productPartDetails[item.partNumber].productPriceQuantity &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ] &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ].moq,
        );
        msns.push(item.partNumber);
        brand.push(item.brandDetails.brandName);
        oos.push(item.outOfStock);

        products.push(
          ';' + item.partNumber + ';' + 1 + ';' + item.productPartDetails &&
            item.productPartDetails[item.partNumber] &&
            item.productPartDetails[item.partNumber].productPriceQuantity &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ] &&
            item.productPartDetails[item.partNumber].productPriceQuantity[
              'india'
            ].sellingPrice *
              1 +
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
    let dataTracking = {
      event_type: 'click',
      label: 'buy_together',
      page_type: 'product_page',
      channel: 'PDP',
      product_name: productNames.join('|'),
      priceWithTax: prices.join('|'),
      brandName: brand.join('|'),
      quantity: quantity.join('|'),
      category_l1: catL1.join('|'),
      category_l2: catL2.join('|'),
      category_l3: catL3.join('|'),
      outOfStock: oos.join('|'),
    };

    sendClickStreamData(dataTracking);
  };

  const addProductToCart = async item => {
    setLoader(true);
    await addtoCart(
      cart,
      item.partNumber,
      item,
      dispatch,
      sessionId,
      token,
      props.fromPdp ? props.navigation : {push: () => {}},
      1,
      true,
      true,
    );

    setLoader(false);
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
      label: props.isModal ? 'skip_&_go_to_cart' : 'add_to_cart_fbt',
      page_type: 'product_page',
      channel: 'PDP',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData.outOfStock,
      quantity: quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };
  const renderButton = () =>
    (fbtProductsData.filter(_ => !_.isParent && _.checked) || []).length ? (
      <TouchableOpacity style={styles.buyBtn} onPress={addProductsToCart}>
        {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
        <Text style={styles.buyBtnText}>BUY TOGETHER</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.buyBtn} onPress={skiptoCart}>
        {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
        <Text style={styles.SkipbuyBtnText}>
          {props.isModal ? 'SKIP AND GO TO CART' : 'ADD TO CART'}
        </Text>
      </TouchableOpacity>
    );

  return (
    <>
      <View style={[styles.fbtWrap, cartFBTWrap]}>
        {props.fromPdp ? (
          <>
            <View style={styles.modalHeader}>
              <SectionTitle Title={'Frequently Bought Together'} />
              {props.isModal && (
                <TouchableOpacity onPress={skiptoCart}>
                  <MaterialCommunityIcon name={'close-circle'} size={24} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.fbtmainRow}>
              <Image
                source={{
                  uri:
                    Platform.OS == 'android'
                      ? 'https://cdn.moglix.com/' +
                        (props.productData &&
                          props.productData.productPartDetails &&
                          props.productData.productPartDetails[props.msn] &&
                          props.productData.productPartDetails[props.msn]
                            .images &&
                          props.productData.productPartDetails[props.msn]
                            .images[0] &&
                          props.productData.productPartDetails[props.msn]
                            .images[0].links &&
                          props.productData.productPartDetails[props.msn]
                            .images[0].links.medium)
                      : 'https://img.moglimg.com/' +
                        (props.productData &&
                          props.productData.productPartDetails &&
                          props.productData.productPartDetails[props.msn] &&
                          props.productData.productPartDetails[props.msn]
                            .images &&
                          props.productData.productPartDetails[props.msn]
                            .images[0] &&
                          props.productData.productPartDetails[props.msn]
                            .images[0].links &&
                          props.productData.productPartDetails[props.msn]
                            .images[0].links.medium),
                }}
                style={styles.fbtMainImage}
                resizeMode="contain"
              />

              <View style={styles.fbtMainContentView}>
                <Text style={styles.thisItem}>This Item</Text>
                <Text style={styles.fbtMainProdName}>
                  {props && props.productData && props.productData.productName}
                </Text>
              </View>
            </View>
          </>
        ) : null}
        {props.fromCart && (
          <View style={styles.modalHeader}>
            <SectionTitle Title={'People also bought together'} />
          </View>
        )}
        <View style={styles.fbtFlatListRow}>
          <FlatList
            horizontal={true}
            data={(fbtProductsData || []).filter(_ => !_.isParent) || []}
            renderItem={renderItemGrid}
            keyExtractor={(item, index) => `key-${index}`}
          />
        </View>

        {props.fromPdp ? (
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amtPayable}>Total Payable (GST Extra)</Text>
              <Text style={styles.amtText}>
                ₹
                {(fbtProductsData || [])
                  .filter(_ => _.checked)
                  .reduce((accum, curr) => {
                    return (
                      accum +
                      curr.productPartDetails[curr.partNumber]
                        .productPriceQuantity['india'].priceWithoutTax
                    );
                  }, 0)}
              </Text>
            </View>
            {renderButton()}
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gridViewCard: {
    flexBasis: '50%',
    paddingHorizontal: Dimension.padding6,
    position: 'relative',
    marginBottom: Dimension.padding12,
  },
  fbtWrap: {
    padding: Dimension.padding15,
    backgroundColor: '#fff',
    marginTop: Dimension.margin8,
  },
  fbtMainImage: {
    width: Dimension.width50,
    height: Dimension.width50,
    marginRight: Dimension.margin15,
  },
  fbtmainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimension.padding15,
  },
  fbtMainContentView: {flex: 1, paddingRight: Dimension.padding15},
  thisItem: {
    backgroundColor: colors.brandbg,
    paddingVertical: Dimension.padding4,
    fontSize: Dimension.font11,
    width: Dimension.width50,
    textAlign: 'center',
    color: colors.lightGrayText,
    fontFamily: Dimension.CustomSemiBoldFont,
    borderRadius: Dimension.borderRadius4,
    marginBottom: Dimension.margin5,
  },
  fbtMainProdName: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.PrimaryTextColor,
  },
  fbtFlatListItem: {
    borderWidth: 1,
    padding: Dimension.padding10,
    marginRight: Dimension.margin15,
    borderColor: colors.ProductBorderColor,
    borderRadius: Dimension.borderRadius6,
  },
  fbtFlatListRow: {width: '100%'},
  gridstyle: {
    borderColor: 'transparent',
    padding: Dimension.padding5,
    borderWidth: 0,
    paddingBottom: 0,
    paddingTop: Dimension.padding12,
    width: Dimension.width120,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Dimension.padding12,
    paddingBottom: Dimension.padding4,
  },
  amtPayable: {
    fontSize: Dimension.font11,
    color: colors.lightGrayText,
    fontFamily: Dimension.CustomRegularFont,
  },
  amtText: {
    fontSize: Dimension.font18,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRobotoBold,
    marginTop: -Dimension.margin5,
  },
  buyBtn: {
    height: Dimension.height30,
    alignItems: 'center',
    backgroundColor: colors.RedThemeColor,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    borderRadius: Dimension.borderRadius6,
  },
  buyBtnText: {
    color: '#fff',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  SkipbuyBtnText: {
    color: '#fff',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  addcartBtn: {
    position: 'absolute',
    bottom: 0,
    height: Dimension.height30,
    alignItems: 'center',
    backgroundColor: colors.RedThemeColor,
    justifyContent: 'center',
    borderBottomLeftRadius: Dimension.borderRadius6,
    borderBottomRightRadius: Dimension.borderRadius6,
    left: 0,
    right: 0,
  },
  addcartBtnText: {
    color: '#fff',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Dimensions.margin8,
  },
});

export default Fbt;
