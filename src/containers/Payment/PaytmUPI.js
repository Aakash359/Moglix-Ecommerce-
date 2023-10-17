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
import {payApi} from '../../services/payment';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import styles from './style';
import Toast from 'react-native-toast-message';

const PaytmUPI = forwardRef((props, ref) => {
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
          mode: 'UPI',
          paymentGateway: 'paytm',
          paymentId: 134,
          platformCode: 'online',
          requestParams: {
            email: '',
            paymentChannel: 'WEB',
            phone: '7908203324',
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
                paymentMethodId: 53,
                type: 'PAYTM',
              },
            },
          },
        };
        payApi(validatorObj, props.sessionId, props.token)
          .then(({data}) => {
            if (data.status) {
              props.setLoader(false);
              let upiData = data.data;
              upiData['payerAccount'] = upiId;
              let webviewData = payFromWebview(upiData);
              props.navigation.navigate('WebView', {
                htmlString: webviewData,
                title: 'Paytm UPI',
                fromPayment: true,
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
    <Form action="${payuData['actionUrl']}" method="post" id="paytm_upi_form" name="paytm_upi_form">
      <Item><Input type="hidden" id="mid" name="mid" autocomplete="off" value="${payuData['mid']}" /></Item>
      <Item><Input type="hidden" id="orderId" name="orderId" autocomplete="off" value="${payuData['orderId']}" /></Item>
      <Item><Input type="hidden" id="txnToken" name="txnToken" autocomplete="off" value="${payuData['txnToken']}" /></Item>
      <Item><Input type="hidden" id="channelId" name="channelId" autocomplete="off" value="WEB" /></Item>
      <Item><Input type="hidden" id="paymentMode" name="paymentMode" autocomplete="off" value="UPI" /></Item>
      <Item><Input type="hidden" id="authMode" name="authMode" autocomplete="off" value="USRPWD" /></Item>
      <Item><Input type="hidden" id="storeInstrument" name="storeInstrument" autocomplete="off" value="0" /></Item>
      <Item><Input type="hidden" id="cardInfo" name="cardInfo" autocomplete="off" value="" /></Item>
      <Item><Input type="hidden" id="channelCode" name="channelCode" autocomplete="off" value="collect" /></Item>
      <Item><Input type="hidden" id="planId" name="planId" autocomplete="off" value="" /></Item>
      <Item><Input type="hidden" id="mpin" name="mpin" autocomplete="off" value="" /></Item>
      <Item><Input type="hidden" id="paymentFlow" name="paymentFlow" autocomplete="off" value="" /></Item>
      <Item><Input type="hidden" id="payerAccount" name="payerAccount" autocomplete="off" value="${payuData['payerAccount']}" /></Item>
    </Form>
    </body></html>`;
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
    <>
      <View style={styles.paytmUpiWrap}>
        {/* <TextInput
          autoFocus={true}
          placeholder="PaytmUPI"
          placeholderTextColor={'#888'}
          selectionColor={'#888'}
          returnKeyType={'done'}
          value={upiId}
          onChangeText={onChangeUpiText}
          style={styles.inputCss}
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
            label={'Paytm UPI'}
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
        <Image
          source={require('../../assets/images/paytm1.png')}
          style={styles.paytmUpiLogo}
          resizeMode="contain"
        />
      </View>
    </>
  );
});

export default PaytmUPI;
