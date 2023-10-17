import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  ImageBackground,
  StyleSheet,
  Text,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';

const IMG_BASE_URL = 'https://img.moglimg.com';

const SalesTimer = props => {
  const [hours, sethours] = useState('00');
  const [minutes, setminutes] = useState('00');
  const [seconds, setseconds] = useState('00');
  const [timeOver, settimeOver] = useState(false);

  useEffect(() => {
    if (props.data[0] && props.data[0].timerEnd) {
      var time = props.data[0].timerEnd;
      time = parseInt(time);
      var countDownDate = new Date(time);
      var handleInterval = setInterval(function () {
        var now = new Date().getTime();
        var timeleft = countDownDate - now;
        if (timeleft < 0) {
          settimeOver(true);
        }
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        sethours(
          String(
            Math.floor(
              (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + days * 24,
            ),
          ),
        );
        setminutes(
          String(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))),
        );
        setseconds(String(Math.floor((timeleft % (1000 * 60)) / 1000)));
      }, 1000);
    } else {
      settimeOver(true);
    }
  });

  const navigateToListing = () => {
    props.data[0].redirectPageData[0]
      ? props.navigation.navigate(
          'ListingScreen',
          props.data[0].redirectPageData[0],
        )
      : console.log('no data');
  };

  const renderCards = () => {
    var data = props.data[0];
    let hour1 = hours.substring(0, 1);
    let hour2 = hours.substring(1, 2);
    let minute1 = minutes.substring(0, 1);
    let minute2 = minutes.substring(1, 2);
    let second1 = seconds.substring(0, 1);
    let second2 = seconds.substring(1, 2);
    if (timeOver || !data) {
      return null;
    }
    navigateToListing;
    return (
      <TouchableOpacity>
        <ImageBackground
          source={{
            uri:
              IMG_BASE_URL +
              (Platform.OS == 'android'
                ? data.imageWebp || data.imageLink
                : data.imageLink),
          }}
          style={styles.TimerSalesImg}
          resizeMode="cover"
          imageStyle={styles.backgroundStyle}>
          <View style={styles.textWrap}>
            <Text style={styles.comingTxt}>{data.title}</Text>
            <View style={{flexDirection: 'row'}}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.timerText}>{hour2 ? hour1 : 0}</Text>
                  <Text style={[styles.timerText, styles.righttimertext]}>
                    {hour2 ? hour2 : hour1}
                  </Text>
                </View>
                <Text style={styles.timetype}>HOURS</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.timerText}>{minute2 ? minute1 : 0}</Text>
                  <Text style={styles.timerText}>
                    {minute2 ? minute2 : minute1}
                  </Text>
                </View>
                <Text style={styles.timetype}>MINS</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.timerText}>{second2 ? second1 : 0}</Text>
                  <Text style={styles.timerText}>
                    {second2 ? second2 : second1}
                  </Text>
                </View>
                <Text style={styles.timetype}>SEC</Text>
              </View>
            </View>
            <Text style={styles.discountText}>{data.bottomText1}</Text>
            <Text style={styles.LightText}>{data.bottomText2}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return renderCards();
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},

  BrandWrap: {alignItems: 'center', marginLeft: Dimension.margin15},
  BrandImgWrap: {
    width: 70,
    height: 70,
    borderColor: '#FFE6E8',
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Dimension.padding10,
  },
  BrandIconImg: {width: '100%', height: '100%', maxHeight: 50},
  BrandText: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
    marginTop: Dimension.margin10,
    maxWidth: 60,
    textAlign: 'center',
  },

  TimerSalesImg: {width: '100%', height: Dimension.height200},
  backgroundStyle: {resizeMode: 'cover', alignSelf: 'flex-start', flex: 1},
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding20,
    backgroundColor: 'rgba(0,0,0,0.54)',
    height: Dimension.height200,
  },
  comingTxt: {
    color: Colors.orangeShade,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginBottom: Dimension.margin5,
  },
  discountText: {
    color: '#fff',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  LightText: {
    color: '#fff',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  timerText: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    backgroundColor: '#fff',
    height: Dimension.height30,
    paddingVertical: Dimension.padding5,
    textAlignVertical: 'center',
    width: Dimension.width18,
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    borderRadius: 4,
    textAlign: 'center',
    marginRight: Dimension.margin5,
  },
  colon: {
    width: Dimension.width12,
    height: Dimension.height28,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: Dimension.font16,
    color: Colors.orangeShade,
  },
  righttimertext: {marginRight: 0},
  timetype: {
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font8,
    color: '#fff',
    textAlign: 'center',
    paddingTop: Dimension.padding5,
    paddingBottom: Dimension.padding10,
  },
});

export default SalesTimer;
