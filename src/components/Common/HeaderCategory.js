import React from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const HeaderCategory = props => {
  const navigationFn = attr => {
    if (props.fromHome) {
      let code = attr && attr.redirectPageData[0].redirectPageLink;

      var adobeData = {
        'myapp.linkpageName': 'moglix:home',
        'myapp.ctaname': `home_header_category${code}`,
        'myapp.linkName': `home_header_category${code}`,
        '&&events': 'event21',
      };
      let dataTracking = {
        event_type: 'click',
        label: `home_page_click_header_category`,
        channel: 'Home',
        page_type: `home_page`,
      };
      sendClickStreamData(dataTracking);
      trackStateAdobe('moglix.home', adobeData);
    }

    props.navigation.navigate('CategoriesHomePage', {
      code: attr.redirectPageData[0].redirectPageLink,
    });
  };

  return props.data.map((attr, i) => {
    if (i != 0) {
      return (
        <View key={i}>
          <View style={styles.ActiveTopCatWrap}>
            <TouchableOpacity onPress={() => navigationFn(attr)}>
              <Image
                // defaultSource={{uri: 'https://via.placeholder.com/150'}}
                source={{
                  uri:
                    'https://cdn.moglix.com/' +
                    (Platform.OS == 'android'
                      ? attr.imageWebp || attr.imageLink
                      : attr.imageLink),
                }}
                style={styles.TopCatImg}
                placeholderStyle={styles.TopCatImg}
                resizeMode="contain"
              />
              <Text style={styles.TopCatName}>{attr.title}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  });
};

const styles = StyleSheet.create({
  TopCatName: {
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font10,
    textAlign: 'center',
  },
  ActiveTopCatName: {
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font10,
    textAlign: 'left',
  },
  TopCatWrap: {marginLeft: Dimension.margin12, maxWidth: Dimension.width80},
  ActiveTopCatWrap: {
    marginRight: Dimension.margin10,
    marginLeft: Dimension.margin8,
    maxWidth: Dimension.width90,
    marginHorizontal:Dimension.margin10
  },
  TopCatImg: {
    width: Dimension.width50,
    height: Dimension.height50,
    borderRadius: 8,
    marginBottom: 5,
  },
});

export default HeaderCategory;
