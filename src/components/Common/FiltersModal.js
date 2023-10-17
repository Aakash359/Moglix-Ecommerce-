import React, {useEffect, useState} from 'react';
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
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const deviceWidth = Dimensions.get('window').width;
const FiltersModal = props => {
  const [searchText, setSearchText] = useState('');
  const [openFilters, setOpenFilters] = useState([]);

  const getSymbolizedText = (_, initial) => {
    let updatedFilter = _.term;
    if (initial == 'price') {
      updatedFilter = updatedFilter.split(' - ');
      updatedFilter[0] = '₹' + updatedFilter[0];
      updatedFilter[1] = '₹' + updatedFilter[1];
      updatedFilter = updatedFilter.join(' - ');
    } else if (initial == 'discount') {
      updatedFilter = updatedFilter.split(' - ');
      updatedFilter[0] = updatedFilter[0] + '%';
      updatedFilter[1] = updatedFilter[1] + '%';
      updatedFilter = updatedFilter.join(' - ');
    } else if (initial == 'ratings') {
      updatedFilter = updatedFilter + '* and above';
    }
    return updatedFilter;
  };

  const openDrillDown = item => {
    let openedFilters = [...openFilters];
    if (openFilters.includes(item)) {
      openedFilters = openedFilters.filter(_ => _ != item);
    } else {
      openedFilters.push(item);
    }
    setOpenFilters(openedFilters);
  };

  const getAppliedFilterCount = term => {
    let appliedFiltersArray = Object.keys({...props.appliedFilter}) || [];
    let isFound = appliedFiltersArray.find(_ => _ == term) || '';
    if (isFound && props.appliedFilter[isFound]) {
      return `(${props.appliedFilter[isFound].length})`;
    }
    return;
  };

  const getCategoryList = (item, index) => {
    return (
      <View
        style={{
          paddingLeft: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            props.setFilterModal(false);
            props.categoryChildItemClicked({
              categoryDetails: {...item, categoryName: item.term},
            });
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#fff',
            padding: 12,
            borderBottomColor: '#e7e7e7',
            borderBottomWidth: 1,
          }}
          key={index}>
          <Text numberOfLines={2} style={styles.text}>
            {item.term}
          </Text>
          {item.childCategoryList && item.childCategoryList.length ? (
            <MaterialCommunityIcon
              onPress={() => openDrillDown(item.categoryId)}
              name={
                openFilters.includes(item.categoryId)
                  ? 'chevron-down'
                  : 'chevron-right'
              }
              style={styles.iconStyle}
              color={'#000'}
              size={18}
            />
          ) : null}
        </TouchableOpacity>
        {item.childCategoryList &&
        item.childCategoryList.length &&
        openFilters.includes(item.categoryId)
          ? item.childCategoryList.map((_, k) => getCategoryList(_, k))
          : null}
      </View>
    );
  };

  return (
    <Modal
      overlayPointerEvents={'auto'}
      coverScreen={true}
      style={styles.modalWrap}
      deviceWidth={deviceWidth}
      hasBackdrop={true}
      onBackButtonPress={() => {
        props.setFilterModal(false);
      }}
      onBackdropPress={() => props.setFilterModal(false)}
      onBackButtonPress={() => props.setFilterModal(false)}
      isVisible={props.filterModal}
      onRequestClose={() => {
        props.setFilterModal(false);
      }}>
      <View style={styles.modalView}>
        <View style={styles.headerView}>
          <MaterialCommunityIcon
            onPress={() => {
              props.setFilterModal(false);
            }}
            name={'arrow-left'}
            style={styles.headerIcon}
            size={24}
          />
          <Text style={styles.filtHeading}>Filters</Text>
          {Object.keys(props.appliedFilterinReducer || {}).length ? (
            <TouchableOpacity
              onPress={props.clearFilters}
              style={styles.FilterBtn}>
              <Text style={styles.filterHeaderText}>CLEAR FILTER</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.filterWrap}>
          <ScrollView style={styles.scrollWrap}>
            {props.filter.map((_, i) => (
              <TouchableOpacity
                onPress={() => {
                  props.setInitialFilter(_.name);
                  setSearchText('');
                }}
                style={[
                  styles.touchableItem,
                  {
                    backgroundColor:
                      props.initialFilter === _.name ? '#fff' : '#F7F7FA',
                  },
                ]}>
                <Text style={styles.nameText}>
                  {_.name} {getAppliedFilterCount(_.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.scrollWrapItem}>
            {(
              (props.filter.find(_ => _.name === props.initialFilter) || {})
                .terms || []
            ).length > 50 ? (
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.inputField}
                  placeholderTextColor={colors.lightGrayText}
                  onChangeText={str => {
                    setSearchText(str);
                  }}
                  value={searchText}
                  blurOnSubmit={true}
                  placeholder="Search">
                    
                  </TextInput>
                <MaterialCommunityIcon
                  name="magnify"
                  style={styles.magnifyIcon}
                />
              </View>
            ) : null}
            <ScrollView>
              {(
                (props.filter.find(_ => _.name === props.initialFilter) || {})
                  .terms || []
                )
                .filter((_, i) => _.term.includes(searchText))
                .map((_, i) => (
                  <View
                    style={[
                      styles.rightView,
                      {
                        height:
                          props.initialFilter == 'category'
                            ? 'auto'
                            : Dimension.height42,
                      },
                    ]}>
                    {props.initialFilter == 'category' ? (
                      <ScrollView style={{flex: 1}}>
                        {getCategoryList(_, i)}
                      </ScrollView>
                    ) : (
                      <TouchableOpacity
                        onPress={() => props.selectFilter(_.term)}
                        style={styles.iconWrap}>
                        <MaterialCommunityIcon
                          name={
                            props.appliedFilter[props.initialFilter] &&
                            props.appliedFilter[props.initialFilter].includes(
                              _.term,
                            )
                              ? 'checkbox-marked'
                              : 'checkbox-blank-outline'
                          }
                          size={20}
                          color={
                            props.appliedFilter[props.initialFilter] &&
                            props.appliedFilter[props.initialFilter].includes(
                              _.term,
                            )
                              ? colors.BlueText
                              : '#000'
                          }
                        />
                        <Text style={styles.termText}>
                          {getSymbolizedText(_, props.initialFilter)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.bottomAction}>
          <TouchableOpacity
            onPress={() => props.applyFilters()}
            style={styles.filterTouch}>
            <Text style={styles.filterText}>APPLY FILTERS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
    borderRadius: 0,
  },
  modalView: {
    flex: 1,
    // paddingTop:60,
    backgroundColor: '#fff',
    height: Dimension.SCREEN_HEIGHT,
    // borderWidth:1,
    // borderColor:'red'
  },
  text: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    textTransform: 'capitalize',
  },
  iconStyle: {
    width: 20,
  },
  filterWrap: {
    flexDirection: 'row',
    height: Dimension.SCREEN_HEIGHT - 150,
    // borderColor:'green', borderWidth:1
  },
  scrollWrap: {width: '40%', backgroundColor: '#F7F7FA'},
  touchableItem: {
    paddingHorizontal: Dimension.padding14,
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 0.6,
    height: Dimension.height42,
    justifyContent: 'center',
  },
  nameText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    textTransform: 'capitalize',
  },
  scrollWrapItem: {width: '60%'},
  inputField: {
    height: 60,
    backgroundColor: '#fff',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    color: colors.PrimaryTextColor,
    paddingLeft: Dimension.padding10,
    paddingRight: Dimension.padding30,
  },
  iconWrap: {
    paddingHorizontal: Dimension.padding14,
    backgroundColor: '#fff',
    // borderBottomColor: '#e7e7e7',
    // borderBottomWidth: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightView: {
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 0.6,
    height: Dimension.height42,
    justifyContent: 'center',
  },
  termText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRobotoRegular,
    textTransform: 'capitalize',
    marginLeft: 8,
  },
  filterTouch: {
    backgroundColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius4,
    height: 60,
    justifyContent: 'center',
  },
  filterText: {
    color: '#fff',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignSelf: 'center',
  },

  searchBox: {position: 'relative', backgroundColor: '#fff'},
  magnifyIcon: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: 60,
    paddingTop: 15,
    fontSize: Dimension.font18,
  },
  bottomAction: {
    backgroundColor: '#EFEFF4',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: Dimension.padding5,
  },
  headerView: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF4',
    paddingHorizontal: Dimension.padding10,
  },
  filtHeading: {
    marginLeft: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    paddingTop: 5,
    color: colors.PrimaryTextColor,
  },
  filterHeaderText: {
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    paddingTop: 5,
    color: colors.RedThemeColor,
  },

  FilterBtn: {
    textAlign: 'right',
    alignItems: 'baseline',
    marginLeft: Dimension.margin180,
  },
});

export default FiltersModal;
