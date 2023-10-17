import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import WebEngage from 'react-native-webengage';
import VersionCheck from 'react-native-version-check';
import {ACPCore} from '@adobe/react-native-acpcore';
var webengage = new WebEngage();
import {decode as atob, encode as btoa} from 'base-64';
import {SocketIO} from '../generic/index';
import {NetworkInfo} from 'react-native-network-info';
import DeviceInfo from 'react-native-device-info';
import {useSelector} from 'react-redux';
import store from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

let customParamaters = {
  'myapp.customerID': '',
  'myapp.emailID': '',
  'myapp.mobile': '',
  'myapp.customerType': '',
  'myapp.loginStatus': 'guest',
};
let userAgent;
// let ipAddress;
let deepLinkURL = false;

DeviceInfo.getUserAgent().then(user_agent => {
  userAgent = user_agent;
});

export const trackAdjust = adjustObj => {
  Adjust.trackEvent(adjustObj);
};

export const webEngageTracking = (name, webEngageObj) => {
  let appVersion = VersionCheck.getCurrentVersion();
  webEngageObj['app_version'] = appVersion;
  webengage.track(name, webEngageObj);
};

export const webEngageScreenTracking = (name, paramsObj) => {
  webengage.screen(name, paramsObj);
};

export const webEngageUserTracking = (func, value) => {
  webengage.user[func](value);
};

export const setCustomParameters = obj => {
  if (obj.userId) {
    customParamaters['myapp.customerID'] = `${obj.userId}`;
  } else {
    customParamaters['myapp.customerID'] = '';
  }
  if (obj.email) {
    customParamaters['myapp.emailID'] = `${obj.email}`;
  }
  if (obj.phone) {
    customParamaters['myapp.mobile'] = `${obj.phone}`;
  }
  if (obj.authenticated == 'true') {
    customParamaters['myapp.loginStatus'] = 'registered';
  } else {
    customParamaters['myapp.loginStatus'] = 'guest';
  }
  if (obj.userType) {
    customParamaters['myapp.customerType'] = obj.userType;
  }
  if (obj.cloudId) {
    customParamaters['myapp.mid'] = obj.cloudId;
  }
};

export const sendClickStreamData = async clickstreamData => {
  let userId = null;
  let fcmToken = await AsyncStorage.getItem('fcm_token');
  let ipAddress = await NetworkInfo.getIPV4Address();
  // NetworkInfo.getIPV4Address().then(ip_address => {
  //   ipAddress = ip_address;
  // });

  if (customParamaters['myapp.customerID']) {
    userId = parseInt(atob(customParamaters['myapp.customerID']));
  }
  let defaultData = {
    session_id:
      (store.getState() &&
        store.getState().authReducer &&
        store.getState().authReducer.data &&
        store.getState().authReducer.data.sessionId) ||
      '',
    user_id:
      userId ||
      (store.getState() &&
        store.getState().authReducer &&
        store.getState().authReducer.data &&
        store.getState().authReducer.data.userId) ||
      '',
    device: 'MobileApp',
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date().getTime(),
    cookie: fcmToken,
    deviceId: DeviceInfo.getUniqueId(),
  };
  SocketIO.emit({...defaultData, ...clickstreamData});
};

export const trackStateAdobe = (stateName, stateData) => {
  //   console.log('adobestateName', stateName);
  //   console.log('adobestateData', stateData);
  if (stateData) {
    if (stateData['myapp.productPrice']) {
      stateData['myapp.productPrice'] = stateData['myapp.productPrice'] + '';
    }
    if (stateData['myapp.quantity']) {
      stateData['myapp.quantity'] = stateData['myapp.quantity'] + '';
    }
    if (stateData['myapp.totalQuantity']) {
      stateData['myapp.totalQuantity'] = stateData['myapp.totalQuantity'] + '';
    }
    if (stateData['myapp.totalPrice']) {
      stateData['myapp.totalPrice'] = stateData['myapp.totalPrice'] + '';
    }
    if (stateData['myapp.totalDiscount']) {
      stateData['myapp.totalDiscount'] = stateData['myapp.totalDiscount'] + '';
    }
  }

  ACPCore.trackState(stateName, {...stateData, ...customParamaters});

  //   if (
  //     stateName &&
  //     (stateName.includes('listing') || stateName.includes('Search Listing Page'))
  //   ) {
  //     /* ACPCore.trackState(stateName); */
  //     // let trackData = {...stateData, ...customParamaters};
  //     // let data = JSON.stringify(trackData);
  //     // console.log(stateName);
  //     // console.log(trackData);
  //     ACPCore.trackState(stateName, {...stateData, ...customParamaters});
  //   } else {
  //   }

  //   console.log(customParamaters);
  //   /* console.log(stateName, {...stateData,...customParamaters}); */
  //   console.log('stateData=====', stateName, {...stateData, ...customParamaters});
};
