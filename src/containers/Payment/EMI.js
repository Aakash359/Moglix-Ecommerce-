import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Picker,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getClusterEmiValues, payApi} from '../../services/payment';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {OrderedMap} from 'immutable';
import colors from '../../redux/constants/colors';
import {emiCards, emiBanks, expMons, expMonsCcDc} from '../../constants/index';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';
import Header from '../../components/Common/Header';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import {applyThousandSeparator} from '../../generic';
import Toast from 'react-native-toast-message';
const deviceWidth = Dimensions.get('window').width;

const EMI = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const [initLoader, setInitLoader] = useState(true);
  const [selectedCardType, setSelectedCardType] = useState('credit_card');
  const [ccdc, setCcDc] = useState({credit_card: [], debit_card: []});
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [emiDetailsModal, setEmiDetailsModal] = useState(false);
  const [emiPlanDetails, setEmiPlanDetails] = useState({});
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [numberError, setNumberError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ccexpmon, setCcExpMon] = useState('');
  const [ccexpyr, setCcExpYr] = useState('');
  const [cvv, setCvv] = useState('');
  const [cvvError, setCvvError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [init, setInit] = useState(false);
  const expMons = expMonsCcDc;

  useEffect(() => {
    setInitLoader(true);
    setInit(true);
    fetchEmiValues();
  }, []);

  const getBankText = value => {
    let emibank = emiBanks.filter((_, i) => value == _.title);
    return (emibank[0] || {}).value;
  };

  const fetchEmiValues = async () => {
    try {
      setInitLoader(true);
      const {data} = await getClusterEmiValues(
        props.price ||
          Number(
            itemsList.reduce(
              (acc, curr) => acc + curr.priceWithoutTax * curr.productQuantity,
              0,
            ),
          ) +
            Number(
              itemsList.reduce(
                (acc, curr) =>
                  acc +
                  curr.totalPayableAmount -
                  curr.priceWithoutTax * curr.productQuantity,
                0,
              ),
            ) +
            Number((cart && cart.cart && cart.cart.shippingCharges) || 0) -
            Number((cart && cart.cart && cart.cart.totalOffer) || 0),
        props.invoiceType
          ? undefined
          : props.route.params.invoiceType === 'tax'
          ? 'razorpay'
          : 'payu',
        props.sessionId || props.route.params.sessionId,
        props.token || props.route.params.token,
      );
      let ccdata = new OrderedMap(data.data.emiResponse.credit_card)
        .map((_, i) => {
          return {key: i, value: _};
        })
        .toList()
        .toArray();
      let dcdata = new OrderedMap(data.data.emiResponse.debit_card)
        .map((_, i) => {
          return {key: i, value: _};
        })
        .toList()
        .toArray();

      setCcDc({credit_card: ccdata, debit_card: dcdata});
      setInitLoader(false);
    } catch (error) {
      setInitLoader(false);
      console.log('error', error);
    }
  };

  const setBank = value => {
    if (selectedBank == value.key) {
      setSelectedBank('');
    } else {
      setSelectedBank(value.key);
    }
  };

  const emiDetails = (emidetails, isNocostEmi) => {
    setEmiPlanDetails({...emidetails, isNocostEmi});
    setEmiDetailsModal(true);
  };

  const renderEmiPlans = isNocostEmi => {
    return (
      <View>
        <View style={styles.costTypeRow}>
          {isNocostEmi ? (
            new OrderedMap(
              (ccdc[selectedCardType].find(_ => _.key == selectedBank) || {})
                .value || {},
            ).filter(
              _ =>
                _.tenure == '03 months' ||
                _.tenure == '3 months' ||
                _.tenure == '06 months' ||
                _.tenure == '6 months' ||
                _.tenure == '3' ||
                _.tenure == '6',
            ).size ? (
              <Text style={styles.emiTypeHeading}>No Cost EMI</Text>
            ) : null
          ) : new OrderedMap(
              (ccdc[selectedCardType].find(_ => _.key == selectedBank) || {})
                .value || {},
            ).filter(
              _ =>
                _.tenure != '03 months' &&
                _.tenure != '3 months' &&
                _.tenure != '06 months' &&
                _.tenure != '6 months' &&
                _.tenure != '3' &&
                _.tenure != '6',
            ).size ? (
            <Text style={styles.emiTypeHeading}>Standard EMI</Text>
          ) : null}

          {isNocostEmi &&
          new OrderedMap(
            (ccdc[selectedCardType].find(_ => _.key == selectedBank) || {})
              .value || {},
          ).filter(
            _ =>
              _.tenure == '03 months' ||
              _.tenure == '3 months' ||
              _.tenure == '06 months' ||
              _.tenure == '6 months' ||
              _.tenure == '3' ||
              _.tenure == '6',
          ).size ? (
            <Text style={styles.emiTypeHeading}>Total Payable</Text>
          ) : null}

          {!isNocostEmi &&
          new OrderedMap(
            (ccdc[selectedCardType].find(_ => _.key == selectedBank) || {})
              .value || {},
          ).filter(
            _ =>
              _.tenure != '03 months' &&
              _.tenure != '3 months' &&
              _.tenure != '06 months' &&
              _.tenure != '6 months' &&
              _.tenure != '3' &&
              _.tenure != '6',
          ).size ? (
            <Text style={styles.emiTypeHeading}>Total Payable</Text>
          ) : null}
        </View>
        <View style={styles.planInner}>
          <View style={styles.whiteBg}>
            {new OrderedMap(
              (ccdc[selectedCardType].find(_ => _.key == selectedBank) || {})
                .value || {},
            )
              .map((_, i) => {
                let tenure = _.tenure;
                let emiBankInterest = isNocostEmi ? '0' : _.emiBankInterest;
                let transactionAmount = isNocostEmi
                  ? _.transactionAmount
                  : _.transactionAmount + _.emi_interest_paid;
                if (
                  isNocostEmi &&
                  (tenure == '03 months' ||
                    tenure == '3 months' ||
                    tenure == '06 months' ||
                    tenure == '6 months' ||
                    tenure == '3' ||
                    tenure == '6')
                ) {
                  return (
                    <TouchableOpacity
                      style={styles.planTypeRow}
                      key={i}
                      onPress={() => {
                        if (!props.invoiceType) {
                          setSelectedPlan(i);
                          emiDetails(_, true);
                        }
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        {props.invoiceType ? null : (
                          <MaterialCommunityIcon
                            name={
                              selectedPlan == i
                                ? 'radiobox-marked'
                                : 'radiobox-blank'
                            }
                            color={
                              selectedPlan === i
                                ? colors.RedThemeColor
                                : colors.PrimaryTextColor
                            }
                            size={24}
                          />
                        )}
                        <View style={styles.priceCol}>
                          {!props.invoiceType &&
                          props.route.params.invoiceType == 'tax' ? (
                            <Text style={styles.origPrice}>
                              ₹
                              {applyThousandSeparator(
                                Math.ceil(
                                  _.transactionAmount / parseInt(_.tenure),
                                ),
                              )}
                            </Text>
                          ) : (
                            <Text style={styles.origPrice}>
                              ₹
                              {applyThousandSeparator(
                                Math.ceil(_.amount).toFixed(2),
                              )}
                            </Text>
                          )}

                          {!props.invoiceType &&
                          props.route.params.invoiceType === 'tax' ? (
                            <Text style={styles.forMonth}>
                              for {tenure} {'months'}{' '}
                              <Text style={styles.greenText}>
                                @ {emiBankInterest} %
                              </Text>
                            </Text>
                          ) : (
                            <Text style={styles.forMonth}>
                              for {tenure}{' '}
                              <Text style={styles.greenText}>
                                @ {emiBankInterest} %
                              </Text>
                            </Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.origPrice}>
                        ₹{applyThousandSeparator(transactionAmount.toFixed(2))}
                      </Text>
                    </TouchableOpacity>
                  );
                } else if (
                  !isNocostEmi &&
                  tenure != '03 months' &&
                  tenure != '3 months' &&
                  tenure != '06 months' &&
                  tenure != '6 months' &&
                  tenure != '3' &&
                  tenure != '6'
                ) {
                  return (
                    <TouchableOpacity
                      style={styles.planTypeRow}
                      key={i}
                      onPress={() => {
                        if (!props.invoiceType) {
                          setSelectedPlan(i);
                          emiDetails(_, false);
                        }
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        {props.invoiceType ? null : (
                          <MaterialCommunityIcon
                            name={
                              selectedPlan == i
                                ? 'radiobox-marked'
                                : 'radiobox-blank'
                            }
                            color={
                              selectedPlan === i
                                ? colors.RedThemeColor
                                : colors.PrimaryTextColor
                            }
                            size={24}
                          />
                        )}
                        <View style={styles.priceCol}>
                          {!props.invoiceType &&
                          props.route.params.invoiceType == 'tax' ? (
                            <Text style={styles.origPrice}>
                              ₹
                              {applyThousandSeparator(
                                Math.ceil(
                                  _.transactionAmount / parseInt(_.tenure),
                                ),
                              )}
                            </Text>
                          ) : (
                            <Text style={styles.origPrice}>
                              ₹
                              {applyThousandSeparator(
                                Math.ceil(_.amount).toFixed(2),
                              )}
                            </Text>
                          )}

                          {!props.invoiceType &&
                          props.route.params.invoiceType === 'tax' ? (
                            <Text style={styles.forMonth}>
                              for {tenure} {'months'}{' '}
                              <Text style={styles.greenText}>
                                @ {emiBankInterest} %
                              </Text>
                            </Text>
                          ) : (
                            <Text style={styles.forMonth}>
                              for {tenure}{' '}
                              <Text style={styles.greenText}>
                                @ {emiBankInterest} %
                              </Text>
                            </Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.origPrice}>
                        ₹{applyThousandSeparator(transactionAmount.toFixed(2))}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })
              .toList()}
          </View>
        </View>
      </View>
    );
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

  const checkCommonValidation = () => {
    if (getBankText(selectedBank) != 'Bajaj Finserv No Cost EMI Card') {
      return (
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
      );
    } else {
      return (
        number &&
        number.length >= 15 &&
        number.length <= 16 &&
        !numberError &&
        name &&
        name.length &&
        !nameError
      );
    }
  };

  const getEmiMonths = emiKey => {
    if (isNaN(parseInt(emiKey.replace(/^\D+/g, ''), 10))) {
      return 3;
    }
    return parseInt(emiKey.replace(/^\D+/g, ''), 10);
  };

  const payEmi = () => {
    try {
      let nocostEmiDiscount = 0;
      let totalPayableAmount = 0;
      let totalAmount = 0;
      let amount = emiPlanDetails.transactionAmount;
      let rate = parseInt(emiPlanDetails.emiBankInterest);
      let month = getEmiMonths(emiPlanDetails.tenure);
      if (month == 3 || month == 6) {
        nocostEmiDiscount =
          (amount * (Math.pow(1 + rate, month) - 1)) /
          (month * Math.pow(1 + rate, month) * rate);
        if (isNaN(nocostEmiDiscount)) {
          nocostEmiDiscount = 0;
        }
        nocostEmiDiscount = nocostEmiDiscount;
        totalPayableAmount =
          props.route.params.shoppingCartDto.cart.totalPayableAmount +
          props.route.params.shoppingCartDto.cart.shippingCharges -
          nocostEmiDiscount;
        totalAmount =
          props.route.params.shoppingCartDto.cart.totalPayableAmount +
          props.route.params.shoppingCartDto.cart.shippingCharges -
          nocostEmiDiscount;
      } else {
        nocostEmiDiscount = 0;
        totalPayableAmount =
          props.route.params.shoppingCartDto.cart.totalPayableAmount +
          props.route.params.shoppingCartDto.cart.shippingCharges;
        totalAmount =
          props.route.params.shoppingCartDto.cart.totalPayableAmount +
          props.route.params.shoppingCartDto.cart.shippingCharges;
      }
      let requestObj = {
        mode: 'EMI',
        paymentId: props.route.params.invoiceType === 'tax' ? 133 : 14,
        platformCode: 'online',
        paymentGateway:
          props.route.params.invoiceType === 'tax' ? 'razorpay' : undefined,

        requestParams: {
          bankcode: selectedPlan,
          ccexpmon: ccexpmon,
          ccexpyr: ccexpyr,
          ccname: name,
          ccnum: number.trim(),
          ccvv: cvv,
          email: auth.email,
          firstname: auth.userName,
          phone: auth.phone,
          productinfo: 'msninrq7qv4',
          store_card: 'false',
          user_id: auth.userId,
          duration:
            props.route.params.invoiceType === 'tax'
              ? emiPlanDetails.tenure
              : undefined,
        },
        validatorRequest: {
          shoppingCartDto: {
            ...props.route.params.shoppingCartDto,
            device: 'app',
            offersList: props.route.params.shoppingCartDto.offersList?.length
              ? props.route.params.shoppingCartDto.offersList
              : null,

            cart: {
              ...props.route.params.shoppingCartDto.cart,
              createdAt: null,
              updatedAt: null,
              totalOffer:
                props.route.params.shoppingCartDto.cart.totalOffer || 0,
              totalAmountWithOffer:
                props.route.params.shoppingCartDto.cart.totalAmountWithOffer ||
                0,
              taxes: props.route.params.shoppingCartDto.cart.taxes || 0,
              isGift: props.route.params.shoppingCartDto.cart.isGift || false,
              giftPackingCharges:
                props.route.params.shoppingCartDto.cart.giftPackingCharges || 0,
              currency: 'INR',
              noCostEmiDiscount: nocostEmiDiscount,
              totalPayableAmount: totalPayableAmount,
              totalAmount: totalAmount,
            },
            payment: {
              bankEmi: selectedPlan,
              bankName: selectedBank,
              emiFlag:
                emiPlanDetails.tenure == '03 months' ||
                emiPlanDetails.tenure == '3 months' ||
                emiPlanDetails.tenure == '06 months' ||
                emiPlanDetails.tenure == '6 months' ||
                emiPlanDetails.tenure == '3' ||
                emiPlanDetails.tenure == '6'
                  ? 1
                  : 0,
              gateway:
                props.route.params.invoiceType == 'tax' ? 'razorpay' : '',
              paymentMethodId:
                props.route.params.invoiceType === 'tax' ? 133 : 14,
              type: 'EMI',
            },
          },
        },
      };
      setLoader(true);
      payApi(requestObj, props.route.params.sessionId, props.route.params.token)
        .then(({data}) => {
          setLoader(false);
          if (data.status) {
            let webviewData =
              props.route.params.invoiceType === 'retail'
                ? payFromWebview(data.data)
                : '<html><head></head><body></body></html>';
            props.navigation.navigate('WebView', {
              htmlString: webviewData,
              title: 'EMI',
              fromPayment: true,
              invoiceType: props.route.params.invoiceType,
              data: data.data,
            });
          } else {
            Toast.show({
              type: 'error',
              text2: data.description,
              visibilityTime: 2000,
              autoHide: true,
            });
          }
        })
        .catch(e => {
          setLoader(false);
          console.log(e);
        });
    } catch (error) {
      setLoader(false);
    }
  };

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

  useEffect(() => {
    console.log(initLoader);
  });

  return (
    <View style={styles.emiView}>
      {!props.invoiceType && (
        <Header navigation={props.navigation} showBack showText={'EMI'} />
      )}

      {initLoader ? (
        <View style={{flex: 1}}>
          <ActivityIndicator
            style={{alignSelf: 'center', paddingVertical: 20}}
            size={'large'}
            color={colors.RedThemeColor}
          />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.cardTypeRow}>
            {emiCards.map((_, i) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCardType(_.value);
                }}
                style={[
                  styles.cardType,
                  {
                    backgroundColor:
                      selectedCardType === _.value
                        ? colors.LightRedThemeColor
                        : '#fff',
                    borderColor:
                      selectedCardType === _.value
                        ? colors.RedThemeColor
                        : '#fff',
                  },
                ]}>
                {/* <MaterialCommunityIcon
              color={
                selectedCardType === _.value
                  ? colors.RedThemeColor
                  : colors.PrimaryTextColor
              }
              size={24}
              name={
                selectedCardType === _.value
                  ? 'radiobox-marked'
                  : 'radiobox-blank'
              }
            /> */}
                <Text
                  style={[
                    styles.cardText,
                    {
                      color:
                        selectedCardType === _.value
                          ? colors.RedThemeColor
                          : colors.PrimaryTextColor,
                    },
                  ]}>
                  {_.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            {(ccdc[selectedCardType] || [])
              .sort((a, b) =>
                getBankText(a.key) > getBankText(b.key) ? 1 : -1,
              )
              .map((item, i) => (
                <View key={i}>
                  <TouchableOpacity
                    onPress={() => {
                      setBank(item);
                      setSelectedPlan('');
                    }}
                    style={styles.bankNameRow}>
                    <Text style={styles.bankNameText}>
                      {getBankText(item.key)}
                    </Text>
                    <MaterialCommunityIcon
                      name={
                        selectedBank == item.key ? 'chevron-up' : 'chevron-down'
                      }
                      color={'#000'}
                      size={26}
                    />
                  </TouchableOpacity>
                  {selectedBank == item.key ? (
                    <>
                      {renderEmiPlans(true)}
                      {renderEmiPlans(false)}
                      <Text style={styles.note}>
                        <Text style={styles.impBoldtext}>Note:</Text>{' '}
                        <Text style={styles.impLightext}>
                          The bank will continue to charge interest on NO cost
                          EMI plans as per existing rates. However, the interest
                          to be charged by the bank will be passed on to you as
                          an upfront discount
                        </Text>
                      </Text>
                    </>
                  ) : null}
                </View>
              ))}
          </View>
          {emiDetailsModal && (
            <Modal
              overlayPointerEvents={'auto'}
              isVisible={emiDetailsModal}
              onTouchOutside={() => setEmiDetailsModal(false)}
              onDismiss={() => setEmiDetailsModal(false)}
              onBackButtonPress={() => setEmiDetailsModal(false)}
              coverScreen={true}
              style={styles.modalWrap}
              deviceWidth={deviceWidth}
              hasBackdrop={true}>
              <View style={styles.modalInnerView}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcon
                    onPress={() => setEmiDetailsModal(false)}
                    name={'arrow-left'}
                    color={'#000'}
                    size={28}
                  />
                  <Text style={styles.bankNameinModal}>
                    {getBankText(selectedBank)}
                  </Text>
                </View>
                <ScrollView style={styles.modalDetailArea}>
                  <View style={styles.topArea}>
                    <Text style={styles.selectedPlanText}>Selected Plan</Text>
                    <View style={styles.selectedPlanRow}>
                      <View style={styles.priceCol}>
                        {!props.invoiceType &&
                        props.route.params.invoiceType == 'tax' ? (
                          <Text style={styles.origPrice}>
                            ₹
                            {applyThousandSeparator(
                              Math.ceil(
                                emiPlanDetails.transactionAmount /
                                  parseInt(emiPlanDetails.tenure),
                              ),
                            )}
                          </Text>
                        ) : (
                          <Text style={styles.origPrice}>
                            ₹
                            {applyThousandSeparator(
                              Math.ceil(emiPlanDetails.amount).toFixed(2),
                            )}
                          </Text>
                        )}
                        <Text style={styles.forMonth}>
                          for {emiPlanDetails.tenure} @{' '}
                          {emiPlanDetails.isNocostEmi
                            ? '0'
                            : emiPlanDetails.emiBankInterest}
                          % p.a.
                        </Text>
                      </View>
                      <Text style={styles.origPrice}>
                        ₹
                        {applyThousandSeparator(
                          emiPlanDetails.isNocostEmi
                            ? emiPlanDetails.transactionAmount.toFixed(2)
                            : emiPlanDetails.transactionAmount +
                                emiPlanDetails.emi_interest_paid,
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardDetail}>
                    <Text style={styles.cardHeading}>
                      Make Payment by entering your Card Details
                    </Text>
                    {cardDetails.map((_, k) => renderInputText(_))}
                    {getBankText(selectedBank) !=
                    'Bajaj Finserv No Cost EMI Card' ? (
                      <>
                        <Text style={styles.validTill}>Valid thru</Text>
                        <View style={styles.cardExpiryRow}>
                          <View
                            style={([styles.inputFieldWrap], {width: '48%'})}>
                            <View style={styles.pickerParent}>
                              <Picker
                                note
                                mode="dropdown"
                                style={styles.pickerCss}
                                selectedValue={ccexpmon}
                                onValueChange={onMonthChange}>
                                {getMonths()}
                              </Picker>
                            </View>
                          </View>
                          <View
                            style={([styles.inputFieldWrap], {width: '48%'})}>
                            <View style={styles.pickerParent}>
                              <Picker
                                note
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
                            <Text style={styles.errorText}>
                              CVV must be 3 numbers
                            </Text>
                          ) : null}
                        </View>
                      </>
                    ) : null}
                    {/* {errorState ? (
                  <Text style={styles.errorText}>{errorText}</Text>
                ) : null} */}
                  </View>
                  <Text style={{padding: Dimension.padding15}}>
                    <Text style={styles.impBoldtext}>Note:</Text>{' '}
                    <Text style={styles.impLightext}>
                      The bank will continue to charge interest on NO Cost EMI
                      plans as per existing rates. However, the interest to be
                      charged by the bank will be passed on to you as an upfront
                      discount
                    </Text>
                  </Text>
                </ScrollView>
                {!props.invoiceType ? (
                  <View style={styles.footerActions}>
                    <TouchableOpacity
                      onPress={payEmi}
                      disabled={!checkCommonValidation()}
                      style={{
                        backgroundColor: !checkCommonValidation()
                          ? 'gray'
                          : colors.RedThemeColor,
                        height: Dimension.height40,
                        width: '100%',
                        flexDirection: 'row',
                        borderRadius: Dimension.borderRadius6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {loader && (
                        <ActivityIndicator color={'#fff'} size={'small'} />
                      )}
                      <Text style={styles.btnText}>
                        PAY ₹
                        {applyThousandSeparator(
                          emiPlanDetails.transactionAmount,
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </Modal>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default EMI;

const styles = StyleSheet.create({
  rightArrow: {backgroundColor: '#fff', justifyContent: 'center'},
  cardType: {
    height: Dimension.height30,
    paddingHorizontal: Dimension.padding15,
    marginRight: Dimension.margin15,
    borderRadius: Dimension.borderRadius8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTypeRow: {flexDirection: 'row', padding: Dimension.padding15},
  cardText: {fontSize: Dimension.font12, fontFamily: Dimension.CustomBoldFont},
  bankNameRow: {
    paddingVertical: Dimension.padding15,
    paddingHorizontal: Dimension.padding20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bankNameText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    lineHeight: Dimension.font20,
    color: colors.PrimaryTextColor,
  },
  emiTypeHeading: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
    alignSelf: 'center',
    paddingHorizontal: Dimension.padding30,
    paddingTop: Dimension.padding15,
    paddingBottom: Dimension.padding5,
  },
  costTypeRow: {flexDirection: 'row', justifyContent: 'space-between'},
  planTypeRow: {
    padding: Dimension.padding15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  whiteBg: {backgroundColor: '#fff', borderRadius: Dimension.borderRadius8},
  planInner: {paddingHorizontal: Dimension.margin20},
  priceCol: {marginLeft: 10},
  origPrice: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRobotoRegular,
  },
  greenText: {color: colors.green2},
  blackText: {color: '#000'},
  impLightext: {
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.PrimaryTextColor,
  },
  impBoldtext: {
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomMediumFont,
    color: colors.PrimaryTextColor,
  },
  forMonth: {
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
  },
  note: {
    paddingHorizontal: Dimension.padding20,
    paddingTop: Dimension.margin15,
    paddingBottom: Dimension.padding15,
  },
  emiView: {paddingBottom: Dimension.padding15, flex: 1},
  // Modal Style
  modalWrap: {flex: 1, backgroundColor: '#fff', margin: 0},
  modalInnerView: {
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: colors.brandbg,
  },
  modalHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding12,
  },
  bankNameinModal: {
    fontSize: Dimension.font14,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: 15,
    marginTop: Dimension.margin4,
  },
  modalDetailArea: {
    paddingTop: Dimension.padding15,
    marginBottom: Dimension.padding50,
  },
  selectedPlanRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: Dimension.borderRadius8,
    paddingLeft: Dimension.padding10,
    paddingRight: Dimension.padding15,
    paddingVertical: Dimension.padding10,
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  selectedPlanText: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    marginBottom: Dimension.margin8,
  },
  cardHeading: {
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font12,
    padding: Dimension.padding15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
  },
  cardDetail: {
    backgroundColor: '#fff',
    marginTop: Dimension.padding15,
    paddingBottom: Dimension.padding15,
  },
  topArea: {paddingHorizontal: Dimension.padding15},
  inputFieldWrap: {paddingHorizontal: Dimension.padding15},
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
  footerActions: {
    padding: Dimension.padding5,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  redBtn: {
    backgroundColor: colors.RedThemeColor,
    height: Dimension.height40,
    width: '100%',
    borderRadius: Dimension.borderRadius6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontFamily: Dimension.CustomRobotoBold,
    marginLeft: Dimension.margin10,
    fontSize: Dimension.font14,
  },
  pickerCss: {
    flex: 1,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.lightGrayText,
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
});
