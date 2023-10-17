import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import FloatingLabelInputField from '../../../components/Common/FloatingInput';
import {changePasswordApi} from '../../../services/user';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../../components/Common/Header';
import Toast from 'react-native-toast-message';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';

const ChangePasswordScreen = props => {
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const [email, setEmail] = useState(auth.email || '');
  const [phone, setPhone] = useState(auth.phone || '');
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currPasswordError, setCurrPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [inputType, setInputType] = useState(true);
  const [inputPassType, setInputPassType] = useState(true);
  const [inputCPassType, setInputCPassType] = useState(true);
  const [init, setInit] = useState(false);

  const passwordDetails = [
    {
      title: 'Mobile Number*',
      state: phone,
      disabled: true,
      onChange: text => setPhone(text),
      errorText: 'Kindly enter your phone number',
    },
    {
      title: 'Email*',
      state: email,
      disabled: true,
      onChange: text => setEmail(text),
      errorText: 'Kindly enter valid email',
    },

    {
      title: 'Current Password*',
      state: currPassword,
      disabled: false,
      onChange: text => setCurrPassword(text),
      errorState: currPasswordError,
      secureTextEntry: inputType,
      setSecuretext: setInputType,
      errorText: 'Password should be minimum of 8 characters',
    },
    {
      title: 'New Password*',
      state: newPassword,
      disabled: false,
      onChange: text => setNewPassword(text),
      errorState: newPasswordError,
      secureTextEntry: inputPassType,
      setSecuretext: setInputPassType,
      errorText: 'Password should be minimum of 8 characters',
      emptyPasswordState: emptyPasswordError,
      emptyPasswordErrorText: 'Password cannot be empty',
      onBlur: onBlurPassword,
    },
    {
      title: 'Confirm Password*',
      state: confirmPassword,
      disabled: false,
      secureTextEntry: inputCPassType,
      setSecuretext: setInputCPassType,
      onChange: text => setConfirmPassword(text),
      errorState: confirmPasswordError,
      errorText: 'Make sure both passwords are same',
    },
  ];

  const onBlurPassword = async () => {
    if (currPassword && currPassword.length > 7) {
      setNewPassword(false);
    } else {
      if (currPassword && currPassword.length > 0) {
        setNewPassword(true);
      }
    }
  };

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      if (currPassword && currPassword.length && currPassword.length > 7) {
        setCurrPasswordError(false);
      } else if (
        currPassword &&
        currPassword.length &&
        currPassword.length < 8
      ) {
        setCurrPasswordError(true);
      } else {
        setCurrPasswordError(true);
      }
    }
  }, [currPassword]);

  useEffect(() => {
    if (init) {
      if (newPassword && newPassword.length && newPassword.length > 7) {
        setNewPasswordError(false);
      } else if (
        newPassword &&
        newPassword.length &&
        newPassword.length > 0 &&
        newPassword.length < 8
      ) {
        setEmptyPasswordError(false);
        setNewPasswordError(true);
      } else {
        setNewPasswordError(false);
        setEmptyPasswordError(true);
      }
    }
  }, [newPassword]);

  useEffect(() => {
    if (init) {
      if (
        confirmPassword &&
        confirmPassword.length &&
        confirmPassword.length > 7 &&
        confirmPassword == newPassword
      ) {
        setConfirmPasswordError(false);
      } else if (
        (confirmPassword &&
          confirmPassword.length &&
          confirmPassword.length < 8) ||
        confirmPassword != newPassword
      ) {
        setConfirmPasswordError(true);
      } else {
        setConfirmPasswordError(true);
      }
    }
  }, [confirmPassword]);

  const renderInputText = ({
    onChange,
    onBlur,
    disabled,
    title,
    state,
    errorState,
    extra,
    errorText,
    emptyPasswordState,
    emptyPasswordErrorText,
    keyboardType,
    maxLength,
    component,
    secureTextEntry,
    setSecuretext,
    style,
  }) => {
    return (
      <View key={title} style={styles.FloatView}>
        {title == 'Email*' ? (
          <FloatingLabelInputField
            label={title}
            onChangeText={text => onChange(text)}
            value={state}
            disabled={disabled}
            onBlur={onBlur}
            keyboardType={keyboardType}
          />
        ) : title == 'Mobile Number*' ? (
          <FloatingLabelInputField
            label={title}
            onChangeText={text => onChange(text)}
            value={state}
            disabled={disabled}
            onBlur={onBlur}
            keyboardType={keyboardType}
          />
        ) : (
          <FloatingLabelInputField
            label={title}
            onChangeText={text => onChange(text)}
            value={state}
            disabled={disabled}
            secureTextEntry={secureTextEntry}
            onBlur={onBlur}
            keyboardType={keyboardType}
            extraView={() => (
              <TouchableOpacity
                onPress={() => setSecuretext(!secureTextEntry)}
                style={styles.passIcon}>
                <MatIcon
                  name={'eye'}
                  color={secureTextEntry ? '#979797' : '#000'}
                  size={22}
                />
              </TouchableOpacity>
            )}
          />
        )}

        {errorState ? (
          <Text style={{color: 'red', fontSize: 12}}>{errorText}</Text>
        ) : null}
        {emptyPasswordState ? (
          <Text style={{color: 'red', fontSize: 12}}>
            {emptyPasswordErrorText}
          </Text>
        ) : null}
      </View>
    );
  };

  const changePassword = async () => {
    let reqObj = {
      idCustomer: auth.userId,
      newPassword,
      oldPassword: currPassword,
      type: 'c',
    };
    let {data} = await changePasswordApi(reqObj, sessionId, token);
    if (
      data.status == 'Password changed successfully' &&
      data.statusCode == 200
    ) {
      Toast.show({
        type: 'success',
        text2: 'Password changed successfully',
        visibilityTime: 2000,
        autoHide: true,
      });
      props.navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text2: data.status,
      });
    }
  };

  const checkCommonValidation = () => {
    return (
      currPassword &&
      currPassword.length &&
      currPassword.length > 7 &&
      !currPasswordError &&
      newPassword &&
      newPassword.length &&
      newPassword.length > 7 &&
      !newPasswordError &&
      confirmPassword &&
      confirmPassword.length &&
      confirmPassword.length > 7 &&
      !confirmPasswordError
    );
  };

  const checkValidation = () => {
    if (checkCommonValidation()) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <View>
      <Header
        showBack
        showText={`Change Password`}
        navigation={props.navigation}
        showWishlist
        showCart
      />
      {passwordDetails.map((_, k) => renderInputText(_))}
      <View style={{backgroundColor: '#fff'}}>
        <TouchableOpacity
          onPress={changePassword}
          disabled={checkValidation()}
          style={[
            {
              backgroundColor: !checkCommonValidation() ? '#C4C4C4' : '#D9232D',
            },
            styles.changePassBtn,
          ]}>
          <Text style={styles.changePassText}>SAVE CHANGES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
