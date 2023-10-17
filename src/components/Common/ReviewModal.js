import React from 'react';
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
import Colors from '../../redux/constants/colors';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ReviewModal = props => {
  const renderStar = starCount => {
    let staList = [];
    for (let i = 0; i < starCount; i++) {
      staList.push(<Icon key={i} name="star" style={styles.starIcon} />);
    }
    return staList;
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onRequestClose={props.onClose}
      coverScreen={true}
      style={{
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        margin: 0,
        height: deviceHeight,
        backgroundColor: '#fff',
      }}
      deviceWidth={deviceWidth}
      onBackButtonPress={props.onClose}
      hasBackdrop={false}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: Dimension.padding15,
        }}>
        <Text style={styles.headingText}>REVIEWS</Text>
        <TouchableOpacity onPress={props.onClose}>
          <Icon size={22} color={'#000'} name={'close-circle'} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          height: deviceHeight,
          backgroundColor: '#fff',
        }}>
        {props.productReviewData.reviewList.map((review, reviewKey) => (
          <View
            key={reviewKey}
            style={{
              borderTopColor: '#e7e7e7',
              borderTopWidth: 0.8,
              padding: Dimension.padding12,
            }}>
            <View style={styles.row}>
              {review.rating ? <Text>{renderStar(review.rating)}</Text> : null}
            </View>
            {review.user_name ? (
              <Text style={styles.reviewerName}>{review.user_name}</Text>
            ) : null}
            {review.date ? (
              <Text style={styles.reviewerDate}>{review.date}</Text>
            ) : null}
            {review.review_subject ? (
              <Text style={styles.reviewerTitle}>{review.review_subject}</Text>
            ) : null}
            {review.review_text ? (
              <Text style={styles.reviewerText}>{review.review_text}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headingText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.PrimaryTextColor,
    marginLeft: Dimension.margin15,
  },
  reviewerName: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin2,
  },
  reviewerDate: {
    fontSize: Dimension.font12,
    color: Colors.lightGrayText,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin2,
  },
  reviewerTitle: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginBottom: Dimension.margin2,
  },
  reviewerText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin2,
  },

  ShowReviewInnerWrap: {
    paddingVertical: Dimension.padding10,
    borderTopWidth: 1,
    paddingHorizontal: Dimension.padding12,
    borderTopColor: Colors.ProductBorderColor,
    borderStyle: 'dashed',
    borderRadius: 1,
    marginTop: Dimension.margin10,
  },
  starIcon: {
    color: Colors.yellowShade,
    fontSize: Dimension.font24,
    marginRight: Dimension.margin5,
  },
  reviewerName: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin2,
  },
  reviewerDate: {
    fontSize: Dimension.font12,
    color: Colors.lightGrayText,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin2,
  },
  reviewerTitle: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginBottom: Dimension.margin2,
  },
  reviewerText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin2,
  },
});

export default ReviewModal;
