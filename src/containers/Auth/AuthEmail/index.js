import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  InteractionManager,
} from 'react-native';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import {verifyUser, socialLogin} from '../../../services/auth';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {googleSignIn, facebookSignIn} from '../../../generic/SocialLogin/index';
import {GoogleSignin} from '@react-native-community/google-signin';
import {useFocusEffect} from '@react-navigation/native';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const AuthEmailScreen = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const dispatch = useDispatch();
  var inputRef = useRef();

  // useFocusEffect(
  //   useCallback(() => {
  //     if (auth.authenticated == 'true') {
  //       props.navigation.goBack();
  //     }
  //   }, [props.navigation, auth.authenticated]),
  // );

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

  const onAutoFocus = () => {
    if (inputRef && (inputRef.current || inputRef.focus)) {
      inputRef.current ? inputRef.current.focus() : inputRef.focus();
    }
  };

  //DidMount handling
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onAutoFocus();
    });
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
  }, []);

  const onSubmit = async () => {
    try {
      setLoader(true);
      if (email && email.length && email.match(emailRegex) && !emailError) {
        let apiData = {
          type: 'e',
          phone: '',
          email,
        };
        const {data} = await verifyUser(apiData);
        if (data.exists && data.statusCode == 200) {
          props.navigation.navigate('LoginWithPassword', {email});
        } else {
          props.navigation.navigate('SignupWithEmail', {email});
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
    if (email) {
      if (email && email.length && email.match(emailRegex)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
  }, [email]);

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
        <View style={styles.loginscreen}>
          <View style={styles.newinputfield}>
            <FloatingLabelInputField
              label={'Email'}
              autoFocus={true}
              value={email}
              autoFocus={true}
              onChangeText={text => setEmail(text)}
              getRef={ref => {
                inputRef = ref;
              }}
            />
            {emailError && (
              <Text style={styles.errorText}>
                Please enter valid email address
              </Text>
            )}
          </View>
          <TouchableOpacity
            disabled={loader || !email || emailError}
            onPress={() => onSubmit()}
            style={
              loader || !email || emailError ? styles.disableBtn : styles.redBtn
            }>
            {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
            <Text style={styles.BtnText}>CONTINUE</Text>
          </TouchableOpacity>
          <View style={styles.orView}>
            <Text style={styles.orText}>or</Text>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Auth')}
            style={styles.contBtn}>
            <Text style={styles.BtnText}>CONTINUE WITH MOBILE</Text>
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
      </View>
    </ImageBackground>
  );
};

export default AuthEmailScreen;
