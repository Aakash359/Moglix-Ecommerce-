import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import Header from '../../../components/Common/Header';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import styles from './style';
import {verifyUser, loginSendOtp} from '../../../services/auth';
import Toast from 'react-native-toast-message';

const phoneRegex = '^[1-9][0-9]{9}$';
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const ForgotPasswordScreen = props => {
  const {identity} = props.route.params;
  const [phone, setPhone] = useState(identity || '');
  const [loader, setLoader] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  var inputRef = useRef();

  useEffect(() => {
    if (phone) {
      if (phone && phone.length == 10 && phone.match(phoneRegex)) {
        setPhoneError(false);
      } else if (phone && phone.length && phone.match(emailRegex)) {
        setPhoneError(false);
      } else {
        setPhoneError(true);
      }
    }
  }, [phone]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onAutoFocus();
    });
  }, []);

  const onAutoFocus = () => {
    if (inputRef && (inputRef.current || inputRef.focus)) {
      inputRef.current ? inputRef.current.focus() : inputRef.focus();
    }
  };

  const onSubmit = async () => {
    try {
      setLoader(true);
      if (phone && phone.length) {
        let apiData = {};
        if (phone.match(emailRegex)) {
          apiData.type = 'e';
          apiData.phone = '';
          apiData.email = phone;
        }
        if (phone && phone.length == 10 && phone.match(phoneRegex)) {
          apiData.type = 'p';
          apiData.phone = phone;
          apiData.email = '';
        }
        const {data} = await verifyUser(apiData);
        if (data.exists && data.statusCode == 200) {
          apiData.source = 'forgot_password';
          const otpResponse = await loginSendOtp(apiData);
          if (
            otpResponse.data &&
            otpResponse.data.status == 'OTP Sent' &&
            otpResponse.data.statusCode == 200
          ) {
            props.navigation.navigate('VerifyOtp', {phone, type: apiData.type});
          }
        } else {
          Toast.show({
            type: 'success',
            text2: `User with email/phone doesn't exist`,
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      }
      setLoader(false);
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'success',
        text2: `Something went wrong!`,
        visibilityTime: 2000,
        autoHide: true,
      });
      setLoader(false);
    }
  };

  return (
    <View style={styles.mainAuthScreenView}>
      <Header
        style={styles.backHeader}
        navigation={props.navigation}
        showBack
        iconStyle={styles.iconColor}
      />
      <View style={styles.signInRedScreen}>
        <View style={styles.loginscreen}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter registered email/mobile number to receive the verification
            code.
          </Text>
          <View style={styles.whiteBg}>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={'Enter Email/Mobile Number'}
                value={phone}
                autoFocus={true}
                onChangeText={text => setPhone(text)}
                getRef={ref => {
                  inputRef = ref;
                }}
              />
              {phoneError && (
                <Text style={styles.errorText}>
                  Enter valid email/phone number
                </Text>
              )}
            </View>
            <TouchableOpacity
              disabled={loader || !phone || phoneError}
              onPress={() => onSubmit()}
              style={
                loader || !phone || phoneError
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

export default ForgotPasswordScreen;
