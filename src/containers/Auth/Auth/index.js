import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import styles from './style';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Dimension from '../../../redux/constants/dimensions';
import {verifyUser, loginSendOtp, socialLogin} from '../../../services/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {googleSignIn, facebookSignIn} from '../../../generic/SocialLogin/index';
import SmsRetriever from 'react-native-sms-retriever';
import {useFocusEffect} from '@react-navigation/native';
import {
  sendClickStreamData,
  trackStateAdobe,
} from '../../../services/analytics';

const phoneRegex = '^[1-9][0-9]{9}$';

const AuthScreen = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [phone, setPhone] = useState('');
  const [loader, setLoader] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const dispatch = useDispatch();
  const fromScreen = props.navigation.getState();
  const previousRoute =
    fromScreen && fromScreen.routes && fromScreen.routes.length - 2 >= 0
      ? fromScreen.routes[fromScreen.routes.length - 2] &&
        fromScreen.routes[fromScreen.routes.length - 2].name
      : fromScreen.routes[fromScreen.routes.length - 1] &&
        fromScreen.routes[fromScreen.routes.length - 1].name;

  useFocusEffect(
    useCallback(() => {
      if (
        auth.authenticated == 'true' &&
        props.route &&
        props.route.params &&
        props.route.params.proceedTocheckout
      ) {
        props.navigation.replace('Checkout', {fromCart: true});
        return;
      }
      if (auth.authenticated == 'true') {
        props.navigation.goBack();
      }
    }, [props.navigation, auth.authenticated]),
  );

  //DidMount handling
  useEffect(() => {
    // initialize the Google SDK
    GoogleSignin.configure({
      scopes: ['email', 'profile'],
      webClientId:
        '847070515399-dd37moe0p42hrp0h4dke3scht7e30ijs.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      accountName: '',
      forceConsentPrompt: true,
    });
    clickStreamPageLoad();
    trackStateAdobe('moglix:Auth page', {
      'myapp.pageName': `moglix:Auth page`,
      'myapp.channel': 'login/signup',
      'myapp.subSection': `moglix:Auth page ${previousRoute} `,
    });
    // getPhoneNumber();
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'signin_page',
      channel: 'Login/Signup',
    };
    sendClickStreamData(dataTracking);
  };

  const getPhoneNumber = async () => {
    try {
      const email = await SmsRetriever.requestPhoneNumber();
      if (email) {
        setPhone(email.replace('+91', ''));
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const onSubmit = async () => {
    setLoader(true);
    try {
      if (
        phone &&
        phone.length == 10 &&
        phone.match(phoneRegex) &&
        !phoneError
      ) {
        let apiData = {
          type: 'p',
          phone,
          email: '',
        };
        const {data} = await verifyUser(apiData);

        if (data.statusCode == 200) {
          apiData.source = data.exists ? 'login_otp' : 'signup';
          const otpResponse = await loginSendOtp(apiData);
          if (
            otpResponse.data &&
            otpResponse.data.status == 'OTP Sent' &&
            otpResponse.data.statusCode == 200
          ) {
            props.navigation.navigate('LoginWithOTP', {
              phone,
              from_screen: data.exists ? 'login' : 'signup',
            });
          } else {
            Toast.show({
              type: 'success',
              text2: 'Something went wrong!',
              visibilityTime: 2000,
              autoHide: true,
            });
          }
        } else {
          Toast.show({
            type: 'success',
            text2: 'Something went wrong!',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      }
    } catch (e) {
      Toast.show({
        type: 'success',
        text2: 'Something went wrong!',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    setLoader(false);
  };

  useEffect(() => {
    if (phone) {
      if (phone && phone.length == 10 && phone.match(phoneRegex)) {
        setPhoneError(false);
        onSubmit();
      } else {
        setPhoneError(true);
      }
    }
  }, [phone]);

  return (
    <ImageBackground
      style={styles.mainAuthScreenView}
      source={require('../../../assets/images/signinFLowBg.png')}
      resizeMode="cover">
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.skipBtn}>
        <Text style={styles.skipText}>SKIP NOW</Text>
      </TouchableOpacity>
      <View style={styles.signInRedScreen}>
        {/* <Header
        navigation={props.navigation}
        showBack
        showText={'Login/Signup'}
      /> */}
        <View style={styles.loginscreen}>
          <View style={styles.newinputfield}>
            <FloatingLabelInputField
              label={'Mobile Number'}
              value={phone}
              maxLength={10}
              keyboardType={'number-pad'}
              onChangeText={text => setPhone(text)}
              handleFocus={getPhoneNumber}
            />
            {phoneError && (
              <Text style={styles.errorText}>
                Phone number must be 10 digits
              </Text>
            )}
          </View>
          <TouchableOpacity
            disabled={loader || phoneError || !phone}
            onPress={() => onSubmit()}
            style={
              loader || phoneError || !phone ? styles.disableBtn : styles.redBtn
            }>
            {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
            <Text style={styles.BtnText}>SEND OTP</Text>
          </TouchableOpacity>
          <View style={styles.orView}>
            <Text style={styles.orText}>or</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.replace('AuthEmail', {
                proceedTocheckout:
                  props.route &&
                  props.route.params &&
                  props.route.params.proceedTocheckout,
              })
            }
            style={styles.contBtn}>
            <Text style={styles.BtnText}>CONTINUE WITH EMAIL</Text>
          </TouchableOpacity>
          <View style={styles.socialBtnRow}>
            {/* <TouchableOpacity
              style={[styles.socialBtn, styles.fbBtn]}
              onPress={() => facebookSignIn(cart, dispatch, props.navigation)}>
              <FAIcon name={'facebook-official'} size={25} color={'#3E5D94'} />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.socialBtn, styles.gBtn]}
              onPress={() => googleSignIn(cart, dispatch, props.navigation)}>
              <Image
                source={require('../../../assets/images/google-Icon.png')}
                style={styles.scImageIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.termsRow}>
          <Text style={styles.termsText}>By continuing, you agree</Text>

          <View style={styles.TextAction}>
            <Text style={styles.termsText}> to our </Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('WebView', {
                  title: 'Terms of Service',
                  url: 'https://www.moglix.com/terms?device=app',
                  fromPayment: false,
                })
              }
              style={styles.textLink}>
              <Text style={styles.termsTextwithLink}>Terms of Service</Text>
            </TouchableOpacity>
            <Text
              style={[styles.termsText, {marginHorizontal: Dimension.margin6}]}>
              &
            </Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('WebView', {
                  title: 'Privacy Policy',
                  url: 'https://www.moglix.com/privacy?device=app',
                  fromPayment: false,
                })
              }
              style={styles.textLink}>
              <Text style={styles.termsTextwithLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default AuthScreen;
