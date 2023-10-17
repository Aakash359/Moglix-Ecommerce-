import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import FloatingLabelInputField from './FloatingInput';
import Toast from 'react-native-toast-message';
import {writeReview} from '../../services/products';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const RATING = ['BAD', 'BAD', 'AVERAGE', 'AVERAGE', 'LOVED IT!'];
const RATING_SUB_TEXT = [
  'What went wrong?',
  'What went wrong?',
  "You don't sound too pleased. Tell us why.",
  "You don't sound too pleased. Tell us why.",
  'What were you impressed with?',
];
const STARS = [0, 1, 2, 3, 4];
const QUALITIES = [
  {
    title: 'Professional\nExecutive',
    image: require('../../assets/images/customer-service-fill.png'),
  },
  {
    title: 'Delivery\nTime',
    image: require('../../assets/images/truck-fill.png'),
  },
  {
    title: 'Product\nQuality',
    image: require('../../assets/images/restart-line2.png'),
  },
];
const WriteReviewModal = props => {
  const [reviewRating, setReviewRating] = useState(4);
  const [title, setTitle] = useState('Amazing Product');
  const [comment, setComment] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  // useEffect(() => {
  //   if (init) {
  //     if (comment && comment.length) {
  //       setCommentError(false);
  //     } else {
  //       setCommentError(true);
  //     }
  //   }
  // }, [comment]);

  // useEffect(() => {
  //   if (init) {
  //     if (title && title.length) {
  //       setTitleError(false);
  //     } else {
  //       setTitleError(true);
  //     }
  //   }
  // }, [title]);

  const onReviewSubmit = async () => {
    if (!comment) {
      setCommentError(true);
      return;
    }
    if (!title) {
      setTitleError(true);
      return;
    }
    if (comment && title) {
      setCommentError(false);
      setTitleError(false);
      let review = {
        review_type: 'PRODUCT_REVIEW',
        item_type: 'PRODUCT',
        item_id: props.msn,
        rating: reviewRating + 1,
        review_subject: title,
        review_text: comment,
        review_id: null,
        user_id: props.auth.userId,
        user_name: props.auth.userName,
      };
      const {data} = await writeReview(
        review,
        props.auth.sessionId,
        props.auth.token,
      );
      if (data.code == '200') {
        Toast.show({
          type: 'success',
          text2: 'Review submitted successfully!',
          visibilityTime: 2000,
          autoHide: true,
        });

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
        <Text style={styles.headingText}>REVIEWS & RATINGS</Text>
        <TouchableOpacity onPress={props.onClose}>
          <Icon size={24} color={'#000'} name={'close-circle'} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollViewArea}>
        <View style={styles.rateHeadContent}>
          <Text style={styles.lovedItText}>{RATING[reviewRating]}</Text>
          <View style={styles.starIcons}>
            {STARS.map((star, index) => (
              <Icon
                key={index}
                onPress={() => setReviewRating(index)}
                style={
                  index <= reviewRating ? styles.yellowStar : styles.whiteStar
                }
                size={30}
                name={index <= reviewRating ? 'star' : 'star-outline'}
              />
            ))}
          </View>
        </View>
        <View style={styles.revForm}>
          <Text style={styles.revformHeading}>
            {RATING_SUB_TEXT[reviewRating]}
          </Text>
          <View style={styles.mogFeature}>
            {QUALITIES.map((quality, qualityKey) => (
              <View key={qualityKey} style={styles.featBox}>
                <Image
                  source={quality.image}
                  style={styles.reviewIcon}
                  resizeMode="contain"
                />
                <Text style={styles.featText}>{quality.title}</Text>
              </View>
            ))}
          </View>
          <View style={styles.newinputfield}>
            <FloatingLabelInputField
              label={'Add a Title'}
              value={title}
              onChangeText={text => setTitle(text)}
            />
            {/* { && (
              <Text style={styles.errorText}>Fields are mandatory</Text>
            )} */}
          </View>
          <Text style={styles.writetitle}>Add a written review</Text>
          <Text style={styles.subTitle}>
            You could mention "easy to assemble", "Sturdiness" and "Value for
            money"
          </Text>
          <View style={styles.newinputfield}>
            <FloatingLabelInputField
              label={'Tell us about this product'}
              value={comment}
              onChangeText={text => setComment(text)}
            />
            {/* <Text style={styles.errorText}>Fields are mandatory<</Text> */}
          </View>
          {commentError || titleError ? (
            <Text style={styles.errorText}>Fields are mandatory</Text>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footerWrap}>
        <TouchableOpacity onPress={onReviewSubmit} style={styles.feedBtn}>
          <Text style={styles.feedText}>SUBMIT FEEDBACK</Text>
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
  scrollViewArea: {
    height: deviceHeight,
  },
  rateHeadContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Dimension.padding15,
    marginBottom: Dimension.margin15,
  },
  lovedItText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font28,
    fontFamily: Dimension.CustomBoldFont,
  },
  starIcons: {flexDirection: 'row', justifyContent: 'center'},
  yellowStar: {color: '#FDB92C'},
  whiteStar: {color: '#000'},
  mogFeature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Dimension.padding20,
    marginBottom: Dimension.margin15,
  },
  revForm: {
    backgroundColor: '#fff',
    paddingVertical: Dimension.padding15,
    paddingHorizontal: Dimension.padding15,
    paddingBottom: Dimension.padding30,
  },
  revformHeading: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    textAlign: 'center',
    marginBottom: Dimension.margin15,
  },
  featBox: {
    borderWidth: 1,
    borderColor: colors.ProductBorderColor,
    width: Dimension.width70,
    height: Dimension.width70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius10,
  },
  reviewIcon: {
    width: Dimension.width20,
    height: Dimension.width20,
    backgroundColor: colors.brandbg,
    padding: Dimension.padding2,
    marginBottom: Dimension.margin5,
  },
  featText: {
    color: colors.ExtralightGrayText,
    textAlign: 'center',
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomMediumFont,
    lineHeight: Dimension.margin12,
  },
  writetitle: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
    marginTop: Dimension.margin30,
    marginBottom: Dimension.margin5,
  },
  subTitle: {color: colors.lightGrayText, flex: 1, fontSize: Dimension.font12},
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
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 12,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    // paddingVertical: Dimension.padding5,
  },
});

export default WriteReviewModal;
