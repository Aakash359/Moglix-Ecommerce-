import React from 'react';
import Modal from 'react-native-modal';
import {sortByData} from '../../redux/constants/listing';
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
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const deviceWidth = Dimensions.get('window').width;
const SortByModal = props => {
  return (
    <Modal
      overlayPointerEvents={'auto'}
      isVisible={props.sortByModal}
      onTouchOutside={() => {
        props.setSortByModal();
      }}
      onDismiss={() => {
        props.setSortByModal();
      }}
      coverScreen={true}
      style={styles.modalWrap}
      deviceWidth={deviceWidth}
      hasBackdrop={true}
      onBackdropPress={() => props.setSortByModal()}
      onBackButtonPress={() => props.setSortByModal()}
      swipeDirection={'down'}
      onSwipeComplete={() => {
        props.setSortByModal();
      }}>
      <View style={styles.modalView}>
        <View style={styles.modalViewInner}>
          <View style={styles.ModalContentWrap}>
            <View style={styles.signUpWrap}>
              <View style={styles.textView}>
                <View style={styles.sortBy}>
                  <Text style={styles.Title}>Sort By</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      props.setSortByModal();
                    }}>
                    <MaterialCommunityIcon
                      name="close-circle"
                      style={styles.modalClose}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {sortByData.map((item, index) => (
                <TouchableOpacity
                  style={styles.SoryByData}
                  onPress={() => {
                    props.setSortByModal();
                    props.setOrderBy(item.orderBy);
                    props.setOrderWay(item.orderWay);
                  }}>
                  <View style={styles.row}>
                    <MaterialCommunityIcon
                      color={
                        props.orderWay === item.orderWay &&
                        props.orderBy === item.orderBy
                          ? colors.RedThemeColor
                          : colors.PrimaryTextColor
                      }
                      size={24}
                      name={
                        props.orderWay === item.orderWay &&
                        props.orderBy === item.orderBy
                          ? 'radiobox-marked'
                          : 'radiobox-blank'
                      }
                    />
                    <Text style={styles.sortBtdata}>{item.title}</Text>
                  </View>
                  <View></View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  ModalContentWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    backgroundColor: colors.PrimaryTextColor,
  },
  signUpWrap: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: Dimension.padding15,
  },
  SoryByData: {
    borderTopColor: colors.ProductBorderColor,
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
    color: colors.PrimaryTextColor,
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
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
});

export default SortByModal;
