import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {OrderedMap} from 'immutable';
import colors from '../../redux/constants/colors';
import {payApi} from '../../services/payment';
import styles from './style';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const WALLETS_MAP = {
  AIRTEL: 'Airtel',
  FREECHARGE: 'Freecharge',
  HDFCPAYZAPP: 'PayZapp',
  OLAMONEY: 'Ola Money',
  OXIGEN: 'Oxigen',
  YESPAY: 'Yes Pay',
};

const Wallet = forwardRef((props, ref) => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [selectedWallet, setSelectedWallet] = useState({});
  useEffect(() => {
    let selectedWallet = new OrderedMap(props.paymentDetails)
      .sortBy(i => i.code)
      .filter((wallet, walletId) => wallet.is_top);
    setSelectedWallet(selectedWallet.toList().getIn(['0']) || {});
  }, []);

  useImperativeHandle(ref, () => ({
    payRequest() {
      props.setLoader(true);
      let validatorObj = {
        mode: selectedWallet.mode,
        paymentGateway: props.invoiceType === 'tax' ? 'razorpay' : undefined,
        paymentId: selectedWallet.id,
        platformCode: 'online',
        requestParams: {
          bankcode:
            selectedWallet.mode == 'AIRTEL' ||
            selectedWallet.code == 'AIRTELMONEY'
              ? 'AMON'
              : selectedWallet.mode == 'PAYTM'
              ? undefined
              : selectedWallet.mode == 'HDFCPAYZAPP'
              ? 'PAYZ'
              : selectedWallet.code == 'MPESA' ||
                selectedWallet.code == 'JIOMONEY' ||
                selectedWallet.code == 'PAYZAPP'
              ? 'FREC'
              : undefined,
          email: auth.email,
          firstname: auth.userName,
          phone: auth.phone,
          productinfo: 'MSNghihjbc',
          paymentChannel: selectedWallet.mode == 'PAYTM' ? 'WEB' : undefined,

          // email: 'sahilsaxena@gmail.com',
          // paymentChannel: 'WEB',
          // phone: '6798556774',
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
              paymentMethodId: selectedWallet.id,
              type:
                props.invoiceType == 'tax'
                  ? selectedWallet.code.toLowerCase()
                  : selectedWallet.mode,
            },
          },
        },
      };
      payApi(validatorObj, props.sessionId, props.token)
        .then(({data}) => {
          console.log(data);
          if (data.status) {
            props.setLoader(false);
            const walletRequest =
              selectedWallet.code == 'PAYTM'
                ? data.data.payTMWalletRequest
                : selectedWallet.code == 'MOBIKWIK'
                ? data.data.mobikwikWalletRequest
                : data.data.payUWalletRequest;
            let webviewData =
              props.invoiceType == 'retail'
                ? payFromWebview(walletRequest)
                : '<html><head></head><body></body></html>';
            props.navigation.navigate('WebView', {
              htmlString: webviewData,
              title: 'Wallet',
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
    if (selectedWallet?.code == 'PAYTM') {
      return `<html>
      <body onload='document.forms[0].submit();'>
        <Form action="${payuData['formUrl']}" method="post">
        <Item><Input type="hidden" name="MID" value="${payuData['mid']}"></Item>
        <Item><Input type="hidden" name="ORDER_ID" value="${payuData['order_ID']}" /></Item>
        <Item><Input type="hidden" name="WEBSITE" value="${payuData['website']}"></Item>
        <Item><Input type="hidden" name="INDUSTRY_TYPE_ID" value="${payuData['industry_TYPE_ID']}"></Item>
        <Item><Input type="hidden" name="CHANNEL_ID" value="${payuData['channel_ID']}"></Item>
        <Item><Input type="hidden" name="TXN_AMOUNT" value="${payuData['txn_AMOUNT']}"></Item>
        <Item><Input type="hidden" name="EMAIL" value="${payuData['email']}"></Item>
        <Item><Input type="hidden" name="CUST_ID" value="${payuData['cust_ID']}"></Item>
        <Item><Input type="hidden" name="MOBILE_NO" value="${payuData['mobile_NO']}"></Item>
        <Item><Input type="hidden" name="txnDate" value="${payuData['todayDate']}"></Item>
        <Item><Input type="hidden" name="CHECKSUMHASH" value="${payuData['checksumhash']}"></Item>
        <Item><Input type="hidden" name="CALLBACK_URL" value="${payuData['callback_URL']}"></Item>
        </Form>
      </body>
    </html>`;
    } else if (selectedWallet?.code == 'MOBIKWIK') {
      return `<html>
      <body onload='document.forms[0].submit();'>
        <Form action="${payuData['formUrl']}" method="post">
          <Item><Input type="hidden" name="mid" value="${payuData['mid']}" /></Item>
          <Item><Input type="hidden" name="orderid" value="${payuData['orderid']}" /></Item>
          <Item><Input type="hidden" name="redirecturl" value="${payuData['redirecturl']}" /></Item>
          <Item><Input type="hidden" name="merchantname" value="${payuData['merchantname']}" /></Item>
          <Item><Input type="hidden" name="email" value="${payuData['email']}" /></Item>
          <Item><Input type="hidden" name="amount" value="${payuData['amount']}" /></Item>
          <Item><Input type="hidden" name="cell" value="${payuData['cell']}" /></Item>
          <Item><Input type="hidden" name="checksum" value="${payuData['checksum']}" /></Item>
          <Item><Input type="hidden" name="version" value="${payuData['version']}" /></Item>
        </Form>
      </body>
    </html>`;
    } else {
      return `<html>
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
      <Item><Input type="hidden" name="bankcode" value="${payuData['bankcode']}" />
      </Item></Form></body</html>`;
    }
  };

  return (
    <>
      {new OrderedMap(props.paymentDetails).filter(
        (wallet, walletId) => !wallet.up_status,
      ).size ? (
        <Text style={styles.walletText}>
          Low success rate currently observed in some cases. If possible, use an
          alternate payment mode
        </Text>
      ) : null}
      <View style={styles.walletWrap}>
        {new OrderedMap(props.paymentDetails)
          .sortBy(i => i.code)
          .filter((wallet, walletId) => wallet.is_top)
          .map((wallet, walletId) => (
            <TouchableOpacity
              key={walletId}
              style={styles.walletList}
              onPress={() => setSelectedWallet(wallet)}>
              <MaterialCommunityIcon
                color={
                  selectedWallet?.code === walletId
                    ? colors.RedThemeColor
                    : colors.PrimaryTextColor
                }
                size={24}
                name={
                  selectedWallet?.code === walletId
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
                }
              />
              <View>
                <Text style={styles.walletListTxt}>
                  {WALLETS_MAP[wallet.code] || wallet.code}
                  {/* {wallet.name} */}
                </Text>
                {!wallet.up_status ? (
                  <Text style={styles.walletRedTxt}>
                    Low success rate observed
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
          .toList()}
        <View style={styles.secureWrap}>
          <Image
            source={require('../../assets/images/secure-payment.png')}
            style={styles.securePayImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.secureText}>
              Safe and Secure Payments. Easy returns.{' '}
            </Text>
            <Text style={styles.secureText}>100% Authentic products.</Text>
          </View>
        </View>
        <Text style={styles.secureText}>
          You will be redirect to a secure Payment Gateway Wallet
        </Text>
        <Text style={styles.secureText}>
          Please note.You might be redirected to 3-D secure page to complete
          your transaction.By placing this order, you agree to the Terms of Use
          and Privacy Policy of moglix.com
        </Text>
      </View>
    </>
  );
});

export default Wallet;
