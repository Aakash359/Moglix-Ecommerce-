import React, {useState} from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Quantity from '../Common/Quantity';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import {applyThousandSeparator} from '../../generic';
import RemoveItem from './RemoveItem';
import SimilarProductModal from './SimilarProductModal';

const Cartcard = props => {
  const [details, setDetails] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showSimilarProduct, setShowSimilarproduct] = useState(false);

  return (
    <>
      {props.msg && props.msg.type == 'price' ? (
        <View
          style={{
            padding: Dimension.padding8,
            backgroundColor: colors.LightRedThemeColor,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <Text
            style={{
              color: colors.PrimaryTextColor,
              fontSize: Dimension.font10,
              fontFamily: Dimension.CustomSemiBoldFont,
            }}>
            {props.msg['data']['text1'].replace('₹', '') + ' '}
            <Text
              style={{
                color: colors.RedThemeColor,
                fontSize: Dimension.font10,
                fontFamily: Dimension.CustomRobotoBold,
                fontWeight: 'bold',
              }}>
              ₹{parseInt(props.msg['data']['oPrice']).toFixed(2)}
            </Text>{' '}
            {props.msg['data']['text2'].replace('₹', '')}
            <Text
              style={{
                color: colors.RedThemeColor,
                fontSize: Dimension.font10,
                fontFamily: Dimension.CustomRobotoBold,
                fontWeight: 'bold',
              }}>
              ₹{parseInt(props.msg['data']['nPrice']).toFixed(2)}
            </Text>
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.card,
          {
            position: 'relative',
            borderTopLeftRadius:
              props.msg && props.msg.type == 'oos'
                ? 0
                : Dimension.borderRadius6,
            borderTopRightRadius:
              props.msg && props.msg.type == 'oos'
                ? 0
                : Dimension.borderRadius6,
          },
        ]}>
        {props.msg && props.msg.type == 'oos' ? (
          // <View
          //   style={{
          //     zIndex: 100,
          //     position: 'absolute',
          //     // right: 10,
          //     // top: 10,
          //     flexDirection: 'row-reverse',
          //     borderTopLeftRadius: Dimension.borderRadius6,
          //     borderTopRightRadius: Dimension.borderRadius6,
          //     // backgroundColor: 'rgba(255,255,255,0.5)',
          //     // padding: Dimension.padding5,
          //   }}>
          <MaterialCommunityIcon
            name={'close-circle'}
            onPress={props.removeProduct}
            style={{
              zIndex: 100,
              position: 'absolute',
              right: 10,
              top: 10,
            }}
            color={'#000'}
            size={20}
          />
        ) : // </View>
        null}
        <View
          style={[
            {
              opacity: props.msg && props.msg.type == 'oos' ? 0.5 : 1,
            },
          ]}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.push('Product', {
                msn: props.productId,
              })
            }
            style={styles.prodImageName}>
            <Image
              source={{
                uri: props.productImg,
              }}
              style={styles.leftProdImage}
              resizeMode="contain"
            />
            <Text style={styles.prodName}>{props.productName}</Text>
          </TouchableOpacity>
          <View style={styles.qtyPrice}>
            {props.msg && props.msg.type == 'oos' ? (
              <Text
                style={{
                  fontSize: Dimension.font16,
                  fontFamily: Dimension.CustomBoldFont,
                  color: colors.PrimaryTextColor,
                  alignSelf: 'flex-end',
                }}>
                Not Available
              </Text>
            ) : (
              <Quantity
                {...props}
                minQuantity={1}
                fromCartCard
                showRemove={() => setShowRemove(true)}
                updateQuantity={props.updateQuantity}
              />
            )}
            {props.msg && props.msg.type == 'oos' ? null : (
              <TouchableOpacity
                onPress={() => setDetails(!details)}
                style={styles.seePriceWithTax}>
                <Text style={styles.price}>
                  ₹
                  {applyThousandSeparator(
                    props.priceWithoutTax * props.productQuantity,
                  )}
                </Text>
                <View style={styles.arrowWrap}>
                  <FAIcon
                    name={details ? 'angle-up' : 'angle-down'}
                    style={styles.arrowIcon}
                  />
                  {/* <FAIcon name="angle-up" style={styles.arrowIcon} /> */}
                </View>
              </TouchableOpacity>
            )}
          </View>
          {details ? (
            <>
              <View style={styles.collapsedArea}>
                <View style={styles.collapsedRow}>
                  <Text style={styles.gst}>GST @{props.taxPercentage}%</Text>
                  <Text style={[styles.gst, styles.gstVal]}>
                    ₹
                    {applyThousandSeparator(
                      (
                        (props.productUnitPrice - props.priceWithoutTax) *
                        props.productQuantity
                      ).toFixed(2),
                    )}
                  </Text>
                </View>
                <View style={styles.collapsedRow}>
                  <Text style={styles.gst}>Discount</Text>
                  <Text style={[styles.gst, styles.gstVal]}>
                    ₹{Number(props.offer).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.collapsedRow}>
                  <Text style={styles.totalAmt}>Total</Text>
                  <Text style={[styles.totalAmt, styles.totalAmtVal]}>
                    ₹
                    {applyThousandSeparator(
                      Math.ceil(
                        Number(props.priceWithoutTax * props.productQuantity) +
                          Number(
                            Number(props.totalPayableAmount) -
                              Number(
                                props.priceWithoutTax * props.productQuantity,
                              ),
                          ) +
                          Number(props.shipping) -
                          Number(props.offer),
                      ),
                    )}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
          {/* {props.shipping ? ( */}
          <View style={styles.shippingStripWrap}>
            {props.offer ? (
              <Text style={styles.couponDisc}>
                Coupon Discount : ₹{props.offer.toFixed(2)}
              </Text>
            ) : (
              <View />
            )}
            {props.msg && props.msg.type == 'oos' ? null : props.shipping ? (
              <View style={styles.flexEnd}>
                <FontAwesome5
                  name="shipping-fast"
                  style={styles.shippingIcon}
                />
                <Text style={styles.shippingPrice}>
                  Shipping : ₹{(props.shipping || 0).toFixed(2)}
                </Text>
              </View>
            ) : (
              <View style={styles.flexEnd}>
                <MaterialCommunityIcon
                  name={'truck-fast'}
                  size={20}
                  color={colors.green2}
                />
                <Text style={styles.shippingStripText1}>Free Delivery</Text>
              </View>
            )}
          </View>
          {/* ) : (
        <View style={styles.shippingStripWrap}>
          <Text style={styles.couponDisc}>Coupon Discount : ₹811.45</Text>
          
        </View>
      )} */}
        </View>
        {props.hideCTA ? null : (
          <View style={styles.cardAction}>
            <TouchableOpacity
              onPress={() => setShowRemove(true)}
              style={styles.deleteAction}>
              <MaterialCommunityIcon
                name={'delete'}
                style={styles.deleteIcon}
                size={24}
              />
              <Text style={styles.remove}>REMOVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.authenticated == 'true'
                  ? props.onMoveToWishlist(props)
                  : props.navigation.navigate('Auth')
              }
              style={styles.movetoWishlistBtn}>
              <Text style={styles.moveWishlistText}>MOVE TO WISHLIST</Text>
            </TouchableOpacity>
          </View>
        )}
        {props.msg && props.msg.type == 'oos' ? (
          <TouchableOpacity
            onPress={() => setShowSimilarproduct(true)}
            style={[
              styles.SimilarprdCard,
              {
                backgroundColor: 'rgba(255,255,255,0.5)',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              },
            ]}>
            <Text style={styles.similatText}>View Similar Product</Text>
            <MaterialCommunityIcon
              name={'chevron-right'}
              size={22}
              color={colors.RedThemeColor}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {showRemove && (
        <RemoveItem
          {...props}
          visible={showRemove}
          closePopup={() => setShowRemove(false)}
          deleteProduct={props.removeProduct}
        />
      )}
      {showSimilarProduct && (
        <SimilarProductModal
          onClose={() => setShowSimilarproduct(false)}
          visible={showSimilarProduct}
          navigation={props.navigation}
          productName={props.productName}
          category={props.categoryCode}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Dimension.borderRadius6,
    paddingHorizontal: Dimension.padding12,
    paddingVertical: Dimension.padding15,
    marginBottom: Dimension.padding10,
    // marginTop: Dimension.padding10,
    paddingBottom: 0,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  similatText: {
    fontSize: Dimension.font14,
    color: colors.RedThemeColor,
    fontFamily: Dimension.CustomMediumFont,
  },
  SimilarprdCard: {
    flex: 1,
    borderTopColor: colors.ProductBorderColor,
    borderTopWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: Dimension.padding15,
  },
  prodImageName: {flexDirection: 'row'},
  leftProdImage: {width: Dimension.width70, height: Dimension.height60},
  prodName: {
    flex: 1,
    paddingLeft: Dimension.padding25,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  qtyPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seePriceWithTax: {flexDirection: 'row', alignItems: 'center'},
  price: {
    fontSize: Dimension.font18,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRobotoBold,
    marginRight: Dimension.margin15,
  },
  deleteAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveWishlistText: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomBoldFont,
  },
  movetoWishlistBtn: {
    flex: 1,
    backgroundColor: colors.brandbg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius6,
    paddingVertical: Dimension.padding8,
  },
  remove: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.PrimaryTextColor,
    marginLeft: 6,
    paddingTop: 3,
  },
  deleteIcon: {color: colors.PrimaryTextColor},
  cardAction: {
    borderTopColor: colors.ProductBorderColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Dimension.padding10,
  },
  arrowIcon: {fontSize: Dimension.font20, color: colors.PrimaryTextColor},
  collapsedArea: {
    backgroundColor: '#F7F7FA',
    marginHorizontal: -Dimension.padding12,
    borderTopWidth: 1,
    borderTopColor: colors.ProductBorderColor,
  },
  collapsedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gst: {
    color: colors.lightGrayText,
    width: '50%',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRobotoRegular,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding12,
    height: Dimension.height30,
    textAlignVertical: 'center',
  },
  shippingArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Dimension.height30,
    alignItems: 'center',
  },
  shippingIcon: {
    color: '#000',
    fontSize: Dimension.font14,
    marginRight: Dimension.margin15,
  },
  deliveryText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.GreenColor,
  },
  shippingPrice: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRobotoRegular,
    color: '#000',
  },
  shippingStripWrap: {
    // borderRadius: 8,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: Colors.BoldgreenText,
    padding: Dimension.padding12,
    paddingHorizontal: 0,
    // marginTop: Dimension.margin12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shippingStripText1: {
    color: colors.BoldgreenText,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: Dimension.margin12,
    alignSelf: 'center',
  },
  totalAmt: {
    color: colors.PrimaryTextColor,
    width: '50%',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding12,
    height: 50,
    textAlignVertical: 'center',
  },
  totalAmtVal: {
    fontFamily: Dimension.CustomRobotoBold,
    textAlign: 'right',
    fontSize: Dimension.font16,
    paddingRight: 40,
  },
  gstVal: {textAlign: 'right', paddingRight: 40, fontSize: Dimension.font14},
  flexEnd: {flexDirection: 'row', alignItems: 'center'},
  couponDisc: {
    color: colors.green2,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRobotoRegular,
  },
});

export default Cartcard;
