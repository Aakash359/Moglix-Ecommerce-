import React from 'react';
import Modal from 'react-native-modal';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const deviceWidth = Dimensions.get('window').width;
const UpdateAddressModal = props => {
  const {closeModal, updateLocationAddress, isVisible, addressData} = props;
  console.log(props);
  return (
    <Modal
      isVisible={isVisible}
      style={styles.SYmodal}
      onBackButtonPress={closeModal}
      coverScreen={true}
      deviceWidth={deviceWidth}
      onDismiss={closeModal}>
      <View style={styles.updateAddBottomSheetwrap}>
        <Text style={[styles.rbstitle, styles.rbstitleUA]}>
          Update with these details?
        </Text>
        <Image
          source={require('../../assets/images/update-location.png')}
          style={styles.mapimg}
        />
        {addressData && addressData.formatted_address ? (
          <>
            <Text style={styles.addupdatetext}>
              {addressData.subLocality}, {addressData.locality},{' '}
              {addressData.subDistrict}, {addressData.district},{' '}
              {addressData.city}, {addressData.state}, {addressData.area} (
              {addressData.pincode})
            </Text>
            {/* <Text style={styles.addupdatetext}>{addressData.city}, {addressData.pincode}</Text> */}
          </>
        ) : null}
        <View style={styles.action}>
          <TouchableOpacity
            onPress={closeModal}
            style={[styles.actbtn, styles.cancelbtn]}>
            <Text style={styles.btntextred}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={updateLocationAddress}
            style={[styles.actbtn, styles.updatebtn]}>
            <Text style={styles.btntextwhite}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  SYmodal: {padding: 0, justifyContent: 'flex-end', margin: 0},
  mapmyindiarow: {
    flexDirection: 'row',
    paddingVertical: Dimension.padding10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapmyindiaimage: {width: 112, height: 36, marginLeft: Dimension.margin10},
  mapmyindiatext: {fontSize: Dimension.font12, color: '#979797'},
  updateAddBottomSheetwrap: {
    padding: Dimension.padding20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: Dimension.borderRadius16,
    borderTopRightRadius: Dimension.borderRadius16,
  },
  mapimg: {
    width: Dimension.width75,
    height: Dimension.height71,
    marginVertical: Dimension.margin10,
  },
  addupdatetext: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Dimension.margin20,
  },
  actbtn: {
    width: '48%',
    borderRadius: Dimension.borderRadius8,
    paddingVertical: Dimension.padding12,
    paddingHorizontal: Dimension.padding10,
    alignItems: 'center',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    margin: Dimension.margin8,
    marginBottom: 0,
  },
  cancelbtn: {backgroundColor: Colors.LightRedThemeColor},
  updatebtn: {backgroundColor: Colors.RedThemeColor},
  btntextred: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: Colors.RedThemeColor,
  },
  btntextwhite: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: '#fff',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  ModalContentWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    backgroundColor: Colors.PrimaryTextColor,
  },
  signUpWrap: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: Dimension.padding15,
  },
  SoryByData: {
    borderTopColor: Colors.ProductBorderColor,
    flexDirection: 'row',
    padding: Dimension.padding15,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  radioWrap: {marginTop: Dimension.margin5},
  sortBtdata: {
    alignSelf: 'center',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
    marginLeft: Dimension.margin20,
  },
  modalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    position: 'relative',
    width: '100%',
  },
  modalViewInner: {position: 'absolute', bottom: 0, width: '100%'},
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Dimension.padding15,
  },
  sortBy: {paddingBottom: Dimension.padding15},
  modalClose: {fontSize: Dimension.font20},
  row: {flexDirection: 'row'},
  Title: {
    fontSize: Dimension.font14,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  rbstitle: {
    fontSize: Dimension.font18,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
});

export default UpdateAddressModal;
