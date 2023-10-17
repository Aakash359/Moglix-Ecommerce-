import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Header from '../../../components/Common/Header';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import styles from './styles';
import {verifyUser, loginSendOtp} from '../../../services/auth';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';

const phoneRegex = '^[1-9][0-9]{9}$';
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const EmailPhoneVerify = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const {identity, type} = props.route.params;
  const [phone, setPhone] = useState(identity);
  const [loader, setLoader] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    if (phone) {
      if (
        type == 'phone' &&
        phone &&
        phone.length == 10 &&
        phone.match(phoneRegex)
      ) {
        setPhoneError(false);
      } else if (
        type != 'phone' &&
        phone &&
        phone.length &&
        phone.match(emailRegex)
      ) {
        setPhoneError(false);
      } else {
        setPhoneError(true);
      }
    }
  }, [phone]);

  const onSubmit = async () => {
    try {
      setLoader(true);
      if (phone && phone.length) {
        let apiData = {};
        if (type == 'email') {
          apiData.type = 'e';
          apiData.phone = '';
          apiData.email = phone;
          apiData.userId = auth.userId;
        } else {
          apiData.type = 'p';
          apiData.phone = phone;
          apiData.email = '';
          apiData.userId = auth.userId;
        }
        const {data} = await verifyUser(apiData);
        if (!data.exists && data.statusCode == 200) {
          apiData.source = type == 'phone' ? 'phone_verify' : 'email_verify';
          const otpResponse = await loginSendOtp(apiData);
          if (
            otpResponse.data &&
            otpResponse.data.status == 'OTP Sent' &&
            otpResponse.data.statusCode == 200
          ) {
            props.navigation.navigate('VerifyEmailPhoneOtp', {
              phone,
              type: type,
              userId: auth.userId,
            });
          }
        } else {
          Toast.show({
            type: 'success',
            text2: `User with ${
              type != 'phone' ? 'Email' : 'Mobile Number'
            } already exists`,
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
          {/* <Text style={styles.title}>Forgot Password</Text> */}
          <Text style={styles.subtitle}>
            Your {type == 'phone' ? 'mobile number' : 'Email ID'} hasn't been
            verified yet. Please verify to get all your purchase details on
            provided {type == 'phone' ? 'mobile number' : 'Email ID'}.
          </Text>
          <View style={styles.whiteBg}>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={`Enter ${type != 'phone' ? 'Email' : 'Mobile Number'}`}
                value={phone}
                autoFocus={true}
                onChangeText={text => setPhone(text)}
              />
              {phoneError && (
                <Text style={styles.errorText}>
                  Enter valid {type == 'phone' ? 'mobile number' : 'Email ID'}
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
              onPress={() => props.navigation.goBack()}
              style={styles.blueLink}>
              <Text style={styles.linkText}>GO BACK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmailPhoneVerify;
