import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getProductBuyCount} from '../../services/products';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const ProductBrought = props => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState();

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    const {data} = await getProductBuyCount(props.msn);
    console.log(data);
    if (data.data.message) {
      setMessage(data.data.message);
      setType('message');
    } else if (props.quantity < 10) {
      setMessage(`Hurry up! Only ${props.quantity} left`);
      setType('quantity');
    } else {
      setMessage(null);
      setType('null');
    }
  };

  return message ? (
    <View style={styles.tagWrap}>
      <View
        style={{
          backgroundColor:
            type == 'message' ? colors.LightRedThemeColor : colors.white,
          flexDirection: 'row',
        }}>
        <MaterialCommunityIcon
          style={styles.trendIcon}
          name={'trending-up'}
          size={20}
        />
        <Text style={styles.trendText}>
          <Text>{message ? message : null}</Text>
        </Text>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  tagWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Dimension.padding10,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: colors.LightRedThemeColor,
    borderRadius: Dimension.borderRadius4,
    paddingVertical: Dimension.padding5,
    paddingHorizontal: Dimension.padding8,
  },
  trendIcon: {color: colors.RedThemeColor, marginRight: 5},
  trendText: {
    color: Dimension.RedThemeColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font11,
    color: colors.RedThemeColor,
  },
});

export default ProductBrought;
