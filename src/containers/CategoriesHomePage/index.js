import React, {useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  InteractionManager,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {fetchLayoutByLayoutCode} from '../../redux/actions/homepage';
import {STATE_STATUS} from '../../redux/constants/index';
import {COMPONENTS_MAP} from '../../redux/constants/homepage';
import Dimension from '../../redux/constants/dimensions';
import Category from '../../components/Common/Category';
import HomeMainCarousel from '../../components/Common/HomeMainCarousel';
import Brands from '../../components/Common/Brands';
import HalfWidthImage from '../../components/Common/HalfWidthImage';
import FullWidthImage from '../../components/Common/FullWidthImage';
import BestSeller from '../../components/Common/BestSeller';
import SectionTitle from '../../components/Common/SectionTitle';
import Colors from '../../redux/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';

const CategoriesHomePageScreen = props => {
  const countrydata = useSelector(state => state.masterReducer.data);
  const homepageData = useSelector(state => state.homepageReducer);
  const wishlistData =
    useSelector(state => state.wishlistReducer || {}).data || [];
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );

  const dispatch = useDispatch();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let reducerSource = homepageData[props.route.params.code];
      let topLayoutStatus =
        (reducerSource && reducerSource.status) || STATE_STATUS.FETCHING;
      if (topLayoutStatus !== STATE_STATUS.FETCHED) {
        dispatch(fetchLayoutByLayoutCode(props.route.params.code));
      }
    });
  }, []);

  const renderSectionTitle = data => {
    return data.titleData && data.titleData.titleName ? (
      <View
        key={`data.titleData.titleName-${Math.random()}`}
        style={{paddingHorizontal: Dimension.padding15, paddingTop: 10}}>
        <SectionTitle
          {...props}
          {...data}
          Title={data.titleData.titleName}
          viewAll={data.titleData.viewAll}
        />
      </View>
    ) : null;
  };

  const renderLoader = () => (
    <View style={{height: 600}}>
      <ActivityIndicator
        size={'large'}
        color={'red'}
        style={{
          // borderRadius: 8,
          // width: '100%',
          // marginHorizontal: 12,
          // backgroundColor: '#e7e7e7',
          marginTop: Dimension.margin35,
          position: 'relative',
          // justifyContent:'center',
          // paddingVertical: 50,
          height: '90%',
          // alignSelf: 'center',
        }}
      />
    </View>
  );

  const renderError = () => (
    <View>
      <Text style={{alignSelf: 'center'}}>
        Something went wrong while fetching data
      </Text>
    </View>
  );

  const renderCarousel = (component, componentId) => (
    <View key={componentId} style={styles.carouselContainer}>
      <HomeMainCarousel
        fromHome
        data={component.data}
        autoplay={true}
        Config={{IMG_PATH: 'https://cdn.moglix.com/'}}
        navigation={props.navigation}
      />
    </View>
  );

  const renderbrands = (component, componentId) => (
    <View
      key={componentId}
      style={{
        paddingBottom: Dimension.margin12,
        backgroundColor: component.colorCode || '#FFF',
      }}>
      {renderSectionTitle({
        titleData: {titleName: 'Explore By Brands', viewAll: false},
      })}
      <View style={{marginTop: Dimension.margin10}}>
        <Brands
          fromHome
          component={component}
          data={component.data}
          navigation={props.navigation}></Brands>
      </View>
    </View>
  );

  const renderHalfWidthImage = (component, componentId) => {
    let VermarginBottom = Dimension.margin15;
    let HorizontalPadding = Dimension.padding15;
    if (component.hasOwnProperty('vPadding')) {
      if (component.vPadding) {
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
          paddingBottom: VermarginBottom,
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
          // paddingTop: 10,
          // paddingBottom: VerPaddingBottom,
          paddingLeft:
            component.data && component.data.length > 1
              ? Dimension.margin12
              : 0,
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
      style={{
        paddingBottom: Dimension.margin12,
        backgroundColor: component.colorCode,
      }}>
      {renderSectionTitle(component)}
      <BestSeller
        fromHome
        data={component}
        {...props}
        TopPicksOfTheDay={true}
        IsThisHomePage={true}
      />
    </View>
  );

  const componentSelector = (component, componentId) => {
    switch (component.componentLabel) {
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
      default:
        return null;
    }
  };

  const renderTopLayout = () => {
    let reducerSource = homepageData[props.route.params.code];
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

  const renderHeader = () => (
    <View style={styles.header}>
      <MaterialCommunityIcon
        onPress={() => props.navigation.goBack()}
        name={'arrow-left'}
        style={styles.headerIcon}
        size={24}
      />
      <View style={styles.LogoRow}>
        <TouchableOpacity
          onPress={() => {
            if (authenticated == 'true') {
              props.navigation.navigate('Wishlist');
            } else {
              props.navigation.navigate('Auth');
            }
          }}
          style={{position: 'relative'}}>
          <Icon name={'heart'} color={'#fff'} size={24} />
          {wishlistData && wishlistData.length ? (
            <View style={styles.wishlistDataView}>
              {/* <Text style={styles.wishlistDataText}>
                    {wishlistData.length}
                  </Text> */}
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Cart')}
          style={styles.cartNav}>
          <Icon name={'cart'} color={'#fff'} size={24} />
          {itemsList && itemsList.length ? (
            <View style={styles.itemsListView}>
              <Text style={styles.itemsListText}>{itemsList.length}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor={Colors.RedThemeColor}
        barStyle={'light-content'}
      />
      {renderHeader()}
      <ScrollView>{renderTopLayout()}</ScrollView>
    </View>
  );
};

export default CategoriesHomePageScreen;
