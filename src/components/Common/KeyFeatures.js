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

const KeyFeatures = props => {
  return (
    <>
      <SectionTitle Title={'Key Features'} />
      <View>
        {props.keyFeatures.map((childrenItem, childrenKey) => (
          <View style={styles.row} key={childrenKey}>
            <Icon
              size={5}
              name={'checkbox-blank-circle'}
              color={'rgba(0,0,0,0.9)'}
              style={styles.iconStyle}
            />
            <Text style={styles.TopCatName}>{childrenItem}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: Dimension.padding10,
  },
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
    color: '#000',
    fontFamily: Dimension.CustomLightFont,
    fontSize: Dimension.font12,
    lineHeight: Dimension.font15,
    textTransform: 'capitalize',
    marginLeft: Dimension.margin6,
  },

  TopCatImgWrap: {
    backgroundColor: Colors.LightRedThemeColor,
    borderRadius: 4,
    padding: 3,
    marginRight: Dimension.margin8,
  },

  TopCatImg: {height: Dimension.width24, width: Dimension.width24},
  iconStyle:{marginTop: Dimension.margin5}
});

export default KeyFeatures;
