import React from 'react';
import {Text, View, Platform} from 'react-native';

const JailBroken = () => {
  const device = Platform.OS == 'ios' ? 'JailBroken' : 'Rooted';
  // jail broken
  return (
    <View style={{alignSelf: 'center', flex: 1, justifyContent: 'center'}}>
      <Text style={{alignSelf: 'center', textAlign: 'center'}}>Error</Text>
      <Text style={{alignSelf: 'center', textAlign: 'center'}}>
        {`Your device is ${device}. This app does not support ${device} devices.`}
      </Text>
    </View>
  );
};

export default JailBroken;
