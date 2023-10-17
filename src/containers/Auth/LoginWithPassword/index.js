import React, {useEffect, useState, useRef} from 'react';
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
import {login} from '../../../services/auth';
import {getCartByUserId} from '../../../services/cart';
import {setAuth} from '../../../redux/actions/auth';
import {fetchWishlist} from '../../../redux/actions/wishlist';
import {updateCart} from '../../../redux/actions/cart';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {ACPCore, ACPIdentity, ACPLifecycle} from '@adobe/react-native-acpcore';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  webEngageUserTracking,
  setCustomParameters,
  trackStateAdobe,
  sendClickStreamData,
} from '../../../services/analytics';

const LoginWithPasswordScreen = props => {
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const {phone, email} = props.route.params;
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [inputType, setInputType] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const fromScreen = props.navigation.getState();
  const previousRoute =
    fromScreen && fromScreen.routes && fromScreen.routes.length - 3 >= 0
      ? fromScreen.routes[fromScreen.routes.length - 3] &&
        fromScreen.routes[fromScreen.routes.length - 3].name
      : fromScreen.routes[fromScreen.routes.length - 2] &&
        fromScreen.routes[fromScreen.routes.length - 2].name;
  var inputRef = useRef();

  const dispatch = useDispatch();

  const onAutoFocus = () => {
    if (inputRef && (inputRef.current || inputRef.focus)) {
      inputRef.current ? inputRef.current.focus() : inputRef.focus();
    }
  };

  useEffect(() => {
    if (password) {
      setIncorrectPassword(false);
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
    trackStateAdobe('moglix:login page', {
      'myapp.pageName': `moglix:login page`,
      'myapp.channel': 'login/signup',
      'myapp.subSection': `moglix:login page ${previousRoute} `,
    });
    clickStreamPageLoad();
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'signin_password',
      channel: 'Login/Signup',
    };
    sendClickStreamData(dataTracking);
  };

  const getCloudId = obj => {
    ACPIdentity.getExperienceCloudId().then(cloudId => {
      obj.cloudId = cloudId;
      setCustomParameters(obj);
    });
  };

  const onSubmit = async () => {
    setLoader(true);
    setIncorrectPassword(false);
    if (password && password.length && password.length > 7 && !passwordError) {
      let apiData = {
        type: 'p',
        phone: phone ? phone : '',
        password,
        isPhoneVerified: true,
        email: email ? email : '',
      };
      const loginresponse = await login(apiData);
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
        await AsyncStorage.setItem('@user', JSON.stringify(loginresponse.data));
        props.navigation.goBack();
        webEngageUserTracking('login', loginresponse.data.userId + '');
        webEngageUserTracking('setEmail', loginresponse.data.email);
        webEngageUserTracking('setFirstName', loginresponse.data.userName);
        webEngageUserTracking('setPhone', loginresponse.data.phone);
        // setCustomParameters(loginresponse.data);
        getCloudId(loginresponse.data);
        Toast.show({
          type: 'success',
          text2: `Welcome to Moglix, ${loginresponse.data.userName}`,
          visibilityTime: 2000,
          autoHide: true,
        });
      } else {
        setIncorrectPassword(true);
        Toast.show({
          type: 'success',
          text2: loginresponse.data.status,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
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
          <Text style={styles.title}>Enter Password</Text>
          <Text style={styles.subtitle}>Linked with {phone || email}</Text>
          <View style={styles.whiteBg}>
            <View style={styles.newinputfield}>
              <FloatingLabelInputField
                label={'Enter Password'}
                value={password}
                autoFocus={true}
                onChangeText={text => setPassword(text)}
                secureTextEntry={inputType}
                getRef={ref => {
                  inputRef = ref;
                }}
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
              {passwordError && (
                <Text style={{color: 'red', fontSize: 10}}>
                  Password must be 8 characters
                </Text>
              )}
              {incorrectPassword && (
                <Text style={styles.errorText}>
                  Kindly enter your correct password
                </Text>
              )}
            </View>
            <TouchableOpacity
              disabled={loader || passwordError || !password}
              onPress={() => onSubmit()}
              style={
                loader || !password || passwordError
                  ? styles.disableBtn
                  : styles.redBtn
              }>
              {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
              <Text style={styles.BtnText}>CONTINUE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.replace('ForgotPassword', {
                  identity: phone || email,
                })
              }
              style={styles.blueLink}>
              <Text style={styles.linkText}>FORGOT PASSWORD?</Text>
            </TouchableOpacity>
            <View style={styles.orView}>
              <Text style={styles.orText}>or</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                props.navigation.replace('LoginWithOTP', {email, phone})
              }
              style={styles.contBtn}>
              <Text style={styles.BtnText}>SIGN IN WITH OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginWithPasswordScreen;
