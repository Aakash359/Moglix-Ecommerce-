import React from 'react';
import {
  Text,
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const HomeOfficeBrand = props => {
  const imageClicked = item => {
    if (props.fromBrand) {
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

    if (item.redirectPageName === 'ListingScreen' && item.redirectPageData) {
      props.navigation.push('Listing', {
        str:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].str,
        type:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].type,
        category: '',
        name: item.imageTitle || item.categoryName,
      });
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
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
          style={styles.homeofficeimage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={props.data}
      style={styles.flatList}
      renderItem={renderItem}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${index}-item`}
    />
  );
};

const styles = StyleSheet.create({
  homeofficeimage: {
    width: Dimension.width120,
    height: Dimension.height160,
    marginBottom: Dimension.margin15,
    borderRadius: Dimension.borderRadius10,
    overflow: 'hidden',
    marginRight: Dimension.padding15,
  },
  flatList: {paddingTop: Dimension.padding10},
});

export default HomeOfficeBrand;
