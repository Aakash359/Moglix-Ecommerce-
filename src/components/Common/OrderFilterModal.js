import React, {useEffect, useState} from 'react';
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
import {ORDER_STATUSES, DATE_RANGES} from '../../generic';
import {color} from 'react-native-reanimated';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const OrderFilterModal = props => {
  const [initialDateRange, setInitialDateRange] = useState(
    props.initialDateRange,
  );
  const [initialStatus, setInitialStatus] = useState(props.initialStatus);

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
        <Text style={styles.headingText}>Filters</Text>
        <TouchableOpacity
          onPress={props.onClearFilter}
          style={styles.FilterBtn}>
          <Text style={styles.filterHeaderText}>CLEAR FILTER</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onClose}>
          <Icon size={24} color={'#000'} name={'close-circle'} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollViewArea}>
        <Text style={styles.filtModalHeading}>Status Filter</Text>
        <View style={styles.filterList}>
          {ORDER_STATUSES.map((status, statusKey) => (
            <TouchableOpacity
              onPress={() => setInitialStatus(status.key)}
              key={statusKey}
              style={styles.Filteritem}>
              <Icon
                name={
                  initialStatus == status.key
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
                }
                size={24}
                color={
                  initialStatus == status.key
                    ? colors.RedThemeColor
                    : colors.PrimaryTextColor
                }
              />
              <Text
                style={
                  initialStatus == status.key
                    ? styles.selectedFilttxt
                    : styles.Filttxt
                }>
                {status.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.filtModalHeading}>Time Filter</Text>
        <View style={styles.filterList}>
          {DATE_RANGES.map((date, dateKey) => (
            <TouchableOpacity
              onPress={() => setInitialDateRange(date.title)}
              key={dateKey}
              style={styles.Filteritem}>
              <Icon
                name={
                  initialDateRange == date.title
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
                }
                size={24}
                color={
                  initialDateRange == date.title
                    ? colors.RedThemeColor
                    : colors.PrimaryTextColor
                }
              />
              <Text
                style={
                  initialDateRange == date.title
                    ? styles.selectedFilttxt
                    : styles.Filttxt
                }>
                {date.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.filterAction}>
        <TouchableOpacity
          disabled={
            initialStatus == props.initialStatus &&
            initialDateRange == props.initialDateRange
          }
          onPress={() => props.onApplyFilter(initialDateRange, initialStatus)}
          style={
            initialStatus == props.initialStatus &&
            initialDateRange == props.initialDateRange
              ? styles.disabledActBtnClear
              : styles.actbtn
          }>
          <Text style={styles.actbtntext}>APPLY</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.disabledActBtnClear}>
            <Text style={styles.actbtntext}>
                  APPLY
            </Text>
          </TouchableOpacity> */}
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
    // height: deviceHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Dimension.padding15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: Dimension.borderRadius10,
    borderTopRightRadius: Dimension.borderRadius10,
  },
  headingText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  FilterBtn: {
    textAlign: 'right',
    alignItems: 'baseline',
    marginLeft: Dimension.margin160,
  },
  filterHeaderText: {
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    paddingTop: 5,
    color: colors.RedThemeColor,
  },
  scrollViewArea: {
    backgroundColor: '#fff',
    paddingHorizontal: Dimension.padding15,
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
  filtModalHeading: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#303030',
    paddingTop: Dimension.padding15,
    paddingBottom: Dimension.padding5,
  },
  filterList: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: Dimension.margin8,
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
  },
  Filteritem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Filttxt: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    marginLeft: Dimension.margin10,
  },
  selectedFilttxt: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    marginLeft: Dimension.margin10,
  },
  filterAction: {
    backgroundColor: '#EFEFF4',
    padding: Dimension.padding6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actbtn: {
    width: '100%',
    borderRadius: Dimension.borderRadius4,
    height: Dimension.height40,
    justifyContent: 'center',
    backgroundColor: colors.RedThemeColor,
  },
  disabledActBtnClear: {
    width: '100%',
    borderRadius: Dimension.borderRadius4,
    height: Dimension.height40,
    justifyContent: 'center',
    backgroundColor: colors.ExtralightGrayText,
  },
  actbtntext: {
    textAlign: 'center',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: '#fff',
  },
});

export default OrderFilterModal;
