import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const HalfWidthImage = props => {
  const imageClicked = item => {
    if (props.fromHome) {
      let code =
        props.component.componentName +
        '_' +
        item.redirectPageName +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].category
            : ''
          : '') +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].type
            : ''
          : '') +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].str
            : ''
          : '');
      let adobeData = {
        'myapp.linkpageName': 'moglix:home',
        'myapp.ctaname': code,
        'myapp.linkName': code,
        '&&events': 'event21',
      };
      let dataTracking = {
        event_type: 'click',
        label: `home_page_click_${props.component.componentName}`,
        channel: 'Home',
        page_type: `home_page`,
      };
      sendClickStreamData(dataTracking);
      trackStateAdobe('moglix:home', adobeData);
    }

    if (item.redirectPageName === 'ListingScreen') {
      props.navigation.push('Listing', {
        str:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].str,
        type:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].type,
        category:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].category,
        name: item.imageTitle || item.categoryName,
      });
    }
  };

  let MarginLeft = Dimension.margin15;
  if (props.data.hasOwnProperty('hPadding')) {
    if (props.data.hPadding) {
      MarginLeft = Dimension.margin15;
    } else {
      MarginLeft = 0;
    }
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.halfWidthImgWrap}
        onPress={() => {
          props.data[0] && imageClicked(props.data[0]);
        }}>
        <Image
          // defaultSource={{uri: 'https://via.placeholder.com/150'}}
          source={{
            uri:
              'https://cdn.moglix.com/' +
              (Platform.OS == 'android'
                ? props.data[0].imageWebp || props.data[0].imageLink
                : props.data[0].imageLink),
          }}
          style={styles.fullWidthBanner}
          placeholderStyle={styles.fullWidthBanner}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.halfWidthImgWrap, {marginLeft: MarginLeft}]}
        onPress={() => {
          props.data[1] && imageClicked(props.data[1]);
        }}>
        <Image
          // defaultSource={{uri: ''}}
          source={{
            uri:
              'https://cdn.moglix.com/' +
              (Platform.OS == 'android'
                ? props.data[1].imageWebp || props.data[1].imageLink
                : props.data[1].imageLink),
          }}
          style={styles.fullWidthBanner}
          placeholderStyle={styles.fullWidthBanner}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1, marginBottom: Dimension.margin15},
  halfWidthImgWrap: {
    flex: 1,
    borderRadius: Dimension.borderRadius6,
    overflow: 'hidden',
  },
  fullWidthBanner: {
    height: Dimension.HomePageHalfWidthBannerHeight,
    width: Dimension.width141,
  },
  LeftMargin: {marginLeft: Dimension.margin15},
});

export default HalfWidthImage;
