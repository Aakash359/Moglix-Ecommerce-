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
import {background, marginRight} from 'styled-system';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const Brands = props => {
  const brandClicked = item => {
    if (props.fromHome) {
      let code =
        props.component.componentName +
        '_' +
        item.redirectPageName +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].type
            : ''
          : '') +
        '_' +
        item.redirectPageData[0].str;
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
          (item.redirectPageData &&
            item.redirectPageData[0] &&
            item.redirectPageData[0].category) ||
          '',
        fromScreen: props.fromScreen || '',
      });
    }
  };
  const renderCards = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          item && brandClicked(item);
        }}>
        <View style={styles.BrandWrap}>
          <View style={styles.BrandImgWrap}>
            <Image
              source={{
                uri:
                  'https://cdn.moglix.com/' +
                  (Platform.OS == 'android'
                    ? item.imageWebp || item.imageLink
                    : item.imageLink),
              }}
              style={styles.BrandIconImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.BrandText}>
            {item.imageTitle || item.brandName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.listView}>
      <FlatList
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        removeClippedSubviews={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.data || []}
        renderItem={renderCards}
        keyExtractor={(item, index) => `${index}-item`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
  listView: {flex: 1,marginLeft:10},
  BrandWrap: {
    alignItems: 'center',
    padding: Dimension.padding5,
  },
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
});

export default Brands;
