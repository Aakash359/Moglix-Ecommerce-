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
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {OrderedMap} from 'immutable';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
import Modal from 'react-native-modal';
import {payApi} from '../../services/payment';
const deviceWidth = Dimensions.get('window').width;
import styles from './style';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const NetBanking = forwardRef((props, ref) => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [selectedBank, setSelectedBank] = useState({});
  const [netbankingModal, setNetBankingModal] = useState(false);
  const [paymentId, setPaymentId] = useState(5);

  useEffect(() => {
    let selectedBank = new OrderedMap(props.paymentDetails)
      .sortBy(i => i.name)
      .filter((bank, bankId) => bank.is_top);
    setSelectedBank(selectedBank.toList().getIn(['0']) || {});
  }, []);

  useImperativeHandle(ref, () => ({
    payRequest() {
      props.setLoader(true);
      let validatorObj = {
        mode: selectedBank.mode,
        paymentGateway: props.invoiceType === 'tax' ? 'razorpay' : undefined,
        paymentId: selectedBank.id,
        platformCode: 'online',
        requestParams: {
          bankcode: selectedBank.code,
          email: auth.email,
          firstname: auth.userName,
          phone: auth.phone,
          productinfo: 'MSNghihjbc',
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
              paymentMethodId: selectedBank.id,
              type: selectedBank.mode,
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
              title: 'Net banking',
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
    <>
      {new OrderedMap(props.paymentDetails).filter(
        (bank, bankId) => !bank.up_status,
      ).size ? (
        <Text style={styles.redtextwithbg}>
          Low success rate currently observed in some cases. If possible, use an
          alternate payment mode
        </Text>
      ) : null}
      <View style={styles.NetBankingWrap}>
        {new OrderedMap(props.paymentDetails)
          .sortBy(i => i.name)
          .filter((bank, bankId) => bank.is_top)
          .map((bank, bankId) => (
            <TouchableOpacity
              key={bankId}
              style={styles.netBankingData}
              onPress={() => setSelectedBank(bank)}>
              <MaterialCommunityIcon
                color={
                  selectedBank?.code === bankId
                    ? colors.RedThemeColor
                    : colors.PrimaryTextColor
                }
                size={24}
                name={
                  selectedBank?.code === bankId
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
                }
              />
              <View style={styles.radioWrap}>
                <Text style={styles.radioBtnTxt}>{bank.name}</Text>
                {!bank.up_status ? (
                  <Text style={styles.nbRedTxt}>Low success rate observed</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
          .toList()}
        <TouchableOpacity
          style={styles.nbInnerCta}
          onPress={() => {
            setNetBankingModal(true);
          }}>
          <Text style={styles.nbCtaTxt}>All Other Banks</Text>
          <FAIcon
            onPress={() => props.navigation.goBack()}
            name={'angle-right'}
            color={colors.PrimaryTextColor}
            size={28}
          />
        </TouchableOpacity>
        <Text style={styles.selectedbankTitle}>
          Selected : {selectedBank.name}
        </Text>
        {netbankingModal && (
          <Modal
            overlayPointerEvents={'auto'}
            isVisible={netbankingModal}
            coverScreen={true}
            style={styles.modalWrap}
            deviceWidth={deviceWidth}
            hasBackdrop={true}
            onBackButtonPress={() => {
              setNetBankingModal(false);
            }}
            onDismiss={() => {
              setNetBankingModal(false);
            }}>
            <View style={styles.modalInnerWrapNB}>
              <View style={styles.modalInnerHeader}>
                <MaterialCommunityIcon
                  onPress={() => {
                    setNetBankingModal(false);
                  }}
                  name={'arrow-left'}
                  color={'#000'}
                  size={28}
                />
                <Text style={styles.bankNameinModal}>All Other Banks</Text>
              </View>
              <ScrollView style={styles.nbScrollBG}>
                {/* {new OrderedMap(props.paymentDetails).filter(
                  (bank, bankId) => !bank.up_status,
                ).size ? (
                  <Text style={styles.redtextwithbg}>
                    Low success rate currently observed in some cases. If
                    possible, use an alternate payment mode
                  </Text>
                ) : null} */}
                {new OrderedMap(props.paymentDetails)
                  .sortBy(i => i.name)
                  .filter((bank, bankId) => !bank.is_top)
                  .map((bank, bankId) => (
                    <TouchableOpacity
                      key={bankId}
                      style={styles.modalListWrap}
                      onPress={() => {
                        setNetBankingModal(false);
                        setSelectedBank(bank);
                      }}>
                      <View style={styles.modalListInnerWrap}>
                        <MaterialCommunityIcon
                          color={
                            selectedBank?.code === bankId
                              ? colors.RedThemeColor
                              : colors.PrimaryTextColor
                          }
                          size={24}
                          style={{alignSelf: 'center'}}
                          name={
                            selectedBank?.code === bankId
                              ? 'radiobox-marked'
                              : 'radiobox-blank'
                          }
                        />
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.bankName}>{bank.name}</Text>
                          {!bank.up_status ? (
                            <Text style={styles.bankNameError}>
                              Low success rate observed
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                  .toList()}
              </ScrollView>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
});

export default NetBanking;
