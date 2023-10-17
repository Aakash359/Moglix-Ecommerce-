import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const FloatingLabelInputField = props => {
  const [isFocused, setIsFocused] = useState(false);
  
  let inputRef = useRef();
  const handleFocus = () => {
    setIsFocused(true);
    if (props.handleFocus) {
      props.handleFocus();
    }
  };

  useEffect(() => {
    handleBlur();
    if (props.autoFocus) {
      handleFocus();
    }
  }, []);

  useEffect(() => {
    if (props.value) {
      handleBlur();
    }
  }, [props.value]);

  const handleBlur = runOnBlur => {
    //for hiding the text if it is empty
    if (props.hideLabel) {
      setIsFocused(true);
    } else {
      if (!props.value) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }
    }
    if (props.onBlur && runOnBlur) {
      props.onBlur();
    }
  };

  const {
    label,
    disabledBorder,
    errorBorder,
    disabledLabel,
    multiline,
    heightStyle,
    inputHeight,
    autoFocus,
  } = props;
  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: !isFocused ? Dimension.height30 : Dimension.width12,
    fontSize: !isFocused ? Dimension.font12 : Dimension.font12,
    color: !isFocused ? colors.lightGrayText : colors.lightGrayText,
    marginLeft: Dimension.margin10,
    marginBottom: !isFocused ?  Dimension.margin20 : 0,
    zIndex: !isFocused ? 0 : 9,
    paddingLeft: !isFocused ? 0 :  Dimension.padding5,
    paddingRight: !isFocused ? 0 : Dimension.padding5,
    backgroundColor: !isFocused ? '#FFF' : '#FFF',
    zIndex: 2,
    fontFamily: Dimension.CustomRegularFont,
  };
  const inputContainer = {
    marginTop: Dimension.margin20,
    //   marginLeft: 10,
    marginRight: Dimension.margin10,
    borderWidth: 1,
    borderRadius: 8,
    fontWeight: Dimension.CustomSemiBoldFont,
    height: Dimension.height40,
    width: '100%',
    backgroundColor: colors.white,
    borderColor: !isFocused ? colors.lightGrayText : colors.lightGrayText,
    borderTopWidth: !isFocused ? 1 : 1,
    zIndex: 1,
    overflow: 'visible',
    position: 'relative',
  };
  const parent = {
    // height: Dimension.height80,
    zIndex: 2,
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (inputRef && inputRef.focus) {
          inputRef.focus();
        }
      }}
      style={parent}>
      <Text style={[labelStyle, disabledLabel]}>{label}</Text>
      <View style={[inputContainer, disabledBorder, errorBorder, heightStyle]}>
        {props.disabled ? (
          <Text style={styles.textInput}>{props.value}</Text>
        ) : (
          <TextInput
            {...props}
            ref={ref => {
              inputRef = ref;
              if (props.getRef) {
                props.getRef(ref);
              }
            }}
            autoFocus={autoFocus}
            style={[styles.textInput, inputHeight]}
            onFocus={handleFocus}
            onBlur={() => handleBlur(true)}
            selectionColor={'#3c3c3c'}
            underlineColorAndroid={'transparent'}
            multiline={multiline}
          />
        )}
        {props.extraView ? props.extraView() : null}
        {props.checkView ? props.checkView() : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: Dimension.height40,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
    color:colors.PrimaryTextColor,
    // borderWidth:1,
    textAlignVertical: 'center',
    // backgroundColor:'#ffff',
    zIndex: 3,
    paddingLeft: Dimension.padding15,
    paddingRight: Dimension.padding15,
  },
});

export default FloatingLabelInputField;
