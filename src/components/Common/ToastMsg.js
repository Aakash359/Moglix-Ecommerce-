import React, {useState} from 'react';
import {
  Text,
  View, 
  StyleSheet
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';


const ToastMsg = props => {
  const {toastMessage} = props;
  return (
    <View style={styles.msgWrap} >
        <Text style={styles.msgText}>{toastMessage}</Text>
    </View>
 );
};

const styles = StyleSheet.create({
  msgWrap:{position:'absolute',top:40,left:15,right:15,zIndex:2, alignItems:'center', backgroundColor:colors.PrimaryTextColor,borderRadius:Dimension.borderRadius8,paddingHorizontal:Dimension.padding10,paddingVertical:Dimension.padding10},
  msgText:{fontSize:Dimension.font12, color:'#fff', fontFamily:Dimension.CustomSemiBoldFont}
});

export default ToastMsg;
