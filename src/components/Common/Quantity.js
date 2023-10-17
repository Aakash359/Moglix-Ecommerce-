import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import {getProduct} from '../../services/products';
import colors from '../../redux/constants/colors';
import Toast from 'react-native-toast-message';
const Quantity = props => {
  const [quantity, setQuantity] = useState(props.productQuantity || 1);

  useEffect(() => {
    setQuantity(props.productQuantity || 1);
  }, [props.productQuantity]);

  const incdecQuantity = async (value, type) => {
    if (props.fromCartCard && value == 0) {
      // props.setQuantity(1);
      setQuantity(props.productQuantity);
      props.showRemove();
      return;
    }
    if (props.minQuantity && props.minQuantity <= value) {
      if (props.fromPdp) {
        if (props.productData.quantityAvailable >= value && value >= 1) {
          props.setQuantity(value);
          setQuantity(value);
          return;
        } else if (props.productData.quantityAvailable < value) {
          Toast.show({
            type: 'error',
            text2: `Only ${props.productData.quantityAvailable} units available in stock`,
            visibilityTime: 2000,
            autoHide: true,
          });
        }
        setQuantity(props.productQuantity);
        return;
      } else if (props.fromRfq) {
        if (value >= 1) {
          props.setQuantity(value);
          setQuantity(value);
        }
        return;
      }
      // if (props.fromPdp) {
      const {data} = await getProduct(props.productId);
      if (data && data.productBO) {
        if (value > data.productBO.quantityAvailable) {
          Toast.show({
            type: 'error',
            text2: `Only ${data.productBO.quantityAvailable} units available in stock`,
            visibilityTime: 2000,
            autoHide: true,
          });
          setQuantity(props.productQuantity);
          // props.setQuantity(data.productBO.quantityAvailable);
          return;
        }
        if (
          props.fromCartCard &&
          value <
            data.productBO.productPartDetails[props.productId]
              .productPriceQuantity.india.moq
        ) {
          // props.setQuantity(
          //   data.productBO.productPartDetails[props.productId]
          //     .productPriceQuantity.india.moq,
          // );
          setQuantity(props.productQuantity);
          props.showRemove();
          return;
        }
        if (
          value >=
          data.productBO.productPartDetails[props.productId]
            .productPriceQuantity.india.moq
        ) {
          props.updateQuantity(props.productId, value);
          return;
        } else {
          // props.updateQuantity(
          //   props.productId,
          //   data.productBO.productPartDetails[props.productId]
          //     .productPriceQuantity.india.moq,
          // );
          setQuantity(props.productQuantity);
        }

        // if (
        //   !(value > data.productBO.quantityAvailable) &&
        //   !(
        //     value <
        //     data.productBO.productPartDetails[props.productId]
        //       .productPriceQuantity.india.moq
        //   )
        // ) {
        //   props.updateQuantity(props.productId, value);
        // }
      }
    } else {
      if (props.fromPdp) {
        if (
          props.productData.quantityAvailable >= props.minQuantity &&
          props.minQuantity >= 1
        ) {
          props.setQuantity(props.minQuantity);
          setQuantity(props.minQuantity);
        }
        return;
      } else if (props.fromRfq) {
        if (props.minQuantity >= 1) {
          props.setQuantity(props.minQuantity);
          setQuantity(props.minQuantity);
        }
        return;
      }
      // if (props.fromPdp) {
      const {data} = await getProduct(props.productId);
      if (data && data.productBO) {
        if (props.minQuantity > data.productBO.quantityAvailable) {
          Toast.show({
            type: 'error',
            text2: `Only ${data.productBO.quantityAvailable} units available in stock`,
            visibilityTime: 2000,
            autoHide: true,
          });
          // props.setQuantity(data.productBO.quantityAvailable);
          setQuantity(props.productQuantity);
          return;
        }
        if (
          props.fromCartCard &&
          value <
            data.productBO.productPartDetails[props.productId]
              .productPriceQuantity.india.moq
        ) {
          props.showRemove();
          // props.setQuantity(
          //   data.productBO.productPartDetails[props.productId]
          //     .productPriceQuantity.india.moq,
          // );
          setQuantity(props.productQuantity);
          return;
        }
        if (
          value <
          data.productBO.productPartDetails[props.productId]
            .productPriceQuantity.india.moq
        ) {
          setQuantity(props.productQuantity);
          // props.setQuantity(
          //   data.productBO.productPartDetails[props.productId]
          //     .productPriceQuantity.india.moq,
          // );
          return;
        }

        // if (
        //   !(props.minQuantity > data.productBO.quantityAvailable) &&
        //   !(
        //     props.minQuantity <
        //     data.productBO.productPartDetails[props.productId]
        //       .productPriceQuantity.india.moq
        //   )
        // ) {
        //   props.updateQuantity(props.productId, props.minQuantity);
        // }
      }
    }
    // }
  };

  return (
    <View style={styles.qtyWrap}>
      <TouchableOpacity
        style={styles.qtyAction}
        onPress={() => incdecQuantity(quantity - 1, 'DEC')}>
        <Text style={styles.qtySign}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.numText}
        keyboardType={'number-pad'}
        value={String(quantity)}
        onChangeText={val => setQuantity(val)}
        onBlur={() => incdecQuantity(quantity, '')}
      />
      <TouchableOpacity
        style={styles.qtyAction}
        onPress={() => incdecQuantity(quantity + 1, 'INC')}>
        <Text style={styles.qtySign}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  qtyWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: Dimension.padding10,
  },
  qtyAction: {
    height: Dimension.width26,
    width: Dimension.width26,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    alignItems: 'center',
    borderRadius: Dimension.borderRadius4,
    backgroundColor: colors.bluelightshade,
    marginRight: Dimension.margin4,
  },
  qtySign: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font20,
    fontFamily: Dimension.CustomMediumFont,
    paddingTop: 0,
    justifyContent: 'center',
  },
  numText: {
    borderWidth: 1,
    borderColor: colors.lightBlue,
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius4,
    backgroundColor: '#fff',
    height: Dimension.width26,
    width: Dimension.width50,
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    textAlign: 'center',
    marginRight: Dimension.margin4,
    paddingTop: 3,
    paddingBottom: 0,
  },
});

export default Quantity;
