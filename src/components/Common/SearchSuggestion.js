import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const SearchSuggestion = props => {
  return (
    <View>
      <TouchableOpacity
        style={styles.suggestListItem}
        onPress={() => {
          props.itemClicked(props.item, true);
        }}>
        <Text style={styles.listItemText}>{props.item.name}</Text>
        <Image style={styles.gotoImage} source={require('../../assets/images/share-box-line1.png')} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  suggestListItem: {
    borderColor: colors.ProductBorderColor,
    paddingVertical: Dimension.padding14,
    borderBottomWidth: 1,
    flexDirection:'row', 
    justifyContent:'space-between',
    alignItems:'center'
  },
  listItemText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  gotoImage:{width:Dimension.width20, height:Dimension.width20}
});

export default SearchSuggestion;
