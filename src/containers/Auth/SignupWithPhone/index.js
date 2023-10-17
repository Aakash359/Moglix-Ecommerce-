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
import {signup, verifyUser} from '../../../services/auth';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAuth} from '../../../redux/actions/auth';
import {
  trackStateAdobe,
  sendClickStreamData,
} from '../../../services/analytics';
import VersionCheck from 'react-native-version-check';
import {getCartByUserId} from '../../../services/cart';
import {updateCart} from '../../../redux/actions/cart';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const phoneRegex = '^[1-9][0-9]{9}$';

const SignupWithPhoneScreen = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const {phone, otp} = props.route.params;
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [useremailError, setUseremailError] = useState(false);
  const [existUseremailError, setExistUseremailError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [init, setInit] = useState(false);
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const dispatch = useDispatch();
  var inputRef = useRef();

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
    clickStreamPageLoad();
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'signup_page',
      channel: 'Login/Signup',
    };
    sendClickStreamData(dataTracking);
  };

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
      if (userEmail && userEmail.match(emailRegex)) {
        setUseremailError(false);
        verifyEmail();
      } else {
        if (userEmail == '' && userEmail.length == 0) {
          setUseremailError(false);
          setExistUseremailError(false);
        } else {
          setUseremailError(true);
        }
      }
    }
  }, [userEmail]);

  const verifyEmail = async () => {
    try {
      if (userEmail && userEmail.match(emailRegex)) {
        let apiData = {
          type: 'e',
          phone: '',
          email: userEmail,
        };
        const {data} = await verifyUser(apiData);
        if (!data.exists && data.statusCode == 200) {
          setExistUseremailError(false);
        } else {
          setExistUseremailError(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBlurName = () => {
    if (userName && userName.length != 0) {
      setUsernameError(false);
    } else {
      setUsernameError(true);
    }
  };
  const onBlurEmail = async () => {
    if (userEmail && userEmail.match(emailRegex)) {
      setUseremailError(false);
      verifyEmail();
    } else {
      if (userEmail && userEmail.length) {
        setUseremailError(true);
      }
    }
  };

  const checkValidation = () => {
    if (userEmail) {
      if (
        userEmail &&
        userEmail.length &&
        userEmail.match(emailRegex) &&
        !existUseremailError &&
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
    return userName && userName.length && !usernameError;
  };

  const onSubmit = async () => {
    setLoader(true);
    try {
      if (
        phone &&
        phone.length == 10 &&
        phone.match(phoneRegex) &&
        otp &&
        otp.length == 6 &&
        userName &&
        userName.length &&
        !usernameError &&
        !useremailError &&
        !existUseremailError
      ) {
        let apiData = {
          buildVersion: VersionCheck.getCurrentVersion(),
          device: 'app',
          email: userEmail,
          emailVerified: false,
          firstName: userName,
          lastName: '',
          otp: otp,
          password: '',
          phone: phone,
          type: 'p',
          phoneVerified: true,
          source: 'signup',
          userType: 'online',
        };
        const loginresponse = await signup(apiData, auth.token, auth.sessionId);
        if (
          loginresponse &&
          loginresponse.data &&
          loginresponse.data.authenticated == 'true'
        ) {
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
          dispatch(updateCart(cartByUser.data));
          dispatch(setAuth(loginresponse.data));

          await AsyncStorage.setItem(
            '@user',
            JSON.stringify(loginresponse.data),
          );
          props.navigation.goBack();
          Toast.show({
            type: 'success',
            text2: `Welcome to Moglix, ${loginresponse.data.userName}`,
            visibilityTime: 2000,
            autoHide: true,
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
          <Text style={styles.title}>Almost Done!</Text>
          <Text style={styles.subtitle}>Just a few more details</Text>
          <View style={styles.whiteBg}>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={'User Name*'}
                value={userName}
                onChangeText={text => setUserName(text)}
                onBlur={onBlurName}
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
                label={'Email ID(optional)'}
                value={userEmail}
                onChangeText={text => setUserEmail(text)}
                onBlur={onBlurEmail}
              />
              {useremailError && (
                <Text style={styles.errorText}>
                  Kindly enter a valid email
                </Text>
              )}
              {existUseremailError && (
                <Text style={styles.errorText}>
                  User email already exists
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
              <Text style={styles.BtnText}>SUBMIT NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignupWithPhoneScreen;
