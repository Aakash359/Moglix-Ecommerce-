import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, TouchableOpacity, FlatList} from 'react-native';
import Header from '../../components/Common/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
import {
  setShippingAddress,
  setBillingAddress,
} from '../../redux/actions/address';
import styles from './style';

const SelectAddressScreen = props => {
  const addresses = useSelector(state => state.addressReducer || {});
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const {invoiceType, title, addressKey} = props.route.params;
  const [selectedAddressId, setSelectedAddress] = useState(
    addresses[invoiceType][addressKey],
  );

  const dispatch = useDispatch();

  const onDeliverHere = idAddress => {
    if (title == 'Billing Address') {
      dispatch(setBillingAddress(invoiceType, idAddress));
    } else {
      dispatch(setShippingAddress(invoiceType, idAddress));
    }
    props.navigation.goBack();
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => setSelectedAddress(item.idAddress)}
      style={[
        styles.changeAddressPage,
        {
          borderWidth: item.idAddress == selectedAddressId ? 0.5 : 0,
        },
      ]}>
      <View style={styles.changeAddressInner}>
        <MaterialCommunityIcon
          name={
            item.idAddress == selectedAddressId
              ? 'radiobox-marked'
              : 'radiobox-blank'
          }
          color={colors.RedThemeColor}
          size={24}
        />
        <Text style={styles.nameTxt}>{item.addressCustomerName}</Text>
      </View>
      <Text style={styles.nrmlTxt}>
        {item.addressLine},{item.city},{item.state.name}, {item.postCode}
      </Text>
      <Text style={styles.nrmlTxt}>Mobile: {item.phone}</Text>
      {selectedAddressId == item.idAddress ? (
        <View style={styles.actionRowInCard}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('UpdateAddress', {
                invoiceType,
                title,
                addressKey,
                address: item,
              })
            }
            style={styles.editCta}>
            <Text style={styles.editText}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeliverHere(item.idAddress)}
            // disabled={item.idAddress == addresses[invoiceType][addressKey]}
            style={styles.deliverHereCta}>
            <Text style={styles.deliverHereCtaTxt}>DELIVER HERE</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View>
      <Header
        showBack
        showText={`Select ${title}`}
        navigation={props.navigation}
      />
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.flatListView}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('UpdateAddress', {
                  title,
                  invoiceType,
                  addressKey,
                  address: {
                    addressCustomerName: auth.userName,
                    email: auth.email,
                    phone: auth.phone,
                  },
                })
              }
              style={styles.topDeliveryAddress}>
              <MaterialCommunityIcon
                name={'plus'}
                color={colors.RedThemeColor}
                size={17}
              />
              <Text style={styles.topDeliveryAddressTxt}>ADD {title}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 60}}
        data={
          invoiceType == 'tax' && addressKey == 'activeShippingId'
            ? addresses[invoiceType].data.filter(
                _ => _.addressType.addressType == 'shipping',
              ) || []
            : invoiceType == 'tax' && addressKey == 'activeBillingId'
            ? addresses[invoiceType].data.filter(
                _ => _.addressType.addressType == 'billing',
              ) || []
            : addresses[invoiceType].data || []
        }
        keyExtractor={(item, index) => `index-${index}`}
        renderItem={renderItem}
      />
    </View>
  );
};

export default SelectAddressScreen;
