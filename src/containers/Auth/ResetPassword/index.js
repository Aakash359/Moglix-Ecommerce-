import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Header from '../../../components/Common/Header';

const ResetPasswordScreen = props => {
  return (
    <View>
      <Header
        navigation={props.navigation}
        showBack
        showText={'Reset Password'}
      />
      <View style={{margin: 20}}>
        <TouchableOpacity
          style={{
            padding: 20,
            // backgroundColor: 'red',
            borderRadius: 8,
            marginVertical: 20,
          }}>
          <Text style={{alignSelf: 'center', color: 'dodgerblue'}}>
            RESEND OTP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.replace('LoginWithPassword')}
          style={{
            padding: 20,
            backgroundColor: 'red',
            borderRadius: 8,
            marginVertical: 20,
          }}>
          <Text style={{alignSelf: 'center', color: '#fff'}}>CONTINUE</Text>
        </TouchableOpacity>
        <Text style={{color: '#000', alignSelf: 'center'}}>OR</Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Auth')}
          style={{
            padding: 20,
            // backgroundColor: 'red',
            borderRadius: 8,
            marginVertical: 20,
          }}>
          <Text style={{alignSelf: 'center', color: 'doodgerblue'}}>
            BACK TO SIGN IN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
