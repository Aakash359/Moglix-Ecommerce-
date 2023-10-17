import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import Header from '../../../components/Common/Header';
import styles from './style';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAuth} from '../../../redux/actions/auth';
import Toast from 'react-native-toast-message';
import {
  validateOtp,
  login,
  loginSendOtp,
  verifyUser,
} from '../../../services/auth';
const phoneRegex = '^[1-9][0-9]{9}$';
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
import {trackStateAdobe} from '../../../services/analytics';

const SignupWithEmailScreen = props => {
  const {email} = props.route.params;
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [userphoneError, setUserphoneError] = useState(false);
  const [userpasswordError, setUserpasswordError] = useState(false);
  const [inputType, setInputType] = useState(true);
  const [loader, setLoader] = useState(false);
  const [init, setInit] = useState(false);
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  var inputRef = useRef();

  const dispatch = useDispatch();

  const onAutoFocus = () => {
    if (inputRef && (inputRef.current || inputRef.focus)) {
      inputRef.current ? inputRef.current.focus() : inputRef.focus();
    }
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onAutoFocus();
    });
    setInit(true);
    adobeSignupTrackEvent();
  }, []);

  const adobeSignupTrackEvent = () => {
    trackStateAdobe('moglix:signup form', {
      'myapp.pageName': 'moglix:signup form',
      'myapp.channel': 'login/signup',
      'myapp.subSection': 'moglix:signup form',
    });
  };

  useEffect(() => {
    if (init) {
      if (userName && userName.length != 0) {
        setUsernameError(false);
      } else {
        setUsernameError(true);
      }
    }
  }, [userName]);

  useEffect(() => {
    if (init) {
      if (userPhone && userPhone.match(phoneRegex)) {
        setUserphoneError(false);
      } else {
        setUserphoneError(true);
      }
    }
  }, [userPhone]);

  useEffect(() => {
    if (init) {
      if (userPassword && userPassword.length > 7) {
        setUserpasswordError(false);
      } else {
        if (userPassword == '' && userPassword.length == 0) {
          setUserpasswordError(false);
        } else {
          setUserpasswordError(true);
        }
      }
    }
  }, [userPassword]);

  const onBlurName = () => {
    if (userName && userName.length != 0) {
      setUsernameError(false);
    } else {
      setUsernameError(true);
    }
  };

  const onBlurPhone = () => {
    if (userPhone && userPhone.length == 10) {
      setUserphoneError(false);
    } else {
      setUserphoneError(true);
    }
  };

  const onBlurPassword = async () => {
    if (userPassword && userPassword.length > 7) {
      setUserpasswordError(false);
    } else {
      if (userPassword && userPassword.length > 0) {
        setUserpasswordError(true);
      }
    }
  };

  const checkValidation = () => {
    if (userPassword) {
      if (
        userPassword &&
        userPassword.length &&
        userPassword.length > 7 &&
        checkCommonValidation()
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (checkCommonValidation()) {
        return false;
      } else {
        return true;
      }
    }
  };

  const checkCommonValidation = () => {
    return (
      userName &&
      userName.length &&
      !usernameError &&
      userPhone &&
      userPhone.length &&
      userPhone.length == 10 &&
      !userphoneError
    );
  };

  const onSubmit = async () => {
    setLoader(true);
    try {
      if (
        email &&
        email.match(emailRegex) &&
        userPhone &&
        userPhone.length == 10 &&
        userPhone.match(phoneRegex) &&
        !userphoneError &&
        userName &&
        userName.length &&
        !usernameError
      ) {
        if (
          userPhone &&
          userPhone.length == 10 &&
          userPhone.match(phoneRegex) &&
          !userphoneError
        ) {
          let apiData = {
            type: 'p',
            phone: userPhone,
            email: '',
          };
          const userResponse = await verifyUser(apiData);
          if (userResponse.data.statusCode == 200 && userResponse.data.exists) {
            Toast.show({
              type: 'success',
              text2: `User with this phone number already exists!`,
              visibilityTime: 4000,
              autoHide: true,
            });
            setLoader(false);
            return;
          }
        }
        let apiData = {
          email: '',
          phone: userPhone,
          source: 'signup',
          type: 'p',
        };
        const otpResponse = await loginSendOtp(apiData);
        if (
          otpResponse.data &&
          otpResponse.data.status == 'OTP Sent' &&
          otpResponse.data.statusCode == 200
        ) {
          props.navigation.navigate('LoginWithOTP', {
            phone: userPhone,
            email,
            password: userPassword,
            name: userName,
            from_screen: 'signupemail',
          });
        } else {
          Toast.show({
            type: 'success',
            text2: `Something went wrong!`,
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      }
    } catch (e) {
      Toast.show({
        type: 'success',
        text2: `Something went wrong!`,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    setLoader(false);
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
          <Text style={styles.title}>Looks like you’re new here!</Text>
          <Text style={styles.subtitle}>Please provide below information</Text>
          <View style={styles.whiteBg}>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={'User Name*'}
                value={userName}
                onChangeText={text => setUserName(text)}
                onBlur={onBlurName}
                // autoFocus={true}
                getRef={ref => {
                  inputRef = ref;
                }}
              />
              {usernameError && (
                <Text style={styles.errorText}>
                  Kindly enter a valid name
                </Text>
              )}
            </View>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={'Mobile Number*'}
                value={userPhone}
                onChangeText={text => setUserPhone(text)}
                onBlur={onBlurPhone}
                maxLength={10}
                keyboardType={'number-pad'}
              />
              {userphoneError && (
                <Text style={styles.errorText}>
                  Kindly enter a valid phone number
                </Text>
              )}
            </View>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={'Enter Password (optional)'}
                value={userPassword}
                onChangeText={text => setUserPassword(text)}
                onBlur={onBlurPassword}
                secureTextEntry={inputType}
                extraView={() => (
                  <TouchableOpacity
                    onPress={() => setInputType(!inputType)}
                    style={styles.passIcon}>
                    <MatIcon
                      name={'eye'}
                      color={inputType ? '#979797' : '#000'}
                      size={22}
                    />
                  </TouchableOpacity>
                )}
              />
              {userpasswordError && (
                <Text style={styles.errorText}>
                  Password must be 8 characters
                </Text>
              )}
            </View>
            <TouchableOpacity
              disabled={loader || checkValidation()}
              onPress={() => onSubmit()}
              style={
                loader || checkValidation() ? styles.disableBtn : styles.redBtn
              }>
              {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
              <Text style={styles.BtnText}>SIGN UP NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignupWithEmailScreen;
