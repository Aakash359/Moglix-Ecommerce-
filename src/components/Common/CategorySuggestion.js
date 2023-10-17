import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const CategorySuggestion = props => {
  return (
    <TouchableOpacity
      style={styles.suggestListItem}
      onPress={() => {
        props.itemClicked(props.item, true);
      }}>
      <Image
        source={{
          uri:
            'https://cdn.moglix.com/' +
            (Platform.OS == 'android'
              ? props.item.imageWebp || props.item.imageLink
              : props.item.imageLink),
        }}
        style={{width: Dimension.width30, height: Dimension.width30}}
        resizeMode="contain"
      />
      <Text style={styles.listItemText}>{props.item.categoryName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  suggestListItem: {
    borderColor: colors.ProductBorderColor,
    paddingVertical: Dimension.padding12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    marginLeft: Dimension.margin12,
  },
});

export default CategorySuggestion;
