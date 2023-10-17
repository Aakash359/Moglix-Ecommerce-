import React, {useState} from 'react';
import {Image, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginFromHome = props => {
  const [close, setClose] = useState(false);
  return (
    <>
      {!close ? (
        <View style={styles.signBg}>
          <View style={styles.signInContent}>
            <Image
              source={require('../../assets/images/moglix_app_logo.png')}
              style={styles.moglixLogo}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Auth');
              }}>
              <Text style={styles.signinText}>SIGN IN </Text>
            </TouchableOpacity>
            <Text style={styles.signOtherText}>for the best experience</Text>
          </View>
          <TouchableOpacity
            onPress={() => setClose(true)}
            style={styles.closeArea}>
            <Icon
              style={styles.closeIcon}
              color={'#000'}
              name={'close-circle'}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  signBg: {
    paddingVertical: Dimension.padding12,
    paddingHorizontal: Dimension.padding15,
    borderTopLeftRadius: Dimension.borderRadius8,
    borderTopRightRadius: Dimension.borderRadius8,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    width: Dimension.width20,
    height: Dimension.height30,
    marginLeft: 'auto',
    marginRight:Dimension.margin11,
    alignSelf:'center',
    justifyContent:'center',
  },
  closeIcon: {fontSize: 22},
  signInContent: {flexDirection: 'row', alignItems: 'center'},
  moglixLogo: {
    width: Dimension.width26,
    height: Dimension.width26,
    marginRight: 15,
  },
  signinText: {
    fontSize: Dimension.font14,
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  signOtherText: {
    fontSize: Dimension.font14,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: 3,
  },
});

export default LoginFromHome;
