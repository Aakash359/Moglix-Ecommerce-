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

const QAModal = props => {
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
        <Text style={styles.headingText}>QUESTION AND ANSWERS</Text>
        <TouchableOpacity onPress={props.onClose}>
          <Icon size={22} color={'#000'} name={'close-circle'} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          height: deviceHeight,
          backgroundColor: '#fff',
        }}>
        {props.qlist.map((quest, questKey) => (
          <View style={styles.ShowReviewWrap} key={'qna_' + questKey}>
            <View style={styles.ShowReviewInnerWrap}>
              <Text style={styles.reviewerTitle}>
                Q{questKey + 1}: {quest.questionText}
              </Text>
              <Text style={styles.reviewerText}>{quest.answerText}</Text>
              <View style={styles.row}></View>
            </View>
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
});

export default QAModal;
