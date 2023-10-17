import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import FloatingLabelInputField from './FloatingInput';
import {askQuestion} from '../../services/products';
import Toast from 'react-native-toast-message';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const QandAModal = props => {
  const [question, setQuestion] = useState('');
  const [questionError, setQuestionError] = useState(false);
  const [init, setInit] = useState(false);
  const modalToastRef = useRef();

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      if (question && question.length && question.trim().length) {
        setQuestionError(false);
      } else {
        setQuestionError(true);
      }
    }
  }, [question]);

  const onSubmitQuestion = async () => {
    if (!question) {
      setQuestionError(true);
    } else {
      if (
        question &&
        question.trim().length &&
        question.length &&
        !questionError
      ) {
        let dataForAPI = {
          categoryCode: props.productData.categoryDetails[0].categoryCode,
          categoryName: props.productData.categoryDetails[0].categoryName,
          customerId: props.auth.userId,
          productMsn: props.msn,
          questionText: question,
          taxonomy: props.productData.categoryDetails[0].taxonomy,
          taxonomyCode: props.productData.categoryDetails[0].taxonomyCode,
        };
        const {data} = await askQuestion(
          dataForAPI,
          props.auth.sessionId,
          props.auth.token,
        );
        if (data.code == 200) {
          Toast.show({
            type: 'success',
            text2: 'Question posted successfully',
            visibilityTime: 2000,
            autoHide: true,
          });
          // if (modalToastRef && modalToastRef.current) {
          //   modalToastRef.current.show();
          // }
          // Toast.show('Question is posted successfully');
          props.onSuccess();
          props.onClose();
        } else {
          Toast.show({
            type: 'error',
            text2: 'Something went wrong!',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      }
    }
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onRequestClose={props.onClose}
      coverScreen={true}
      style={styles.wrModalWrap}
      deviceWidth={deviceWidth}
      onBackButtonPress={props.onClose}
      hasBackdrop={false}>
      <View style={styles.modalHeader}>
        {/* <Toast ref={modalToastRef} /> */}
        <Text style={styles.headingText}>SUBMIT YOUR QUESTION</Text>
        <TouchableOpacity onPress={props.onClose}>
          <Icon size={24} color={'#000'} name={'close-circle'} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollViewArea}>
        <View style={styles.revForm}>
          <View style={styles.newinputfield}>
            <FloatingLabelInputField
              label={'Post your Question'}
              value={question}
              onChangeText={text => setQuestion(text)}
            />
          </View>
          {questionError && (
            <Text style={styles.errorText}>This field is mandatory</Text>
          )}
          <Text style={styles.subTitle}>
            Be specific, ask questions about the product and not about price,
            delivery, service etc.
          </Text>
          <Text style={styles.subTitle}>
            Ask for information which isn’t captured in the product
            specification.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footerWrap}>
        <TouchableOpacity onPress={onSubmitQuestion} style={styles.feedBtn}>
          <Text style={styles.feedText}>SUBMIT QUESTION</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrModalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
    height: deviceHeight,
    backgroundColor: colors.brandbg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Dimension.padding15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headingText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  scrollViewArea: {height: deviceHeight, backgroundColor: '#fff'},
  revForm: {
    backgroundColor: '#fff',
    paddingVertical: Dimension.padding15,
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
    borderTopColor: colors.ProductBorderColor,
    borderTopWidth: 1,
    padding: Dimension.padding5,
  },
  feedBtn: {
    height: Dimension.height34,
    width: '100%',
    backgroundColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedText: {
    color: '#fff',
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomBoldFont,
  },
  errorText: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    paddingVertical: Dimension.padding5,
  },
});

export default QandAModal;
