import React, {useRef, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../../components/Common/Header';
import queryString from 'query-string';

const WebViewScreen = props => {
  const {params} = props.route;
  let webview = useRef();
  const [payHit, setPayHit] = useState(true);

  const payRazorPay = data => {
    let fp = `
        var corescript = document.createElement('script');
        corescript.type = 'text/javascript';
        corescript.src = "https://checkout.razorpay.com/v1/razorpay.js";
        corescript.onload= ()=>{
          razorpay = new Razorpay({
            key: '${data['razorpay_key']}',
                // logo, we'll display it in payment processing  
            image: 'https://i.imgur.com/n5tjHFD.png',
            callback_url:  '${
              'https://api.moglix.com' + '/paymentRazorPayWallet/success'
            }',
            redirect: true
        }),
        razorpay.once('ready',(response)=> {
          console.log("ready rezorpay!!")  ;
          setTimeout(()=>{
              const razorData = {
                email: '${data['email']}',
                order_id: '${data['order_id']}',
                method: '${data['method']}',
                amount: ${data['amount']},
                contact :'${data['contact']}'`;

    if (data['emi_duration']) {
      fp += ',' + 'emi_duration:' + data['emi_duration'];
    }
    if (data['save']) {
      fp += ',save:' + data['save'];
    }
    if (data['bank']) {
      fp += ",bank:'" + data['bank'] + "'";
    }
    if (data['customer_id']) {
      fp += ", customer_id:'" + data['customer_id'] + "'";
    }
    if (data['wallet']) {
      fp += ", wallet:'" + data['wallet'] + "'";
    }
    if (data['vpa']) {
      fp += ", vpa:'" + data['vpa'] + "'";
    }
    if (data['token']) {
      fp += ", token:'" + data['token'] + "'";
    }
    if (data['ccname']) {
      fp += ",card:{name:'" + data['ccname'] + "'";
    }
    if (data['ccvv']) {
      fp += ',cvv:' + data['ccvv'];
    }
    if (data['ccexpyr']) {
      fp += ',expiry_year:' + data['ccexpyr'];
    }
    if (data['ccexpmon']) {
      fp += `, expiry_month:  '${String(data['ccexpmon'])}'`;
    }
    if (data['ccnum']) {
      fp += ', number:' + data['ccnum'];
      fp += '}';
    }
    fp += `};
            razorpay.createPayment(razorData);  
            const that = this;       
            razorpay.on('payment.success', function(resp) {
              console.log(resp)
            })
            razorpay.on('payment.error', function(resp){
                alert(resp.error.description)
                console.log(resp.error);
            });
            }, 0);
        });
        }
        var parent = document.getElementsByTagName('head').item(0);
        parent.appendChild(corescript);
        void(0);
    `;

    console.log(fp, 'ewtcfdeydfewdytewd');
    if (webview && payHit) {
      setPayHit(false);
      webview.current.injectJavaScript(fp);
    }
  };

  const orderFailure = url => {
    let queryParams = url.split('?')[1];
    let queryObj = queryString.parse(queryParams);
    if (!queryObj.orderAmount && queryObj.transactionAmount) {
      queryObj.orderAmount = queryObj.transactionAmount;
    }
    // let queryObj = JSON.parse('{"' + decodeURI(queryParams.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    let response = {
      response: {
        data: {
          data: queryObj,
        },
      },
    };
    props.navigation.navigate('Failure', {
      onGoBack: props.navigation.goBack(),
      response: response,
    });
  };

  const orderSuccessful = url => {
    let queryParams = url.split('?')[1];
    let queryObj = queryString.parse(queryParams);
    if (!queryObj.orderAmount && queryObj.transactionAmount) {
      queryObj.orderAmount = queryObj.transactionAmount;
    }
    // let queryObj = JSON.parse('{"' + decodeURI(queryParams.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    let response = {
      response: {
        data: {
          data: queryObj,
        },
      },
    };
    props?.navigation?.navigateAndReset
      ? props.navigation.navigateAndReset('Success', {
          response: response,
        })
      : null;
  };

  if (props.route.params.fromPayment) {
    return (
      <View style={{flex: 1}}>
        <Header
          navigation={props.navigation}
          showBack
          showText={props.route.params.title || ''}
        />

        <WebView
          ref={webview}
          originWhitelist={['*']}
          source={{html: props.route.params.htmlString}}
          style={{marginTop: 20}}
          onLoad={() => {
            if (payHit) {
              props.route.params.invoiceType &&
              props.route.params.invoiceType == 'tax'
                ? payRazorPay(props.route.params.data)
                : '';
            }
          }}
          onNavigationStateChange={navState => {
            if (
              navState &&
              navState.url &&
              navState.url.indexOf('order-confirmation?') > -1
            ) {
              setPayHit(true);
              orderSuccessful(navState.url);
            } else if (
              navState &&
              navState.url &&
              navState.url.indexOf('://api') === -1 &&
              (navState.url.indexOf('.moglilabs.com') > -1 ||
                navState.url.indexOf('moglix.com') > -1)
            ) {
              setPayHit(true);
              orderFailure(navState.url);
            }
            // Keep track of going back navigation within component
            // this.canGoBack = navState.canGoBack;
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <Header
          navigation={props.navigation}
          showBack
          showText={params.title || ''}
        />
        <WebView
          source={{uri: props.route.params.url}}
          style={{marginTop: -50}}
        />
      </View>
    );
  }
};

export default WebViewScreen;
// uri: props.route.params.url ||
