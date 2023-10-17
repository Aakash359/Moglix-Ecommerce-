import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {OrderedMap} from 'immutable';


const ListingHeader = props => {
  const [filterCount, setFilterCount] = useState(0);
  useEffect(() => {
    let filterKeys = Object.keys(props.appliedFilter);
    let count = 0;
    filterKeys.map(_ => {
      count += props.appliedFilter[_].length;
    });
    setFilterCount(count);
  }, [(Object.keys(props.appliedFilter) || []).length]);

  return (
    <View style={styles.listHeaderBg}>
      <View style={styles.ListHeaderWrap}>
        <View style={styles.listWrapLeft}>
          <TouchableOpacity
            style={[styles.listWrapInner, styles.listWrapInnerLeft]}
            onPress={() => {
              props.setFilterModal(true);
            }}>
              
            <MaterialCommunityIcon
              name="filter-variant"
              style={styles.filterIcon}
            />
            <Text style={styles.listHeaderText}>Filters</Text>
            {filterCount ? (
              <View style={styles.filterCountWrap}>
                <Text style={styles.filterCountText}>{filterCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.listWrapInner, styles.listWrapInnerRIght]}
            onPress={() => {
              props.setSortByModal(true);
            }}>
              <FontAwesome
              name="arrows-v"
              style={styles.verticalIcon}
              />
            <MaterialCommunityIcon
              name="sort-variant"
              style={styles.filterIcon}
            />
            <Text style={styles.listHeaderText}>Sort By</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listWrapLeft: {flex: 8, flexDirection: 'row'},
  ListHeaderWrap: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    borderTopColor: Colors.ProductBorderColor,
    borderTopWidth: 1,
    paddingVertical: Dimension.padding10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  listWrapInner: {flexDirection: 'row', flex: 1},
  imgCss: {width: Dimension.width24, height: Dimension.width24},
  listHeaderText: {
    marginLeft: Dimension.padding10,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
    lineHeight: Dimension.width24,
    justifyContent: 'center',
  },
  listWrapInnerLeft: {
    borderRightColor: Colors.ProductBorderColor,
    borderRightWidth: 1,
  },
  listWrapInnerRIght: {paddingLeft: Dimension.padding15},
  filterCountWrap: {
    paddingHorizontal: Dimension.padding4,
    borderRadius: 3,
    backgroundColor: Colors.LightRedThemeColor,
    height: Dimension.width12,
    justifyContent: 'center',
    marginLeft: Dimension.margin5,
    marginTop: Dimension.margin6,
  },
  filterCountText: {
    fontSize: Dimension.font8,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.RedThemeColor,
    justifyContent: 'center',
  },
  listHeaderBg: {backgroundColor: '#F7F7FA'},
  filterIcon: {fontSize: Dimension.font18},
  verticalIcon:{fontSize: Dimension.font15,marginTop:Dimension.margin3,left:1},
});

export default ListingHeader;
