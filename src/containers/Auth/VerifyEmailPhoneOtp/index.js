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
  validateIdentity,
  loginSendOtp,
} from '../../../services/auth';
import colors from '../../../redux/constants/colors';
import Toast from 'react-native-toast-message';
import {setAuth} from '../../../redux/actions/auth';

const VerifyEmailPhoneOtp = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  let interval = {};
  const {phone, type, userId} = props.route.params;
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpCorrect, setOtpCorrect] = useState(false);
  const inputRef = useRef();

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
    return () => clearInterval(interval);
  }, []);

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

  const onSubmitOtp = async () => {
    if (otp && otp.length == 6) {
      setOtpError(false);
      let apiData = {
        type: type == 'phone' ? 'p' : 'e',
        phone: type == 'phone' ? phone : '',
        source: type == 'phone' ? 'phone_verify' : 'email_verify',
        email: type == 'email' ? phone : '',
        userId: userId,
        otp,
      };
      const {data} = await validateOtp(apiData);
      if (
        data.statusCode == 200 &&
        data.status == 'OTP Validate successfully'
      ) {
        const loginresponse = await validateIdentity(
          apiData,
          auth.token,
          auth.sessionId,
        );
        if (
          loginresponse &&
          loginresponse.data &&
          loginresponse.data.statusCode == 200
        ) {
          let newAuth = {...auth};
          newAuth = {
            ...newAuth,
            emailVerified: type == 'email' ? true : newAuth.emailVerified,
            phoneVerified: type == 'phone' ? true : newAuth.phoneVerified,
          };
          dispatch(setAuth(newAuth));
          await AsyncStorage.setItem('@user', JSON.stringify(newAuth));
          Toast.show({
            type: 'success',
            text2: `${
              type == 'phone' ? 'Phone number' : 'Email ID'
            } successfully Verified`,
            visibilityTime: 2000,
            autoHide: true,
          });
          props.navigation.navigate('Profile');
        }
      } else {
        setOtpError(true);
      }
    } else {
      setOtpError(true);
    }
  };

  const onResendOtp = async () => {
    setOtp('');
    setOtpError(false);
    let apiData = {
      type: type == 'phone' ? 'p' : 'e',
      phone: type == 'phone' ? phone : '',
      source: type == 'phone' ? 'phone_verify' : 'email_verify',
      email: type == 'email' ? phone : '',
      userId: userId,
    };
    const otpResponse = await loginSendOtp(apiData);
    if (
      otpResponse.data &&
      otpResponse.data.status == 'OTP Sent' &&
      otpResponse.data.statusCode == 200
    ) {
      Toast.show({
        type: 'success',
        text2: `OTP sent successfully!`,
        visibilityTime: 2000,
        autoHide: true,
      });
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
            OTP has been sent to {phone} for verification.
          </Text>
          <View style={styles.whiteBg}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.invisibleTextInput}
                value={otp}
                onChangeText={text => setOtp(text)}
                maxLength={6}
                keyboardType={'number-pad'}
                disabled={otpCorrect}
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
            </View>
            {otpError && (
              <Text style={styles.errorText}>OTP is not correct</Text>
            )}
            {otpCorrect && (
              <Text style={styles.validText}>Verified successfully!</Text>
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
          </View>
        </View>
      </View>
    </View>
  );
};

export default VerifyEmailPhoneOtp;
