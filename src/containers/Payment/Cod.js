import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const Cod = props => {
  const {servicable} = props;
  console.log(props.address);
  return (
    <View style={{marginHorizontal: Dimension.margin15}}>
      {
        servicable ? (
          <View style={styles.codAvailabelTextWrap}>
            <Text style={styles.codAvailabelText}>
              Great! All products in the cart are eligible for Cash-on-Delivery.
            </Text>
            <Text
              style={[
                styles.codAvailabelText,
                {marginTop: Dimension.margin10},
              ]}>
              Amount payable on delivery :{' '}
              <Text
                style={[
                  styles.codAvailabelText,
                  {
                    fontFamily: Dimension.CustomRobotoRegular,
                    fontSize: Dimension.font12,
                  },
                ]}>
                {props.amountPayable}
              </Text>
            </Text>
          </View>
        ) : null
        // <View style={styles.codNotAvailabelForFewItemsTextWrap}>
        //   <Text style={styles.codNotAvailabelForFewItemsText}>
        //     Few Items are not eligible for COD
        //   </Text>
        //   <TouchableOpacity>
        //     <FAIcon
        //       name={'question-circle'}
        //       size={18}
        //       style={styles.questIcon}
        //       color={colors.blueShade}
        //     />
        //   </TouchableOpacity>
        // </View>
      }
      {/* <View style={styles.codNotAvailabelForFewItemsTextWrap}>
    <Text style={styles.codNotAvailabelForFewItemsText}>Few Items is not eligible for COD</Text>
    <TouchableOpacity>
    <FAIcon name={'question-circle'} size={18} style={styles.questIcon} color={colors.blueShade} />
    </TouchableOpacity>
  </View> */}
      {servicable ? (
        <>
          <Text style={styles.SubTitle}>
            *Payment through cash on delivery, is subjected to availability of
            the device.
          </Text>
          {props.address.phone ? (
            <>
              <Text style={styles.codDetLabel}>Mobile Number</Text>
              <Text style={styles.codDetText}>+91-{props.address.phone}</Text>
            </>
          ) : null}
          {props.address.email ? (
            <>
              <Text style={styles.codDetLabel}>Email ID</Text>
              <Text style={styles.codDetText}>{props.address.email}</Text>
            </>
          ) : null}
        </>
      ) : (
        <View style={styles.codNotAvailabelTextWrap}>
          <Text style={styles.codAvailabelText}>
            Your cart is not eligible for COD{' '}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ///Cod css
  codAvailabelTextWrap: {
    borderRadius: Dimension.borderRadius8,
    borderWidth: 1,
    borderColor: colors.GreenColor,
    backgroundColor: colors.lightGreen,
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    marginBottom: Dimension.margin15,
    // marginHorizontal:Dimension.margin15
  },
  codAvailabelText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
  },
  codNotAvailabelTextWrap: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.orangeColor,
    backgroundColor: '#FFEBE0',
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    marginBottom: Dimension.margin15,
    // marginHorizontal:Dimension.margin15
  },
  codNotAvailabelForFewItemsTextWrap: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.ProductBorderColor,
    backgroundColor: '#fff',
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    flexDirection: 'row',
    marginBottom: Dimension.margin15,
  },
  codNotAvailabelForFewItemsText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.BlueText,
  },
  SubTitle: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.PrimaryTextColor,
    marginBottom: Dimension.margin15,
  },
  codDetLabel: {
    color: colors.ExtralightGrayText,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
  },
  codDetText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    marginBottom: Dimension.margin10,
  },
  questIcon: {marginLeft: Dimension.margin10},
});

export default Cod;
