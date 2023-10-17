import React from 'react';
import {Text, TouchableOpacity, StyleSheet,Image} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const RecentSearch = props => {
  return (
    <TouchableOpacity
      style={styles.suggestListItem}
      onPress={() => {
        props.itemClicked(props.item, false);
      }}>
      <TouchableOpacity
        onPress={() => props.removeSearch(props.item.name)}
        style={styles.deleteItem}>
        <MaterialCommunityIcon
          name="close-thick"
          style={styles.deleteItemIcon}
        />
      </TouchableOpacity>
      <Text style={styles.listItemText}>{props.item.name}</Text>
      <TouchableOpacity onPress={() => props.fillSearch(props.item.name)}>
        {/* <MaterialCommunityIcon
          name="monitor-share"
          style={[
            styles.deleteItemIcon,
            {alignSelf: 'flex-end', alignContent: 'center'},
          ]}
        /> */}
        <Image
          source={require('../../assets/images/share-box-line1.png')}
          style={[
            styles.recentScrIcon,
            {alignSelf: 'flex-end', alignContent: 'center'},
          ]}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  suggestListItem: {
    borderColor: colors.ProductBorderColor,
    paddingVertical: Dimension.padding12,
    borderBottomWidth: 1,
    position: 'relative',
    paddingLeft: Dimension.padding30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    justifyContent:'center',
    alignItems:'center',
    marginTop:1.8
  },
  deleteItem: {
    position: 'absolute',
    left: 5,
    top: 7,
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  deleteItemIcon: {
    fontSize: Dimension.font14, 
    color: colors.PrimaryTextColor,
    alignItems:'center',
    justifyContent:'center'
  },
  recentScrIcon: {
    height: 15,
    width: 15,
    color: colors.PrimaryTextColor,
   
  },
});

export default RecentSearch;
