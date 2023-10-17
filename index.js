/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {name as iosappName} from './appios.json';
import JailMonkey from 'jail-monkey';
import JailBroken from './src/components/Common/JailBroken';

// if (!__DEV__) {
//   console.log = () => {};
//   console.info = () => {};
//   console.warn = () => {};
//   console.error = () => {};
//   console.debug = () => {};
// }

// // For Capturing Network calls in React-Native-Debugger
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

if (JailMonkey.isJailBroken()) {
  AppRegistry.registerComponent(
    Platform.OS == 'ios' ? iosappName : appName,
    () => JailBroken,
  );
} else {
  if (Platform.OS == 'ios') {
    AppRegistry.registerComponent(iosappName, () => App);
  } else {
    AppRegistry.registerComponent(appName, () => App);
  }
}

// }

// AppRegistry.registerComponent(appName, () => App);
