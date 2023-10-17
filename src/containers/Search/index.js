import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  SectionList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchTrendingCat,
  setSearchSuggestion,
} from '../../redux/actions/search';
import {fetchLayoutByLayoutCode} from '../../redux/actions/homepage';
import {fetchSuggestions, isBrandCategory} from '../../services/search';
import {STATE_STATUS} from '../../redux/constants';
import TrendingSearch from '../../components/Common/TrendingSearch';
import debounce from 'lodash.debounce';
import VoiceSearch from '../../components/Common/VoiceSearchModal';
import SearchSuggestion from '../../components/Common/SearchSuggestion';
import CategorySuggestion from '../../components/Common/CategorySuggestion';
import RecentSearch from '../../components/Common/RecentSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import {
  trackAdjust,
  trackStateAdobe,
  webEngageTracking,
  sendClickStreamData,
} from '../../services/analytics';
import {COMPONENTS_MAP} from '../../redux/constants/homepage';
import HomeMainCarousel from '../../components/Common/HomeMainCarousel';
import Brands from '../../components/Common/Brands';
import HalfWidthImage from '../../components/Common/HalfWidthImage';
import FullWidthImage from '../../components/Common/FullWidthImage';
import BestSeller from '../../components/Common/BestSeller';
import SectionTitle from '../../components/Common/SectionTitle';
import HeaderCategory from '../../components/Common/HeaderCategory';
import Category from '../../components/Common/Category';

const SearchScreen = props => {
  //search Reducer handling
  const countrydata = useSelector(state => state.masterReducer.data);
  const homepageData = useSelector(state => state.homepageReducer);
  const trendingCategoriesData = useSelector(
    state => state.searchReducer['all'].categories,
  );
  const trendingCategoriesStatus = useSelector(
    state => state.searchReducer['all'].status,
  );
  const searchSuggestion = useSelector(
    state => state.searchReducer.suggestions,
  );
  const searchedCategory = useSelector(
    state => (state.homepageReducer || {}).searchedCategory || {},
  );
  const fromScreen = props.navigation.getState();
  let previousRoute =
    fromScreen && fromScreen.routes && fromScreen.routes.length - 2 >= 0
      ? fromScreen.routes[fromScreen.routes.length - 2] &&
        fromScreen.routes[fromScreen.routes.length - 2].name
      : fromScreen.routes[fromScreen.routes.length - 1] &&
        fromScreen.routes[fromScreen.routes.length - 1].name;

  const dispatch = useDispatch();
  let searchInput = React.createRef();

  //state handling
  const [inputValue, setInputValue] = useState('');
  const [suggestionList, setSuggestionList] = useState({
    categorySuggestionList: [],
    suggestionList: [],
  });
  const [searchModal, setSearchModal] = useState(false);
  const [recentSearchState, setRecentSearchState] = React.useState([]);

  //Mounting api call
  useEffect(() => {
    if (trendingCategoriesStatus !== STATE_STATUS.FETCHED) {
      dispatch(fetchTrendingCat('all'));
    }
    let reducerSource = homepageData[countrydata.searchpageLayoutCode];
    if (!reducerSource || reducerSource.status != STATE_STATUS.FETCHED) {
      dispatch(fetchLayoutByLayoutCode(countrydata.searchpageLayoutCode));
    }
    if (searchInput && searchInput.current && searchInput.current.focus) {
      searchInput.current.focus();
    }
    readRecentSearchStateData();
    if (previousRoute == 'HomeApp') {
      let routeObj =
        fromScreen && fromScreen.routes && fromScreen.routes.length - 2 >= 0
          ? fromScreen.routes[fromScreen.routes.length - 2]
          : fromScreen.routes[fromScreen.routes.length - 1];
      previousRoute =
        (routeObj &&
          routeObj.state &&
          routeObj.state.history[routeObj.state.history.length - 1].key.split(
            '-',
          )[0]) ||
        '';
    }
    let obj = {
      'myapp.linkpagename': `${previousRoute}`,
      'myapp.ctaname': 'search header clicked',
      'myapp.channel': 'search',
      'myapp.subSection': `search ${previousRoute}`,
      '&&events': 'event42',
    };
    trackStateAdobe('myapp.ctaclick', obj);
    clickStreamSearchHeader(previousRoute);
  }, []);

  const clickStreamSearchHeader = previousRouteName => {
    let dataTracking = {
      event_type: 'click',
      label: 'search_header_click',
      channel: 'Search',
      page_type: `${previousRouteName}`,
    };
    sendClickStreamData(dataTracking);
  };

  //handle recentsearchState
  useEffect(() => {
    saveRecentSearchData();
  }, [recentSearchState]);

  //save recent search state
  const saveRecentSearchData = async () => {
    try {
      const jsonValue = JSON.stringify({
        recentSearchState: recentSearchState,
      });
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      // saving error
      console.log('storing data doesnt work', e);
    }
  };

  //reading recent search state
  const readRecentSearchStateData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      const tasksObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (tasksObj) setRecentSearchState([...tasksObj.recentSearchState] || []);
    } catch (e) {
      // error reading value
      console.log('loading stored data doesnt work');
    }
  };

  const handleAddRecentSearch = item => {
    setRecentSearchState([...recentSearchState, item]);
  };

  //fetch suggestions
  const debouncedSave = useRef(
    debounce(text => {
      fetchSuggestionList(text);
    }, 200),
  ).current;

  const onSearchText = (text, focustext) => {
    if (!focustext) {
      setInputValue(text);
    }

    if (text && text.length > 2) {
      debouncedSave(text);
    } else {
      setSuggestionList({
        categorySuggestionList: [],
        suggestionList: [],
      });
    }
  };
  //service call
  const fetchSuggestionList = async text => {
    if (searchSuggestion && searchSuggestion[text]) {
      setSuggestionList({
        ...searchSuggestion[text],
      });
    } else {
      const res = await fetchSuggestions(text);
      if (res.data) {
        let suggestionData = {};
        let suggestionKeys = ['suggestionList', 'categorySuggestionList'];
        suggestionKeys.map(_ => {
          suggestionData[_] = res.data[_].map(item => {
            return {
              ...item,
              id: item.categoryId || item.brandId,
              str:
                _ == 'suggestionList'
                  ? item.term
                  : item.categoryId || item.brandId,
              name: item.term,
              category: item.categoryId || item.brandId,
              categoryImage: _ == 'suggestionList' ? '' : item.imageLink,
              type: _ == 'suggestionList' ? 'Search' : 'Category',
            };
          });
        });
        dispatch(setSearchSuggestion(text, {...suggestionData}));
        setSuggestionList({
          ...suggestionData,
        });
      }
    }
  };

  //rendering elements
  const renderLoader = () => (
    <ActivityIndicator
      size={'small'}
      color={'red'}
      style={styles.activityIndicator}
    />
  );

  const renderError = () => (
    <View>
      <Text style={styles.centertext}>
        Something went wrong while fetching data
      </Text>
    </View>
  );

  //render trending search
  const renderTrendingSearch = () => {
    if (trendingCategoriesStatus == STATE_STATUS.FETCHING) {
      return renderLoader();
    } else if (trendingCategoriesStatus == STATE_STATUS.FETCHED) {
      return (
        <TrendingSearch
          handleAddRecentSearch={handleAddRecentSearch}
          {...props}
          data={trendingCategoriesData || []}
        />
      );
    } else {
      return renderError();
    }
  };

  const searchSuggestionItem = ({item}) => {
    return item.type == 'Search' ? (
      <SearchSuggestion item={item} itemClicked={itemClicked} />
    ) : (
      <CategorySuggestion item={item} itemClicked={itemClicked} />
    );
  };

  const categorySuggestionItem = ({item}) => {
    return <CategorySuggestion item={item} itemClicked={itemClicked} />;
  };

  const recentSearchItem = ({item}) => {
    return (
      <RecentSearch
        removeSearch={removeSearch}
        item={item}
        fillSearch={fillSearch}
        itemClicked={itemClicked}
      />
    );
  };

  const fillSearch = searchtext => {
    onSearchText(searchtext);
    // setInputValue(searchtext);
  };

  const removeSearch = async searchText => {
    let oldSearched = [...recentSearchState];
    oldSearched = oldSearched.filter(_ => _.str !== searchText);
    setRecentSearchState(oldSearched);

    const jsonValue = JSON.stringify({
      recentSearchState: oldSearched,
    });
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  };

  //Item click handling
  const itemClicked = (item, isSave) => {
    if (isSave) {
      handleAddRecentSearch(item);
      webEngageSearchEvent(item.name);
    }
    props.navigation.push(
      'Listing',
      {
        str: item.str,
        type: item.type,
        category: item.category,
        suggestionClicked: true,
        trendingSearch: false,
        searchType: 'suggestion',
        voicesearch: false,
      },
      `${Math.random()}`,
    );
  };

  const togleSearch = () => {
    let obj = {
      'myapp.linkpagename': 'voice button clicked',
      'myapp.ctaname': 'voice button clicked',
      'myapp.channel': 'search',
      'myapp.subSection': `search searchscreen`,
      '&&events': 'event43',
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
      page_type: `Search`,
    };
    sendClickStreamData(dataTracking);
  };

  const recognizeSearch = async params => {
    try {
      const {data} = await isBrandCategory({str: params.str});
      if (data && data.type) {
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
            searchType: params.searchType || 'voice',
            voicesearch: params.searchType != 'direct',
          },
          `${Math.random()}`,
        );
      } else {
        props.navigation.push('Listing', {
          type: 'Search',
          str: params.str,
          category: '',
          searchType: params.searchType || 'voice',
          voicesearch: params.searchType != 'direct',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderCarousel = (component, componentId) => (
    <View key={componentId} style={styles.carouselContainer}>
      <HomeMainCarousel
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
      style={[
        styles.explorebrand,
        {backgroundColor: component.colorCode || '#FFF'},
      ]}>
      {renderSectionTitle({
        titleData: {titleName: 'Explore By Brands', viewAll: false},
      })}
      <View style={styles.brandView}>
        <Brands data={component.data} navigation={props.navigation}></Brands>
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
          backgroundColor: component.colorCode || '#FFF',
        }}>
        <FullWidthImage
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
        data={component}
        {...props}
        TopPicksOfTheDay={true}
        IsThisHomePage={true}
      />
    </View>
  );

  const renderListComponent = ({item, index}) => (
    <ProductListView fromHome item={item} navigation={props.navigation} />
  );

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
              renderItem={renderListComponent}
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
          {renderSectionTitle({
            titleData: {
              titleName: `${itemsList.length} Items in your cart`,
              viewAll: false,
            },
          })}
          <View style={styles.VertProductListSection}>
            <FlatList
              horizontal={true}
              data={itemsList}
              renderItem={renderListComponent}
              keyExtractor={(item, index) => `${index}-item`}
            />
          </View>
        </View>
      );
    } else {
      return;
    }
  };

  const renderSectionTitle = data => {
    return data.titleData && data.titleData.titleName ? (
      <View style={styles.sectionTitle}>
        <SectionTitle
          navigation={props.navigation}
          data={data.data}
          {...props}
          Title={data.titleData.titleName}
          viewAll={data.titleData.viewAll}
        />
      </View>
    ) : null;
  };

  const renderHeaderCategory = (component, componentId) => {
    return (
      <View key={componentId} style={styles.topHeaderCategory}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <HeaderCategory
            navigation={props.navigation}
            data={component.data}></HeaderCategory>
        </ScrollView>
      </View>
    );
  };

  const componentSelector = (component, componentId) => {
    switch (component.componentLabel) {
      case COMPONENTS_MAP.homepage_header_category:
        return renderHeaderCategory(component, componentId);
      case COMPONENTS_MAP.homepage_categories:
        return (
          <View>
            <Category
              key={componentId}
              fromScreen={'Homepage'}
              data={component.data}
              checkwkcewc
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
      default:
        return null;
    }
  };

  const renderTopLayout = () => {
    let reducerSource = homepageData[countrydata.searchpageLayoutCode];
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

  const webEngageSearchEvent = searchQuery => {
    let webEnagageObj = {searchQuery};
    webEngageTracking('searchQuery', webEnagageObj);
  };

  return (
    <>
      <View style={styles.searchArea}>
        <View style={styles.searchBox}>
          <TouchableOpacity
            style={styles.searchIconWrap}
            onPress={() => props.navigation.goBack()}>
            <MaterialCommunityIcon
              onPress={() => props.navigation.goBack()}
              name="arrow-left"
              style={styles.arrowBackIcon}
            />
          </TouchableOpacity>
          <TextInput
            autoFocus={true}
            style={styles.inputField}
            placeholder={
              searchedCategory && searchedCategory.data
                ? `Search for ${searchedCategory && searchedCategory.data}`
                : 'Search for products, brands and more'
            }
            placeholderTextColor={'#888'}
            selectionColor={'#888'}
            returnKeyType={'search'}
            onChangeText={onSearchText}
            onFocus={() =>
              onSearchText(searchedCategory && searchedCategory.data, true)
            }
            ref={searchInput}
            value={inputValue}
            onSubmitEditing={event => {
              if (inputValue && inputValue.length > 1) {
                recognizeSearch({
                  str: event.nativeEvent.text,
                  searchType: 'direct',
                  voicesearch: false,
                });

                // props.navigation.push('Listing', {
                //   type: 'Search',
                //   str: event.nativeEvent.text,
                //   category: '',
                //   searchType: 'direct',
                //   voicesearch: false,
                // });
                webEngageSearchEvent(event.nativeEvent.text);
                handleAddRecentSearch({
                  str: event.nativeEvent.text,
                  term: event.nativeEvent.text,
                  name: event.nativeEvent.text,
                  type: 'Search',
                });
              }
            }}
          />
          <TouchableOpacity style={styles.voiceSearch} onPress={setSearchModal}>
            <FAIcon
              name="microphone"
              style={styles.voiceIconCss}
              onPress={togleSearch}
            />
          </TouchableOpacity>
          {searchModal && (
            <VoiceSearch
              suggestionClicked={recognizeSearch}
              isVisible={searchModal}
              closeModal={togleSearch}
            />
          )}
        </View>
      </View>
      <ScrollView>
        {!suggestionList || !suggestionList.suggestionList.length ? (
          <View style={styles.trendingSearchView}>
            {renderTrendingSearch()}
          </View>
        ) : null}
        <View style={{...styles.scrollView, flex: 1}}>
          {suggestionList && suggestionList.suggestionList.length ? (
            <View style={styles.suggestionScroll}>
              <SectionList
                sections={[
                  {
                    // title: 'Suggestions',
                    data: suggestionList.suggestionList || [],
                  },
                  {
                    // title: 'Product Categories',
                    data: suggestionList.categorySuggestionList || [],
                  },
                ]}
                renderSectionHeader={({section: {title}}) => (
                  <Text style={styles.suggestionHeading}>{/* {title} */}</Text>
                )}
                keyExtractor={(item, index) => `${index}-item`}
                renderItem={searchSuggestionItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.suggestionList}
              />
            </View>
          ) : null}

          {!suggestionList ||
          (!suggestionList.suggestionList.length &&
            recentSearchState &&
            recentSearchState.length) ? (
            <View style={styles.recentSearchHead}>
              <Text style={styles.recSearchHeading}>Recent Searches</Text>
              <TouchableOpacity
                style={styles.clearSearch}
                onPress={() => {
                  setRecentSearchState([]);
                }}>
                <Text style={styles.clearHistory}>CLEAR</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View>
            {!suggestionList || !suggestionList.suggestionList.length ? (
              <View style={[styles.suggestionList, styles.recentSearchList]}>
                <FlatList
                  data={recentSearchState}
                  keyExtractor={(_, i) => `${i}-i`}
                  renderItem={recentSearchItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatlistContainer}
                />
              </View>
            ) : null}
          </View>
          <View style={{margin: 16}}>{renderTopLayout()}</View>
        </View>
      </ScrollView>
    </>
  );
};

export default SearchScreen;
