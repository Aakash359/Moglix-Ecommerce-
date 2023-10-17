import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';

const {width: viewportWidth} = Dimensions.get('window');

const RFQSuccess = props => {
  const rateMoglix = () => {
    /* InAppReview.RequestInAppReview(); */
    if (Platform.OS == 'android') {
      Linking.openURL(
        'http://play.google.com/store/apps/details?id=com.moglix.online&hl=en',
      );
    } else {
      Linking.openURL(
        'https://apps.apple.com/in/app/moglix-best-industrial-app/id1493763517',
      );
    }
  };

  return (
    <Modal
      style={styles.modalContainer}
      isVisible={props.visible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}>
      <View style={styles.topSubContainer}>
        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity onPress={props.onClose}>
            <Icon name={'close-circle'} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalSubContainer}>
          <Icon name="check-circle" style={styles.checkIcon} />
          <View style={styles.TextWrap}>
            <Text style={styles.headingText}>
              Thanks for submitting the query
            </Text>

            <Text style={styles.pitchText}>
              Please hold back, our team is working on your request.{'\n'}
              Will respond you back within 24 - 48 hours
            </Text>
            <Text style={styles.supporttext}>
              Rate us and help us improve our App
              {/* {'\n'} */}
            </Text>
            <TouchableOpacity onPress={rateMoglix} style={styles.rateusbtn}>
              <Text style={styles.rateustext}>RATE US NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onClose}>
              <Text style={styles.declineText}>CONTINUE SHOPPING</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RFQSuccess;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    margin: 0,
    padding: 0,
    bottom: 0,
    width: viewportWidth,
  },
  topSubContainer: {
    backgroundColor: '#fff',
    width: viewportWidth,
    borderTopLeftRadius: Dimension.borderRadius16,
    borderTopRightRadius: Dimension.borderRadius16,
  },
  closeIcon: {
    width: Dimension.width20, 
    height: Dimension.width20,
    fontSize:22,
    marginRight:-Dimension.margin1
  },
  modalSubContainer: {
    width: viewportWidth,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: Dimension.padding30,
    paddingTop: Dimension.padding25,
  },
  checkIcon: {
    fontSize: 108,
    color: Colors.GreenColor,
    marginBottom: Dimension.margin20,
  },
  TextWrap: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: Dimension.padding15,
  },
  headingText: {
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomBoldFont,
    color: Colors.PrimaryTextColor,
    marginBottom: Dimension.margin5,
    textAlign: 'center',
  },
  pitchText: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomMediumFont,
    textAlign: 'center',
    color: Colors.lightGrayText,
  },
  supporttext: {
    fontSize: Dimension.font14,
    color: Colors.PrimaryTextColor,
    textAlign: 'center',
    marginVertical: Dimension.margin20,
  },
  rateusbtn: {
    paddingVertical: Dimension.padding12,
    borderRadius: Dimension.borderRadius8,
    width: Dimension.width140,
    backgroundColor: Colors.RedThemeColor,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Dimension.margin20,
  },
  rateustext: {
    fontSize: Dimension.font14,
    color: '#fff',
    fontFamily: Dimension.CustomBoldFont,
  },
  declineText: {
    fontSize: Dimension.font14,
    textAlign:'center',
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomBoldFont,
  },
});
