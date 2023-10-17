import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Share,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import Dimension from '../../redux/constants/dimensions';
import VoiceSearch from './VoiceSearchModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {isBrandCategory} from '../../services/search';
import colors from '../../redux/constants/colors';
import {trackStateAdobe} from '../../services/analytics';
import CustomeIcon from './CustomeIcon';

const Header = props => {
  const wishlistData =
    useSelector(state => state.wishlistReducer || {}).data || [];
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );

  const searchedCategory = useSelector(
    state => (state.homepageReducer || {}).searchedCategory || {},
  );

  const [searchModal, setSearchModal] = useState(false);

  const togleSearch = () => {
    setSearchModal(!searchModal);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://www.moglix.com' + '/' + props.shareUrl,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const recognizeSearch = async params => {
    try {
      const {data} = await isBrandCategory({str: params.str});
      props.navigation.push(
        'Listing',
        {
          str:
            (data.categoryName && data.redirectionLink.replace(/\D/g, '')) ||
            data.brandName ||
            params.str,
          type:
            (data.type || params.type).charAt(0).toUpperCase() +
            (data.type || params.type).slice(1),
          category:
            (data.categoryName && data.redirectionLink.replace(/\D/g, '')) ||
            '',
        },
        `${Math.random()}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openVoiceSearch = () => {
    const fromScreen = props.navigation.getState();
    let previousRoute;
    if (fromScreen && fromScreen.history) {
      previousRoute =
        fromScreen && fromScreen.history && fromScreen.history.length - 1 >= 0
          ? fromScreen.history[fromScreen.history.length - 1] &&
            fromScreen.history[fromScreen.history.length - 1].key.split('-')[0]
          : '';
    } else {
      previousRoute =
        fromScreen && fromScreen.routes && fromScreen.routes.length - 2 >= 0
          ? fromScreen.routes[fromScreen.routes.length - 1].name
          : '';
    }

    let obj = {
      'myapp.linkpagename': 'voice button clicked',
      'myapp.ctaname': 'voice button clicked',
      'myapp.channel': 'search',
      'myapp.subSection': `search ${previousRoute}`,
    };
    trackStateAdobe('myapp.ctaclick', obj);
    setSearchModal(true);
  };

  const {
    navigation,
    showBack,
    showSearch,
    showText,
    showWishlist,
    showCart,
    showBackToHome,
    showName,
    showLogo,
    showLargeSearch,
    style,
    iconStyle,
    fromZoomer,
  } = props;

  return (
    <View
      style={[
        styles.headerView,
        {
          shadowOpacity: Platform.OS == 'android' ? 0.25 : 0,
          shadowRadius: 3.84,
          elevation: Platform.OS === 'ios' ? 0 : 5,
          padding: showBackToHome ? 0 : Dimension.padding10,
        },
        style,
      ]}>
      {showBack || showBackToHome || showLogo || showText ? (
        <View style={styles.LogoRow}>
          {showLogo ? (
            <Image
              resizeMode={'contain'}
              style={styles.logoImage}
              source={require('../../assets/images/logo.jpg')}
            />
          ) : null}
          {showBack ? (
            <Icon
              onPress={() => navigation.goBack()}
              name={'arrow-left'}
              color={'#000'}
              size={28}
              style={iconStyle}
            />
          ) : null}
          {showText ? (
            <View>
              <Text style={styles.showTextStyle}>{showText}</Text>
              {props.showSubText ? (
                <Text
                  style={[
                    styles.showTextStyle,
                    {fontFamily: Dimension.CustomRegularFont, color: 'grey'},
                  ]}>
                  {props.showSubText}
                </Text>
              ) : null}
            </View>
          ) : null}
          {showBackToHome ? (
            <TouchableOpacity onPress={() => props.navigation.popToTop()}>
              <Image
                style={styles.smallLogo}
                source={require('../../assets/images/moglix_app_logo.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {showName ? (
        <Text numberOfLines={1} style={styles.nameOnHeader}>
          Welcome, {showName}
        </Text>
      ) : null}
      {showSearch ? (
        <TouchableOpacity
          onPress={() => navigation.push('Search')}
          style={[
            styles.searchView,
            {
              width: showLargeSearch
                ? Dimensions.get('window').width * 0.73
                : Dimensions.get('window').width * 0.53,
            },
          ]}>
          <View style={styles.LogoRow}>
            <FeatherIcon name={'search'} size={22} color={'#3c3c3c'} />
            <View style={styles.serachWrap}>
              {searchedCategory && searchedCategory.data ? (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.searchText,
                    {width: showLargeSearch ? 220 : 125},
                  ]}>
                  Search for {searchedCategory && searchedCategory.data}
                </Text>
              ) : (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.searchText,
                    {width: showLargeSearch ? 220 : 125},
                  ]}>
                  Search for products, brands and more
                </Text>
              )}
            </View>
          </View>
          <View style={styles.iconView}>
            <FAIcon
              onPress={() => openVoiceSearch()}
              name={'microphone'}
              color={'dodgerblue'}
              size={22}
            />
          </View>
        </TouchableOpacity>
      ) : null}
      {showWishlist || showCart || fromZoomer ? (
        <View style={styles.LogoRow}>
          {fromZoomer ? (
            <TouchableOpacity onPress={onShare} style={{position: 'relative'}}>
              <Icon name={'share-variant'} color={'#000'} size={24} />
            </TouchableOpacity>
          ) : null}
          {showWishlist ? (
            <TouchableOpacity
              onPress={() => {
                if (authenticated == 'true') {
                  navigation.navigate('Wishlist');
                } else {
                  navigation.navigate('Auth');
                }
              }}
              style={{position: 'relative'}}>
              <Icon name={'heart'} color={'#000'} size={24} />
              {wishlistData && wishlistData.length ? (
                <View style={styles.itemsListView}>
                  <Text style={styles.itemsListText}>
                    {wishlistData.length}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}
          {showCart ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.cartNav}>
                <CustomeIcon name="Cart" size={25}></CustomeIcon>
              {/* <Icon name={'cart'} color={'#000'} size={24} /> */}
              {itemsList && itemsList.length ? (
                <View style={styles.itemsListView}>
                  <Text style={styles.itemsListText}>{itemsList.length}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {searchModal && (
        <VoiceSearch
          suggestionClicked={recognizeSearch}
          isVisible={searchModal}
          closeModal={togleSearch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  TopCatName: {
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font10,
    textAlign: 'center',
  },
  ActiveTopCatName: {
    color: colors.RedThemeColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font10,
    textAlign: 'left',
  },
  TopCatWrap: {marginLeft: Dimension.margin12, maxWidth: Dimension.width80},
  ActiveTopCatWrap: {
    marginLeft: Dimension.margin12,
    maxWidth: Dimension.width80,
  },
  TopCatImg: {
    width: Dimension.width65,
    height: Dimension.height50,
    borderRadius: 8,
    marginBottom: 5,
  },
  headerView: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: Dimension.padding12,
    justifyContent: 'space-between',
  },
  LogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: Dimension.width55,
    height: Dimension.width22,
  },
  showTextStyle: {
    marginLeft: Dimension.margin8,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  smallLogo: {
    width: Dimension.width22,
    height: Dimension.width22,
    marginLeft: Dimension.margin10,
    marginVertical: Dimension.margin10,
    // borderWidth:1, borderColor:'red',
    // marginTop: -Dimension.margin12,
    // marginHorizontal:-Dimension.margin5,
  },
  nameOnHeader: {
    maxWidth: Dimension.width150,
    // width: Dimension.width150,
    fontSize: Dimension.font12,
    alignSelf: 'center',
    fontFamily: Dimension.CustomMediumFont,
  },
  searchView: {
    flexDirection: 'row',
    paddingVertical: Dimension.padding6,
    paddingHorizontal: Dimension.padding8,
    borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: Dimension.borderRadius8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serachWrap: {
    height: 20,
    flexDirection: 'row',
  },

  searchText: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 150,
    // maxWidth: 220,
    marginLeft: Dimension.margin8,
    fontSize: Dimension.font11,
    marginTop: Dimension.margin2,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.lightGrayText,
  },
  iconView: {
    width: 20,
    marginLeft: -100,
  },

  // wishlistDataView: {
  //   width: 14,
  //   height: 14,
  //   backgroundColor: colors.RedThemeColor,
  //   position: 'absolute',
  //   top: -6,
  //   right: -6,
  //   borderRadius: 2,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // wishlistDataText: {
  //   color: '#fff',
  //   alignSelf: 'center',
  //   fontSize: 8,
  //   fontFamily: Dimension.CustomMediumFont,
  // },
  cartNav: {marginLeft: Dimension.margin16, position: 'relative'},
  itemsListView: {
    width: 14,
    height: 14,
    backgroundColor: colors.RedThemeColor,
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsListText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 8,
    fontFamily: Dimension.CustomMediumFont,
  },
});

export default Header;
