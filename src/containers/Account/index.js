import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Common/Header';
import styles from './style';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../redux/constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {logout, updateProfile} from '../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchAuth,
  logout as logoutAction,
  updateUser,
} from '../../redux/actions/auth';
import Toast from 'react-native-toast-message';
import EditProfile from '../../components/Common/EditProfile';
import {webEngageUserTracking, trackStateAdobe} from '../../services/analytics';

const AccountScreen = props => {
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const dispatch = useDispatch();
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );

  const onLogout = async () => {
    setLoading(true);
    await logout();
    dispatch(logoutAction());
    dispatch(fetchAuth());
    props.navigation.goBack();
    webEngageUserTracking('logout', {});
    setLoading(false);
    Toast.show({
      type: 'success',
      text2: 'Logged out successfully!',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  useEffect(() => {
    trackStateAdobe('moglix:account dashboard', {
      pageName: 'moglix:account dashboard',
      channel: 'moglix:home',
      subSection: 'moglix:account dashboard',
    });
  }, []);

  const updateProfileData = async userName => {
    let dataForAPI = {
      lname: '',
      pname: userName,
      userid: userId,
    };
    const {data} = await updateProfile(dataForAPI, sessionId, token);
    if (data.status) {
      // let userData = await AsyncStorage.getItem('@user');
      // userData = {
      //   ...userData,
      //   userName,
      // };
      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({...auth, userName: userName}),
      );

      dispatch(updateUser(userName));
      setEditModal(false);
    }
  };

  return (
    <View>
      <Header
        navigation={props.navigation}
        showBack
        showCart
        showWishlist
        showText={'My Account'}
      />
      <View style={styles.accountView}>
        <View style={styles.redStrip}>
          <View style={styles.userIconWrap}>
            <Image
              source={require('../../assets/images/UserIcon.png')}
              style={styles.UserIconImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.userDetail}>
            <View style={styles.nameCol}>
              <Text style={styles.userData}>Name</Text>
              <Text style={styles.userName}>{auth.userName}</Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileBtn}
              disabled={loading}
              onPress={() => setEditModal(!editModal)}>
              <Text style={styles.editProfileBtnText}>EDIT PROFILE</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userDetData}>
          {auth.email ? (
            <View style={[styles.userdetRow, styles.brdBottom]}>
              {auth.email ? (
                <View style={styles.userDataCol}>
                  <Text style={styles.noteHading}>Email</Text>
                  <Text style={styles.noteText} numberOfLines={2}>
                    {auth.email}
                  </Text>
                </View>
              ) : null}
              {auth.email ? (
                <>
                  {auth.emailVerified ? (
                    <TouchableOpacity style={styles.verifiedBtn}>
                      <Text style={styles.verifiedBtnText}>VERIFIED</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      disabled={loading}
                      onPress={() =>
                        props.navigation.push('EmailPhoneVerify', {
                          type: 'email',
                          identity: auth.email,
                        })
                      }
                      style={styles.verifyBtn}>
                      <Text style={styles.verifyBtnText}>VERIFY NOW</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : null}
            </View>
          ) : null}
          <View style={styles.userdetRow}>
            {auth.phone ? (
              <View style={styles.userDataCol}>
                <Text style={styles.noteHading}>Mobile Number</Text>
                <Text style={styles.noteText} numberOfLines={2}>
                  +91-{auth.phone}
                </Text>
              </View>
            ) : null}
            {auth.phone ? (
              <>
                {auth.phoneVerified ? (
                  <TouchableOpacity style={styles.verifiedBtn}>
                    <Text style={styles.verifiedBtnText}>VERIFIED</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={loading}
                    onPress={() =>
                      props.navigation.push('EmailPhoneVerify', {
                        type: 'phone',
                        identity: auth.phone,
                      })
                    }
                    style={styles.verifyBtn}>
                    <Text style={styles.verifyBtnText}>VERIFY NOW</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          disabled={loading}
          style={[styles.profileBlockWrap, styles.row]}
          onPress={() => props.navigation.navigate('ChangePassword')}>
          <MaterialCommunityIcon
            color={colors.PrimaryTextColor}
            name={'lock'}
            size={28}
          />
          <Text style={styles.profileActText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          onPress={onLogout}
          style={styles.profileBlockWrap}>
          <View style={styles.row}>
            <MaterialCommunityIcon
              color={colors.PrimaryTextColor}
              name={'logout'}
              size={28}
            />
            <Text style={styles.profileActText}>Logout</Text>
          </View>
          {loading ? (
            <ActivityIndicator size={'small'} color={colors.PrimaryTextColor} />
          ) : null}
        </TouchableOpacity>
      </View>
      {editModal && (
        <EditProfile
          editModal={editModal}
          setEditModal={setEditModal}
          userName={auth.userName}
          updateProfile={updateProfileData}
        />
      )}
    </View>
  );
};

export default AccountScreen;
