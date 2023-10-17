import React from 'react';
import {Text, StyleSheet, Image, View, Dimensions} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const DeliveryData = props => {
  return (
    <>
      {props.deliveryData.aggregate.serviceable ? (
        <View style={styles.whiteBg}>
          <Image
            source={require('../../assets/images/shipping1.png')}
            style={styles.leftImageIcon}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.deliBlackText}>
              <Text style={styles.orangeText}>Order Now</Text> to get delivery
              in{' '}
              {Math.ceil(
                (props.deliveryData.avgDay + props.deliveryData.minDay) / 2,
              )}{' '}
              day(s)
            </Text>
            <Text style={styles.greyText}>
              Shipping charges visible in cart
            </Text>
          </View>
        </View>
      ) : null}
      <View style={styles.whiteBg}>
        {props.deliveryData.aggregate.serviceable ? (
          <Image
            source={require('../../assets/images/delivery-available.png')}
            style={styles.leftImageIcon}
            resizeMode="contain"
          />
        ) : null}
        <View>
          <Text
            style={[
              styles.delText,
              {
                color: props.deliveryData.aggregate.codAvailable
                  ? colors.GreenColor
                  : colors.RedThemeColor,
              },
            ]}>
            {props.deliveryData.aggregate.codAvailable
              ? 'COD Available'
              : !props.deliveryData.aggregate.serviceable
              ? 'Pincode is not servicable'
              : 'COD Not Available'}
          </Text>
          {props.deliveryData.aggregate.serviceable ? (
            <Text style={styles.greyText}>
              Shipping charges visible in cart
            </Text>
          ) : null}
        </View>
      </View>
      {props.deliveryData.aggregate.message ? (
        <View style={styles.whiteBg}>
          <Text style={styles.delText}>
            {props.deliveryData.aggregate.message}
          </Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  delText: {
    color: colors.GreenColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
  },
  whiteBg: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding15,
    alignItems: 'center',
    paddingVertical: Dimension.padding15,
    borderTopWidth: 1,
  },
  deliBlackText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    color: colors.PrimaryTextColor,
    marginBottom: -3,
  },
  orangeText: {color: colors.orangeColor},
  leftImageIcon: {width: Dimension.width25, marginRight: 15},
  greyText: {
    color: colors.lightGrayText,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRegularFont,
  },
});

export default DeliveryData;
