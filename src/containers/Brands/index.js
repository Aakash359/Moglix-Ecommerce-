import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Button,
  Dimensions,
  Image,
  InteractionManager,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchBrandLayoutByLayoutCode,
  fetchBrandById,
} from '../../redux/actions/brandpage';

import {STATE_STATUS} from '../../redux/constants/index';
import {COMPONENTS_MAP, BRAND_FILTERS} from '../../redux/constants/brandpage';

import Dimension from '../../redux/constants/dimensions';
import Category from '../../components/Common/Category';
import HomeMainCarousel from '../../components/Common/HomeMainCarousel';
import HalfWidthImage from '../../components/Common/HalfWidthImage';
import FullWidthImage from '../../components/Common/FullWidthImage';
import SpotLight from '../../components/Common/SpotLight';
import SectionTitle from '../../components/Common/SectionTitle';
import HomeOfficeBrand from '../../components/Common/HomeOfficeBrand';
import styles from './style';
import Header from '../../components/Common/Header';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const BrandsScreen = props => {
  const [selectedFilter, setSelectedFilter] = useState('09');

  const countrydata = useSelector(state => state.masterReducer.data);
  const brandpageData = useSelector(state => state.brandpageReducer);
  const allbrandsData = useSelector(
    state => state.brandpageReducer['all'].data,
  );
  const allbrandsStatus = useSelector(
    state => state.brandpageReducer['all'].status,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(
        fetchBrandLayoutByLayoutCode(countrydata.brandStorePageLayoutCode),
      );
      dispatch(fetchBrandById('all'));
    });
  }, []);

  useEffect(() => {
    if (allbrandsStatus == STATE_STATUS.FETCHED) {
      trackStateAdobe('moglix:all brands', {
        'myapp.pageName': 'moglix:all brands',
        'myapp.channel': 'home',
        'myapp.subSection': 'moglix:all categories',
      });
      clickStreamPageLoad();
    }
  }, [allbrandsStatus]);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'all_brands',
      channel: 'Home',
    };
    sendClickStreamData(dataTracking);
  };

  const renderBrandLayout = () => {
    let reducerSource = brandpageData[countrydata.brandStorePageLayoutCode];
    let brandLayoutData = reducerSource && reducerSource.data;
    let brandLayoutStatus =
      (reducerSource && reducerSource.status) || STATE_STATUS.FETCHING;
    if (brandLayoutStatus === STATE_STATUS.FETCHING) {
      return renderLoader();
    } else if (brandLayoutStatus === STATE_STATUS.FETCHED) {
      return brandLayoutData.map((component, componentId) =>
        componentSelector(component, componentId),
      );
    } else {
      return renderError();
    }
  };

  const componentSelector = (component, componentId) => {
    switch (component.componentLabel) {
      case COMPONENTS_MAP.homepage_categories:
        return (
          <View style={styles.catWrap}>
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
      case COMPONENTS_MAP.spotlight:
        return renderSpotLight(component, componentId);
      case COMPONENTS_MAP.home_page_banner:
        return renderCarousel(component, componentId);
      case COMPONENTS_MAP.HomePageHalfWidthImage:
        return renderHalfWidthImage(component, componentId);
      case COMPONENTS_MAP.HomePageFullWidthImage:
        return renderFullWIdthImage(component, componentId);
      case COMPONENTS_MAP.brandhomeoffice:
        return renderHomeOfficeBrands(component, componentId);
      default:
        return null;
    }
  };

  const renderHomeOfficeBrands = (component, componentId) => {
    return (
      <View
        key={componentId}
        style={[
          styles.homeOfficeBrands,
          {
            backgroundColor: component.colorCode || '#e8e8e8',
          },
        ]}>
        {component.titleData.titleName && (
          <View style={styles.homeOfficeBrandsInner}>
            <SectionTitle
              {...props}
              Title={component.titleData.titleName}></SectionTitle>
          </View>
        )}
        <HomeOfficeBrand
          fromBrand
          component={component}
          data={component.data}
          navigation={props.navigation}></HomeOfficeBrand>
      </View>
    );
  };

  const renderSpotLight = (component, componentId) => {
    return (
      <View
        key={componentId}
        style={
          (styles.spotlight,
          [
            {
              backgroundColor: component.colorCode || '#e8e8e8',
            },
          ])
        }>
        {component.titleData.titleName && (
          <View style={styles.spotLightView}>
            <SectionTitle
              {...props}
              Title={component.titleData.titleName}></SectionTitle>
          </View>
        )}
        <SpotLight
          fromBrand
          component={component}
          data={component.data}
          navigation={props.navigation}></SpotLight>
      </View>
    );
  };

  const renderCarousel = (component, componentId) => (
    <View key={componentId} style={styles.carouselContainer}>
      <HomeMainCarousel
        fromHome
        data={component.data}
        autoplay={true}
        Config={{IMG_PATH: 'https://cdn.moglix.com/'}}
        navigation={props.navigation}
        fromBrand
      />
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
        style={[
          styles.halfWidthImageRow,
          {
            // paddingBottom: VermarginBottom,
            paddingHorizontal: HorizontalPadding,
            backgroundColor: component.colorCode || '#e8e8e8',
          },
        ]}>
        <View style={styles.halfWidthImageGap}></View>
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
        style={[
          styles.topFullFullWidth,
          {
            paddingBottom: VerPaddingBottom,
            backgroundColor: component.colorCode || '#e8e8e8',
          },
        ]}>
        <FullWidthImage
          fromHome
          data={component}
          navigation={props.navigation}></FullWidthImage>
        <View style={styles.fullWidthImageGapBottom}></View>
      </View>
    );
  };

  // const renderSearch = () => (
  //   <View style={styles.searchBar}>
  //     <View style={styles.searchBarInner}>
  //       <TouchableOpacity style={styles.searchIconWrap} onPress={() => {}}>
  //         <MaterialCommunityIcon
  //           name="magnify"
  //           style={[styles.voiceIconCss, {color: '#979797'}]}
  //         />
  //       </TouchableOpacity>
  //       <Text style={styles.searcinputText} onPress={() => {}}>
  //         Search Product or Brand
  //       </Text>
  //     </View>
  //     <FAIcon
  //       name="microphone"
  //       style={styles.voiceIconCss}
  //       onPress={() => {}}
  //     />
  //   </View>
  // );

  const renderFilter = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          item.key === selectedFilter
            ? styles.activeFilter
            : styles.inactiveFilter,
        ]}
        onPress={() => {
          setSelectedFilter(item.key);
        }}>
        <Text
          style={[
            item.key === selectedFilter
              ? styles.activeFilterText
              : styles.inactiveFilterText,
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAllBrandLayout = () => {
    if (allbrandsStatus === STATE_STATUS.FETCHING) {
      // return renderLoader();
    } else if (allbrandsStatus === STATE_STATUS.FETCHED) {
      return (
        <View style={styles.allbrmainwrap}>
          <View style={styles.allbrandsView}>
            <Text style={styles.allbrheading}>All Brands</Text>
            <FlatList
              style={styles.alphalist}
              data={BRAND_FILTERS}
              showsHorizontalScrollIndicator={false}
              renderItem={renderFilter}
              maxToRenderPerBatch={5}
              initialNumToRender={5}
              horizontal={true}
              keyExtractor={(item, index) => `${index}-item`}
            />
          </View>
          <View style={styles.alphalistrow}>
            {allbrandsData[selectedFilter].map((brand, brandKey) => (
              <TouchableOpacity
                key={brandKey}
                onPress={() => {
                  props.navigation.push('Listing', {
                    str: brand.name,
                    type: 'Brand',
                    category: '',
                  });
                }}>
                <Text key={brandKey} style={styles.alphatextList}>
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      return renderError();
    }
  };

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
      <Text style={styles.error}>Something went wrong while fetching data</Text>
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
    <View style={styles.brandStoreView}>
      <ScrollView stickyHeaderIndices={[0]}>
        {renderHeader()}
        <Image
          source={require('../../assets/images/brand_store_banner_image.png')}
          style={styles.headingimg}
          resizeMode="cover"
        />
        {renderBrandLayout()}
        {renderAllBrandLayout()}
      </ScrollView>
    </View>
  );
};

export default BrandsScreen;
