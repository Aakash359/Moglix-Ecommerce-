import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
const deviceWidth = Dimensions.get('window').width;

const OTPModal = props => {
  const {closeModal, isVisible} = props;
  return (
    <Modal
      overlayPointerEvents={'auto'}
      onBackButtonPress={closeModal}
      isVisible={isVisible}
      hasBackdrop={true}
      onDismiss={closeModal}
      style={styles.SYmodal}
      coverScreen={true}
      deviceWidth={deviceWidth}>
      <View style={styles.bottomsheetwrap}>
        <TouchableOpacity onPress={closeModal} style={styles.closebtn}>
          <MaterialCommunityIcon name="close-circle" style={styles.closeicon} />
        </TouchableOpacity>
        <Text style={styles.rbstitle}>Enter 4 Digit OTP</Text>
        <Text style={styles.rbsSubTitle}>
          OTP has been sent to
          <Text style={{fontFamily: Dimension.CustomBoldFont}}>
            {' '}
            8285829999
          </Text>{' '}
          for verification.
        </Text>
        <View style={styles.whiteview}>
          <View style={styles.rbsInnerview}>
            <TextInput
              style={styles.optbox}
              placeholder="1"
              placeholderTextColor={'#3C3C3C'}
            />
            <TextInput
              style={styles.optbox}
              placeholder="1"
              placeholderTextColor={'#3C3C3C'}
            />
            <TextInput
              style={styles.optbox}
              placeholder="1"
              placeholderTextColor={'#3C3C3C'}
            />
            <TextInput
              style={styles.optbox}
              placeholder="1"
              placeholderTextColor={'#3C3C3C'}
            />
          </View>
          <View style={styles.codeReciveWrap}>
            <View>
              <Text style={styles.rbsSubTitle}>Didn’t receive the code?</Text>
              <Text style={styles.codeResend}> Resend in 00:77 </Text>
            </View>
            <TouchableOpacity style={styles.resendOTP}>
              <Text style={styles.resendotptext}>RESEND OTP</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.contBtnDisabled}>
            <Text style={styles.btntext}>CONTINUE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contBtn}>
            <Text style={styles.btntext}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  SYmodal: {padding: 0, justifyContent: 'flex-end', margin: 0},
  bottomsheetwrap: {
    padding: Dimension.padding15,
    position: 'relative',
    backgroundColor: '#F7F7FA',
    borderTopLeftRadius: Dimension.borderRadius16,
    borderTopRightRadius: Dimension.borderRadius16,
  },
  closebtn: {
    position: 'absolute',
    right: Dimension.margin15,
    top: Dimension.margin10,
    zIndex: 2,
  },
  closeicon: {fontSize: Dimension.font18},
  rbstitle: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.PrimaryTextColor,
  },
  rbsSubTitle: {
    fontSize: Dimension.font4, 
    color: colors.PrimaryTextColor
  },
  whiteview: {
    backgroundColor: '#fff',
    padding: Dimension.padding15,
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin15,
  },
  rbsInnerview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Dimension.margin15,
  },
  optbox: {
    width: '22%',
    backgroundColor: '#F1F1F1',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: Dimension.borderRadius8,
    height: Dimension.height45,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
  },
  codeReciveWrap: {flexDirection: 'row', marginBottom: Dimension.margin15},
  resendOTP: {marginLeft: 'auto'},
  codeResend: {
    fontSize: Dimension.font10,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  resendotptext: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: Dimension.margin5,
  },
  contBtn: {
    width: '100%',
    backgroundColor: colors.RedThemeColor,
    paddingVertical: Dimension.padding12,
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin15,
  },
  contBtnDisabled: {
    width: '100%',
    backgroundColor: '#C4C4C4',
    paddingVertical: Dimension.padding12,
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin15,
  },
  btntext: {
    textAlign: 'center',
    fontSize: Dimension.font14,
    color: '#fff',
    fontFamily: Dimension.CustomBoldFont,
  },
  updateAddBottomSheetwrap: {
    padding: Dimension.padding20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: Dimension.borderRadius16,
    borderTopRightRadius: Dimension.borderRadius16,
  },
});

export default OTPModal;
