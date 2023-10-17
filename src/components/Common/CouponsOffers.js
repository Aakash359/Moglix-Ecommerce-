import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../redux/constants/colors';
import {getOffer} from '../../services/products';
import {setProductOffer} from '../../redux/actions/products';
import {useDispatch, useSelector} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';
import SectionTitle from './SectionTitle';

const FreeShipping = props => {
  const dispatch = useDispatch();
  const offer = useSelector(
    state => state.productsReducer[props.msn].offer || {},
  );

  const [showOffer, setShowOffer] = useState(false);
  useEffect(() => {
    if (offer && offer.status !== STATE_STATUS.FETCHED) {
      getShowOffer();
    } else {
      if (offer.data) {
        setShowOffer(true);
      }
    }
  }, []);

  const getShowOffer = async () => {
    const {data} = await getOffer({
      itemsList: [
        {
          categoryId: props.categoryCode,
          productId: props.msn.toUpperCase(),
          taxonomy: props.taxonomyCode,
        },
      ],
      totalPayableAmount: props.price,
    });
    if (data.data) {
      dispatch(setProductOffer(props.msn, data.data));
      setShowOffer(true);
    }
  };

  if (!showOffer) {
    return null;
  }

  return (
    <View style={styles.shippingStripWrap}>
      <SectionTitle Title={'Coupon & Offers'} />
      {offer.data.map((coupon, couponKey) => (
        <TouchableOpacity
          key={couponKey}
          onPress={() => props.couponAndOffersModal(coupon)}
          style={styles.couponOffer}>
          <View style={styles.row}>
            <Icon
              name={'ticket-confirmation'}
              size={22}
              color={Colors.green2}
            />
            <View style={styles.couponWrap}>
              <Text style={styles.titletext}>
                {coupon.block_data.image_block[0].image_title}
              </Text>
              <Text style={styles.SubTitletext}>
                {
                  coupon.block_data.image_block['0'].image_general['0']
                    .general_url
                }{' '}
                {
                  coupon.block_data.image_block['0'].image_general['1']
                    .general_url
                }
              </Text>
            </View>
          </View>
          <Icon name={'chevron-right'} size={24} color={'#000'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
  shippingStripWrap: {
    // borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    // borderWidth: 1,
    // borderColor: Colors.BoldgreenText,
    padding: Dimension.padding12,
    marginTop: Dimension.margin10,
  },
  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: Dimension.margin12,
    alignSelf: 'center',
  },
  titletext: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
  },
  SubTitletext: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.PrimaryTextColor,
  },
  couponOffer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Dimension.margin12,
  },
  couponWrap: {
    marginLeft: Dimension.margin12,
    width: '85%',
  },
});

export default FreeShipping;
