import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../redux/constants/colors';
import RfqRequirement from '../Common/RfqRequirement';
import RFQSuccess from './RFQSuccess';

const GetQuote = props => {
  const [rfqRequirement, setRfqRequirement] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  return (
    <>
      <View style={styles.shippingStripWrap}>
        <View style={styles.leftQuoteText}>
          <Icon name={'dropbox'} size={24} color={'#000'} />
          <View style={styles.alignView}>
            <Text style={styles.shippingStripText1}>
              Want to buy even more quantity
            </Text>
            <Text style={styles.shippingStripText2}>Get customized price</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.ViewAllBtn}
          onPress={() =>
            props.authenticated == 'true'
              ? setRfqRequirement(!rfqRequirement)
              : props.navigation.push('Auth')
          }>
          <Text style={styles.ViewAllBtnText}>GET QUOTE</Text>
        </TouchableOpacity>
      </View>
      {rfqSuccess && (
        <RFQSuccess visible={rfqSuccess} onClose={() => setRfqSuccess(false)} />
      )}
      {rfqRequirement && (
        <RfqRequirement
          userId={props.userId}
          minQuantity={props.minQuantity}
          showSuccess={() => setRfqSuccess(true)}
          rfqRequirement={rfqRequirement}
          setRfqRequirement={setRfqRequirement}
          productData={props.productData}
          user={props.user}
          navigation={props.navigation}
          sessionId={props.sessionId}
          token={props.token}
          fromGetQuote
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  leftQuoteText: {flexDirection: 'row'},
  alignView: {alignSelf: 'flex-start', flexDirection: 'column'},
  shippingStripWrap: {
    // borderRadius: 8,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: Colors.BoldgreenText,
    paddingHorizontal: Dimension.padding12,
    paddingVertical: Dimension.padding8,
    marginTop: Dimension.margin10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    marginLeft: Dimension.margin10,
    marginBottom: -Dimension.margin2,
  },
  ViewAllBtn: {
    backgroundColor: Colors.LightRedThemeColor,
    paddingHorizontal: Dimension.padding20,
    paddingVertical: Dimension.padding8,
    borderRadius: 4,
  },
  ViewAllBtnText: {
    textTransform: 'uppercase',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: Colors.RedThemeColor,
  },
  shippingStripText2: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font9,
    opacity: 0.8,
    fontFamily: Dimension.CustomMediumFont,
    marginLeft: Dimension.margin10,
  },
});

export default GetQuote;
