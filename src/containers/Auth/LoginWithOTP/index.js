import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  InteractionManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-gesture-handler';
import Header from '../../../components/Common/Header';
import styles from './style';
import {
  validateOtp,
  login,
  loginSendOtp,
  signup,
  appDeviceAnalytics,
} from '../../../services/auth';
import {getCartByUserId} from '../../../services/cart';
import {setAuth} from '../../../redux/actions/auth';
import {fetchWishlist} from '../../../redux/actions/wishlist';
import {updateCart} from '../../../redux/actions/cart';
import colors from '../../../redux/constants/colors';
import Toast from 'react-native-toast-message';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  webEngageUserTracking,
  setCustomParameters,
  trackStateAdobe,
  sendClickStreamData,
} from '../../../services/analytics';
import {ACPCore, ACPIdentity, ACPLifecycle} from '@adobe/react-native-acpcore';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';

const LoginWithOTPScreen = props => {
  let interval = {};
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const {phone, from_screen, email, password, name} = props.route.params;
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpCorrect, setOtpCorrect] = useState(false);
  const inputRef = useRef();
  const fromScreen = props.navigation.getState();
  const previousRoute =
    fromScreen && fromScreen.routes && fromScreen.routes.length - 3 >= 0
      ? fromScreen.routes[fromScreen.routes.length - 3]?.name
      : fromScreen.routes[fromScreen.routes.length - 2]?.name;

  const onAutoFocus = () => {
    if (inputRef && inputRef.current && !otpCorrect) {
      inputRef.current.blur();
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onAutoFocus();
    });

    initializeCounter();
    if (from_screen == 'login') {
      adobeLoginTrackEvent();
    } else {
      adobeSignupTrackEvent();
    }

    clickStreamPageLoad();
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'signin_otp',
      channel: 'Login/Signup',
    };
    sendClickStreamData(dataTracking);
  };

  const adobeLoginTrackEvent = () => {
    trackStateAdobe('moglix:login page', {
      'myapp.pageName': `moglix:login otp page`,
      'myapp.channel': 'login/signup',
      'myapp.subSection': `moglix:login otp page ${previousRoute} `,
    });
  };

  const adobeSignupTrackEvent = () => {
    trackStateAdobe('moglix:signup page', {
      'myapp.pageName': `moglix:login otp page`,
      'myapp.channel': 'login/signup',
      'myapp.subSection': `moglix:login otp page ${previousRoute} `,
    });
  };

  const initializeCounter = () => {
    setTimer(30);
    interval = setInterval(() => {
      setTimer(timer => {
        if (timer > 0) {
          return timer - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    if (otp && otp.length == 6) {
      onSubmitOtp();
    }
  }, [otp]);

  const getCloudId = obj => {
    ACPIdentity.getExperienceCloudId().then(cloudId => {
      obj.cloudId = cloudId;
      setCustomParameters(obj);
    });
  };

  const onSubmitOtp = async () => {
    if (otp && otp.length == 6) {
      setOtpError(false);
      let apiData = {
        type:
          from_screen == 'signupemail'
            ? 'p'
            : email
            ? 'e'
            : from_screen == 'login' || from_screen == 'signup'
            ? 'p'
            : 'e',
        phone:
          from_screen == 'signupemail'
            ? phone
            : email
            ? ''
            : from_screen == 'login' || from_screen == 'signup'
            ? phone
            : '',
        source: from_screen == 'login' ? 'login_otp' : 'signup',
        email: from_screen == 'signupemail' ? '' : email || '',
        otp,
      };
      const {data} = await validateOtp(apiData);
      if (
        data.statusCode == 200 &&
        data.status == 'OTP Validate successfully' &&
        from_screen == 'login'
      ) {
        const loginresponse = await login(apiData);
        if (
          loginresponse &&
          loginresponse.data &&
          loginresponse.data.authenticated == 'true'
        ) {
          setOtpCorrect(true);
          Toast.show({
            type: 'success',
            text2: `OTP Correct!`,
            visibilityTime: 2000,
            autoHide: true,
          });

          let currentCart = {...cart};
          currentCart = {
            ...currentCart,
            cart: {
              ...currentCart.cart,
              userId: loginresponse.data.userId,
              sessionId: loginresponse.data.sessionId,
            },
          };
          const cartByUser = await getCartByUserId(
            currentCart,
            loginresponse.data.sessionId,
            loginresponse.data.token,
          );
          dispatch(setAuth(loginresponse.data));
          dispatch(updateCart(cartByUser.data));
          // dispatch(
          //   fetchWishlist(
          //     loginresponse.data.userId,
          //     'business',
          //     loginresponse.data.sessionId,
          //     loginresponse.data.token,
          //   ),
          // );
          await AsyncStorage.setItem(
            '@user',
            JSON.stringify(loginresponse.data),
          );

          webEngageUserTracking('login', loginresponse.data.userId + '');
          webEngageUserTracking('setEmail', loginresponse.data.email);
          webEngageUserTracking('setFirstName', loginresponse.data.userName);
          webEngageUserTracking('setPhone', loginresponse.data.phone);
          // setCustomParameters(loginresponse.data);
          getCloudId(loginresponse.data);
          analyticsApp(loginresponse.data);
          Toast.show({
            type: 'success',
            text2: `Welcome to Moglix, ${loginresponse.data.userName}`,
            visibilityTime: 2000,
            autoHide: true,
          });
          props.navigation.goBack();
        } else {
          Toast.show({
            type: 'success',
            text2: `Something went wrong!`,
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } else if (
        data.statusCode == 200 &&
        data.status == 'OTP Validate successfully' &&
        from_screen == 'signup'
      ) {
        props.navigation.replace('SignupWithPhone', {phone, otp});
      } else if (
        data.statusCode == 200 &&
        data.status == 'OTP Validate successfully' &&
        from_screen == 'signupemail'
      ) {
        let signupData = {
          buildVersion: VersionCheck.getCurrentVersion(),
          device: 'app',
          email: email,
          emailVerified: false,
          firstName: name,
          lastName: '',
          otp: otp,
          password: password || '',
          phone: phone,
          phoneVerified: true,
          source: 'signup',
          userType: 'online',
        };
        const signupResponse = await signup(
          signupData,
          auth.token,
          auth.sessionId,
        );
        if (
          signupResponse &&
          signupResponse.data &&
          signupResponse.data.authenticated == 'true'
        ) {
          let currentCart = {...cart};
          currentCart = {
            ...currentCart,
            cart: {
              ...currentCart.cart,
              userId: signupResponse.data.userId,
              sessionId: signupResponse.data.sessionId,
            },
          };
          const cartByUser = await getCartByUserId(
            currentCart,
            signupResponse.data.sessionId,
            signupResponse.data.token,
          );
          dispatch(updateCart(cartByUser.data));
          dispatch(setAuth(signupResponse.data));

          await AsyncStorage.setItem(
            '@user',
            JSON.stringify(signupResponse.data),
          );
          Toast.show({
            type: 'success',
            text2: `Welcome to Moglix, ${signupResponse.data.userName}`,
            visibilityTime: 2000,
            autoHide: true,
          });
          props.navigation.navigate('Profile');
        } else {
          Toast.show({
            type: 'success',
            text2: `Something went wrong!`,
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } else {
        setOtpError(true);
      }
    }
  };

  const analyticsApp = async loginData => {
    let resObj = {};
    resObj = await AsyncStorage.getItem('@AdjusttrackerTokens');
    resObj = JSON.parse(resObj);
    if (resObj['myapp.source'] != 'source: direct') {
      let appData = {
        deviceId: DeviceInfo.getUniqueId(),
        installReferrer:
          'source:' +
          resObj['myapp.source'] +
          ' & ' +
          'medium:' +
          resObj['myapp.medium'] +
          ' & ' +
          'campaign:' +
          resObj['myapp.campaign'] +
          ' & ' +
          'network:' +
          resObj['myapp.network'] +
          ' & ' +
          'adgroup_id:' +
          resObj['myapp.adgroup_id'],

        userId: loginData.userId + '',
      };
      try {
        let response = await appDeviceAnalytics(appData);
      } catch (e) {}
    } else {
      let appData = {
        deviceId: DeviceInfo.getUniqueId(),
        installReferrer:
          'source: direct' +
          ' & ' +
          'medium: direct' +
          ' & ' +
          'campaign: direct' +
          ' & ' +
          'network: direct' +
          ' & ' +
          'adgroup_id: direct',
        userId: loginData.userId + '',
      };
      try {
        let response = await appDeviceAnalytics(appData);
      } catch (e) {}
    }
  };

  const onResendOtp = async () => {
    setOtp('');
    setOtpError(false);
    let apiData = {
      type:
        from_screen == 'signupemail'
          ? 'p'
          : email
          ? 'e'
          : from_screen == 'login' || from_screen == 'signup'
          ? 'p'
          : 'e',
      phone:
        from_screen == 'signupemail'
          ? phone
          : email
          ? ''
          : from_screen == 'login' || from_screen == 'signup'
          ? phone
          : '',
      source: from_screen == 'login' ? 'login_otp' : 'signup',
      email: from_screen == 'signupemail' ? '' : email || '',
    };
    const otpResponse = await loginSendOtp(apiData);
    if (
      otpResponse.data &&
      otpResponse.data.status == 'OTP Sent' &&
      otpResponse.data.statusCode == 200
    ) {
      initializeCounter();
    } else {
      Toast.show({
        type: 'success',
        text2: `Something went wrong!`,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.mainAuthScreenView}>
      <Header
        style={styles.backHeader}
        navigation={props.navigation}
        showBack
        iconStyle={styles.iconColor}
        // showText={'Login with OTP'}
      />
      <View style={styles.signInRedScreen}>
        <View style={styles.loginscreen}>
          <Text style={styles.title}>Enter 6 digit OTP</Text>
          <Text style={styles.subtitle}>
            OTP has been sent to{' '}
            {from_screen == 'signupemail' ? phone : email || phone} for
            verification.
          </Text>
          <View style={styles.whiteBg}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.invisibleTextInput}
                value={otp}
                onChangeText={text => setOtp(text)}
                disabled={otpCorrect}
                maxLength={6}
                keyboardType={'number-pad'}
                autoFocus={true}
                ref={inputRef}
              />
              <TouchableOpacity
                onPress={onAutoFocus}
                style={
                  otpCorrect
                    ? styles.validatetextInputStyle
                    : otpError
                    ? styles.errortextInputStyle
                    : styles.textInputStyle
                }>
                <Text
                  style={{
                    color: otp && otp.length == 0 ? '#363636' : '#454f63',
                    alignSelf: 'center',
                  }}>
                  {(otp && otp[0]) || '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAutoFocus}
                style={
                  otpCorrect
                    ? styles.validatetextInputStyle
                    : otpError
                    ? styles.errortextInputStyle
                    : styles.textInputStyle
                }>
                <Text
                  style={{
                    color: otp && otp.length == 1 ? '#363636' : '#454f63',
                    alignSelf: 'center',
                  }}>
                  {(otp && otp[1]) || '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAutoFocus}
                style={
                  otpCorrect
                    ? styles.validatetextInputStyle
                    : otpError
                    ? styles.errortextInputStyle
                    : styles.textInputStyle
                }>
                <Text
                  style={{
                    color: otp && otp.length == 2 ? '#363636' : '#454f63',
                    alignSelf: 'center',
                  }}>
                  {(otp && otp[2]) || '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAutoFocus}
                style={
                  otpCorrect
                    ? styles.validatetextInputStyle
                    : otpError
                    ? styles.errortextInputStyle
                    : styles.textInputStyle
                }>
                <Text
                  style={{
                    color: otp && otp.length == 3 ? '#363636' : '#454f63',
                    alignSelf: 'center',
                  }}>
                  {(otp && otp[3]) || '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAutoFocus}
                style={
                  otpCorrect
                    ? styles.validatetextInputStyle
                    : otpError
                    ? styles.errortextInputStyle
                    : styles.textInputStyle
                }>
                <Text
                  style={{
                    color: otp && otp.length == 4 ? '#363636' : '#454f63',
                    alignSelf: 'center',
                  }}>
                  {(otp && otp[4]) || '-'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAutoFocus}
                style={
                  otpCorrect
                    ? styles.validatetextInputStyle
                    : otpError
                    ? styles.errortextInputStyle
                    : styles.textInputStyle
                }>
                <Text
                  style={{
                    color: otp && otp.length == 5 ? '#363636' : '#454f63',
                    alignSelf: 'center',
                  }}>
                  {(otp && otp[5]) || '-'}
                </Text>
              </TouchableOpacity>
              {/* TextInput with Error */}
              {/* <TextInput style={styles.textInputwithErrorStyle} selectionColor={'#363636'} maxLength={1} placeholder='-' placeholderTextColor={'#454F63'} /> */}
              {/* TextInput with Verified number */}
              {/* <TextInput style={styles.textInputwithVerifiedStyle} selectionColor={'#363636'} maxLength={1} placeholder='-' placeholderTextColor={'#454F63'} /> */}
            </View>
            {otpError && (
              <Text style={styles.errorText}>OTP is not correct</Text>
            )}
            {otpCorrect && (
              <Text style={styles.validText}>Number Verified</Text>
            )}
            <View style={styles.codeReciveWrap}>
              <View>
                <Text style={styles.rbsSubTitle}>Didn’t receive the code?</Text>
                <Text style={styles.codeResend}>
                  {' '}
                  Resend in 00:
                  {String(timer).length > 1
                    ? String(timer)
                    : 0 + String(timer)}{' '}
                </Text>
              </View>
              <TouchableOpacity
                disabled={timer > 0}
                onPress={onResendOtp}
                style={styles.resendOTP}>
                <Text
                  style={[
                    styles.resendotptext,
                    {color: timer > 0 ? 'grey' : colors.RedThemeColor},
                  ]}>
                  RESEND OTP
                </Text>
              </TouchableOpacity>
            </View>
            {from_screen == 'signupemail' ? null : (
              <>
                <View style={styles.orView}>
                  <Text style={styles.orText}>or</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.replace('LoginWithPassword', {
                      phone,
                      email,
                    })
                  }
                  style={styles.contBtn}>
                  <Text style={styles.BtnText}>SIGN IN WITH PASSWORD</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginWithOTPScreen;
