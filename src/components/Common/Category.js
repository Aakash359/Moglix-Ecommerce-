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

// str: item.categoryId,
// type: 'Category',
// category: item.categoryId,
// name: item.categoryName,

const Category = props => {
  const trackAdobe = item => {
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
          : null
        : null);
    var adobeData = {
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
    trackStateAdobe('moglix.home', adobeData);
  };

  const categoryClicked = item => {
    if (props.fromHome) {
      trackAdobe(item);
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
        fromScreen: props.fromScreen || '',
      });
    } else {
      props.navigation.push('Listing', {
        str: item.categoryId,
        type: 'Category',
        category: item.categoryId,
        name: item.categoryName,
      });
    }
  };

  const renderCards = ({item, index}) => {
    if (props.fromScreen == 'Cart' && index < 6) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            item && categoryClicked(item);
          }}
          style={{
            borderRadius: 4,
            backgroundColor: '#fff',
            padding: 8,
            width: '32%',
            marginTop: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            item && categoryClicked(item);
          }}>
          <Image
            // defaultSource={{uri: 'https://via.placeholder.com/150'}}
            source={{
              uri:
                'https://cdn.moglix.com/' +
                (Platform.OS == 'android'
                  ? item.imageWebp || item.imageLink || item.mainImageLink
                  : item.imageLink || item.mainImageLink),
            }}
            style={styles.TopCatImg}
            placeholderStyle={styles.TopCatImg}
          />
          <Text
            style={{
              color: Colors.PrimaryTextColor,
              fontFamily: Dimension.CustomMediumFont,
              fontSize: Dimension.font10,
              marginTop: Dimension.margin10,
              textAlign: 'center',
              flexShrink: 1,
            }}>
            {item.imageTitle || item.categoryName}
          </Text>
        </TouchableOpacity>
      );
    } else if (props.fromScreen != 'Cart') {
      return (
        <TouchableOpacity
          key={index}
          style={{
            width: props.fromScreen == 'Cart' ? '32%' : 'auto',
            marginTop: props.fromScreen == 'Cart' ? 20 : 0,
          }}
          onPress={() => {
            item && categoryClicked(item);
          }}>
          <View
            style={[
              styles.TopCatWrap,
              {
                width: props.fromScreen == 'Cart' ? '100%' : 'auto',
                backgroundColor: props.fromScreen == 'Cart' ? '#fff' : '',
              },
            ]}>
            <View
              style={[
                styles.TopCatImgWrap,
                {width: props.fromScreen == 'Cart' ? '100%' : 'auto'},
              ]}>
              <Image
                // defaultSource={{uri: 'https://via.placeholder.com/150'}}
                source={{
                  uri:
                    'https://cdn.moglix.com/' +
                    (Platform.OS == 'android'
                      ? item.imageWebp || item.imageLink || item.mainImageLink
                      : item.imageLink || item.mainImageLink),
                }}
                style={styles.TopCatImg}
                placeholderStyle={styles.TopCatImg}
              />
            </View>
            <Text style={styles.TopCatName} numberOfLines={2}>
              {item.imageTitle || item.categoryName}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return;
    }
  };

  return (
    <View>
      {props.fromScreen == 'Cart' ? (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {props.data.map((_, k) => renderCards({item: _, index: k}))}
        </View>
      ) : (
        <FlatList
          style={{
            paddingVertical: !props.fromPdp ? Dimension.padding8 : null,
          }}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          removeClippedSubviews={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={props.data || []}
          renderItem={renderCards}
          keyExtractor={(item, index) => `${index}-item`}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},

  TopCatName: {
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font10,
    marginTop: Dimension.margin10,
    maxWidth: Dimension.height60,
    textAlign: 'center',
    flexShrink: 1,
  },

  TopCatImgWrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    // padding: Dimension.padding5,
    // width: Dimension.height60,
    alignItems: 'center',
    marginHorizontal: Dimension.margin1,
  },
  TopCatWrap: {
    alignItems: 'center',
    marginRight: Dimension.margin15,
  },
  TopCatImg: {borderRadius: 8, height: 60, width: 60},
});

export default Category;
