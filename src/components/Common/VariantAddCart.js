import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  Dimensions,
  Text,
  Image,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Quantity from '../Common/Quantity';
import Varients from './Varients';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import RfqRequirement from '../Common/RfqRequirement';
import RFQSuccess from '../Common/RFQSuccess';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const deviceWidth = Dimensions.get('window').width;

const VariantAddCart = props => {
  const [rfqRequirement, setRfqRequirement] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  return (
    <>
      <Modal
        overlayPointerEvents={'auto'}
        coverScreen={true}
        style={styles.modalWrap}
        deviceWidth={deviceWidth}
        hasBackdrop={true}
        onBackButtonPress={() => {
          props.setGrpPdModal(false);
        }}
        isVisible={props.grpPdModal}
        onRequestClose={() => {
          props.setGrpPdModal(false);
        }}>
        <View style={styles.varientView}>
          <Text style={styles.Title}>Select variant</Text>
          <TouchableOpacity
            onPress={() => props.setGrpPdModal(false)}
            style={styles.closeIcon}>
            <Icon
              style={styles.closeIcon}
              color={'#000'}
              name={'close-circle'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.topBorder} />
        <View
          style={{flexDirection: 'row', marginTop: Dimension.margin5, flex: 0}}>
          <Image
            style={styles.prdImage}
            resizeMode={'contain'}
            source={{
              uri:
                'https://cdn.moglix.com/' +
                  (props.grpProductData.productPartDetails &&
                    props.grpProductData.productPartDetails[props.grpPdMsn] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .images[0] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .images[0].links &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .images[0].links.default) || '',
            }}
          />
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.prod_Name} numberOfLines={2}>
              {props.grpProductData.productName}
            </Text>
            {!props.grpProductData.outOfStock ? (
              <View style={styles.innerView}>
                <Text style={styles.rateView}>
                  ₹
                  {props.grpProductData &&
                    props.grpProductData.productPartDetails &&
                    props.grpProductData.productPartDetails[props.grpPdMsn] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'].mrp}
                </Text>

                <Text style={styles.text}>
                  {props.grpProductData &&
                    props.grpProductData.productPartDetails &&
                    props.grpProductData.productPartDetails[props.grpPdMsn] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'] &&
                    props.grpProductData.productPartDetails[
                      props.grpPdMsn
                    ].productPriceQuantity['india'].discount.toFixed(0)}
                  % OFF
                </Text>
              </View>
            ) : null}

            {!props.grpProductData.outOfStock ? (
              <View style={styles.qantView}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  ₹
                  {props.grpProductData &&
                    props.grpProductData.productPartDetails &&
                    props.grpProductData.productPartDetails[props.grpPdMsn] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'].priceWithoutTax}
                </Text>
                <Text style={styles.packText}>
                  Qty/pack -{' '}
                  {props.grpProductData &&
                    props.grpProductData.productPartDetails &&
                    props.grpProductData.productPartDetails[props.grpPdMsn] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'] &&
                    props.grpProductData.productPartDetails[props.grpPdMsn]
                      .productPriceQuantity['india'].packageUnit}
                </Text>
                <View style={{marginLeft: Dimension.margin35, bottom: 15}}>
                  <View style={styles.qntWrapView}>
                    <Text style={styles.qntText}>Enter Qty</Text>
                  </View>
                  <Quantity
                    productQuantity={quantity}
                    setQuantity={setQuantity}
                    minQuantity={1}
                    productData={props.grpProductData}
                    fromRfq
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.availRequest}>Available on Request</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomBorder} />
        <View style={{flex: 10, bottom: 12}}>
          <Varients
            refetchWithMsn={props.refetchWithMsn}
            productData={props.grpProductData}
            styles={styles}
          />
        </View>

        {props.grpProductData && !props.grpProductData.outOfStock ? (
          <TouchableOpacity
            onPress={() => props.variantAddCart(quantity)}
            style={styles.redBtn}>
            <Text style={styles.ContinueBtn}>ADD TO CART</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setRfqRequirement(true)}
            style={[
              styles.cartBtnTextForGrid,
              {
                backgroundColor: '#fff',
              },
            ]}>
            <Text style={[styles.cartBtnText, {color: colors.RedThemeColor}]}>
              ASK BEST PRICE
            </Text>
          </TouchableOpacity>

          // <TouchableOpacity
          //   onPress={() => setRfqRequirement(true)}
          //   style={styles.redBtn}>
          //   <Text style={styles.ContinueBtn}>ASK BEST PRICE</Text>
          // </TouchableOpacity>
        )}
      </Modal>
      {rfqSuccess && (
        <RFQSuccess visible={rfqSuccess} onClose={() => setRfqSuccess(false)} />
      )}
      {rfqRequirement ? (
        <RfqRequirement
          rfqRequirement={rfqRequirement}
          setRfqRequirement={setRfqRequirement}
          user={props.user}
          sessionId={props.sessionId}
          token={props.token}
          userId={props.userId}
          fromVariantCart
          showSuccess={() => setRfqSuccess(true)}
          rfqData={props.grpProductData}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  modalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
    borderRadius: 0,
    flex: 1,
    backgroundColor: '#fff',
  },
  qantView: {
    flexDirection: 'row',
    marginTop: Dimension.margin10,
  },
  packText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.lightGrayText,
    marginTop: Dimension.margin20,
    marginLeft: -Dimension.margin33,
  },
  qntWrapView: {
    flexDirection: 'column',
    top: 5,
  },
  qntText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.lightGrayText,
    textAlign: 'right',
  },
  btnSelected: {
    borderColor: colors.RedThemeColor,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: 'rgba(244, 225, 229, 1)',
    borderRadius: 4,
  },
  sizeBtn: {
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 4,
  },
  sizetext: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
  },
  sizetextSelected: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  inactiveAttrBtnText: {
    color: colors.ExtralightGrayText,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  inactiveAttrBtn: {
    backgroundColor: '#e3e3e3',
    borderColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 4,
    opacity: 1,
  },
  sizebtnWrap: {flexDirection: 'row'},
  reviewerTitle: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginBottom: Dimension.margin2,
  },
  ContinueBtn: {
    color: '#fff',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font16,
  },
  redBtn: {
    margin: Dimension.margin5,
    backgroundColor: colors.RedThemeColor,
    height: Dimension.height45,
    borderRadius: Dimension.borderRadius6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Title: {
    paddingBottom: Dimension.padding5,
    fontSize: Dimension.font14,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  prdImage: {
    height: Dimension.prdListViewImage,
    marginLeft: Dimension.margin20,
    width: Dimension.prdListViewImage,
    alignSelf: 'center',
    bottom: 10,
    marginHorizontal: Dimension.margin20,
  },
  varientView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Dimension.padding15,
    flex: 1,
  },
  closeIcon: {
    width: Dimension.width18,
    height: Dimension.height30,
    marginLeft: 'auto',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  closeIcon: {fontSize: 22},
  text: {
    fontSize: 12,
    marginLeft: Dimension.margin10,
    color: colors.GreenColor,
    fontWeight: 'bold',
  },
  prod_Name: {
    fontSize: 12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRobotoRegular,
    fontWeight: '900',
    width: Dimension.width180,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#e7e7e7',
    bottom: 10,
  },
  topBorder: {
    height: 1,
    backgroundColor: '#e7e7e7',
    bottom: 20,
  },
  rateView: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.PrimaryTextColor,
    textDecorationLine: 'line-through',
  },
  innerView: {
    flexDirection: 'row',
    marginTop: Dimension.margin10,
    alignItems: 'center',
  },
  availRequest: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.orangeColor,
    marginTop: 12,
    marginBottom: 24,
  },
  cartBtnTextForGrid: {
    width: '96%',
    alignSelf: 'center',
    backgroundColor: colors.RedThemeColor,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Dimension.padding15,
    borderRadius: 8,
    bottom: 10,
    position: 'absolute',
    borderColor: colors.RedThemeColor,
    borderWidth: 1,
  },
  cartBtnText: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#fff',
  },
});

export default VariantAddCart;
