import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {applyThousandSeparator} from '../../generic';

const ProductPrice = props => {
  return (
    <View>
      <View style={styles.productView}>
        {props.mrp > props.priceWithoutTax && !props.outOfStock ? (
          <Text style={styles.PrdOriginalPrice}>
            ₹{applyThousandSeparator(props.mrp)}
          </Text>
        ) : null}
        {props.mrp > props.priceWithoutTax && props.mrp && !props.outOfStock ? (
          <Text style={styles.PrdOff}>
            {Math.floor(
              ((parseInt(props.mrp) - parseInt(props.priceWithoutTax)) /
                parseInt(props.mrp)) *
                100,
            )}
            % OFF
          </Text>
        ) : null}
      </View>
      {props.priceWithoutTax > 0 && !props.outOfStock ? (
        <Text style={styles.PrdOfferPrice}>
          ₹{applyThousandSeparator(props.priceWithoutTax)}
        </Text>
      ) : null}
      {props.mrp > props.priceWithoutTax && props.mrp && !props.outOfStock ? (
        <Text style={styles.lightText}>
          GST @{props.taxRule.taxPercentage}% Inclusive Price:{' '}
          <Text
            style={[
              styles.lightText,
              {fontWeight: '400', fontFamily: Dimension.CustomRobotoRegular},
            ]}>
            ₹{applyThousandSeparator(props.sellingPrice.toFixed(0))}
          </Text>
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  PrdName: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },

  PrdOriginalPrice: {
    color: Colors.SecondaryTextColor,
    fontSize: Dimension.font12,
    fontWeight: '400',
    fontFamily: Dimension.CustomRobotoRegular,
    textDecorationLine: 'line-through',
    marginRight: Dimension.margin10,
  },
  PrdOff: {
    color: Colors.GreenColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  PrdOfferPrice: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font24,
    fontFamily: Dimension.CustomRobotoBold,
    fontWeight: 'bold',
    lineHeight: Dimension.font124,
  },
  lightText: {
    color: Colors.lightGrayText,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  productView: {flexDirection: 'row'},
});

export default ProductPrice;
