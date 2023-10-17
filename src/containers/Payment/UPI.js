import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {OrderedMap} from 'immutable';
import colors from '../../redux/constants/colors';
import {payApi} from '../../services/payment';
import styles from './style';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import Toast from 'react-native-toast-message';

const UPI = forwardRef((props, ref) => {
  const [init, setInit] = useState(true);
  const [upiId, setupiId] = useState('');
  const [upiIdError, setupiIdError] = useState(false);

  useEffect(() => {
    setInit(false);
  }, []);

  useImperativeHandle(ref, () => ({
    payRequest() {
      if (!upiIdError && upiId && upiId.length > 3) {
        setupiIdError(false);
        props.setLoader(true);
        let validatorObj = {
          mode: props.invoiceType == 'tax' ? 'UPI' : 'TEZ',
          paymentGateway: props.invoiceType == 'tax' ? 'razorpay' : undefined,
          paymentId: props.invoiceType == 'tax' ? 132 : 62,
          platformCode: 'online',
          requestParams: {
            bankcode: props.invoiceType == 'tax' ? 'upi' : 'TEZ',
            email: '',
            firstname: '',
            phone: '',
            productinfo: 'MSNghihjbc',
            vpa: props.invoiceType == 'tax' ? upiId : undefined,
          },
          validatorRequest: {
            shoppingCartDto: {
              ...props.shoppingCartDto,
              offersList: props.shoppingCartDto.offersList?.length
                ? props.shoppingCartDto.offersList
                : null,

              cart: {
                ...props.shoppingCartDto.cart,
                createdAt: null,
                updatedAt: null,
                totalOffer: props.shoppingCartDto.cart.totalOffer || 0,
                totalAmountWithOffer:
                  props.shoppingCartDto.cart.totalAmountWithOffer || 0,
                taxes: props.shoppingCartDto.cart.taxes || 0,
                isGift: props.shoppingCartDto.cart.isGift || false,
                giftPackingCharges:
                  props.shoppingCartDto.cart.giftPackingCharges || 0,
                currency: 'INR',
              },
              payment: {
                paymentMethodId: props.invoiceType == 'tax' ? 132 : 62,
                type: 'TEZ',
              },
            },
          },
        };
        payApi(validatorObj, props.sessionId, props.token)
          .then(({data}) => {
            if (data.status) {
              props.setLoader(false);
              let upiData =
                props.invoiceType == 'tax'
                  ? data.data
                  : data.data.payUWalletRequest;
              upiData['vpa'] = upiId;
              let webviewData =
                props.invoiceType == 'retail'
                  ? payFromWebview(upiData)
                  : '<html><head></head><body></body></html>';
              props.navigation.navigate('WebView', {
                htmlString: webviewData,
                title: 'UPI',
                fromPayment: true,
                invoiceType: props.invoiceType,
                data: data.data,
              });
            } else {
              props.setLoader(false);
              Toast.show({
                type: 'error',
                text2: data.description,
                visibilityTime: 2000,
                autoHide: true,
              });
            }
          })
          .catch(e => {
            props.setLoader(false);
            console.log(e);
          });
      } else {
        props.setLoader(false);
        setupiIdError(true);
      }
    },
  }));

  const payFromWebview = payuData => {
    let str = `<html>
    <body onload='document.forms[0].submit();'>
    <Form action="${payuData['formUrl']}" method="post">
        <Item><Input type="hidden" name="key" value="${payuData['key']}" /></Item>
        <Item><Input type="hidden" name="txnid" value="${payuData['txnid']}" /></Item>
        <Item><Input type="hidden" name="amount" value="${payuData['amount']}" /></Item>
        <Item><Input type="hidden" name="productinfo" value="${payuData['productinfo']}" /></Item>
        <Item><Input type="hidden" name="firstname" value="${payuData['firstname']}" /></Item>
        <Item><Input type="hidden" name="email" value="${payuData['email']}" /></Item>
        <Item><Input type="hidden" name="phone" value="${payuData['phone']}" /></Item>
        <Item><Input type="hidden" name="surl" value="${payuData['surl']}" /></Item>
        <Item><Input type="hidden" name="furl" value="${payuData['furl']}" /></Item>
        <Item><Input type="hidden" name="curl" value="${payuData['curl']}" /></Item>
        <Item><Input type="hidden" name="hash" value="${payuData['hash']}" /></Item>
        <Item><Input type="hidden" name="pg" value="${payuData['pg']}" /></Item>
        <Item><Input type="hidden" name="bankcode" value="${payuData['bankcode']}" /></Item>
        <Item><Input type="hidden" name="vpa" value="${payuData['vpa']}" /></Item>
    </Form></body></html>`;
    return str;
  };

  const onChangeUpiText = text => {
    setupiId(text);
  };

  useEffect(() => {
    if (!init) {
      if (upiId && upiId.length > 3) {
        setupiIdError(false);
      } else {
        setupiIdError(true);
      }
    }
  }, [upiId]);

  return (
    <View style={styles.upiWrapper}>
      {new OrderedMap(props.paymentDetails).filter(
        (upi, upiId) => !upi.up_status,
      ).size ? (
        <Text style={{color: 'red', fontSize: 12}}>
          Low success rate currently observed in some cases. If possible, use an
          alternate payment mode
        </Text>
      ) : null}
      <View>
        {/* <TextInput
          autoFocus={true}
          placeholder="UPI"
          placeholderTextColor={'#888'}
          selectionColor={'#888'}
          returnKeyType={'done'}
          onChangeText={onChangeUpiText}
          value={upiId}
          style={styles.upiInput}
        // onChangeText={onSearchText}
        // value={inputValue}
        // onSubmitEditing={event => {
        //   props.navigation.push('Listing', {
        //     type: 'Search',
        //     str: event.nativeEvent.text,
        //     category: '',
        //   });
        // }}
        /> */}

        <View style={styles.newinputfield}>
          <FloatingLabelInputField
            label={'UPI'}
            // maxLength={maxLength}
            // keyboardType={keyboardType}

            autoFocus={true}
            // selectionColor={'#888'}
            returnKeyType={'done'}
            value={upiId}
            onChangeText={onChangeUpiText}
          />
          {upiIdError && (
            <Text style={{color: 'red'}}>Please enter a valid UPI address</Text>
          )}
        </View>
      </View>
      <Text style={styles.support}>We support following UPI IDs</Text>
      <View style={styles.supportImages}>
        <Image
          source={require('../../assets/images/gpay_upi1.png')}
          style={styles.UpiImg}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/images/phonepe_upi1.png')}
          style={styles.UpiImg}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/images/bhim_upi1.png')}
          style={styles.UpiImg}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/images/whatsapp_upi1.png')}
          style={styles.UpiImg}
          resizeMode="contain"
        />
      </View>
    </View>
  );
});

export default UPI;
