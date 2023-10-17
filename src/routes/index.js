import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomIcon from 'react-native-vector-icons/Foundation';
import {
  BOTTOM_TAB_SCREENS,
  COLORS,
  APP_STACK_SCREENS,
} from '../constants/index';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import Dimension from '../redux/constants/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAuth, setAuth, setFcmToken} from '../redux/actions/auth';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {saveAppData, appDeviceAnalytics} from '../services/auth';
import colors from '../redux/constants/colors';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../generic/index';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import {
  trackAdjust,
  setCustomParameters,
  trackStateAdobe,
} from '../services/analytics';
import ProfileTabIcon from '../components/Common/ProfileTabIcon';
import {ACPCore, ACPIdentity, ACPLifecycle} from '@adobe/react-native-acpcore';
import {navigationRef} from '../generic/navigator';

const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const horizontalAnimation = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({current, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const navOptionHandler = () => ({
  headerShown: false,
  tabBarShowLabel: false,
  ...horizontalAnimation,
  // ...TransitionPresets.SlideFromRightIOS,
});
const styles = StyleSheet.create({
  tabBar: {
    // paddingBottom: Dimension.padding10,
    // paddingTop: Dimension.padding15,
    height: Dimension.height50,
    backgroundColor: '#fff',
  },
  IconDefaultColor: {color: colors.ExtralightGrayText},
  tabText: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomMediumFont,
    marginTop: Dimension.margin4,
  },
  iconAlignment: {alignItems: 'center', alignSelf: 'center'},
});
const tabBarOptions = {
  activeTintColor: COLORS.active,
  inactiveTintColor: COLORS.inActive,
  showLabel: false,
  style: styles.tabBar,
};

const Routes = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [adjustTrackerTokens, setAdjustTrackerTokens] = useState({
    key: 'value',
  });
  const [isSessionSet, setIsSessionSet] = useState(false);
  const dispatch = useDispatch();

  (function () {
    const adjustConfig = new AdjustConfig(
      'uy7esahbcbuo',
      AdjustConfig.EnvironmentProduction,
    );
    adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
    adjustConfig.setShouldLaunchDeeplink(true);
    // ****** code to uncomment after integrating Adobe criteo  *******
    var lifecycleParams = {};
    adjustConfig.setAttributionCallbackListener(function (attribution) {
      let trackerToken = '';
      let trackerName = '';
      let campaign = '';
      let utm_network = '';
      let creative = '';
      let adgroup = '';
      if (attribution.trackerToken != null) {
        trackerToken = String(attribution.trackerToken);
      }
      if (attribution.trackerName != null) {
        trackerName = String(attribution.trackerName);
      }
      if (attribution.campaign != null) {
        campaign = String(attribution.campaign);
      }
      if (attribution.network != null) {
        utm_network = String(attribution.network);
      }
      if (attribution.creative != null) {
        creative = String(attribution.creative);
      }
      if (attribution.adgroup != null) {
        adgroup = String(attribution.adgroup);
      }
      lifecycleParams = {
        'myapp.medium': trackerToken,
        'myapp.source': trackerName,
        'myapp.campaign': campaign,
        'myapp.network': utm_network,
        'myapp.content': creative,
        'myapp.adgroup_id': adgroup,
        '&&events': 'event28',
      };
      trackStateAdobe('myapp.campaignTrack', lifecycleParams);
    });
    adjustConfig.setUrlStrategy(AdjustConfig.URL_STRATEGY_INDIA);
    Adjust.create(adjustConfig);
    // Linking.getInitialURL()
    // .then(url => {
    //   if (url) {
    //     adjustConfig.setDeferredDeeplinkCallbackListener(function (url) {});
    //   }
    // })
    // .catch(err => {
    //   console.log('appjserror', err);
    // });
  })();

  useEffect(() => {
    if (auth && auth.sessionId && !isSessionSet) {
      setIsSessionSet(true);
    }
  }, [auth.sessionId]);

  const getCloudId = obj => {
    ACPIdentity.getExperienceCloudId().then(cloudId => {
      obj.cloudId = cloudId;
      setCustomParameters(obj);
    });
  };

  const getUserData = async () => {
    let userData = await AsyncStorage.getItem('@user');
    appAnalytics(JSON.parse(userData));
    getCloudId(JSON.parse(userData));

    if (userData) {
      dispatch(setAuth(JSON.parse(userData)));
    }
    if (!userData) dispatch(fetchAuth());
  };

  const getFcmToken = async () => {
    try {
      const token = await firebase.messaging().getToken();
      Adjust.setPushToken(token);
      console.log('fcmToken', token);
      AsyncStorage.setItem('fcm_token', token);
      // dispatch(setFcmToken(token));
    } catch (error) {
      console.log(error);
    }
  };

  const onTokenRefreshListener = async () => {
    try {
      const token = await firebase.messaging().onTokenRefresh();
      Adjust.setPushToken(token);
      console.log('fcmToken', token);
    } catch (error) {
      console.log(error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
  };

  const setAppInfo = async () => {
    let appData = {
      deviceId: DeviceInfo.getUniqueId(),
      appVersion: VersionCheck.getCurrentVersion(),
    };
    let promises = [
      DeviceInfo.getInstallReferrer(),
      DeviceInfo.getFirstInstallTime(),
      DeviceInfo.getUserAgent(),
    ];
    await Promise.all(promises).then(
      ([installReferrer, firstInstallTime, userAgent]) => {
        appData.phoneNumber = ''; //phoneNumber;
        appData.installReferrer = installReferrer;
        appData.firstInstallTime = firstInstallTime;
        appData.userAgent = userAgent;
        saveAppData(appData);
      },
    );
  };

  const appAnalytics = async auth => {
    if (auth.authenticated == 'true') {
      if (typeof adjustTrackerTokens['myapp.source'] != 'undefined') {
        let appData = {
          deviceId: DeviceInfo.getUniqueId(),
          installReferrer:
            'source:' +
            adjustTrackerTokens['myapp.source'] +
            ' & ' +
            'medium:' +
            adjustTrackerTokens['myapp.medium'] +
            ' & ' +
            'campaign:' +
            adjustTrackerTokens['myapp.campaign'] +
            ' & ' +
            'network:' +
            adjustTrackerTokens['myapp.network'] +
            ' & ' +
            'adgroup_id:' +
            adjustTrackerTokens['myapp.adgroup_id'],
          userId: auth.userId,
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
          userId: auth.userId,
        };
        AsyncStorage.setItem(
          '@AdjusttrackerTokens',
          JSON.stringify(appData.installReferrer),
        );
        try {
          let response = await appDeviceAnalytics(appData);
        } catch (e) {
          console.log('error=======' + e);
        }
      }
    }
  };

  useEffect(() => {
    console.log('ref', navigationRef);
    setAppInfo();
    requestUserPermission();
    getUserData();
    getFcmToken();
    adjustSessionEvent();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // alert('A new FCM message arrived!' + JSON.stringify(remoteMessage));
    });
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    return () => {
      onTokenRefreshListener();
      Adjust.componentWillUnmount();
    };
  }, []);

  const adjustSessionEvent = () => {
    var adjustEvent = new AdjustEvent('icnhjw');
    trackAdjust(adjustEvent);
  };

  const tabBarIcon = (focused, color, route, rest) => {
    let currentScreen = BOTTOM_TAB_SCREENS.find(
      screen => screen.name === route.name,
    );
    let tabName = currentScreen['name'];
    let iconName = currentScreen[focused ? 'activeIcon' : 'inactiveIcon'];
    return (
      <TouchableOpacity
        style={styles.iconAlignment}
        onPress={() => rest.navigation.navigate(route.name)}>
        {tabName == 'Profile' ? (
          <ProfileTabIcon focused={focused} iconName={iconName} color={color} />
        ) : currentScreen.iconType ? (
          <BottomIcon name={iconName} size={26} color={color} />
        ) : (
          <Icon name={iconName} size={26} color={color} />
        )}
        <Text style={[styles.tabText, {color: focused ? color : '#3c3c3c'}]}>
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({route, ...rest}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color}) =>
            tabBarIcon(focused, color, route, rest),
        })}
        tabBarOptions={tabBarOptions}>
        {BOTTOM_TAB_SCREENS.map((screen, key) => (
          <Tab.Screen
            key={key}
            name={screen.name}
            component={screen.component}
          />
        ))}
      </Tab.Navigator>
    );
  };

  const linking = {
    prefixes: ['https://www.moglix.com', 'www.moglix.com://'],
    config: {
      initialRouteName: 'HomeApp',
      screens: {
        HomeApp: {
          screens: {
            Home: {
              path: 'Home',
            },
            Categories: {
              path: 'Categories',
            },
            Brands: {
              path: 'Brands',
            },
            Orders: {
              path: 'Orders',
            },
          },
        },
        Product: {
          path: 'Product/:msn',
        },
      },
    },
  };

  const fallbackComponent = () => (
    <ActivityIndicator
      size={'large'}
      color={'red'}
      style={{
        backgroundColor: '#e7e7e7',
        borderRadius: 8,
        width: '100%',
        marginHorizontal: 12,
        marginBottom: 8,
        paddingVertical: 50,
        alignSelf: 'center',
      }}
    />
  );

  return isSessionSet ? (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={fallbackComponent}>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="HomeApp">
        <AppStack.Screen
          screenOptions={{
            headerShown: false,
          }}
          name="HomeApp"
          component={TabNavigator}
          options={navOptionHandler}
        />
        {APP_STACK_SCREENS.map((screen, key) => (
          <AppStack.Screen
            key={key}
            name={screen.name}
            screenOptions={{
              headerShown: false,
            }}
            component={screen.component}
            options={navOptionHandler}
          />
        ))}
      </AppStack.Navigator>
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  ) : (
    <View></View>
  );
};

export default Routes;
