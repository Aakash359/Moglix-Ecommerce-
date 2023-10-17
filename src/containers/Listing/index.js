import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Dimensions,
  InteractionManager,
  Image,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {fetchProductSearchResult} from '../../redux/actions/listing';
import {STATE_STATUS} from '../../redux/constants/index';
import Dimension from '../../redux/constants/dimensions';
import ListingHeader from '../../components/Common/ListingHeader';
import SortByModal from '../../components/Common/SortByModal';
import FiltersModal from '../../components/Common/FiltersModal';
import ProductListView from '../../components/Common/ProductListView';
import Header from '../../components/Common/Header';
import styles from './style';
import colors from '../../redux/constants/colors';
import {addtoCart} from '../../generic/Cart';
import RfqRequirement from '../../components/Common/RfqRequirement';
import VariantAddCart from '../../components/Common/VariantAddCart';
import {getProduct} from '../../services/products';
import Toast from 'react-native-toast-message';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
import YoutubePlayer from 'react-native-youtube-iframe';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import RFQSuccess from '../../components/Common/RFQSuccess';

const youtubeRegex = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;

const ListingScreen = props => {
  //getting params from route
  const paramsType = props.route.params.type;
  const paramsStr = props.route.params.str;
  const paramsAppliedFilters = props.route.params.appliedFilter;
  const paramsCategoryName = props.route.params.name;
  const filterObjKey = props.route.params.filterObj;
  const fromScreen = props.navigation.getState();
  const previousRoute =
    fromScreen &&
    fromScreen.routes &&
    fromScreen.routes.length - 3 >= 0 &&
    fromScreen.routes[fromScreen.routes.length - 3]
      ? fromScreen.routes[fromScreen.routes.length - 3].name
      : (fromScreen.routes[fromScreen.routes.length - 2] &&
          fromScreen.routes[fromScreen.routes.length - 2].name) ||
        '';
  const suggestionClicked = props.route.params.suggestionClicked || false;
  const trendingSearch = props.route.params.trendingSearch || false;
  const searchType = props.route.params.searchType || '';
  const isVoiceSearch = props.route.params.voicesearch || false;
  // const fromScreen = props.navigation.dangerouslyGetParent().state.routes;
  // redux state.listingReducer handling
  const products = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).products ||
      [],
  );

  const appliedFilterinReducer = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {})
        .appliedFilter || {},
  );

  const products_status = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).status ||
      STATE_STATUS.UNFETCHED,
  );
  const maxPage = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).maxPage || 0,
  );
  const totalCount = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).totalCount ||
      0,
  );

  const recommendedCat = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {})
        .categoriesRecommended || [],
  );

  const pageNo = useSelector(
    state =>
      (((state.listingReducer[paramsType] || {})[paramsStr] || {}).params || {})
        .pageIndex || 0,
  );

  const listingParams = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).params || {},
  );

  const filter = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).filter || [],
  );

  const categoryRes = useSelector(
    state =>
      ((state.listingReducer[paramsType] || {})[paramsStr] || {}).categoryRes ||
      {},
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const user = useSelector(state => (state.authReducer || {}).data || {});
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );

  const dispatch = useDispatch();
  //component state handling
  const [orderBy, setOrderBy] = useState('popularity');
  const [orderWay, setOrderWay] = useState('desc');
  const pageSize = 20;
  const [category, setCategory] = useState(props.route.params.category || '');
  const [listingType, setListingType] = useState(paramsType || 'Search');
  const [str, setStr] = useState(props.route.params.str || '');
  const [loader, setLoader] = useState(true);
  const [initLoader, setInitLoader] = useState(true);
  const [appliedFilter, setAppliedFilter] = useState(
    paramsAppliedFilters || {},
  );
  const [sortByModal, setSortByModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [initialFilter, setInitialFilter] = useState('category');
  const [rfqRequirement, setRfqRequirement] = useState(false);
  const [rfqData, setRfqData] = useState({});
  const [grpPdModal, setGrpPdModal] = useState(false);
  const [grpProductData, setGrpProductData] = useState({});
  const [grpPdMsn, setGrpPdMsn] = useState('');
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [parentLoader, setParentLoader] = useState(false);
  //api hit of componentDidMount
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!filterObjKey) {
        fetchListingData(0);
      } else if (filterObjKey) {
        getFiltersFromFilterObj();
      }
      setInitLoader(false);
    });
  }, []);

  const clearFilters = () => {
    let fetchListingObj = {
      type: 'm',
      orderBy,
      orderWay,
      pageIndex: 0,
      pageSize,
      str: str,
      category:
        listingType === 'Category'
          ? encodeURIComponent(category)
          : listingType === 'Brand' && category
          ? category
          : listingType === 'Search' && category
          ? category
          : null,
      brand:
        listingType === 'Brand'
          ? str
              .replace('-', ' ')
              .split(' ')
              .map(_ => _.replace(/^./, _ && _[0] && _[0].toUpperCase()))
              .join(' ')
          : null,
      listingType,
      filter: [],
      appliedFilter: {},
    };
    setAppliedFilter({});
    dispatch(fetchProductSearchResult(fetchListingObj));
    setFilterModal(false);
  };

  const getFiltersFromFilterObj = () => {
    let previousFilters = [...filterObjKey];
    let filterstoApply = {};
    let tempFilter = [];

    previousFilters.map(_ => {
      if (filterstoApply.hasOwnProperty(Object.keys(_)[0])) {
        filterstoApply[Object.keys(_)[0]].push(_[Object.keys(_)[0]]);
        tempFilter.push({key: Object.keys(_)[0], value: _[Object.keys(_)[0]]});
      } else {
        filterstoApply[Object.keys(_)[0]] = [];
        filterstoApply[Object.keys(_)[0]].push(_[Object.keys(_)[0]]);
        tempFilter.push({key: Object.keys(_)[0], value: _[Object.keys(_)[0]]});
      }
    });

    let currentFilters = {...appliedFilter};

    tempFilter.map(_ => {
      let isBrand = _.key == 'brand';
      if (currentFilters[_.key] && currentFilters[_.key].includes(_.value)) {
        currentFilters[_.key] = currentFilters[_.key].filter(
          __ => __ != _.value,
        );
      } else {
        if (currentFilters[_.key]) {
          if (isBrand) {
            decodeURIComponent(_.value)
              .split('||')
              .map(brand => {
                currentFilters[_.key].push(brand);
              });
          } else {
            currentFilters[_.key].push(_.value);
          }
        } else {
          currentFilters[_.key] = [];
          if (isBrand) {
            decodeURIComponent(_.value)
              .split('||')
              .map(brand => {
                currentFilters[_.key].push(brand);
              });
          } else {
            currentFilters[_.key].push(_.value);
          }
        }
      }
    });
    setAppliedFilter(currentFilters);

    let fetchListingObj = {
      type: 'm',
      orderBy,
      orderWay,
      pageIndex: 0,
      pageSize,
      str: str,
      category:
        listingType === 'Category'
          ? encodeURIComponent(category)
          : listingType === 'Brand' && category
          ? category
          : listingType === 'Search' && category
          ? category
          : null,
      brand:
        listingType === 'Brand'
          ? str
              .replace('-', ' ')
              .split(' ')
              .map(_ => _.replace(/^./, _ && _[0] && _[0].toUpperCase()))
              .join(' ')
          : null,
      listingType,
      filter,
      appliedFilter: currentFilters,
    };
    dispatch(fetchProductSearchResult(fetchListingObj));
  };

  //handling loader
  useEffect(() => {
    if (products_status === STATE_STATUS.FETCHED && loader && !initLoader) {
      setLoader(false);
      adjustListingEvent();
      webEngageListingEvent();
      webEngageScreenTracking('ListingScreen', {
        category: paramsCategoryName,
      });
    }
    if (
      products_status === STATE_STATUS.FETCHED &&
      appliedFilter &&
      Object.keys(appliedFilter).length
    ) {
      if (paramsType == 'Category') {
        clickStreamPageLoadCategory();
      } else if (
        paramsType == 'Brand' &&
        listingParams.category &&
        listingParams.category != ''
      ) {
        clickStreamPageLoadBrandCategory();
      } else if (paramsType == 'Brand') {
        clickStreamPageLoadBrand();
      } else if (paramsType == 'Search') {
        clickStreamPageLoadSearch();
      }
    }
  }, [products_status]);

  const adjustListingEvent = () => {
    var adjustEvent = new AdjustEvent('ge53wx');
    let msns = (products || []).map(_ => _.moglixPartNumber);
    adjustEvent.addPartnerParameter('id', msns.slice(0, 5).join('|'));
    trackAdjust(adjustEvent);
  };

  const webEngageListingEvent = () => {
    if (paramsType == 'Category') {
      let webEngageCategoryObj = {
        'Category Id': paramsStr,
        'Category Name': paramsCategoryName,
        URL: `https://www.moglix.com/${
          categoryRes &&
          categoryRes.categoryDetails &&
          categoryRes.categoryDetails.canonicalURL
        }`,
      };
      webEngageTracking('categoryViewed', webEngageCategoryObj);
      adobeCategoryListingTrackEvent();
      clickStreamPageLoadCategory();
    } else if (
      paramsType == 'Brand' &&
      listingParams.category &&
      listingParams.category != ''
    ) {
      adobeBrandCategoryListingTrackEvent();
      clickStreamPageLoadBrandCategory();
    } else if (paramsType == 'Brand') {
      let brandStr = listingParams.str.replace(/\s+/g, '-');
      let webEngageBrandObj = {
        'Brand Name': paramsStr,
        'Brand URL': `https://api.moglix.com/brand/getbrand?type=${
          listingParams.type
        }&orderBy=${listingParams.orderBy}&orderWay=${
          listingParams.orderWay
        }&pageIndex=${listingParams.pageIndex}&pageSize=${
          listingParams.pageSize
        }&brand=${brandStr}filter=${JSON.stringify(appliedFilter)}`,
      };
      webEngageTracking('brandViewed', webEngageBrandObj);
      adobeBrandListingTrackEvent();
      clickStreamPageLoadBrand();
    } else if (paramsType == 'Search') {
      adobeSearchListingTrackEvent();
      clickStreamPageLoadSearch();
    }
  };

  const adobeCategoryListingTrackEvent = () => {
    let taxo1 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[0]) ||
      '';
    let taxo2 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[1]) ||
      '';
    let taxo3 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[2]) ||
      '';

    trackStateAdobe(taxo1 + ':' + taxo2 + ':' + taxo3 + `: listing `, {
      'myapp.pageName': taxo1 + ':' + taxo2 + ':' + taxo3 + `: listing`,
      'myapp.channel': 'listing',
      'myapp.subSection':
        'moglix:' +
        taxo1 +
        ':' +
        taxo2 +
        ':' +
        taxo3 +
        `: listing ${previousRoute}`,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.suggestionClicked': suggestionClicked ? 'yes' : 'no',
      'myapp.trendingSearch': trendingSearch ? 'yes' : 'no',
      'myapp.voicesearch': isVoiceSearch ? 'yes' : 'no',
    });
  };

  const adobeBrandListingTrackEvent = () => {
    trackStateAdobe('moglix:' + paramsStr + ': listing', {
      'myapp.pageName': 'moglix:' + paramsStr + ': listing',
      'myapp.channel': 'brand',
      'myapp.subSection':
        'moglix:' + paramsStr + `:brand  listing ${previousRoute}`,
      'myapp.brand': paramsStr,
      'myapp.suggestionClicked': suggestionClicked ? 'yes' : 'no',
      'myapp.trendingSearch': trendingSearch ? 'yes' : 'no',
      'myapp.voicesearch': isVoiceSearch ? 'yes' : 'no',
    });
  };

  const adobeSearchListingTrackEvent = () => {
    trackStateAdobe('moglix:' + paramsStr + ': listing', {
      'myapp.pageName': 'moglix:' + paramsStr + ': listing',
      'myapp.channel': 'search',
      'myapp.subSection': `moglix: search ${searchType}`,
      'myapp.suggestionClicked': suggestionClicked ? 'yes' : 'no',
      'myapp.trendingSearch': trendingSearch ? 'yes' : 'no',
      'myapp.searchterm': `${paramsStr}`,
      'myapp.voicesearch': isVoiceSearch ? 'yes' : 'no',
    });
  };

  const adobeBrandCategoryListingTrackEvent = () => {
    trackStateAdobe('moglix:' + paramsStr + ': listing', {
      'myapp.pageName': 'moglix:' + paramsStr + ': listing',
      'myapp.channel': 'brand:category',
      'myapp.subSection':
        'moglix:' + paramsStr + `:brand category listing ${previousRoute}`,
      'myapp.brand': paramsStr,
      'myapp.suggestionClicked': suggestionClicked ? 'yes' : 'no',
      'myapp.trendingSearch': trendingSearch ? 'yes' : 'no',
      'myapp.voicesearch': isVoiceSearch ? 'yes' : 'no',
    });
  };

  const clickStreamPageLoadCategory = () => {
    let taxo1 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[0]) ||
      '';
    let taxo2 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[1]) ||
      '';
    let taxo3 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[2]) ||
      '';

    let dataTracking = {
      url: `https://api.moglix.com/category/getcategory?type=${
        listingParams.type
      }&orderBy=${listingParams.orderBy}&orderWay=${
        listingParams.orderWay
      }&pageIndex=${listingParams.pageIndex}&pageSize=${
        listingParams.pageSize
      }&str=${listingParams.str}&category=${
        listingParams.category
      }&listingType=${listingParams.listingType}&filter=${JSON.stringify(
        appliedFilter,
      )}`,
      event_type: 'page_load',
      label: 'view',
      page_type: 'category_page',
      channel: 'Listing',
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      productCount: totalCount,
      filteradded:
        appliedFilter && Object.keys(appliedFilter).length ? true : false,
    };
    sendClickStreamData(dataTracking);
  };

  const clickStreamPageLoadBrand = () => {
    let brandStr = listingParams.str.replace(/\s+/g, '-');
    let dataTracking = {
      url: `https://api.moglix.com/brand/getbrand?type=${
        listingParams.type
      }&orderBy=${listingParams.orderBy}&orderWay=${
        listingParams.orderWay
      }&pageIndex=${listingParams.pageIndex}&pageSize=${
        listingParams.pageSize
      }&brand=${brandStr}&filter=${JSON.stringify(appliedFilter)}`,
      event_type: 'page_load',
      label: 'view',
      page_type: 'brand_page',
      channel: 'Listing',
      brandName: brandStr,
      productCount: totalCount,
      filteradded:
        appliedFilter && Object.keys(appliedFilter).length ? true : false,
    };
    sendClickStreamData(dataTracking);
  };

  const clickStreamPageLoadBrandCategory = () => {
    let taxo1 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[0]) ||
      '';
    let taxo2 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[1]) ||
      '';
    let taxo3 =
      (categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy &&
        categoryRes &&
        categoryRes.categoryDetails &&
        categoryRes.categoryDetails.taxonomy.split('/')[2]) ||
      '';
    let brandStr = listingParams.str.replace(/\s+/g, '-');
    let dataTracking = {
      url: `https://api.moglix.com/brand/getbrand?type=${
        listingParams.type
      }&orderBy=${listingParams.orderBy}&orderWay=${
        listingParams.orderWay
      }&pageIndex=${listingParams.pageIndex}&pageSize=${
        listingParams.pageSize
      }&brand=${brandStr}&category=${
        listingParams.category
      }filter=${JSON.stringify(appliedFilter)}`,
      event_type: 'page_load',
      label: 'view',
      page_type: 'brand_category_page',
      channel: 'Listing',
      brandName: brandStr,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      productCount: totalCount,
      filteradded:
        appliedFilter && Object.keys(appliedFilter).length ? true : false,
    };
    sendClickStreamData(dataTracking);
  };

  const clickStreamPageLoadSearch = () => {
    let dataTracking = {
      url: `https://api.moglix.com/category/getcategory?type=${
        listingParams.type
      }&orderBy=${listingParams.orderBy}&orderWay=${
        listingParams.orderWay
      }&pageIndex=${listingParams.pageIndex}&pageSize=${
        listingParams.pageSize
      }&str=${listingParams.str}&category=${
        listingParams.category
      }&listingType=${listingParams.listingType}&filter=${JSON.stringify(
        appliedFilter,
      )}`,
      event_type: 'page_load',
      label: 'view',
      page_type: 'search_page',
      channel: 'Listing',
      productCount: totalCount,
      search_query: paramsStr,
      filteradded:
        appliedFilter && Object.keys(appliedFilter).length ? true : false,
    };
    sendClickStreamData(dataTracking);
  };

  //api hit for orderWay, orderBy, appliedFilter changes
  useEffect(() => {
    if (!loader) {
      fetchListingData(0);
    }
  }, [orderWay, orderBy]);

  //action dispatch for saga and service
  const fetchListingData = pageIndex => {
    let fetchListingObj = {
      type: 'm',
      orderBy,
      orderWay,
      pageIndex,
      pageSize,
      str: str,
      category:
        listingType === 'Category'
          ? encodeURIComponent(category)
          : listingType === 'Brand' && category
          ? category
          : listingType === 'Search' && category
          ? category
          : null,
      brand:
        listingType === 'Brand'
          ? str
              .replace('-', ' ')
              .split(' ')
              .map(_ => _.replace(/^./, _ && _[0] && _[0].toUpperCase()))
              .join(' ')
          : null,
      listingType,
      filter,
      appliedFilter,
    };
    dispatch(fetchProductSearchResult(fetchListingObj));
  };

  //onEndReached api hit
  const endReachedfetchListing = () => {
    if (
      products_status === STATE_STATUS.FETCHED &&
      products_status !== STATE_STATUS.FETCHING &&
      pageNo + 1 < maxPage &&
      !loader
    ) {
      fetchListingData(pageNo + 1);
    }
  };
  //search header
  const renderSearch = () => (
    <View style={styles.searchView}>
      <View style={styles.searchBox}>
        <TouchableOpacity style={styles.searchIconWrap} onPress={() => {}}>
          <MaterialCommunityIcon
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

  const listEmptyComponent = () => (
    <View style={styles.noOrders}>
      <View style={styles.whiteBgWithImage}>
        <Text style={styles.noOrderText}>No Product Found</Text>
        <Image
          source={require('../../assets/images/nosearchillustration.png')}
          style={styles.noOrderImage}
          resizeMode="contain"
        />
        <Text style={styles.noOrderContent}>
          Maybe your search was too specific. Kindly check your spelling or
          Please try after clear filters
        </Text>
        <TouchableOpacity onPress={clearFilters} style={styles.BuyNowBtn}>
          <Text style={styles.BuyNowBtnText}>CLEAR FILTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const addToCartFromListing = async msn => {
    setParentLoader(true);
    const productBoData = await getProduct(msn);
    let productData = {...productBoData.data.productBO};
    if (
      productData &&
      productData.filterAttributesList &&
      productData.filterAttributesList.length &&
      productData.filterAttributesList != null
    ) {
      setGrpProductData(productData);
      setGrpPdMsn(msn);
      setGrpPdModal(true);
      setParentLoader(false);
    } else {
      await addtoCart(
        cart,
        msn,
        productData,
        dispatch,
        sessionId,
        token,
        {push: () => {}},
        1,
        false,
        false,
        false,
        false,
        navigateCart,
      );
      adjustAddEvent(msn, productData, 1);
      webEngageAddBuyEvent(msn, productData, 1);
      adobeAddCartTrackEvent(msn, productData, 1);
      clickStreamAddCart(msn, productData, 1);
      setParentLoader(false);
    }
  };

  const navigateCart = (msn, productData, quantity) => {
    adobeGotoCartTrackEvent(msn, productData, quantity);
    props.navigation.push('Cart');
  };

  const adobeGotoCartTrackEvent = (msn, productData, quantity) => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';
    let obj = {
      'myapp.linkpagename':
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'listing',
      'myapp.ctaname': 'go to cart',
      'myapp.channel': 'listing',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: listing`,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber || msn,
      'myapp.productPrice':
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.quantity': quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const clickStreamAddCart = (msn, productData, quantity) => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';

    let dataTracking = {
      event_type: 'click',
      label: 'add_to_cart',
      page_type:
        paramsType == 'Category'
          ? 'category_page'
          : paramsType == 'Brand' &&
            listingParams.category &&
            listingParams.category != ''
          ? 'brand_category_page'
          : paramsType == 'Brand'
          ? 'brand_page'
          : 'search_page',
      channel: paramsType == 'Search' ? 'Search' : 'Listing',
      product_name: productData && productData.productName,
      msn: productData.partNumber || msn,
      price: String(
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      ),
      brand: productData.brandDetails && productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      quantity:
        quantity ||
        (productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india.moq) ||
        1,
      oos: productData.outOfStock,
    };
    sendClickStreamData(dataTracking);
  };

  const adjustAddEvent = (msn, productData, quantity) => {
    var adjustEvent = new AdjustEvent('cxcov6');
    adjustEvent.addPartnerParameter('id', String(msn));
    adjustEvent.addPartnerParameter(
      'price',
      String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .priceWithoutTax,
      ),
    );
    adjustEvent.addPartnerParameter('quantity', String(quantity)),
      adjustEvent.addPartnerParameter('currency', 'INR'),
      trackAdjust(adjustEvent);
  };

  const webEngageAddBuyEvent = (msn, productData, quantity) => {
    let webengageAddBuyObj = {
      Brand: productData.brandDetails && productData.brandDetails.brandName,
      'Category Id':
        productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode,
      'Category Name':
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomy,
      Currency: 'INR',
      Discount:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.discount,
      'Image URL': `https://cdn.moglix.com/${
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].images &&
        productData.productPartDetails[msn].images[0] &&
        productData.productPartDetails[msn].images[0].links &&
        productData.productPartDetails[msn].images[0].links.medium
      }`,
      Price:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .priceWithoutTax,
      'Product Id': msn,
      'Product Name': productData && productData.productName,
      Quantity: quantity,
      'Retail Price':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.mrp,
    };

    webEngageTracking('addedToCart', webengageAddBuyObj);
  };

  const adobeAddCartTrackEvent = (msn, productData, quantity) => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';
    let obj = {
      'myapp.linkpagename':
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'listing',
      'myapp.ctaname': 'add to cart',
      'myapp.channel': 'listing',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: listing`,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber || msn,
      'myapp.productPrice':
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.quantity': quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags || [],
      'myapp.parentID': productData.partNumber || msn,
      '&&products':
        ';' +
        productData.partNumber +
        ';' +
        quantity +
        ';' +
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice *
          quantity +
        ';',
      '&&events': 'scAdd,event7',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const variantAddCart = async grppdQuantity => {
    await addtoCart(
      cart,
      grpPdMsn,
      grpProductData,
      dispatch,
      sessionId,
      token,
      {push: () => {}},
      grppdQuantity,
      false,
      false,
    );
    setGrpPdModal(false);
    adjustAddEvent(grpPdMsn, grpProductData, grppdQuantity);
    adobeAddCartTrackEvent(grpPdMsn, grpProductData, grppdQuantity);
    clickStreamAddCart(grpPdMsn, grpProductData, grppdQuantity);
  };

  const rfqRequirementFromListing = item => {
    setRfqRequirement(!rfqRequirement);
    setRfqData(item);
  };

  // each itemRender
  const renderItem = ({item}) => {
    return (
      <View style={styles.listViewCard}>
        <FlatList
          style={{
            zIndex: 9,
            position: 'relative',
            paddingHorizontal: Dimension.padding3,
            marginHorizontal: 15,
            marginBottom: 15,
          }}
          contentContainerStyle={{flex: 1}}
          // horizontal={true}
          data={(item && item.videoInfo && item.videoInfo.slice(0, 1)) || []}
          renderItem={({item, index}) => (
            <View style={styles.videoWrap}>
              {/* <Text style={styles.videoTitle}>{item.title}</Text> */}
              <View style={styles.youtubeWrap}>
                <YoutubePlayer
                  play={true}
                  key={index}
                  webViewProps={{allowsFullscreenVideo: true}}
                  height={190}
                  videoId={item.link.match(youtubeRegex)[2].toString()}
                />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${index}-item`}
        />
        {/* <View style={styles.listCardBtns}>
          {item.quantityAvailable && !item.outOfStock ? (
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => addToCartFromListing(item.moglixPartNumber)}>
              <Text style={styles.cartBtnText}>ADD TO CART</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sendQueryBtn}
              onPress={() => {
                setRfqRequirement(!rfqRequirement);
                setRfqData(item);
              }}>
              <Text style={styles.sendQueryBtnText}>SEND QUERY</Text>
            </TouchableOpacity>
          )}
        </View> */}
        <ProductListView
          listingStyle={styles.listingWidth}
          navigation={props.navigation}
          item={item}
          addToCartFromListing={addToCartFromListing}
          rfqRequirementFromListing={rfqRequirementFromListing}
          fromListing
          parentLoader={parentLoader}
        />
      </View>
    );
  };

  //category child Item
  const categoryChildItem = ({item, index}) => {
    return (
      <>
        {index == 0 ? (
          <TouchableOpacity
            // onPress={() => categoryChildItemClicked(item)}
            style={[
              styles.catChildCard,
              {
                borderColor: colors.RedThemeColor,
                backgroundColor: colors.LightRedThemeColor,
              },
            ]}>
            <Text
              style={[
                styles.catChildItem,
                {marginLeft: 0, color: colors.RedThemeColor},
              ]}>
              All
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => categoryChildItemClicked(item)}
          style={styles.catChildCard}>
          <Image
            style={{width: 20, height: 20}}
            source={{
              uri:
                'https://cdn.moglix.com/' + item.categoryDetails.mainImageLink,
            }}
          />
          <Text style={styles.catChildItem}>
            {item && item.categoryDetails && item.categoryDetails.categoryName}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  //categoryChildItem handle fx
  const categoryChildItemClicked = item => {
    props.navigation.push('Listing', {
      str: item && item.categoryDetails && item.categoryDetails.categoryId,
      type: 'Category',
      category: item && item.categoryDetails && item.categoryDetails.categoryId,
      name: item && item.categoryDetails && item.categoryDetails.categoryName,
    });
  };

  //selectedFilter
  const selectFilter = term => {
    let currentFilters = {...appliedFilter};
    if (
      currentFilters[initialFilter] &&
      currentFilters[initialFilter].includes(term)
    ) {
      currentFilters[initialFilter] = currentFilters[initialFilter].filter(
        _ => _ != term,
      );
    } else {
      if (currentFilters[initialFilter]) {
        currentFilters[initialFilter].push(term);
      } else {
        currentFilters[initialFilter] = [];
        currentFilters[initialFilter].push(term);
      }
    }
    setAppliedFilter(currentFilters);
  };

  //applied filters api hit
  const applyFilters = () => {
    setFilterModal(false);
    fetchListingData(0);
  };

  const percentageAdder = (term, type) => {
    let txt = '';
    let left = '';
    let right = '';
    if (type == 'discount') {
      if (term == '0 - 10') {
        txt = term.slice(0, 1) + '%' + term.slice(2) + '%';
      } else if (term == '51 - *') {
        txt = term.slice(0, 2) + '%' + term.slice(3);
      } else {
        txt = term.slice(0, 2) + '%' + term.slice(3) + '% ';
      }
    } else if (type == 'price') {
      if (term.includes('*')) {
        left = '₹' + term.split(' - ')[0];
        right = term.split(' - ')[1];
        txt = left + ' - ' + right;
      } else {
        left = '₹' + term.split(' - ')[0];
        right = '₹' + term.split(' - ')[1];
        txt = left + ' - ' + right;
      }
    } else {
      txt = term;
    }
    return txt;
  };

  //Inline Filters
  const renderInLineFilters = ({leadingItem}) => {
    let updatedLeadingItem =
      leadingItem.length == 2
        ? leadingItem.find(_ => _.selfCounter == 5)
        : leadingItem;
    if (
      (updatedLeadingItem || {}).selfCounter === 5 &&
      listingType === 'Category'
    ) {
      let brandData = [
        ...((filter.find(_ => _.name == 'brand') || {}).terms || []),
      ];
      if (brandData && brandData.length && brandData.length > 6) {
        brandData.length = 5;
      }
      return (
        <View style={styles.exploreWrapper}>
          <Text style={styles.exploreText}>
            Explore{' '}
            {categoryRes &&
              categoryRes.categoryDetails &&
              categoryRes.categoryDetails.categoryName}{' '}
            by top brands
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {brandData.map((category, key) => (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.push(
                    'Listing',
                    {
                      str: category.term,
                      type: 'Brand',
                      category: '',
                    },
                    `${Math.random()}`,
                  );
                }}
                style={styles.brands}>
                <Text style={styles.exploreBrandText}>{category.term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    } else if (
      listingType === 'Category' &&
      (((updatedLeadingItem || {}).selfCounter || 0) + 1) / 6 >= 2 &&
      (((updatedLeadingItem || {}).selfCounter || 0) + 1) % 6 == 0
    ) {
      let currentCount =
        (((updatedLeadingItem || {}).selfCounter || 0) + 1) / 6 - 2;
      let appliedFilters = Object.keys(appliedFilter);
      if (filter[currentCount]) {
        let filtername = filter[currentCount].name;
        if (
          (appliedFilters.includes(filtername) &&
            (appliedFilter[filtername] || []).length ==
              (
                filter[currentCount].terms.filter(
                  term => term.enabled && term.count,
                ) || []
              ).length) ||
          ['brand', 'category'].includes(filter[currentCount].name)
        ) {
          return null;
        }

        return (
          <View style={styles.exploreWrapper}>
            <Text style={styles.exploreText}>
              Explore by {filter[currentCount].name}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {filter[currentCount].terms
                .filter(term => term.enabled && term.count)
                .map((category, key) =>
                  (appliedFilter[filtername] || []).includes(
                    category.term,
                  ) ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        openCustomFilter(filtername, category.term);
                      }}
                      style={styles.brands}>
                      <Text style={styles.exploreBrandText}>
                        {percentageAdder(
                          category.term,
                          filter[currentCount].name,
                        )}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
            </ScrollView>
          </View>
        );
      }
    }
    return null;
  };

  const openCustomFilter = (filterKey, filterItemKey) => {
    let currentFilters = {...appliedFilter};
    if (currentFilters[filterKey]) {
      currentFilters[filterKey].push(filterItemKey);
    } else {
      currentFilters[filterKey] = [];
      currentFilters[filterKey].push(filterItemKey);
    }

    setAppliedFilter(currentFilters);

    let fetchListingObj = {
      type: 'm',
      orderBy,
      orderWay,
      pageIndex: 0,
      pageSize,
      str: str,
      category:
        listingType === 'Category'
          ? encodeURIComponent(category)
          : listingType === 'Brand' && category
          ? category
          : listingType === 'Search' && category
          ? category
          : null,
      brand:
        listingType === 'Brand'
          ? str
              .replace('-', ' ')
              .split(' ')
              .map(_ => _.replace(/^./, _ && _[0] && _[0].toUpperCase()))
              .join(' ')
          : null,
      listingType,
      filter,
      appliedFilter: currentFilters,
    };
    dispatch(fetchProductSearchResult(fetchListingObj));

    // props.navigation.push(
    //   'Listing',
    //   {
    //     str: categoryRes.categoryDetails.categoryId,
    //     type: category ? 'Category' : listingType,
    //     categoryId: categoryRes.categoryDetails.categoryId,
    //     category: categoryRes.categoryDetails.categoryId,
    //     customFilterApplied: true,
    //     appliedFilter: currentFilters,
    //   },
    //   `${Math.random()}`,
    // );
  };

  const renderFooter = () => {
    if (products_status != STATE_STATUS.FETCHED && pageNo > 0) {
      return (
        <View style={{padding: 100}}>
          <ActivityIndicator
            style={{alignSelf: 'center'}}
            color={colors.RedThemeColor}
            size={'large'}
          />
        </View>
      );
    }
    return null;
  };

  const _recommendedCategories = () => {
    if (recommendedCat && recommendedCat.length) {
      return (
        <View>
          {recommendedCat && recommendedCat.length ? (
            <Text style={styles.recommHeading}>Are you looking for</Text>
          ) : null}
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommendedCat.map((category, index) =>
                index < 3 ? (
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.push(
                        'Listing',
                        {
                          type: 'Search',
                          str: category.categoryName,
                          id: category.categoryId,
                          type: 'Search',
                        },
                        'listing_' +
                          category.categoryId +
                          category.categoryName,
                      )
                    }
                    key={index}
                    style={styles.alphatextList}>
                    <Text style={styles.cattext}>{category.categoryName}</Text>
                  </TouchableOpacity>
                ) : null,
              )}
            </ScrollView>
          </View>
        </View>
      );
    }
  };

  const productListing = () => (
    <>
      {categoryRes && categoryRes.children && categoryRes.children.length ? (
        <View>
          <FlatList
            style={styles.flatListRow}
            data={categoryRes.children}
            renderItem={categoryChildItem}
            keyExtractor={(item, index) => `${index}-item`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: Dimension.padding5,
              paddingRight: Dimension.padding10,
            }}
          />
        </View>
      ) : null}
      {products && products.length ? (
        <>
          <ListingHeader
            styles={styles.filterHeadRow}
            appliedFilter={appliedFilter}
            setSortByModal={setSortByModal}
            setFilterModal={setFilterModal}
          />
        </>
      ) : null}
      <View
        style={{
          paddingHorizontal: Dimension.padding15,
          paddingTop: Dimension.padding10,
          flexDirection: 'row',
        }}>
        {_recommendedCategories()}
      </View>
      <Text style={styles.listingHeader}>
        {paramsType == 'Category'
          ? categoryRes &&
            categoryRes.categoryDetails &&
            categoryRes.categoryDetails.categoryName
          : paramsCategoryName || paramsStr}{' '}
        <Text style={styles.greyText}>({(maxPage * 20).toFixed()} items)</Text>
      </Text>
      <View style={styles.listingArea}>
        <FlatList
          data={products}
          renderItem={renderItem}
          style={{paddingBottom: 380}}
          contentContainerStyle={{paddingBottom: 380}}
          keyExtractor={(item, index) => `${index}-item`}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={endReachedfetchListing}
          ItemSeparatorComponent={renderInLineFilters}
          ListEmptyComponent={listEmptyComponent}
        />
      </View>
    </>
  );
  const renderError = () => (
    <View>
      <Text style={{alignSelf: 'center'}}>
        Something went wrong while fetching data
      </Text>
    </View>
  );

  const renderLoader = () => (
    <ActivityIndicator
      size={'large'}
      color={'red'}
      style={styles.activityIndicator}
    />
  );

  const renderListing = () => {
    if (initLoader) {
      return renderLoader();
    } else if (
      loader ||
      (pageNo == 0 &&
        [STATE_STATUS.UNFETCHED, STATE_STATUS.FETCHING].includes(
          products_status,
        ))
    ) {
      return renderLoader();
    } else {
      return productListing();
    }
  };

  const renderHeader = () => (
    <Header
      navigation={props.navigation}
      showBack
      showWishlist
      showSearch
      // showLogo
      // showLargeSearch
      showCart
      showBackToHome
      style={styles.noboxshadow}
      // showName
    />
    // <View style={styles.mainHeader}>{renderSearch()}</View>
  );

  return (
    <View>
      {renderHeader()}
      {renderListing()}
      {filterModal && (
        <FiltersModal
          filter={filter}
          setFilterModal={setFilterModal}
          filterModal={filterModal}
          setInitialFilter={setInitialFilter}
          initialFilter={initialFilter}
          categoryChildItemClicked={categoryChildItemClicked}
          selectFilter={selectFilter}
          appliedFilter={appliedFilter}
          applyFilters={applyFilters}
          appliedFilterinReducer={appliedFilterinReducer}
          clearFilters={clearFilters}></FiltersModal>
      )}

      {sortByModal && (
        <SortByModal
          sortByModal={sortByModal}
          orderWay={orderWay}
          orderBy={orderBy}
          setSortByModal={setSortByModal}
          setOrderBy={setOrderBy}
          setOrderWay={setOrderWay}></SortByModal>
      )}
      {rfqSuccess && (
        <RFQSuccess visible={rfqSuccess} onClose={() => setRfqSuccess(false)} />
      )}
      {rfqRequirement ? (
        <RfqRequirement
          rfqRequirement={rfqRequirement}
          setRfqRequirement={setRfqRequirement}
          user={user}
          sessionId={sessionId}
          showSuccess={() => setRfqSuccess(true)}
          token={token}
          userId={userId}
          fromListing
          fromScreen="Listing"
          rfqData={rfqData}
          paramsType={paramsType}
        />
      ) : null}

      {grpPdModal && (
        <VariantAddCart
          grpPdModal={grpPdModal}
          setGrpPdModal={setGrpPdModal}
          grpProductData={grpProductData}
          refetchWithMsn={addToCartFromListing}
          grpPdMsn={grpPdMsn}
          variantAddCart={variantAddCart}
          sessionId={sessionId}
          token={token}
          userId={userId}
          user={user}
        />
      )}
    </View>
  );
};

export default ListingScreen;
