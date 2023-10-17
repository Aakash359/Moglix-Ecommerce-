import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {OrderedMap} from 'immutable';

const ProductSpecs = props => {
  const renderSingleItem = (displayText, isBrand) => (
    <TouchableOpacity
      disabled={!isBrand}
      onPress={() =>
        isBrand
          ? props.navigation.push('Listing', {
              str: displayText,
              type: 'Brand',
              category: '',
            })
          : null
      }
      style={styles.brandWrap}>
      <Text
        style={[
          styles.brandText,
          {
            color: isBrand ? 'dodgerblue' : '#000',
          },
        ]}>
        {displayText}
      </Text>
    </TouchableOpacity>
  );

  const renderSingleRow = (childrenItem, childrenKey, isBrand) => (
    <View key={childrenKey} style={styles.singleRow}>
      {renderSingleItem(childrenKey)}
      {renderSingleItem(childrenItem.join(', '), isBrand)}
    </View>
  );

  return (
    <>
      <View>
        {renderSingleRow([props.brandName], 'Brand', true)}
        {new OrderedMap(props.productSpecifications)
          .map((childrenItem, childrenKey) =>
            renderSingleRow(childrenItem, childrenKey),
          )
          .toList()
          .toArray()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  brandWrap: {
    width: '50%',
    borderWidth: 0.4,
    borderColor: '#e7e7e7',
    paddingVertical: Dimension.padding12,
    paddingHorizontal: Dimension.padding10,
  },
  brandText: {
    fontFamily: Dimension.CustomLightFont,
    fontSize: Dimension.font12,
  },
  singleRow: {flexDirection: 'row', alignItems: 'center'},
});

export default ProductSpecs;
