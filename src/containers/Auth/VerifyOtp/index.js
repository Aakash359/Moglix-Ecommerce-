import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import Header from '../../../components/Common/Header';
import styles from './style';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import colors from '../../../redux/constants/colors';
import {
  validateOtp,
  forgotPassword,
  loginSendOtp,
} from '../../../services/auth';
import Toast from 'react-native-toast-message';

const VerifyOtpScreen = props => {
  let interval = {};
  const {phone, type} = props.route.params;
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [inputType, setInputType] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  var inputRef = useRef();
  const onAutoFocus = () => {
    if (inputRef && inputRef.current && !otpVerified) {
      inputRef.current.blur();
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (password) {
      if (password && password.length > 7) {
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    }
  }, [password]);

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
    setOtpError(false);
    if (otp && otp.length == 6) {
      let apiData = {
        type,
        phone: type == 'p' ? phone : '',
        email: type == 'e' ? phone : '',
        otp,
        source: 'forgot_password',
      };
      const {data} = await validateOtp(apiData);
      if (
        data.statusCode == 200 &&
        data.status == 'OTP Validate successfully'
      ) {
        clearInterval(interval);
        setOtpVerified(true);
      } else {
        setOtpError(true);
        Toast.show({
          type: 'success',
          text2: data.status,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  const onResetPassword = async () => {
    if (password && password.length > 7 && otpVerified) {
      try {
        setLoader(true);
        let apiData = {
          phone: type == 'p' ? phone : '',
          email: type == 'e' ? phone : '',
          otp,
          oldPassword: '',
          newPassword: password,
          source: 'forgot_password',
        };
        const {data} = await forgotPassword(apiData);
        if (data.statusCode == 200) {
          if (type == 'p') {
            props.navigation.navigate('Auth');
          } else {
            props.navigation.navigate('AuthEmail');
          }

          Toast.show({
            type: 'success',
            text2: 'Password Reset Successfully!',
            visibilityTime: 2000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'success',
            text2: 'Something went wrong!',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
        setLoader(false);
      } catch (e) {
        Toast.show({
          type: 'success',
          text2: 'Something went wrong!',
          visibilityTime: 2000,
          autoHide: true,
        });
        setLoader(false);
      }
    }
  };

  const onResendOtp = async () => {
    setOtp('');
    setOtpError(false);
    let apiData = {
      type,
      phone: type == 'p' ? phone : '',
      email: type == 'e' ? phone : '',
      source: 'forgot_password',
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
                disabled={otpVerified}
                keyboardType={'number-pad'}
                autoFocus={true}
                ref={inputRef}
              />
              <TouchableOpacity
                onPress={() => onAutoFocus()}
                style={
                  otpVerified
                    ? styles.textInputwithVerifiedStyle
                    : otpError
                    ? styles.textInputwithErrorStyle
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
                onPress={() => onAutoFocus()}
                style={
                  otpVerified
                    ? styles.textInputwithVerifiedStyle
                    : otpError
                    ? styles.textInputwithErrorStyle
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
                onPress={() => onAutoFocus()}
                style={
                  otpVerified
                    ? styles.textInputwithVerifiedStyle
                    : otpError
                    ? styles.textInputwithErrorStyle
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
                onPress={() => onAutoFocus()}
                style={
                  otpVerified
                    ? styles.textInputwithVerifiedStyle
                    : otpError
                    ? styles.textInputwithErrorStyle
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
                onPress={() => onAutoFocus()}
                style={
                  otpVerified
                    ? styles.textInputwithVerifiedStyle
                    : otpError
                    ? styles.textInputwithErrorStyle
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
                onPress={() => onAutoFocus()}
                style={
                  otpVerified
                    ? styles.textInputwithVerifiedStyle
                    : otpError
                    ? styles.textInputwithErrorStyle
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
            {otpVerified && (
              <Text style={styles.validText}>Number Verified</Text>
            )}
            {otpError && (
              <Text style={styles.errorText}>OTP is not correct</Text>
            )}
            {/* <Text style={styles.errorText}>OTP is not correct</Text>
          <Text style={styles.validText}>Number Verified</Text> */}
            {!otpVerified ? (
              <View style={styles.codeReciveWrap}>
                <View>
                  <Text style={styles.rbsSubTitle}>
                    Didn’t receive the code?
                  </Text>
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
            ) : null}
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                autoFocus={otpVerified}
                label={'Set Password'}
                value={password}
                onChangeText={text => setPassword(text)}
                disabled={!otpVerified}
                disabledBorder={otpVerified ? {} : styles.disableInput}
                disabledLabel={otpVerified ? {} : styles.labelDisable}
                secureTextEntry={inputType}
                extraView={() => (
                  <View style={styles.passIcon}>
                    {/* Disabled View */}
                    {!otpVerified ? (
                      <MatIcon
                        name={'eye'}
                        color={inputType ? '#979797' : '#000'}
                        size={22}
                        style={{zIndex: 100}}
                      />
                    ) : (
                      <MatIcon
                        name={'eye'}
                        onPress={() => setInputType(!inputType)}
                        color={inputType ? '#979797' : '#000'}
                        size={22}
                        style={{zIndex: 100}}
                      />
                    )}
                  </View>
                )}
              />
              {passwordError && (
                <Text style={{color: 'red', fontSize: 10}}>
                  Password must be 8 characters
                </Text>
              )}
            </View>
            <TouchableOpacity
              disabled={loader || !otpVerified || !password || passwordError}
              onPress={onResetPassword}
              style={
                loader || !otpVerified || !password || passwordError
                  ? styles.disableBtn
                  : styles.redBtn
              }>
              {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
              <Text style={styles.BtnText}>CONTINUE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Auth')}
              style={styles.blueLink}>
              <Text style={styles.linkText}>BACK TO SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VerifyOtpScreen;
