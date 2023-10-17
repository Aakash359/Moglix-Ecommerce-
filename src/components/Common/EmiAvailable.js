import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../redux/constants/colors';
import {getEmi} from '../../services/products';
import {setProductEmi} from '../../redux/actions/products';
import {useDispatch, useSelector} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';

const EmiAvailable = props => {
  const dispatch = useDispatch();
  const emi = useSelector(state => state.productsReducer[props.msn].emi || {});

  const [showEmi, setShowEmi] = useState(false);
  useEffect(() => {
    if (emi && emi.status !== STATE_STATUS.FETCHED) {
      getShowEmi();
    } else {
      if (emi.data) {
        setShowEmi(true);
      }
    }
  }, []);

  const getShowEmi = async () => {
    const {data} = await getEmi({
      price: props.price,
    });
    if (data.data && data.data.emiResponse) {
      dispatch(setProductEmi(props.msn, data.data.emiResponse));
      setShowEmi(true);
    }
  };

  if (!showEmi) {
    return null;
  }

  return (
    <View style={styles.shippingStripWrap}>
      <Icon name={'calendar-clock'} size={20} color={Colors.BlueText} />
      <View>
        <Text style={styles.shippingStripText1}>EMIs Available</Text>
        <Text style={styles.shippingStripText2}>
          EMI starting from{' '}
          <Text style={styles.shippingStripText3}>
            ₹{emi.data.minEmiAmount}/month
          </Text>
        </Text>
      </View>
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    marginLeft: Dimension.margin12,
    // alignSelf: 'center',
  },
  shippingStripText2: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRegularFont,
    marginLeft: Dimension.margin12,
  },
  shippingStripText3: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRobotoBold,
    marginLeft: Dimension.margin12,
  },
});

export default EmiAvailable;
