import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  Picker,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../components/Common/Header';
import Modal from 'react-native-modal';
const deviceWidth = Dimensions.get('window').width;
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Cancel = props => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  const onValueChange = value => {
    setReason(value);
  };

  return (
    <Modal
      overlayPointerEvents={'auto'}
      coverScreen={true}
      // deviceWidth={deviceWidth}
      hasBackdrop={true}
      style={styles.orderCancel}
      isVisible={props.cancelModal}
      onRequestClose={() => {
        props.setCancelModal(false);
      }}>
      {/* props.order_params.status == 'CANCELLED' &&
      props.order_params.requestType == 'cancel' &&
      !props.order_params.cancel_active */}
      {props.order_params.status == 'CANCELLED' &&
      props.order_params.requestType == 'cancel' &&
      !props.order_params.cancel_active ? (
        <>
          <Header
            navigation={props.navigation}
            showBack
            showCart
            iconStyle={styles.iconColor}
            showText={'Request Cancellation'}
            style={styles.removeShadow}
          />
          <View style={styles.cancelConfirmed}>
            <MaterialCommunityIcon
              style={styles.orderedCheckCircle}
              name="checkbox-marked-circle"
              size={120}
            />
            <Text style={styles.cancelContent}>Cancellation Confirmed</Text>
          </View>
          {props.order_params.payment_type == 'COD' ? (
            <View style={styles.refundStatus}>
              <Text style={styles.refundStatusLbl}>Refund status</Text>
              <Text style={styles.refundStatusTxt}>
                There will be no Refund as the order is purchased using
                Cash-on-Delivery
              </Text>
            </View>
          ) : null}
          <View style={styles.cartOrderView}>
            <View style={styles.cartView}>
              <TouchableOpacity
                style={[styles.viewOrderBtn, styles.cartOrderBtn]}
                onPress={() => {
                  props.setCancelModal(false);
                }}>
                <Text style={[styles.viewOrderBtnText, styles.btnText]}>
                  VIEW ORDER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shopMoreBtn, styles.cartOrderBtn]}
                onPress={() => {
                  props.navigation.navigate('Home');
                }}>
                <Text style={[styles.shopMoreBtnText, styles.btnText]}>
                  SHOP MORE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <Header
            navigation={props.navigation}
            showBack
            showText={'Request Cancellation'}
          />
          <ScrollView style={styles.orderCancelDescParent}>
            <View style={styles.orderCancelDesc}>
              <View style={styles.orderCancelDescInner}>
                <Image
                  source={{
                    uri: props.order_params.productImg,
                  }}
                  style={styles.orderCancelProdImg}
                  resizeMode="contain"
                />
                <View style={styles.orderCancelProdName}>
                  <Text style={styles.orderCancelProdNameTxt}>
                    {props.order_params.product_name}
                  </Text>
                  <View style={styles.prodPriceWrap}>
                    <Text style={styles.prodPrice}>
                      ₹{props.order_params.price_without_tax}
                    </Text>
                    <Text style={styles.prodPriceQty}>
                      ({props.order_params.Quantity} Qty)
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.reasonCancelWrap}>
                <Text style={styles.reasonCancelTxt}>
                  Reason for cancellation
                </Text>
                <View style={styles.reasonCancelInputWrap}>
                  <View style={styles.selectionWrap}>
                    <Picker
                      note
                      mode="dropdown"
                      placeholder={'Reason for Cancellation*'}
                      selectedValue={reason}
                      style={styles.selectionTxt}
                      // itemStyle={{margin:'40',padding:'30'}}
                      onValueChange={onValueChange}>
                      <Picker.Item
                        key={'noKey'}
                        label={'Reason for Cancellation*'}
                        style={styles.selectionPopupTxt}
                        value={false}
                      />
                      {props.cancelReasons.map((value, idx) => {
                        return (
                          <Picker.Item
                            key={idx}
                            label={value.text}
                            value={value.id}
                            style={styles.selectionPopupTxt}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <View style={styles.commentsInputWrap}>
                    {/* <FloatingLabelInputField
                      label={title}
                      onChangeText={text => onChange(text)}
                      value={state}
                      disabled={disabled}
                      onBlur={onBlur}
                      // errorBorder={'#D9232D'}
                      maxLength={maxLength}
                      keyboardType={keyboardType}
                    // hideLabel={''}
                    /> */}
                    <View style={[styles.newinputfield]}>
                      <FloatingLabelInputField
                        label={'Add Comment (Optional)'}
                        heightStyle={{height: 120}}
                        value={comment}
                        multiline={true}
                        maxLength={10}
                        inputHeight={styles.inputBoxStyle}
                        onChangeText={str => {
                          setComment(str);
                        }}
                      />
                    </View>
                    {/* <TextInput
                      style={styles.commentsInput}
                      placeholder="Add Comment (Optional)"
                    /> */}
                  </View>
                </View>
              </View>
              <View style={styles.warnWrap}>
                <Text style={styles.warnLbl}>Refund Status</Text>
                <Text style={styles.warnValue}>
                  There will be no refund as the order is purchased using
                  Cash-On-Delivery
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            disabled={reason == ''}
            style={[
              styles.BuyNowBtn,
              {
                backgroundColor: reason == '' ? '#C4C4C4' : '#D9232D',
              },
            ]}
            onPress={() => props.cancelOrder(reason)}>
            <Text style={styles.BuyNowBtnText}>SUBMIT REQUEST</Text>
          </TouchableOpacity>
        </>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  orderCancelDescParent: {
    backgroundColor: '#fff',
  },
  orderCancel: {
    backgroundColor: colors.brandbg,
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: -Dimension.margin2,
    marginHorizontal: -Dimension.margin1,
    paddingHorizontal: -Dimension.padding15,
    paddingVertical: -Dimension.padding15,
  },
  orderCancelDescInner: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.accborder,
    borderRadius: Dimension.borderRadius8,
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding15,
  },

  orderCancelDesc: {
    margin: Dimension.padding10,
    flexDirection: 'column',
  },

  orderCancelProdName: {
    paddingLeft: Dimension.padding25,
    flexDirection: 'column',
    flex: 1.5,
  },
  orderCancelProdNameTxt: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },

  BuyNowBtn: {
    height: Dimension.height40,
    margin: Dimension.margin6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: Dimension.borderRadius8,
  },
  BuyNowBtnText: {
    color: colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  orderCancelProdImg: {
    width: Dimension.width74,
    height: Dimension.height74,
  },
  prodPriceWrap: {
    flexDirection: 'row',
    paddingTop: Dimension.padding10,
    alignItems: 'center',
  },
  prodPrice: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
  },
  prodPriceQty: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    marginLeft: Dimension.margin5,
    marginTop: Dimension.margin5,
  },
  reasonCancelTxt: {
    marginTop: Dimension.margin20,
    marginBottom: Dimension.margin10,
    color: colors.LightTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
  },
  reasonCancelInputWrap: {
    borderWidth: 1,
    borderColor: colors.accborder,
    borderRadius: Dimension.borderRadius8,
    paddingHorizontal: Dimension.padding10,
    paddingTop: Dimension.padding20,
    paddingBottom: Dimension.padding10,
  },
  selectionWrap: {
    borderWidth: 1,
    borderColor: colors.lightGrayText,
    borderRadius: Dimension.borderRadius8,
    backgroundColor: '#fff',
    position: 'relative',
    marginBottom: Dimension.margin10,
  },
  selectionTxt: {
    color: colors.placeholderGray,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
  },
  selectionPopup: {
    marginTop: Dimension.margin60,
  },
  selectionPopupTxt: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
  },
  commentsInputWrap: {},
  commentsInput: {
    borderWidth: 1,
    borderColor: colors.lightGrayText,
    borderRadius: Dimension.borderRadius8,
    height: Dimension.height100,
    color: colors.ExtralightGrayText,
    fontSize: Dimension.font14,
    // alignSelf:'flex-start',
    alignContent: 'flex-start',
    fontFamily: Dimension.CustomRegularFont,
    paddingHorizontal: Dimension.padding15,
  },
  warnWrap: {
    marginTop: Dimension.margin20,
  },
  warnLbl: {
    color: colors.ExtralightGrayText,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomMediumFont,
  },
  warnValue: {
    color: colors.LightTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    paddingTop: Dimension.padding8,
  },
  removeShadow: {
    elevation: 0,
  },
  cancelConfirmed: {
    height: Dimension.height245,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#455B631A',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 2,
  },
  orderedCheckCircle: {
    // fontSize: Dimension.font44,
    color: colors.BoldgreenText,
  },
  cancelContent: {
    color: colors.BoldgreenText,
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomSemiBoldFont,
    paddingTop: Dimension.padding20,
  },
  refundStatus: {
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding20,
  },
  refundStatusLbl: {
    color: colors.ExtralightGrayText,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomMediumFont,
    paddingBottom: Dimension.padding5,
  },
  refundStatusTxt: {
    color: colors.LightTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  cartOrderBtn: {
    borderRadius: 8,
    borderColor: colors.RedThemeColor,
    borderWidth: 1,
    height: Dimension.height36,
    justifyContent: 'center',
    width: '48%',
    alignItems: 'center',
  },
  viewOrderBtn: {
    backgroundColor: '#FFF',
  },
  viewOrderBtnText: {
    color: colors.RedThemeColor,
  },
  shopMoreBtn: {
    backgroundColor: colors.RedThemeColor,
  },
  shopMoreBtnText: {
    color: '#FFF',
  },
  btnText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  cartView: {flexDirection: 'row', justifyContent: 'space-between'},
  cartOrderView: {
    padding: Dimension.padding15,
    borderRadius: Dimension.borderRadius8,
    marginHorizontal: Dimension.margin10,
    marginTop: Dimension.margin10,
    marginBottom: Dimension.margin20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#fff',
  },
  inputBoxStyle: {height: 110, textAlignVertical: 'top'},
  pickerIcon: {
    position: 'absolute',
    zIndex: 1,
    fontSize: Dimension.font20,
    color: colors.PrimaryTextColor,
    right: Dimension.padding15,
    top: Dimension.padding10,
  },
});

export default Cancel;
