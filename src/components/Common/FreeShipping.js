import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../redux/constants/colors';
import {getShippingValue} from '../../services/products';
import {setProductShippingValue} from '../../redux/actions/products';
import {useDispatch, useSelector} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';

const FreeShipping = props => {
  const dispatch = useDispatch();
  const shippingValue = useSelector(
    state => (state.productsReducer[props.msn] || {}).shippingValue || {},
  );
  const cartItemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});

  const [showStrip, setShowStrip] = useState(false);
  useEffect(() => {
    if (shippingValue && shippingValue.status !== STATE_STATUS.FETCHED) {
      getShowStrip();
    } else {
      if (shippingValue.data && shippingValue.data.totalShippingAmount == 0) {
        setShowStrip(true);
      }
    }
  }, []);

  const getShowStrip = async () => {
    const {data} = await getShippingValue({
      itemsList: [
        {
          categoryId: props.categoryCode,
          productId: props.msn.toUpperCase(),
          taxonomy: props.taxonomyCode,
        },
      ],
      totalPayableAmount: cart && cart.cart && cart.cart.totalPayableAmount,
    });
    if (data.data && data.data.totalShippingAmount == 0) {
      setShowStrip(true);
    }
  };

  if (!showStrip) {
    return null;
  }

  return (
    <View style={styles.shippingStripWrap}>
      <Icon name={'truck-fast'} size={20} color={Colors.green2} />
      <Text style={styles.shippingStripText1}>Free Delivery</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  shippingStripWrap: {
    // borderRadius: 8,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: Colors.BoldgreenText,
    padding: Dimension.padding12,
    marginTop: Dimension.margin12,
    flexDirection: 'row',
  },
  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: Dimension.margin12,
    alignSelf: 'center',
  },
});

export default FreeShipping;
