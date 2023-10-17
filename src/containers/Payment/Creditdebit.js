import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {Text, View, StyleSheet, Picker, TouchableOpacity} from 'react-native';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
import {expMonsCcDc} from '../../constants/index';
import {getPrePaidDiscountApi, payApi} from '../../services/payment';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

const Creditdebit = forwardRef((props, ref) => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});

  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [init, setInit] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ccexpmon, setCcExpMon] = useState('');
  const [ccexpyr, setCcExpYr] = useState('');
  const [cvv, setCvv] = useState('');
  const [cvvError, setCvvError] = useState(false);
  const [mode, setMode] = useState('CC');
  const [checkbox, setCheckbox] = useState(true);
  const expMons = expMonsCcDc;
  let prepaidDiscount = 0;
  let totalPayableAmount = 0;

  useEffect(() => {
    getPrePaidDiscount('CC');
    setInit(true);
  }, []);

  const getPrePaidDiscount = async cardType => {
    let cartObj = {
      ...props.shoppingCartDto,
      payment: {
        paymentId: cardType == 'CC' ? 9 : 2,
        type: cardType == 'CC' ? 'CC' : 'DC',
      },
    };

    const {data} = await getPrePaidDiscountApi(
      cartObj,
      props.sessionId,
      props.token,
    );
    if (data && data.status) {
      let extraOffer =
        props.shoppingCartDto &&
        props.shoppingCartDto.cart &&
        props.shoppingCartDto.cart.extraOffer;
      extraOffer = data.data.extraOffer;
      let cart = data.data.cart;
      let shipping = 0;
      let totalAmount = 0;
      let totalOffer = 0;

      if (data.data && data.data.extraOffer && data.data.extraOffer.prepaid) {
        prepaidDiscount = data.data.extraOffer.prepaid;
      }
      if (cart) {
        shipping = cart.shippingCharges ? cart.shippingCharges : 0;
        totalAmount = cart.totalAmount ? cart.totalAmount : 0;
        totalOffer = cart.totalOffer ? cart.totalOffer : 0;
        totalPayableAmount =
          totalAmount + shipping - totalOffer - prepaidDiscount;
      }
      let updatedCart = {
        ...props.shoppingCartDto,
        cart: {
          ...props.shoppingCartDto.cart,
          extraOffer: extraOffer,
          shippingCharges: shipping,
          totalAmount: totalAmount,
          totalOffer: totalOffer || 0,
          totalPayableAmount: totalPayableAmount,
        },
      };
      props.updateCartObj(updatedCart);
    }
  };

  const cardDetails = [
    {
      title: 'Card Number',
      state: number,
      disabled: false,
      onChange: text => setNumber(text),
      errorState: numberError,
      errorText: 'Kindly enter correct card details',
      keyboardType: 'number-pad',
    },
    {
      title: 'Name on Card',
      state: name,
      disabled: false,
      onChange: text => setName(text),
      errorState: nameError,
      errorText: 'Kindly enter valid name',
    },
  ];

  const renderInputText = ({
    onChange,
    onBlur,
    disabled,
    title,
    state,
    errorState,
    errorText,
    keyboardType,
    maxLength,

    style,
  }) => {
    return (
      <View style={styles.inputFieldWrap} key={title}>
        <FloatingLabelInputField
          label={title}
          onChangeText={text => onChange(text)}
          value={state}
          disabled={disabled}
          onBlur={onBlur}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />
        {errorState ? <Text style={styles.errorText}>{errorText}</Text> : null}
      </View>
    );
  };

  const getMonths = () => {
    let months = [];
    months.push(<Picker.Item label={'MM'} value={''} />);
    {
      expMons &&
        expMons.forEach(mon => {
          months.push(<Picker.Item label={mon.value} value={mon.key} />);
        });
    }
    return months;
  };

  const getYears = () => {
    let todayDate = new Date();
    let currentYear = todayDate.getFullYear();
    const expYrs = [];
    for (let i = 0; i < 20; i++) {
      expYrs.push(currentYear + '');
      currentYear = currentYear + 1;
    }

    let years = [];
    years.push(<Picker.Item label={'YYYY'} value={''} />);
    {
      expYrs &&
        expYrs.forEach(year => {
          years.push(<Picker.Item label={year} value={year} />);
        });
    }
    return years;
  };

  const onMonthChange = value => {
    setCcExpMon(value);
  };

  const onYearChange = value => {
    setCcExpYr(`${value}`);
  };

  useEffect(() => {
    if (init) {
      if (number && number.length >= 15 && number.length <= 16) {
        setNumberError(false);
      } else {
        setNumberError(true);
      }
    }
  }, [number]);

  useEffect(() => {
    if (init) {
      if (name && name.length) {
        setNameError(false);
      } else {
        setNameError(true);
      }
    }
  }, [name]);

  useEffect(() => {
    if (init) {
      if (cvv && cvv.length == 3) {
        setCvvError(false);
      } else {
        setCvvError(true);
      }
    }
  }, [cvv]);

  useImperativeHandle(ref, () => ({
    payRequest() {
      if (
        number &&
        number.length >= 15 &&
        number.length <= 16 &&
        !numberError &&
        name &&
        name.length &&
        !nameError &&
        cvv &&
        cvv.length == 3 &&
        !cvvError &&
        ccexpmon &&
        ccexpmon.length &&
        ccexpyr &&
        ccexpyr.length
      ) {
        let paymentId = 9;
        if (props.invoiceType == 'tax') {
          paymentId = mode == 'CC' ? 131 : 130;
        } else {
          paymentId = mode == 'CC' ? 9 : 2;
        }
        props.setLoader(true);
        let validatorObj = {
          mode: 'CC',
          paymentGateway: props.invoiceType === 'tax' ? 'razorpay' : undefined,
          paymentId: paymentId,
          platformCode: 'online',
          requestParams: {
            bankcode: props.invoiceType == 'tax' ? 'card' : null,
            ccexpmon: ccexpmon,
            ccexpyr: ccexpyr,
            ccname: name,
            ccnum: number.trim(),
            ccvv: cvv,
            email: auth.email,
            firstname: auth.userName,
            phone: auth.phone,
            productinfo: 'MSNghihjbc',
            store_card: checkbox ? 'true' : 'false',
            user_id: auth.userId,
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
                paymentMethodId: paymentId,
                type: mode,
              },
            },
          },
        };
        payApi(validatorObj, props.sessionId, props.token)
          .then(({data}) => {
            if (data.status) {
              props.setLoader(false);
              let webviewData =
                props.invoiceType === 'retail'
                  ? payFromWebview(data.data)
                  : '<html><head></head><body></body></html>';
              props.navigation.navigate('WebView', {
                htmlString: webviewData,
                title: 'Credit/Debit',
                fromPayment: true,
                invoiceType: props.invoiceType,
                data: data.data,
                navigation: props.navigation,
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
        Toast.show({
          type: 'error',
          text2: 'Please enter valid card details',
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
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
        <Item><Input type="hidden" name="bankcode" value="${payuData['bankcode']}" /></Item>`;
    if (payuData['ccnum']) {
      str += `<Item><Input type="hidden" name="ccnum" value="${payuData['ccnum']}" /></Item>`;
    }
    if (payuData['ccname']) {
      str += `<Item><Input type="hidden" name="ccname" value="${payuData['ccname']}" /></Item>`;
    }
    if (payuData['ccvv']) {
      str += `<Item><Input type="hidden" name="ccvv" value="${payuData['ccvv']}" /></Item>`;
    }
    if (payuData['ccexpmon']) {
      str += `<Item><Input type="hidden" name="ccexpmon" value="${payuData['ccexpmon']}" /></Item>`;
    }
    if (payuData['ccexpyr']) {
      str += `<Item><Input type="hidden" name="ccexpyr" value="${payuData['ccexpyr']}" /></Item>`;
    }
    if (payuData['store_card']) {
      str += `<Item><Input type="hidden" name="store_card" value="${payuData['store_card']}" /></Item>`;
    }
    if (payuData['cardToken']) {
      str += `<Item><Input type="hidden" name="store_card_token" value="${payuData['cardToken']}" /></Item>`;
    }
    if (payuData['user_credentials']) {
      str += `<Item><Input type="hidden" name="user_credentials" value="${payuData['user_credentials']}" /></Item>`;
    }
    str += `</Form></body></html>`;
    return str;
  };

  return (
    <View style={styles.cardDetail}>
      {/* <Text style={styles.validTill}>Valid thru</Text> */}
      {cardDetails.map((_, k) => renderInputText(_))}
      <Text style={styles.validTill}>Valid thru</Text>
      <View style={styles.cardExpiryRow}>
        <View style={([styles.inputFieldWrap], {width: '48%'})}>
          <View style={styles.pickerParent}>
            <Picker
              note
              itemStyle={{backgroundColor: '#fff', color: '#000'}}
              mode="dropdown"
              style={styles.pickerCss}
              selectedValue={ccexpmon}
              onValueChange={onMonthChange}>
              {getMonths()}
            </Picker>
          </View>
        </View>
        <View style={([styles.inputFieldWrap], {width: '48%'})}>
          <View style={styles.pickerParent}>
            <Picker
              note
              itemStyle={{backgroundColor: '#fff', color: '#000'}}
              mode="dropdown"
              style={styles.pickerCss}
              selectedValue={ccexpyr}
              onValueChange={onYearChange}>
              {getYears()}
            </Picker>
          </View>
        </View>
      </View>
      <View style={styles.inputFieldWrap}>
        <FloatingLabelInputField
          label={'CVV'}
          keyboardType="numeric"
          value={cvv}
          secureTextEntry={true}
          maxLength={3}
          onChangeText={text => setCvv(text.trim())}
          autoCorrect={false}
        />
        {cvvError ? (
          <Text style={styles.errorText}>CVV must be 3 numbers</Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.saveCard}>
        <MaterialCommunityIcon
          onPress={() => setCheckbox(!checkbox)}
          name={checkbox ? 'checkbox-marked' : 'checkbox-blank-outline'}
          color={colors.blueShade}
          size={20}
        />
        <Text style={styles.saveText}>Save this Card</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  cardDetail: {backgroundColor: '#fff', paddingBottom: Dimension.padding15},
  topArea: {paddingHorizontal: Dimension.padding15},
  inputFieldWrap: {
    paddingHorizontal: Dimension.padding15,
  },
  validTill: {
    fontSize: Dimension.font12,
    color: colors.lightGrayText,
    fontFamily: Dimension.CustomMediumFont,
    paddingTop: Dimension.padding15,
    paddingHorizontal: Dimension.padding15,
  },
  cardExpiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Dimension.padding15,
  },
  saveCard: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding15,
    alignItems: 'center',
  },
  saveText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    marginTop: 2,
    marginLeft: Dimension.margin10,
  },
  pickerParent: {
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  pickerCss: {
    color: colors.lightGrayText,
  },
});

export default Creditdebit;
