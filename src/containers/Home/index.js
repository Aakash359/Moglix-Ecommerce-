import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Linking,
  Platform,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import HeaderCategory from '../../components/Common/HeaderCategory';
import {fetchRecentlyViewed} from '../../redux/actions/recentlyViewed';
import {fetchLayoutByLayoutCode} from '../../redux/actions/homepage';
import {STATE_STATUS} from '../../redux/constants/index';
import {fetchWishlist} from '../../redux/actions/wishlist';
import {COMPONENTS_MAP} from '../../redux/constants/homepage';
import Dimension from '../../redux/constants/dimensions';
import Category from '../../components/Common/Category';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import HomeMainCarousel from '../../components/Common/HomeMainCarousel';
import SalesTimer from '../../components/Common/SalesTimer';
import Brands from '../../components/Common/Brands';
import HalfWidthImage from '../../components/Common/HalfWidthImage';
import FullWidthImage from '../../components/Common/FullWidthImage';
import BestSeller from '../../components/Common/BestSeller';
import SectionTitle from '../../components/Common/SectionTitle';
import styles from './style';
import VoiceSearch from '../../components/Common/VoiceSearchModal';
import {isBrandCategory} from '../../services/search';
import {rateApp} from '../../services/homepage';
import {setCart} from '../../redux/actions/cart';
import {getCartBySession} from '../../services/cart';
import {fetchAuth} from '../../redux/actions/auth';
import Header from '../../components/Common/Header';
import ToastMsg from '../../components/Common/ToastMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductListView from '../../components/Common/ProductListView';
import SplashScreen from 'react-native-splash-screen';
import LoginFromHome from '../../components/Common/LoginFromHome';
import RatingModalOnHome from '../../components/Common/RatingModalOnHome';
import Toast from 'react-native-toast-message';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  webEngageUserTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import {requestshippingValue} from '../../generic/Cart';

const HomeScreen = props => {
  const countrydata = useSelector(state => state.masterReducer.data);
  const homepageData = useSelector(state => state.homepageReducer);
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const recentlyViewedData = useSelector(
    state => (state.recentlyViewedReducer || {}).data || [],
  );
  const wishlistData =
    useSelector(state => state.wishlistReducer || {}).data || [];
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const userName = useSelector(
    state => ((state.authReducer || {}).data || {}).userName || '',
  );
  const wishlistStatus =
    useSelector(state => state.wishlistReducer || {}).status ||
    STATE_STATUS.FETCHING;

  const searchedCategory = useSelector(
    state => (state.homepageReducer || {}).searchedCategory || {},
  );
  const dispatch = useDispatch();
  const [searchModal, setSearchModal] = useState(false);
  const [RatingModalVisible, setRatingModalVisible] = useState(false);
  const [adjustTrackerTokens, setAdjustTrackerTokens] = useState({});

  //Mounting call
  useEffect(() => {
    SplashScreen.hide();
    getRatingModalVisibility();
    // getUserData();

    let reducerSource = homepageData[countrydata.homepageTopLayoutCode];
    let topLayoutStatus =
      (reducerSource && reducerSource.status) || STATE_STATUS.FETCHING;
    if (topLayoutStatus != STATE_STATUS.FETCHED) {
      dispatch(fetchLayoutByLayoutCode(countrydata.homepageTopLayoutCode));
    }
    let reducerSourceBottom =
      homepageData[countrydata.homepageBottomLayoutCode];
    let bottomLayoutStatus =
      (reducerSourceBottom && reducerSourceBottom.status) ||
      STATE_STATUS.FETCHING;
    if (bottomLayoutStatus != STATE_STATUS.FETCHED) {
      dispatch(fetchLayoutByLayoutCode(countrydata.homepageBottomLayoutCode));
    }

    if (auth.authenticated == 'true') {
      dispatch(fetchRecentlyViewed(auth.userId, auth.token, auth.sessionId));
    }
    webEngageUserTracking('login', auth.userId + '');
    webEngageUserTracking('setEmail', auth.email);
    webEngageUserTracking('setFirstName', auth.userName);
    webEngageUserTracking('setPhone', auth.phone);
    webEngageScreenTracking('HomeScreen', {});
    adobeHomeTracking();
    clickStreamPageLoad();

    // return () => {
    //   if (Platform.OS === 'android') {
    //     Linking.removeEventListener('url');
    //   }
    // };
    // return urlListener;
    console.log('mountedddddddddddddddddddd');
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'home_page',
      channel: 'Home',
    };
    sendClickStreamData(dataTracking);
  };

  const adobeHomeTracking = () => {
    trackStateAdobe('moglix:home', {
      'myapp.pageName': 'moglix:home',
      'myapp.channel': 'home',
      'myapp.subSection': 'moglix:home',
    });
  };

  const getRatingModalVisibility = async () => {
    AsyncStorage.getItem('@appSessions')
      .then(res => {
        if (!res || res == 1) {
          AsyncStorage.getItem('LoginShown')
            .then(rs => {
              if (!rs) {
                props.navigation.navigate('Auth');
                AsyncStorage.setItem('LoginShown', 'true');
              }
            })
            .catch(e => {
              props.navigation.navigate('Auth');
              AsyncStorage.setItem('LoginShown', 'true');
            });
        } else if (res && res == 3) {
          AsyncStorage.getItem('ModalShown')
            .then(rs => {
              if (!rs) {
                AsyncStorage.setItem('ModalShown', 'true');
                setRatingModalVisible(true);
              }
            })
            .catch(e => {
              AsyncStorage.setItem('ModalShown', 'true');
              setRatingModalVisible(true);
            });
        }
      })
      .catch(e => {
        AsyncStorage.setItem('LoginShown', 'true');
        props.navigation.navigate('Auth');
      });
  };

  const getUserData = async () => {
    let userData = await AsyncStorage.getItem('@user');
    if (!userData) dispatch(fetchAuth());
  };

  useEffect(() => {
    if (sessionId) getCartData();
  }, [sessionId]);

  const getCartData = async () => {
    const {data} = await getCartBySession(sessionId, token);
    let response = {...data};
    response.cart = {
      ...response.cart,
      userId: userId,
      sessionId: sessionId,
    };
    const shipping = await requestshippingValue(data, sessionId, token);
    dispatch(setCart(shipping));
    if (
      (wishlistStatus !== STATE_STATUS.FETCHED ||
        wishlistStatus !== STATE_STATUS.UPDATED) &&
      auth.authenticated == 'true'
    ) {
      dispatch(fetchWishlist(userId, 'business', sessionId, token));
    }
  };

  const renderSectionTitle = (data, goToCart) => {
    return data.titleData && data.titleData.titleName ? (
      <View style={styles.sectionTitle}>
        <SectionTitle
          navigation={props.navigation}
          data={data.data}
          goToCart={goToCart}
          {...props}
          Title={data.titleData.titleName}
          viewAll={data.titleData.viewAll}
        />
      </View>
    ) : null;
  };

  const renderSearch = () => (
    <View style={styles.searchBar}>
      <TouchableOpacity
        style={styles.searchBarInner}
        onPress={() => props.navigation.push('Search')}>
        <FeatherIcon name="search" style={styles.magnifyIcon} />
        <View style={styles.serachWarpView}>
          {searchedCategory && searchedCategory.data ? (
            <Text style={styles.searcinputText}>
              Search for {searchedCategory && searchedCategory.data}
            </Text>
          ) : (
            <Text style={styles.searcinputText}>
              Search for products, brands and more
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.iconView}>
        <FAIcon
          name="microphone"
          style={styles.voiceIconCss}
          onPress={togleSearch}
        />
      </View>
    </View>
  );

  const renderLoader = () => (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator
        // animating={true}
        size={'large'}
        color={'red'}
        style={styles.activityIndicator}
      />
    </View>
  );

  const renderError = () => (
    <View>
      <Text style={styles.textCenter}>
        Something went wrong while fetching data
      </Text>
    </View>
  );

  const renderHeaderCategory = (component, componentId) => {
    return (
      <View key={componentId} style={styles.topHeaderCategory}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <HeaderCategory
            fromHome
            component={component}
            navigation={props.navigation}
            data={component.data}></HeaderCategory>
        </ScrollView>
      </View>
    );
  };

  const renderCarousel = (component, componentId) => (
    <View key={componentId} style={styles.carouselContainer}>
      <HomeMainCarousel
        data={component.data}
        autoplay={true}
        Config={{IMG_PATH: 'https://cdn.moglix.com/'}}
        navigation={props.navigation}
        fromHome
      />
    </View>
  );

  const renderbrands = (component, componentId) => (
    <View
      key={componentId}
      style={[
        styles.explorebrand,
        {backgroundColor: component.colorCode || '#FFF'},
      ]}>
      {renderSectionTitle({
        titleData: {titleName: 'Explore By Brands', viewAll: false},
      })}
      <View style={styles.brandView}>
        <Brands
          fromHome
          component={component}
          data={component.data}
          navigation={props.navigation}
          fromScreen={'Homepage'}></Brands>
      </View>
    </View>
  );

  const renderHalfWidthImage = (component, componentId) => {
    let VermarginBottom = Dimension.margin15;
    let HorizontalPadding = Dimension.padding15;
    if (component.hasOwnProperty('vPadding')) {
      if (imageData.vPadding) {
        VermarginBottom = Dimension.margin15;
      } else {
        VermarginBottom = 0;
      }
      if (component.hPadding) {
        HorizontalPadding = Dimension.padding15;
      } else {
        HorizontalPadding = 0;
      }
    }
    return (
      <View
        key={componentId}
        style={{
          // paddingBottom: VermarginBottom,
          paddingHorizontal: HorizontalPadding,
          backgroundColor: component.colorCode || '#FFF',
        }}>
        <HalfWidthImage
          fromHome
          component={component}
          data={component.data}
          navigation={props.navigation}></HalfWidthImage>
      </View>
    );
  };

  const renderFullWIdthImage = (component, componentId) => {
    let VerPaddingTop = 0;
    let VerPaddingBottom = Dimension.margin8;
    if (component.hasOwnProperty('vPadding')) {
      if (component.vPadding) {
        VerPaddingTop = 0;
        VerPaddingBottom = Dimension.margin8;
      } else {
        VerPaddingTop = -Dimension.margin8;
        VerPaddingBottom = 0;
      }
    }
    return (
      <View
        key={componentId}
        style={{
          paddingBottom: VerPaddingBottom,
          paddingTop: VerPaddingBottom,
          backgroundColor: component.colorCode || '#FFF',
        }}>
        <FullWidthImage
          fromHome
          data={component}
          navigation={props.navigation}></FullWidthImage>
      </View>
    );
  };

  const renderBestSeller = (component, componentId) => (
    <View
      key={componentId}
      style={[
        styles.bestSellerView,
        {
          backgroundColor: component.colorCode,
        },
      ]}>
      {renderSectionTitle(component)}
      <BestSeller
        fromHome
        data={component}
        {...props}
        TopPicksOfTheDay={true}
        IsThisHomePage={true}
        fromScreen="Home"
      />
    </View>
  );

  const renderListComponent = ({item, index}, params) => {
    return (
      <ProductListView
        fromHome
        params={params}
        item={{
          ...item,
          productImg: item.productImg
            ? item.productImg
            : item.productImage
            ? 'https://cdn.moglix.com' +
              `${(item.productImage || item.productImg)[0] == '/' ? '' : '/'}` +
              (item.productImage || item.productImg)
            : null,
        }}
        navigation={props.navigation}
      />
    );
  };

  const renderWishList = (component, componentId) => {
    if (auth.authenticated == 'true' && wishlistData.length) {
      return (
        <View
          key={componentId}
          style={[
            styles.bestSellerView,
            {
              backgroundColor: component.colorCode,
            },
          ]}>
          {renderSectionTitle({
            titleData: {titleName: 'Wishlist', viewAll: false},
          })}
          <View style={styles.VertProductListSection}>
            <FlatList
              horizontal={true}
              data={wishlistData}
              renderItem={itemData => renderListComponent(itemData, 'wishList')}
              keyExtractor={(item, index) => `${index}-item`}
            />
          </View>
        </View>
      );
    } else {
      return;
    }
  };

  const recentlyViewed = (component, componentId) => {
    if (recentlyViewedData && recentlyViewedData.length) {
      return (
        <View
          key={componentId}
          style={[
            styles.bestSellerView,
            {
              backgroundColor: component.colorCode,
            },
          ]}>
          {renderSectionTitle({
            titleData: {
              titleName: `Recently viewed`,
              viewAll: false,
            },
          })}
          <View style={styles.VertProductListSection}>
            <FlatList
              horizontal={true}
              data={recentlyViewedData}
              renderItem={itemData =>
                renderListComponent(itemData, 'recentlyViewed')
              }
              keyExtractor={(item, index) => `${index}-item`}
            />
          </View>
        </View>
      );
    } else {
      return;
    }
  };

  const renderCart = (component, componentId) => {
    if (itemsList.length) {
      return (
        <View
          key={componentId}
          style={[
            styles.bestSellerView,
            {
              backgroundColor: component.colorCode,
            },
          ]}>
          {renderSectionTitle(
            {
              titleData: {
                titleName: `${itemsList.length} Items in your cart`,
                viewAll: false,
              },
            },
            true,
          )}
          <View style={styles.VertProductListSection}>
            <FlatList
              horizontal={true}
              data={itemsList}
              renderItem={itemData => renderListComponent(itemData, 'cart')}
              keyExtractor={(item, index) => `${index}-item`}
            />
          </View>
        </View>
      );
    } else {
      return;
    }
  };

  const renderSalesTimer = (component, componentId) => {
    return (
      <View
        key={componentId}
        style={[
          styles.bestSellerView,
          {
            backgroundColor: component.colorCode,
          },
        ]}>
        <SalesTimer data={component.data} navigation={props.navigation} />
      </View>
    );
  };

  const componentSelector = (component, componentId) => {
    switch (component.componentLabel) {
      case COMPONENTS_MAP.recently_viewed:
        return recentlyViewed(component, componentId);
      case COMPONENTS_MAP.homepage_header_category:
        return renderHeaderCategory(component, componentId);
      case COMPONENTS_MAP.homepage_categories:
        return (
          <View style={{paddingHorizontal: Dimension.padding12}}>
            <Category
              fromHome
              component={component}
              key={componentId}
              fromScreen={'Homepage'}
              data={component.data}
              navigation={props.navigation}
            />
          </View>
        );
      case COMPONENTS_MAP.home_page_banner:
        return renderCarousel(component, componentId);
      case COMPONENTS_MAP.homepage_brands:
        return renderbrands(component, componentId);
      case COMPONENTS_MAP.HomePageHalfWidthImage:
        return renderHalfWidthImage(component, componentId);
      case COMPONENTS_MAP.HomePageFullWidthImage:
        return renderFullWIdthImage(component, componentId);
      case COMPONENTS_MAP.best_seller:
        return renderBestSeller(component, componentId);
      case COMPONENTS_MAP.homepage_wishlist:
        return renderWishList(component, componentId);
      case COMPONENTS_MAP.homepage_cart:
        return renderCart(component, componentId);
      case COMPONENTS_MAP.homepage_sales_timer:
        return renderSalesTimer(component, componentId);
      default:
        return null;
    }
  };

  const renderTopLayout = () => {
    let reducerSource = homepageData[countrydata.homepageTopLayoutCode];
    let topLayoutData = reducerSource && reducerSource.data;
    let topLayoutStatus =
      (reducerSource && reducerSource.status) || STATE_STATUS.FETCHING;
    if (topLayoutStatus === STATE_STATUS.FETCHING) {
      return renderLoader();
    } else if (topLayoutStatus === STATE_STATUS.FETCHED) {
      return topLayoutData.map((component, componentId) =>
        componentSelector(component, componentId),
      );
    } else {
      return renderError();
    }
  };

  const renderBottomLayout = () => {
    let reducerSource = homepageData[countrydata.homepageBottomLayoutCode];
    let topLayoutData = reducerSource && reducerSource.data;
    let topLayoutStatus =
      (reducerSource && reducerSource.status) || STATE_STATUS.FETCHING;
    if (topLayoutStatus === STATE_STATUS.FETCHING) {
      // return renderLoader();
    } else if (topLayoutStatus === STATE_STATUS.FETCHED) {
      return topLayoutData.map((component, componentId) =>
        componentSelector(component, componentId),
      );
    } else {
      return renderError();
    }
  };
  {
    /* Static Header with logo on Home */
  }
  const renderHeader = () => (
    <>
      <View style={styles.searchHeader}>
        <Header
          navigation={props.navigation}
          showLogo
          showCart
          showName={userName}
          style={styles.headerWithoutshadow}
        />
        {renderSearch()}
      </View>
    </>
  );

  const togleSearch = () => {
    let obj = {
      'myapp.linkpagename': 'voice button clicked',
      'myapp.ctaname': 'voice button clicked',
      'myapp.channel': 'search',
      'myapp.subSection': `search home`,
    };
    if (searchModal) {
      trackStateAdobe('myapp.ctaclick', obj);
      clickStreamVoiceSearch();
    }

    setSearchModal(!searchModal);
  };

  const clickStreamVoiceSearch = () => {
    let dataTracking = {
      event_type: 'click',
      label: 'voice_button_click',
      channel: 'Search',
      page_type: `Home`,
    };
    sendClickStreamData(dataTracking);
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

  const submitFeedback = async obj => {
    let finalData = {
      deviceId: DeviceInfo.getUniqueId(),
      appId: VersionCheck.getCurrentVersion(),
      userId: auth.userId,
      sessionId: auth.sessionId,
      ...obj,
    };
    const {data} = await rateApp(finalData, auth.sessionId, auth.token);
    if (data) {
      Toast.show({
        type: 'success',
        text2: 'Feedback submitted successfully',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:feedback submitted',
      'myapp.ctaname': 'submit',
      'myapp.channel': 'home',
      '&&events': 'event40',
    });
    setRatingModalVisible(false);
  };

  const dismissFeedback = () => {
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:feedback dismissed',
      'myapp.ctaname': 'cross',
      'myapp.channel': 'home',
      '&&events': 'event41',
    });
    setRatingModalVisible(false);
  };

  return (
    <View>
      {/* <ToastMsg toastMessage={'Welcome to Moglix, Ashish'} /> */}
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderTopLayout()}
        {renderBottomLayout()}
      </ScrollView>
      {searchModal && (
        <VoiceSearch
          suggestionClicked={recognizeSearch}
          isVisible={searchModal}
          closeModal={togleSearch}
        />
      )}
      <View style={styles.homeLoginBg}>
        {auth.authenticated != 'true' ? (
          <LoginFromHome navigation={props.navigation} />
        ) : null}
      </View>
      {RatingModalVisible && (
        <RatingModalOnHome
          isVisible={RatingModalVisible}
          submitFeedback={submitFeedback}
          onClose={() => dismissFeedback()}
        />
      )}
    </View>
  );
};

export default HomeScreen;
