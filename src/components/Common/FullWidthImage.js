import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const FullWidthImage = props => {
  const imageClicked = item => {
    if (props.fromHome) {
      let code =
        props.data.componentName +
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
        label: `home_page_click_${props.data.componentName}`,
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
        filterObj:
          (item.redirectPageData &&
            item.redirectPageData[0] &&
            item.redirectPageData[0].filterObj) ||
          [],
      });
    }
  };

  const renderItem = ({item, index}) => {
    var horizontalPadding = Dimension.padding15;
    var ImageWidth = Dimensions.get('window').width - Dimension.padding30;
    if (props.data.hasOwnProperty('hPadding')) {
      if (props.data.hPadding) {
        horizontalPadding = Dimension.padding15;
        ImageWidth = Dimensions.get('window').width - Dimension.padding30;
      } else {
        horizontalPadding = 0;
        ImageWidth = Dimensions.get('window').width;
      }
    }
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.fullWidthHeadingImage,
          {paddingHorizontal: horizontalPadding},
        ]}
        onPress={() => {
          item && imageClicked(item);
        }}>
        <Image
          source={{
            uri:
              'https://cdn.moglix.com/' +
              (Platform.OS == 'android'
                ? item.imageWebp || item.imageLink
                : item.imageLink),
          }}
          style={{
            height:
              item.imageSize == 'Full'
                ? 326
                : item.imageSize == 'Quarter'
                ? 50
                : 170,
            // borderRadius: 8,
            // marginTop: 8,
            width: ImageWidth,
          }}
          resizeMode="cover"
          placeholderStyle={[
            styles.fullWidthBanner,
            {
              height:
                item.imageSize == 'Full'
                  ? 326
                  : item.imageSize == 'Quarter'
                  ? 70
                  : 170,
              borderRadius: 8,
            },
          ]}
          key={index}
        />
      </TouchableOpacity>
    );
  };

  const renderItemList = ({item, index}) => {
    var horizontalPadding = Dimension.padding15;
    var ImageWidth = Dimensions.get('window').width - Dimension.padding30;
    if (props.data.hasOwnProperty('hPadding')) {
      if (props.data.hPadding) {
        horizontalPadding = Dimension.padding15;
        ImageWidth = Dimensions.get('window').width - Dimension.padding30;
      } else {
        horizontalPadding = 0;
        ImageWidth = Dimensions.get('window').width;
      }
    }

    return (
      <TouchableOpacity
        key={index}
        style={[styles.imgWrapforbrandstore]}
        onPress={() => {
          item && imageClicked(item);
        }}>
        <View style={styles.brandStoreImageView}>
          <Image
            source={{
              uri:
                'https://cdn.moglix.com/' +
                (Platform.OS == 'android'
                  ? item.imageWebp || item.imageLink
                  : item.imageLink),
            }}
            style={[
              styles.imgforbrandstore,
              {
                height:
                  item.imageSize == 'Full'
                    ? Dimension.height270
                    : item.imageSize == 'Quarter'
                    ? 70
                    : Dimension.height142,
                borderRadius: 4,
              },
            ]}
            resizeMode="contain"
            key={index}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.listView}>
      <FlatList
        data={props.data && props.data.data}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={
          props.data && props.data.data.length === 1
            ? renderItem
            : renderItemList
        }
        keyExtractor={(item, index) => `${index}-item`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgWrap: {
    justifyContent: 'center',
    marginLeft: Dimension.margin15,
    width:
      Dimensions.get('window').width <= 375
        ? Dimensions.get('window').width - Dimension.padding30
        : null,
  },

  row: {flexDirection: 'row'},
  fullWidthBanner: {
    width: Dimensions.get('window').width - Dimension.padding30,
  },

  imgWrapforbrandstore: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 0,
    paddingTop: Dimension.padding15,
  },
  imgforbrandstore: {marginRight: 0, marginLeft: 0},
  fullWidthHeadingImage: {
    // paddingBottom: 10,
    // bottom:8,
  },
  brandStoreImageView: {
    width: Dimensions.get('window').width - Dimension.padding45,
    paddingLeft: 0,
    marginLeft: 0,
    marginRight: Dimension.padding12,
  },
  listView: {
    flex: 1,
  },
});

export default FullWidthImage;
