import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  Picker,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import Header from './Header';
import colors from '../../redux/constants/colors';

const ReturnExchangeSuccess = props => {
  return (
    <Modal
      overlayPointerEvents={'auto'}
      coverScreen={true}
      hasBackdrop={true}
      style={styles.wrModal}
      isVisible={props.reSuccessModal}
      onRequestClose={() => {
        if (props.setExSuccessModal) {
          props.setExSuccessModal(false);
        }
        if (props.setReSuccessModal) {
          props.setReSuccessModal(false);
        }
        if (props.setReModal) {
          props.setReModal(false);
        }
        if (props.setExModal) {
          props.setExModal(false);
        }
      }}>
      <View style={styles.modalInnerView}>
        <Header
          showText={'Request for Return'}
          showBack
          showCart
          navigation={{
            goBack: () => {
              if (props.setExSuccessModal) {
                props.setExSuccessModal(false);
              }
              if (props.setReSuccessModal) {
                props.setReSuccessModal(false);
              }
              if (props.setReModal) {
                props.setReModal(false);
              }
              if (props.setExModal) {
                props.setExModal(false);
              }
              props.navigation.navigate('Orders');
            },
          }}
        />
        <ScrollView>
          <View style={styles.whiteBg}>
            <MaterialCommunityIcon
              name={'checkbox-marked-circle'}
              size={Dimension.width140}
              color={colors.BoldgreenText}
            />
            <Text style={styles.greenText}>
              {' '}
              {props.fromExchange ? 'Exchange Intiated' : 'Return Initiated'}
            </Text>
          </View>
          {['COD', 'NEFT'].includes(props.order_params.payment_type) ? (
            <View style={styles.refundStatus}>
              <Text style={styles.refTitle}>Status</Text>
              <Text style={styles.refsubText}>
                Your {props.fromExchange ? 'exchange' : 'return'} request has
                been submitted.
              </Text>
            </View>
          ) : (
            <View style={styles.refundStatus}>
              <Text style={styles.refTitle}>Refund Status</Text>
              <Text style={styles.refsubText}>
                Refund will be intiated to the source payment mode within 7-10
                business days once the products reaches our warehouse.
              </Text>
            </View>
          )}
          <View style={styles.cartOrderView}>
            <View style={styles.cartView}>
              <TouchableOpacity
                style={[styles.viewOrderBtn, styles.cartOrderBtn]}
                onPress={() => {
                  if (props.setExSuccessModal) {
                    props.setExSuccessModal(false);
                  }
                  if (props.setReSuccessModal) {
                    props.setReSuccessModal(false);
                  }
                  if (props.setReModal) {
                    props.setReModal(false);
                  }
                  if (props.setExModal) {
                    props.setExModal(false);
                  }
                  props.navigation.navigate('Orders');
                }}>
                <Text style={[styles.viewOrderBtnText, styles.btnText]}>
                  VIEW ORDER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shopMoreBtn, styles.cartOrderBtn]}
                onPress={() => {
                  if (props.setExSuccessModal) {
                    props.setExSuccessModal(false);
                  }
                  if (props.setReSuccessModal) {
                    props.setReSuccessModal(false);
                  }
                  if (props.setReModal) {
                    props.setReModal(false);
                  }
                  if (props.setExModal) {
                    props.setExModal(false);
                  }
                  props.navigation.navigate('Home');
                }}>
                <Text style={[styles.shopMoreBtnText, styles.btnText]}>
                  SHOP MORE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrModal: {
    backgroundColor: colors.brandbg,
    margin: 0,
    justifyContent: 'flex-start',
  },
  modalInnerView: {},
  whiteBg: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: Dimension.padding30,
    paddingHorizontal: Dimension.padding15,
  },
  greenText: {
    color: colors.BoldgreenText,
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: Dimension.margin15,
  },
  refundStatus: {
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding10,
  },
  refTitle: {
    fontSize: Dimension.font11,
    color: colors.ExtralightGrayText,
    fontFamily: Dimension.CustomMediumFont,
  },
  refsubText: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
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
});

export default ReturnExchangeSuccess;
