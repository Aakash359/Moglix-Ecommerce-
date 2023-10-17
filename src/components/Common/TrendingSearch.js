import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const TrendingSearch = props => {
  const itemClicked = item => {
    props.handleAddRecentSearch({
      ...item,
      category: item.categoryId,
      id: item.categoryId,
      str: item.categoryId,
      term: item.categoryName,
      name: item.categoryName,
      type: 'Category',
    });
    props.navigation.push('Listing', {
      str: item.categoryId,
      type: 'Category',
      category: item.categoryId,
      name: item.categoryName,
      suggestionClicked: false,
      trendingSearch: true,
    });
  };

  const renderItem = () =>
    props &&
    props.data.map(_ => (
      <TouchableOpacity
        style={styles.catNameWrap}
        onPress={() => itemClicked(_)}>
        <Text style={styles.catName}>{_.categoryName}</Text>
      </TouchableOpacity>
    ));

  return (
    props &&
    props.data && (
      <>
        <Text style={styles.trendingSearchHeader}>Trending Searches</Text>
        <View style={styles.catList}>{renderItem()}</View>
      </>
    )
  );
};

const styles = StyleSheet.create({
  trendingSearchHeader: {
    color: colors.lightGrayText,
    fontSize: Dimension.font11,
    paddingVertical: Dimension.padding15,
    paddingHorizontal: Dimension.padding10,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  catNameWrap: {
    paddingHorizontal: Dimension.padding10,
    paddingVertical: Dimension.padding8,
    borderRadius: Dimension.borderRadius8,
    borderWidth: 1,
    borderColor: colors.ProductBorderColor,
    backgroundColor: '#fff',
    marginBottom: Dimension.margin10,
    marginRight: Dimension.margin10,
  },
  catName: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  catList: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding10,
    flexWrap: 'wrap',
  },
});

export default TrendingSearch;
