import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {applyThousandSeparator, getBrand} from '../../generic';
import KeyFeatures from './KeyFeatures';
import {OrderedMap} from 'immutable';
import {useSelector} from 'react-redux';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const ProductListView = props => {
  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || '',
  );

  const [loader, setLoader] = useState(false);
  const {item, listingStyle} = props;

  useEffect(() => {
    if (!props.parentLoader) {
      setLoader(false);
    }
  }, [props.parentLoader]);

  const renderFilterAttributes = item => {
    return new OrderedMap(item.filterableAttributes || {})
      .map((_, i) => <Text style={styles.featureType}>{_}</Text>)
      .toList();
  };

  const renderkeyFeatures = item => {
    return ((item && item.keyFeatures) || []).map((_, i) => {
      if (i < 2) {
        return (
          <View style={styles.flist}>
            <View style={styles.greydot}></View>
            <Text style={styles.listText}>{_}</Text>
          </View>
        );
      }
    });
  };

  const addCartQuery = () => {
    return (
      <View style={styles.price}>
        {item.outOfStock ||
        item.oos ||
        item.quantityAvailable == 0 ||
        (item &&
          item.productDetail &&
          item.productDetail.productBO &&
          item.productDetail.productBO.outOfStock) ? null : (
          <View style={styles.leftPrice}>
            <Text style={styles.mainPrice}>
              ₹
              {applyThousandSeparator(
                item.priceWithoutTax ||
                  item.pricewithouttax ||
                  (item &&
                    item.productDetail &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct || item.productId
                    ] &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct || item.productId
                    ].productPriceQuantity &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct || item.productId
                    ].productPriceQuantity['india'] &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct || item.productId
                    ].productPriceQuantity['india'].priceWithoutTax) ||
                  0,
              )}
            </Text>
            {item.itemInPack &&
            item.itemInPack != '1 piece' &&
            item.itemInPack != '1 Piece' ? (
              <Text style={styles.qty}>
                {item.itemInPack && item.itemInPack.split(' ')[0] > 1
                  ? `Qty/pack - ${item.itemInPack}`
                  : null}
              </Text>
            ) : null}
          </View>
        )}
        {!props.fromHome ? (
          item.outOfStock ||
          item.oos ||
          item.quantityAvailable == 0 ||
          (item &&
            item.productDetail &&
            item.productDetail.productBO &&
            item.productDetail.productBO.outOfStock) ? (
            <View style={styles.price}>
              <View style={styles.leftQueryArea}>
                <Text style={styles.availRequest}>Available on Request</Text>
              </View>
              <TouchableOpacity
                style={styles.sendQueryBtn}
                onPress={() => {
                  if (authenticated == 'true') {
                    props.rfqRequirementFromListing(item);
                  } else {
                    props.navigation.navigate('Auth');
                  }
                }}>
                <Text style={styles.sendQueryText}>SEND QUERY</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartBtn}
              disabled={loader}
              onPress={() => {
                if (props.fromListing) {
                  setLoader(true);
                  props.addToCartFromListing(item.moglixPartNumber);
                } else {
                  setLoader(true);
                  props.addToCartFromListing(item);
                }
              }}>
              {loader && (
                <ActivityIndicator
                  color={'#fff'}
                  size={'small'}
                  style={styles.cartLoader}
                />
              )}
              {loader ? null : (
                <Text style={styles.addToCartText}>ADD TO CART</Text>
              )}
            </TouchableOpacity>
          )
        ) : null}

        {/* {!item.oos ||
          item.quantityAvailable != 0 ||
          (item &&
            item.productDetail &&
            item.productDetail.productBO &&
            !item.productDetail.productBO.outOfStock) ? (
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={() => console.log('This is addtocart button')}>
              <Text style={styles.addToCartText}>ADD TO CART</Text>
            </TouchableOpacity>
          ) : null} */}
      </View>
    );
  };

  const trackAdobe = product => {
    let msnId =
      product.partNumber ||
      product.moglixPartNumber ||
      product.msn ||
      product.idProduct ||
      product.productId;
    let sellingPrice =
      product.priceWithoutTax ||
      product.pricewithouttax ||
      (product &&
        product.productDetail &&
        product.productDetail.productBO.productPartDetails[
          product.idProduct || product.productId
        ] &&
        product.productDetail.productBO.productPartDetails[
          product.idProduct || product.productId
        ].productPriceQuantity &&
        product.productDetail.productBO.productPartDetails[
          product.idProduct || product.productId
        ].productPriceQuantity['india'] &&
        product.productDetail.productBO.productPartDetails[
          product.idProduct || product.productId
        ].productPriceQuantity['india'].priceWithoutTax) ||
      0;
    let code = props.params + '_' + msnId;

    var adobeData = {
      'myapp.linkpageName': 'moglix:home',
      'myapp.ctaname': code,
      'myapp.linkName': code,
      '&&products': `;${msnId};1;${sellingPrice}`,
      '&&events': 'event21',
    };
    let dataTracking = {
      event_type: 'click',
      label: `home_page_click_${props.params}`,
      channel: 'Home',
      page_type: `home_page`,
    };
    sendClickStreamData(dataTracking);
    trackStateAdobe('moglix.home', adobeData);
  };

  return (
    <TouchableOpacity
      style={[
        styles.cardView,
        listingStyle,
        {...(props.parentStyles || {})},
        props.fromPdp
          ? {
              marginHorizontal: 0,
              marginBottom: 0,
              marginRight: Dimension.margin15,
            }
          : null,
        props.fromSimilarPdp
          ? {
              flex: 0.8,
              maxWidth: Dimensions.get('window').width * 0.8,
            }
          : null,
      ]}
      onPress={() => {
        if (props.fromHome) {
          trackAdobe(item);
        }
        props.navigation.push('Product', {
          msn:
            item.partNumber ||
            item.moglixPartNumber ||
            item.msn ||
            item.idProduct ||
            item.productId,
        });
      }}>
      {item.productTags && item.productTags.length ? (
        <Image
          source={{uri: item.productTags[0].tagImageLink}}
          resizeMode="contain"
          style={styles.prodTags}
        />
      ) : null}
      <View style={styles.prodAreaTop}>
        <Image
          source={{
            uri: item.productImg
              ? item.productImg
              : 'https://cdn.moglix.com/' +
                (Platform.OS == 'android'
                  ? item.imageWebp ||
                    item.imageLink ||
                    item.mainImageLink ||
                    item.imageLink_medium ||
                    item.imageLink_small ||
                    (item.productDetail &&
                      item.productDetail.productBO &&
                      item.productDetail.productBO.productPartDetails &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].images &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].images[0] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].images[0].links.medium)
                  : item.imageLink ||
                    item.mainImageLink ||
                    item.imageLink_medium ||
                    item.imageLink_small ||
                    (item.productDetail &&
                      item.productDetail.productBO &&
                      item.productDetail.productBO.productPartDetails &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].images &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].images[0] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].images[0].links.medium)),
          }}
          style={styles.leftProdImage}
          resizeMode="contain"
        />
        <View style={styles.rightArea}>
          <View style={styles.rateProd}>
            {item.avgRating ? (
              <TouchableOpacity style={styles.prodRating}>
                <Text style={styles.ratingCount}>
                  {item.avgRating.toFixed(1)}
                </Text>
                <FAIcon name="star" style={styles.starIcon} />
              </TouchableOpacity>
            ) : null}
            {/* <Text style={styles.reviewCount}>({})</Text> */}
          </View>
          <Text numberOfLines={2} style={styles.prodName}>
            {item.productName}
          </Text>
          <Text style={styles.bybrand}>
            By :{' '}
            {item.brandName ||
              getBrand(item.short_description) ||
              item.brandName ||
              (item &&
                item.productDetail &&
                item.productDetail.productBO.brandDetails.brandName)}
          </Text>
          {item.outOfStock ||
          item.oos ||
          item.quantityAvailable == 0 ||
          item.outOfStock ||
          (item &&
            item.productDetail &&
            item.productDetail.productBO &&
            item.productDetail.productBO.outOfStock) ? null : (
            <View style={styles.percentOff}>
              <Text style={styles.offPrice}>
                ₹
                {applyThousandSeparator(
                  item.priceMrp ||
                    item.totalPayableAmount ||
                    item.mrp ||
                    (item &&
                      item.productDetail &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].productPriceQuantity &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].productPriceQuantity['india'] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].productPriceQuantity['india'].mrp) ||
                    0,
                )}
              </Text>

              <Text style={styles.greenText}>
                {Math.floor(
                  ((parseInt(
                    (item.productDetail &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].productPriceQuantity &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].productPriceQuantity['india'] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct || item.productId
                      ].productPriceQuantity['india'].mrp) ||
                      item.priceMrp ||
                      item.mrp ||
                      item.productUnitPrice,
                  ) -
                    parseInt(
                      (item.productDetail &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ] &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ].productPriceQuantity &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ].productPriceQuantity['india'] &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ].productPriceQuantity['india'].priceWithoutTax) ||
                        item.priceWithoutTax ||
                        item.pricewithouttax,
                    )) /
                    parseInt(
                      (item.productDetail &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ] &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ].productPriceQuantity &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ].productPriceQuantity['india'] &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct || item.productId
                        ].productPriceQuantity['india'].mrp) ||
                        item.priceMrp ||
                        item.mrp ||
                        item.productUnitPrice,
                    )) *
                    100,
                )}
                % OFF
              </Text>
            </View>
          )}

          {!props.fromSimilarPdp ? (
            addCartQuery()
          ) : (
            <View style={styles.price}>
              {item.outOfStock ||
              item.oos ||
              item.quantityAvailable == 0 ||
              (item &&
                item.productDetail &&
                item.productDetail.productBO &&
                item.productDetail.productBO.outOfStock) ? null : (
                <View style={styles.leftPrice}>
                  <Text style={styles.mainPrice}>
                    ₹
                    {applyThousandSeparator(
                      item.priceWithoutTax ||
                        item.pricewithouttax ||
                        (item &&
                          item.productDetail &&
                          item.productDetail.productBO.productPartDetails[
                            item.idProduct || item.productId
                          ] &&
                          item.productDetail.productBO.productPartDetails[
                            item.idProduct || item.productId
                          ].productPriceQuantity &&
                          item.productDetail.productBO.productPartDetails[
                            item.idProduct || item.productId
                          ].productPriceQuantity['india'] &&
                          item.productDetail.productBO.productPartDetails[
                            item.idProduct || item.productId
                          ].productPriceQuantity['india'].priceWithoutTax) ||
                        0,
                    )}
                  </Text>
                </View>
              )}
            </View>
          )}
          {props.fromHome &&
          // props.params == 'recentlyViewed' &&
          (item.outOfStock ||
            item.oos ||
            item.quantityAvailable == 0 ||
            (item &&
              item.productDetail &&
              item.productDetail.productBO &&
              item.productDetail.productBO.outOfStock)) ? (
            <Text style={styles.availRequest}>Available on Request</Text>
          ) : null}
        </View>
      </View>
      {!props.fromViewAll && (
        <>
          <View style={styles.feature}>{renderFilterAttributes(item)}</View>
          <View style={styles.featureList}>{renderkeyFeatures(item)}</View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: Dimension.margin10,
    marginVertical: Dimension.margin5,
    marginRight: Dimension.margin15,
    borderRadius: Dimension.borderRadius8,
    borderColor: '#EFEFF4',
    borderWidth: 1,
    overflow: 'hidden',
    padding: Dimension.padding12,
    position: 'relative',
    paddingBottom: Dimension.margin12,
    // shadowColor: 'rgba(0,0,0,0.5)',
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.8,
    //   shadowRadius: 1,
    //   elevation: 2,
    maxWidth: Dimensions.get('window').width * 0.95,
  },
  prodName: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    paddingRight: Dimension.padding15,
    fontFamily: Dimension.CustomRegularFont,
  },
  leftProdImage: {
    width: Dimension.prdListViewImage,
    height: Dimension.prdListViewImage,
    marginTop: Dimension.margin12,
  },
  rightArea: {
    paddingLeft: Dimension.padding15,
    position: 'relative',
    width: '75%',
  },
  rateProd: {flexDirection: 'row', marginBottom: Dimension.margin5},
  prodRating: {
    flexDirection: 'row',
    backgroundColor: colors.ratingColor,
    borderRadius: Dimension.borderRadius4,
    paddingHorizontal: Dimension.padding6,
    height: 20,
    alignItems: 'center',
  },
  ratingCount: {
    color: '#fff',
    fontSize: Dimension.font11,
    marginTop: -2,
    fontFamily: Dimension.CustomRobotoBold,
  },
  starIcon: {color: '#fff', fontSize: Dimension.font8, marginLeft: 3},
  reviewCount: {
    marginLeft: 5,
    color: colors.ExtralightGrayText,
    fontSize: Dimension.font11,
    alignSelf: 'center',
  },
  wishlist: {position: 'absolute', right: 0, top: -5},
  prodAreaTop: {flexDirection: 'row', flex: 1},
  wishlistIcon: {fontSize: Dimension.font18, color: colors.ExtralightGrayText},
  wishlistIconActive: {fontSize: Dimension.font18, color: colors.RedThemeColor},
  bybrand: {
    color: colors.lightGrayText,
    fontSize: Dimension.font11,
    // marginBottom: ,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  percentOff: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -Dimension.margin4,
  },
  offPrice: {
    fontSize: Dimension.font11,
    color: colors.lightGrayText,
    fontFamily: Dimension.CustomRobotoRegular,
    marginTop: -Dimension.margin4,
    textDecorationLine: 'line-through',
  },
  greenText: {
    fontSize: Dimension.font12,
    color: colors.ratingColor,
    fontFamily: Dimension.CustomBoldFont,
    paddingLeft: Dimension.padding8,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // borderWidth:1,
  },
  mainPrice: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    color: colors.PrimaryTextColor,
  },
  qty: {
    fontSize: Dimension.font10,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
  },
  addToCartBtn: {
    paddingHorizontal: Dimension.padding10,
    backgroundColor: colors.RedThemeColor,
    paddingVertical: Dimension.padding8,
    borderRadius: Dimension.borderRadius4,
    flexDirection: 'row',
    width: 'auto',
    height: 30,
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: -Dimension.margin10,
  },
  // addToCartBtn1: {
  //   paddingHorizontal: Dimension.padding10,
  //   backgroundColor: colors.RedThemeColor,
  //   paddingVertical: Dimension.padding8,
  //   borderRadius: Dimension.borderRadius4,
  //   flexDirection: 'row',
  //   width:90,
  //   marginTop: -Dimension.margin10,
  // },
  addToCartText: {
    fontSize: Dimension.font12,
    color: '#fff',
    fontFamily: Dimension.CustomRobotoBold,
  },
  cartLoader: {
    marginLeft: Dimension.margin5,
    // backgroundColor:'red',
    height: Dimension.height11,
  },
  availRequest: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.PrimaryTextColor,
  },
  sendQueryBtn: {
    paddingHorizontal: Dimension.padding15,
    borderWidth: 1,
    borderColor: colors.RedThemeColor,
    paddingVertical: Dimension.padding8,
    borderRadius: Dimension.borderRadius4,
    marginTop: -Dimension.margin10,
  },
  sendQueryText: {
    fontSize: Dimension.font11,
    color: colors.RedThemeColor,
    fontFamily: Dimension.CustomRobotoBold,
  },
  feature: {
    flexDirection: 'row',
    marginVertical: Dimension.margin10,
    marginBottom: Dimension.margin4,
  },
  featureType: {
    paddingTop: Dimension.padding4,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    textAlign: 'center',
    borderColor: colors.ProductBorderColor,
    borderRadius: Dimension.borderRadius4,
    marginRight: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font10,
    color: colors.ExtralightGrayText,
    paddingHorizontal: Dimension.padding5,
  },
  flist: {flexDirection: 'row', marginBottom: Dimension.margin4},
  greydot: {
    width: Dimension.width8,
    height: Dimension.width8,
    borderRadius: Dimension.borderRadius16,
    backgroundColor: colors.ExtralightGrayText,
    marginRight: 10,
    marginTop: 4,
  },
  listText: {
    fontSize: Dimension.font11,
    // width:'90%',
    flex: 1,
    lineHeight: Dimension.height16,
    color: colors.lightGrayText,
    fontFamily: Dimension.CustomMediumFont,
  },
  prodTags: {
    width: Dimension.width60,
    zIndex: 1,
    height: Dimension.height24,
    top: -Dimension.margin2,
    left: 0,
    position: 'absolute',
  },
});

export default ProductListView;
