import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SectionTitle from './SectionTitle';

const ReturnPolicy = props => {
  const TABS_DATA = [
    {
      icon: 'keyboard-return',
      title: '7 days return window',
      url: 'https://www.moglix.com/faq?device=app',
      imageicon: require('../../assets/images/Return7.png'),
    },
    {
      icon: 'text-box-remove',
      title: 'Wrong Products',
      url: 'https://www.moglix.com/faq?device=app',
      imageicon: require('../../assets/images/WrongPrd.png'),
    },
    {
      icon: 'checkbox-blank-off',
      title: 'Faulty Products',
      url: 'https://www.moglix.com/faq?device=app',
      imageicon: require('../../assets/images/faultyPrd.png'),
    },
    {
      icon: 'thumb-down',
      title: 'Quality Issue',
      url: 'https://www.moglix.com/faq?device=app',
      imageicon: require('../../assets/images/QualityIssue.png'),
    },
  ];

  return (
    <View style={styles.policyView}>
      <SectionTitle Title={'Return Policy'} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {TABS_DATA.map((childrenItem, childrenKey) => (
            <TouchableOpacity
              key={childrenKey}
              onPress={() =>
                props.navigation.navigate('WebView', {
                  title: 'FAQs',
                  url: childrenItem.url,
                })
              }>
              <View style={styles.TopCatWrap}>
                <View style={styles.TopCatImgWrap}>
                  <Image
                    source={childrenItem.imageicon}
                    style={styles.ImageIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.TopCatName}>{childrenItem.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  TopCatWrap: {
    alignItems: 'center',
    marginRight: Dimension.margin15,
    backgroundColor: '#fff',
    alignContent: 'center',
    padding: Dimension.padding5,
    marginTop: Dimension.margin5,
    flexDirection: 'row',
  },
  TopCatName: {
    color: Colors.blueShade,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  TopCatImgWrap: {
    backgroundColor: Colors.LightRedThemeColor,
    borderRadius: 4,
    padding: 3,
    marginRight: Dimension.margin8,
  },

  TopCatImg: {height: Dimension.width24, width: Dimension.width24},
  policyView: {
    backgroundColor: '#fff',
    padding: Dimension.padding12,
    marginTop: Dimension.margin10,
  },
  ImageIcon: {width: Dimension.width18, height: Dimension.width18},
});

export default ReturnPolicy;
