import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import FloatingLabelInputField from './FloatingInput';
import {trackStateAdobe} from '../../services/analytics';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const RatingModalOnHome = props => {
  const [step, setStep] = useState(1);
  const [comment, setComment] = useState('');

  const onNext = () => {
    setStep(2);
  };

  const openStores = () => {
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:rating popup',
      'myapp.ctaname': 'rate 5 star',
      'myapp.channel': 'feedback',
      '&&events': 'event39',
    });
    props.submitFeedback({
      isRated: true,
      feedbackText: '',
    });
    Linking.openURL(`market://details?id=com.moglix.online`);
  };

  const submitFeedback = () => {
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:feedback form',
      'myapp.ctaname': 'submit',
      'myapp.channel': 'feedback',
      '&&events': 'event40',
      'myapp.subSection': `${comment}`,
    });
    props.submitFeedback({
      isRated: false,
      feedbackText: comment,
    });
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onRequestClose={props.onClose}
      coverScreen={true}
      style={styles.wrModalWrap}
      deviceWidth={deviceWidth}
      onBackButtonPress={props.onClose}
      hasBackdrop={true}>
      <View style={styles.modalWrapInner}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={props.onClose}>
            <Icon size={26} color={'#000'} name={'close-circle'} />
          </TouchableOpacity>
        </View>
        {step == 2 ? (
          <>
            <ScrollView style={styles.scrollViewArea}>
              <Text style={styles.headingText}>How can we make it better?</Text>
              <Text style={styles.subText}>
                Let us know what went wrong and {'\n'}we’ll work on it
              </Text>
              <View style={styles.revForm}>
                <View style={styles.newinputfield}>
                  <FloatingLabelInputField
                    heightStyle={{height: 160}}
                    label={'Add Comment'}
                    multiline={true}
                    value={comment}
                    onChangeText={text => setComment(text)}
                    inputHeight={styles.inputBoxStyle}
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.footerWrap}>
              <TouchableOpacity
                onPress={props.onClose}
                style={[styles.cancelBtn, styles.actBtn]}>
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!comment}
                style={[
                  !comment ? styles.disabledFeedBtn : styles.feedBtn,
                  styles.actBtn,
                ]}
                onPress={submitFeedback}>
                <Text style={styles.feedText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.scrollViewArea}>
            <Text style={styles.headingText}>Did you like the app?</Text>
            <Image
              source={require('../../assets/images/star_rating.png')}
              style={styles.modalcoupenImg}
              resizeMode="contain"
            />
            <Text style={styles.subText}>
              Your Play Store review will help in{'\n'}spreading a good word
            </Text>
            <TouchableOpacity onPress={openStores} style={styles.rateUsBtn}>
              <Text style={styles.rateUsBtnText}>RATE US 5 STAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext} style={styles.submFeedBtn}>
              <Text style={styles.actionText}>SUBMIT FEEDBACK</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrModalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    // paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
    justifyContent: 'flex-end',
    // height: deviceHeight,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalWrapInner: {
    backgroundColor: '#fff',
    borderTopLeftRadius: Dimension.borderRadius10,
    borderTopRightRadius: Dimension.borderRadius10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Dimension.padding15,
    alignItems: 'center',
    // backgroundColor:'#fff'
  },
  headingText: {
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomSemiBoldFont,
    paddingHorizontal: Dimension.padding15,
    textAlign: 'center',
  },
  subText: {
    fontSize: Dimensions.font14,
    fontFamily: Dimension.CustomMediumFont,
    color: colors.lightGrayText,
    textAlign: 'center',
  },
  scrollViewArea: {backgroundColor: '#fff'},
  revForm: {
    backgroundColor: '#fff',
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    paddingBottom: Dimension.padding30,
  },
  subTitle: {
    color: colors.PrimaryTextColor,
    flex: 1,
    lineHeight: Dimension.height16,
    fontSize: Dimension.font12,
    marginTop: Dimension.margin10,
  },
  footerWrap: {
    backgroundColor: colors.brandbg,
    borderTopColor: colors.ProductBorderColor,
    borderTopWidth: 1,
    paddingVertical: Dimension.padding5,
    paddingHorizontal: Dimension.padding10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actBtn: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimension.height34,
  },
  feedBtn: {
    backgroundColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius6,
  },
  feedText: {
    color: '#fff',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  errorText: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    paddingVertical: Dimension.padding5,
  },
  inputBoxStyle: {height: 150, textAlignVertical: 'top'},
  cancelBtnText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.RedThemeColor,
  },
  disabledFeedBtn: {
    backgroundColor: colors.ExtralightGrayText,
    borderRadius: Dimension.borderRadius6,
  },
  rateUsBtn: {
    width: Dimension.width120,
    backgroundColor: colors.RedThemeColor,
    height: Dimension.height34,
    paddingHorizontal: Dimension.padding10,
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin20,
    alignSelf: 'center',
  },
  rateUsBtnText: {
    fontSize: Dimension.font14,
    textAlign: 'center',
    fontFamily: Dimension.CustomBoldFont,
    color: '#fff',
  },
  submFeedBtn: {
    flexDirection: 'row',
    width: Dimension.width200,
    alignSelf: 'center',
    justifyContent: 'center',
    bottom:20,
    marginVertical: Dimension.margin30,
  },
  actionText: {
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font14,
    color: colors.RedThemeColor,
    marginHorizontal: Dimension.margin20,
  },
  modalcoupenImg: {
    marginVertical: Dimension.margin20,
    alignSelf: 'center',
    width: Dimension.width205,
    height: Dimension.height145,
  },
});

export default RatingModalOnHome;
