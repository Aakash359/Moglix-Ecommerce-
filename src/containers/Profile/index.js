import React, {useEffect} from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Linking,
} from 'react-native';
import {OrderedMap} from 'immutable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import Header from '../../components/Common/Header';
import {useDispatch, useSelector} from 'react-redux';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const ProfileScreen = props => {
  const PROFILE_TABS = new OrderedMap({
    personal: {
      id: 'personal',
      children: [
        {
          title: 'My Orders',
          icon: 'text-box',
          componentName: 'Orders',
        },
        {
          title: 'My RFQs',
          icon: 'note-text',
          componentName: 'RFQ',
        },
        {
          title: 'Wishlist',
          icon: 'heart',
          isLast: true,
          componentName: 'Wishlist',
        },
      ],
    },
    businessDetails: {
      id: 'businessDetails',
      children: [
        {
          title: 'Business Details',
          icon: 'trello',
          componentName: 'BusinessDetails',
        },
      ],
    },
    contact: {
      id: 'contact',
      children: [
        {
          icon: 'help-circle',
          // url: 'https://www.moglix.com/faq?device=app',
          title: "FAQ's",
          componentName: 'FaqScreen',
        },
        {
          title: 'Contact Us',
          icon: 'card-account-details',
          isLast: true,
          // url: 'https://www.moglix.com/contact?device=app',
          componentName: 'ContactScreen',
        },
      ],
    },
    info: {
      id: 'info',
      children: [
        {
          title: 'Share App',
          icon: 'share-variant',
          hasFunction: true,
          callFunction: () => onShare(),
        },
        {
          title: 'About Us',
          icon: 'information',
          url: 'https://www.moglix.com/about?device=app',
          title: 'About Us',
        },
        {
          title: 'Privacy Policy',
          icon: 'privacy-tip',
          isLast: true,
          url: 'https://www.moglix.com/privacy?device=app',
          title: 'Privacy Policy',
          iconType: 'MatIcon',
        },
      ],
    },
    partnership: {
      id: 'partnership',
      children: [
        {
          title: 'Become a Supplier',
          icon: 'server',
          isLast: true,
          hasFunction: true,
          callFunction: () => Linking.openURL('https://supplier.moglix.com/'),
          // url: 'https://supplier.moglix.com/',
          title: 'Become a Seller',
        },
      ],
    },
  });

  const onShare = () => {
    Share.share({
      message:
        Platform.OS == 'android'
          ? 'Hi, I heartily recommend Moglix App for all your business needs and purchases. Click and download now! ' +
            'https://play.google.com/store/apps/details?id=com.moglix.online&referrer=utm_source%3Dapplink%26utm_medium%3Dshare%26utm_campaign%3Dreferral'
          : 'Hi, I heartily recommend Moglix App for all your business needs and purchases. Click and download now! ' +
            'https://apps.apple.com/in/app/moglix-best-industrial-app/id1493763517',
    })
      .then(user => {})
      .catch(err => {
        console.log('WRONG share', err);
      })
      .done();
  };

  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );
  const auth = useSelector(state => (state.authReducer || {}).data || {});

  const dispatch = useDispatch();

  useEffect(() => {
    trackStateAdobe('moglix:my profile', {
      pageName: 'moglix:my profile',
      channel: 'moglix:home',
      subSection: 'moglix:my profile',
    });
    clickStreamPageLoad();
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'my_profile',
      channel: 'Dashboard',
    };
    sendClickStreamData(dataTracking);
  };

  const renderSearch = () => (
    <View style={styles.searchView}>
      <View style={styles.searchViewInner}>
        <TouchableOpacity style={styles.searchIconWrap} onPress={() => {}}>
          <Icon
            name="magnify"
            style={[styles.voiceIconCss, {color: '#979797'}]}
          />
        </TouchableOpacity>
        <Text style={styles.searcinputText} onPress={() => {}}>
        Search Product or Brand
        </Text>
      </View>
      <FAIcon
        name="microphone"
        style={styles.voiceIconCss}
        onPress={() => {}}
      />
    </View>
  );

  const renderHeader = () => (
    <Header
      navigation={props.navigation}
      // showBack
      showWishlist
      showSearch
      // showLogo
      showLargeSearch
      showCart
      // showBackToHome
      // showName
    />
  );

  return (
    <View style={styles.pageView}>
      {renderHeader()}
      <ScrollView style={styles.scrollView}>
        {authenticated != 'true' ? (
          <View style={styles.ProfileTop}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Auth')}
              style={styles.redCard}>
              <Text style={styles.redCardText}>Sign In/Sign Up</Text>
              <Icon name={'chevron-right'} style={{color: '#fff'}} size={22} />
            </TouchableOpacity>
            <Text style={styles.signInSuggestionText}>
              Track your orders, use wishlist, get exciting offers and more.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Account')}
            style={styles.accountView}>
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
                  <Text style={styles.userName}>{auth.userName}</Text>
                  <Icon
                    name={'chevron-right'}
                    style={{color: '#fff'}}
                    size={24}
                  />
                </View>
                {auth.email ? (
                  <View style={styles.usrDet}>
                    <Icon
                      name={
                        !auth.emailVerified
                          ? 'close-circle'
                          : 'checkbox-marked-circle'
                      }
                      style={{color: 'rgba(255,255,255,.80)'}}
                      size={20}
                    />
                    <Text style={styles.usrDetText}>{auth.email}</Text>
                  </View>
                ) : null}
                {auth.phone ? (
                  <View style={styles.usrDet}>
                    <Icon
                      name={
                        !auth.phoneVerified
                          ? 'close-circle'
                          : 'checkbox-marked-circle'
                      }
                      style={{color: 'rgba(255,255,255,.80)'}}
                      size={20}
                    />
                    <Text style={styles.usrDetText}>+91 - {auth.phone}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            {!auth.emailVerified && auth.email ? (
              <View style={styles.noterow}>
                <Text style={styles.noteText}>
                  <Text style={styles.noteHading}>Note : </Text>
                  You Email ID is still not verified yet. Please verify now.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.push('EmailPhoneVerify', {
                      type: 'email',
                      identity: auth.email,
                    })
                  }
                  style={styles.verifyBtn}>
                  <Text style={styles.verifyBtnText}>VERIFY NOW</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </TouchableOpacity>
        )}

        {PROFILE_TABS.map((item, index) =>
          ['personal', 'businessDetails'].includes(index) &&
          authenticated != 'true' ? null : (
            <View key={index} style={styles.profileTabs}>
              {item.children.map((childrenItem, childrenKey) =>
                [
                  'Wishlist',
                  'My Orders',
                  'My RFQs',
                  'Business Details',
                ].includes(childrenItem.title) &&
                authenticated != 'true' ? null : (
                  <TouchableOpacity
                    key={childrenKey}
                    onPress={() =>
                      childrenItem.hasFunction
                        ? childrenItem.callFunction()
                        : childrenItem.url
                        ? props.navigation.navigate('WebView', {
                            title: childrenItem.title,
                            url: childrenItem.url,
                            fromPayment: false,
                          })
                        : props.navigation.navigate(childrenItem.componentName)
                    }
                    style={[
                      styles.profileClick,
                      {
                        borderBottomWidth: childrenItem.isLast ? 0 : 0.8,
                      },
                    ]}>
                    {childrenItem.iconType ? (
                      <MatIcon
                        size={24}
                        style={{color: '#525050'}}
                        name={childrenItem.icon}
                      />
                    ) : (
                      <Icon
                        size={24}
                        style={{color: '#525050'}}
                        name={childrenItem.icon}
                      />
                    )}
                    <Text style={styles.profileText}>{childrenItem.title}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          ),
        ).toList()}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
