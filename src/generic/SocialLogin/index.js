import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCartByUserId} from '../../services/cart';
import {setAuth} from '../../redux/actions/auth';
import {fetchWishlist} from '../../redux/actions/wishlist';
import {updateCart} from '../../redux/actions/cart';
import {GoogleSignin} from '@react-native-community/google-signin';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {socialLogin} from '../../services/auth';
import VersionCheck from 'react-native-version-check';

export const googleSignIn = async (cart, dispatch, navigation) => {
  try {
    await GoogleSignin.hasPlayServices({
      autoResolve: true,
      showPlayServicesUpdateDialog: true,
    });
    const userInfo = await GoogleSignin.signIn();
    let reqObj = {
      phone: '',
      email: userInfo.user['email'],
      token: userInfo['idToken'],
      firstName: userInfo.user['name'],
      lastName: '',
      userId: userInfo.user['id'],
      buildVersion: VersionCheck.getCurrentVersion(),
      isPhoneVerified: false,
    };

    const loginresponse = await socialLogin(reqObj);
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
      // navigation.popToTop();
    }
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
      console.log(error);
    }
  }
};

export const facebookSignIn = async (cart, dispatch, navigation) => {
  // LoginManager.logOut();
  if (Platform.OS === 'android') {
    LoginManager.setLoginBehavior('NATIVE_ONLY');
  }

  LoginManager.logInWithPermissions([
    'email',
    'public_profile',
    'user_friends',
  ]).then(
    function (result) {
      if (result.isCancelled) {
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const accessToken = data.accessToken;
          const responseInfoCallback = async (error, result) => {
            if (error) {
            } else {
              let reqObj = {
                source: 'facebook',
                buildVersion: VersionCheck.getCurrentVersion(),
                email: result.email,
                firstName: result.name,
                isPhoneVerified: false,
                lastName: '',
                phone: '',
                token: data.accessToken.toString(),
                userId: result.id,
              };

              const loginresponse = await socialLogin(reqObj);
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
                await AsyncStorage.setItem(
                  '@user',
                  JSON.stringify(loginresponse.data),
                );
                navigation.popToTop();
              }
            }
          };
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken,
              parameters: {
                fields: {
                  string: 'email,name,first_name,middle_name,last_name',
                },
              },
            },
            responseInfoCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        });
      }
    },
    function (error) {
      console.log('Login fail with error: ' + error);
    },
  );
};
