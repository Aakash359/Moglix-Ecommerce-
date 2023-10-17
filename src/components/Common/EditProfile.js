import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import FloatingLabelInputField from '../Common/FloatingInput';
import Dimension from '../../redux/constants/dimensions';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../redux/constants/colors';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const EditProfile = props => {
  const [name, setName] = useState(props.userName || '');
  const [nameError, setNameError] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      if (name && name.length != 0) {
        setNameError(false);
      } else {
        setNameError(true);
      }
    }
  }, [name]);

  const checkCommonValidation = () => {
    return name && name.length && !nameError;
  };

  return (
    <Modal
      overlayPointerEvents={'auto'}
      isVisible={props.editModal}
      onTouchOutside={() => {
        props.setEditModal(false);
      }}
      onDismiss={() => {
        props.setEditModal(false);
      }}
      coverScreen={true}
      style={styles.modalbg}
      deviceWidth={deviceWidth}
      onBackButtonPress={() => {
        props.setEditModal(false);
      }}
      onBackdropPress={() => {
        props.setEditModal(false);
      }}>
      <View style={styles.modalInner}>
        <View style={styles.modalHeader}>
          <Text style={styles.headText}>Update Profile & Name</Text>
          <TouchableOpacity
            onPress={() => {
              props.setEditModal(false);
            }}>
            <MatIcon name={'close-circle'} size={26} color={'#3c3c3c'} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.subText}>Please provide us your real name.</Text>
          <FloatingLabelInputField
            label={'Enter Name*'}
            value={name}
            onChangeText={text => setName(text)}
          />
          {nameError && (
            <Text style={styles.errorText}>Please enter valid name</Text>
          )}
        </View>
        <TouchableOpacity
          style={
            !checkCommonValidation()
              ? styles.submitButtonDisabled
              : styles.submitButton
          }
          onPress={() => props.updateProfile(name)}
          disabled={!checkCommonValidation()}>
          <Text style={styles.submitButtonText}>UPDATE PROFILE</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    height: Dimension.height40,
    backgroundColor: colors.RedThemeColor,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius6,
    margin: Dimension.margin5,
    marginTop: Dimension.margin20,
  },
  submitButtonText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: '#fff',
  },
  submitButtonDisabled: {
    backgroundColor: colors.ExtralightGrayText,
    height: Dimension.height40,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius6,
    margin: Dimension.margin5,
  },
  modalbg: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalInner: {backgroundColor: '#fff'},
  modalHeader: {
    backgroundColor: colors.brandbg,
    padding: Dimension.padding15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headText: {
    fontSize: Dimension.font18,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomBoldFont,
  },
  subText: {
    fontSize: Dimension.font11,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    marginBottom: Dimension.margin15,
  },
  inputArea: {padding: Dimension.padding15},
  errorText: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRegularFont,
  },
});

export default EditProfile;
