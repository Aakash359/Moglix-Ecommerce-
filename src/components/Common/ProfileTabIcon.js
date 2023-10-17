import React from 'react';
import {useSelector} from 'react-redux';
import {View, Text} from 'react-native';
import Colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileTabIcon = props => {
  const user = useSelector(state => (state.authReducer || {}).data || {});

  return user && user.userName ? (
    <View
      style={{
        borderRadius: 40,
        borderWidth: 2,
        opacity: props.focused ? 1 : 0.4,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingHorizontal: 7,
        // paddingVertical: 1,
        backgroundColor: props.focused ? '#D9232D' : Colors.PrimaryTextColor,
        borderColor: props.focused ? '#D9232D' : Colors.PrimaryTextColor,
      }}>
      <Text
        style={{
          alignSelf: 'center',
          lineHeight: Dimension.font18,
          color: props.focused ? '#fff' : '#fff',
          fontSize: Dimension.font14,
          fontFamily: Dimension.CustomSemiBoldFont,
        }}>
        {user.userName.toUpperCase().substring(0, 1)}
      </Text>
    </View>
  ) : (
    <Icon name={props.iconName} size={26} color={props.color} />
  );
};

export default ProfileTabIcon;
