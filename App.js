import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, LogBox, Platform, Linking} from 'react-native';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import Routes from './src/routes/index';
import NetworkModal from './src/components/Common/NetworkModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SocketIO} from './src/generic';
import {trackStateAdobe, trackAdjust} from './src/services/analytics';
import * as RootNavigation from './src/generic/navigator';

LogBox.ignoreAllLogs();

const App = () => {
  const [adjustTrackerTokens, setAdjustTrackerTokens] = useState({});

  useEffect(() => {
    setAppSession();
    SocketIO.startSocketIO();

    let urlListener = {};
    if (Platform.OS === 'android') {
      urlListener = Linking.addEventListener('url', getLinkingUrl);
    }

    setTimeout(() => {
      Linking.getInitialURL()
        .then(url => {
          if (url) {
            handleOpenUrl({url: url});
          }
        })
        .catch(err => {
          console.log(err);
        });
    });

    return urlListener;
  }, []);

  const getLinkingUrl = eventUrl => {
    console.log('event listener');
    if (Platform.OS === 'android') {
      handleOpenUrl(eventUrl);
    }
  };

  const handleOpenUrl = event => {
    if (event) {
      Linking.canOpenURL(event.url).then(supported => {
        if (supported) {
          console.log('linkingUrl', event.url);
          let input = event.url;
          if (input.includes('https://www.moglix.com/dashboard/order')) {
            AsyncStorage.setItem('@orderLinking', 'true');
            lifeCycleCallAdobe(event.url);
            RootNavigation.navigate('Orders');
            return;
          }

          let fields = input.split('layoutCode=');
          if (fields[1]) {
            AsyncStorage.setItem('@layout', fields[1]);
            lifeCycleCallAdobe(event.url);
            RootNavigation.navigate('CategoriesHomePage', {
              code: 'layoutCode=' + fields[1],
            });
            return;
          }

          let urlIntent = event.url;
          if (urlIntent.match('moglix://')) {
            urlIntent = urlIntent.replace('moglix://', '');
            if (urlIntent.includes('msn')) {
              RootNavigation.push('Product', {
                msn: urlIntent.replace('-g', ''),
              });
            }
            return;
          } else {
            let new_url = event.url;
            lifeCycleCallAdobe(new_url);
            new_url = new_url.split('?')[0];
            // let origUrl = url;
            new_url = new_url.replace('https://www.moglix.com/', '');
            let urlForAPI = new_url;
            new_url = new_url.split('/');
            const urlLength = new_url.length;
            let screen = 'Listing';
            let obj = {};
            let keyPrefix = 'listing';
            let staticPage = false;
            console.log(new_url);
            if (urlLength > 0) {
              const lastParam = new_url[urlLength - 1].toString();
              const brandParam = new_url[0].toString();
              let brandName = '';
              if (new_url[1]) {
                brandName = new_url[1].toString();
              }
              if (lastParam.match(/^\d{9}$/) && brandParam !== 'brands') {
                obj = {
                  str: lastParam,
                  type: 'Category',
                  category: lastParam,
                  // name: item.imageTitle || item.categoryName,
                };

                // obj = {
                //   type: 'Category',
                //   str: lastParam,
                //   category: false,
                // };
                //categoryPage
              } else if (
                lastParam.match(/^[A-Za-z0-9_.]+$/) &&
                brandParam === 'brands' &&
                urlLength > 2
              ) {
                obj = {
                  type: 'Brand',
                  category: lastParam,
                  brand: brandName,
                  str: brandName,
                };
                // brand category page
              } else if (
                brandParam === 'brands' &&
                new_url[1] &&
                urlLength === 2
              ) {
                obj = {
                  type: 'Brand',
                  category: '',
                  brand: brandName,
                  str: brandName,
                };
                // brand page
              } else if (new_url[0] === 'all-categories') {
                screen = 'Categories';
                staticPage = true;
                // all categories page
              } else if (new_url[0] === 'faq') {
                screen = 'FaqScreen';
                staticPage = true;
                // faq page
              } else if (new_url[0] === 'privacy') {
                screen = 'PrivacyScreen';
                staticPage = true;
                // privacy page
              } else if (new_url[0] === 'quickorder') {
                screen = 'Cart';
                staticPage = true;
                // privacy page
              } else if (new_url[0] === 'brand-store') {
                screen = 'Brands';
                staticPage = true;
              } else {
                screen = 'Home';
                staticPage = true;
                // screen = 'WebViewURLScreen';
                // obj = {
                //   uri: origUrl + '?device=app'
                // };
                // keyPrefix = 'webviewUri'
                // staticPage = false;
              }
              if (urlLength > 2) {
                const secondURLStrig = new_url[1].toString();
                if (secondURLStrig === 'mp') {
                  screen = 'Product';
                  obj = {
                    msn: new_url[2].replace('-g', ''),
                    // fromScreen: 'deeplink',
                  };
                  keyPrefix = 'product';
                  staticPage = false;
                }
              }
              // listingService.checkWebviewUrl(urlForAPI).then(res => {
              // GlobalService.setDeepLinkURL(urlForAPI);
              // RootNavigation.navigate('MainScreen');
              // if (res && res.status && res.data && res.data.isWebView) {
              //   NavigationService.navigate('WebViewURLScreen', {
              //     uri: urlForAPI,
              //   });
              // } else {

              if (staticPage) {
                if (new_url[0] === 'brand-store' && screen == 'Brands') {
                  RootNavigation.navigate(screen);
                } else {
                  RootNavigation.push(screen);
                }
              } else {
                RootNavigation.push(
                  screen,
                  obj,
                  keyPrefix + new Date().getTime(),
                );
                // return;
              }
              // }
              // });
            }
          }
        }
      });
    }
  };

  const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  lifeCycleCallAdobe = url => {
    let lifecycleParams = {
      'myapp.medium': getParameterByName('utm_medium', url),
      'myapp.source': getParameterByName('utm_source', url),
      'myapp.campaign': getParameterByName('utm_campaign', url),
      'myapp.network': getParameterByName('utm_network', url),
      'myapp.gclid': getParameterByName('gclid', url),
      'myapp.fbclid': getParameterByName('fbclid', url),
      'myapp.s_kwcid': getParameterByName('s_kwcid', url),
      'myapp.content': getParameterByName('utm_content', url),
      'myapp.adgroup_id': getParameterByName('adgroup_id', url),
      'myapp.keyword': getParameterByName('keyword', url),
      '&&events': 'event27',
    };

    setAdjustTrackerTokens(lifecycleParams);
    AsyncStorage.setItem(
      '@AdjusttrackerTokens',
      JSON.stringify(adjustTrackerTokens),
    );
    trackStateAdobe('myapp.campaignTrack', lifecycleParams);
  };

  const setAppSession = async () => {
    AsyncStorage.getItem('@appSessions')
      .then(res => {
        AsyncStorage.setItem('@appSessions', `${+res + 1}` || '1');
      })
      .catch(e => {
        AsyncStorage.setItem('@appSessions', 1);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={'grey'} barStyle={'light-content'} />
      <Provider store={store}>
        <NetworkModal />
        <Routes />
      </Provider>
    </SafeAreaView>
  );
};

export default App;
