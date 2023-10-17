import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  InteractionManager,
  Platform,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Share,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import RNFetchBlob from 'rn-fetch-blob';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import ProductPrice from '../../components/Common/ProductPrice';
import {
  fetchProduct,
  fetchProductReview,
  fetchProductQuestion,
  setFbtProducts,
} from '../../redux/actions/products';
import {STATE_STATUS} from '../../redux/constants';
import {RATINGS} from '../../redux/constants/products';
import styles from './style';
import ReturnPolicy from '../../components/Common/ReturnPolicy';
import SectionTitle from '../../components/Common/SectionTitle';
import Dimension from '../../redux/constants/dimensions';
import KeyFeatures from '../../components/Common/KeyFeatures';
import ProductSpecs from '../../components/Common/ProductSpecs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import HomeMainCarousel from '../../components/Common/HomeMainCarousel';
import FreeShipping from '../../components/Common/FreeShipping';
import GetQuote from '../../components/Common/GetQuote';
import SimilarProducts from '../../components/Common/SimilarProducts';
import RelatedCategories from '../../components/Common/RelatedCategories';
import EmiAvailable from '../../components/Common/EmiAvailable';
import CouponsOffers from '../../components/Common/CouponsOffers';
import Varients from '../../components/Common/Varients';
import QAModal from '../../components/Common/QAModal';
import ReviewModal from '../../components/Common/ReviewModal';
import {getFbtProductsApi, getProductLogistics} from '../../services/products';
import {addtoCart} from '../../generic/Cart/index';
import PincodeModal from '../../components/Common/PincodeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchAddressByInvoiceType} from '../../redux/actions/address';
import Header from '../../components/Common/Header';
import {updateWishlist} from '../../redux/actions/wishlist';
import DeliveryData from '../../components/Common/DeliveryData';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Quantity from '../../components/Common/Quantity';
import colors from '../../redux/constants/colors';
import ProductGridView from '../../components/Common/ProductGridView';
import RfqRequirement from '../../components/Common/RfqRequirement';
import Fbt from '../../components/Common/Fbt';
import EMI from '../Payment/EMI';
import WriteReviewModal from '../../components/Common/WriteReviewModal';
import QandAModal from '../../components/Common/QandAModal';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import {
  trackAdjust,
  webEngageTracking,
  webEngageScreenTracking,
  trackStateAdobe,
  sendClickStreamData,
} from '../../services/analytics';
const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
import {useFocusEffect} from '@react-navigation/native';
import RFQSuccess from '../../components/Common/RFQSuccess';
import {fetchSetRecentlyViewed} from '../../redux/actions/recentlyViewed';
import ProductBrought from '../../components/Common/ProductBrought';

const youtubeRegex = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;

const ProductScreen = props => {
  const scrollviewRef = useRef();
  const msn = String(props.route.params.msn).toUpperCase();
  const wishlistData =
    useSelector(state => state.wishlistReducer || {}).data || [];
  const wishlistStatus =
    useSelector(state => state.wishlistReducer || {}).status ||
    STATE_STATUS.FETCHING;
  const productData = useSelector(
    state => ((state.productsReducer[msn] || {}).productBO || {}).data || {},
  );
  const productStatus = useSelector(
    state =>
      ((state.productsReducer[msn] || {}).productBO || {}).status ||
      STATE_STATUS.UNFETCHED,
  );
  const productReviewData = useSelector(
    state => ((state.productsReducer[msn] || {}).review || {}).data || {},
  );
  const productReviewStatus = useSelector(
    state =>
      ((state.productsReducer[msn] || {}).review || {}).status ||
      STATE_STATUS.UNFETCHED,
  );
  const productQuestionData = useSelector(
    state => ((state.productsReducer[msn] || {}).question || {}).data || {},
  );
  const productQuestionStatus = useSelector(
    state =>
      ((state.productsReducer[msn] || {}).question || {}).status ||
      STATE_STATUS.UNFETCHED,
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const user = useSelector(state => (state.authReducer || {}).data || {});

  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const authenticated = useSelector(
    state => ((state.authReducer || {}).data || {}).authenticated || 'false',
  );
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const similarProducts = useSelector(
    state => ((state.productsReducer || {})[msn] || {}).similarProducts || {},
  );

  const fbtProducts = useSelector(
    state => (state.productsReducer[msn] || {}).fbtProducts || {},
  );

  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );

  const addresses = useSelector(state => state.addressReducer || {});

  const fromScreen = props.route.params.fromScreen;

  const dispatch = useDispatch();
  const [init, setInit] = useState(true);
  const [qaModalVisible, setQaModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [pincodeModal, setPincodeModal] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState({postCode: ''});
  const [deliveryData, setDeliveryData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const lottieanimation = useRef(null);
  const isFirstRun = useRef(true);
  let rfqRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [EMIModalVisible, setEMIModalVisible] = useState(false);
  const [writeReviewModalVisible, setWriteReviewModalVisible] = useState(false);
  const [QandAModalVisible, setQandAModalVisible] = useState(false);
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const [buyNowLoader, setBuyNowLoader] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [offer, setOffer] = useState({});
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [callbackFn, setCallbackFn] = useState(null);

  useFocusEffect(
    useCallback(() => {
      scrollviewRef.current &&
        scrollviewRef.current.scrollTo({x: 0, y: 0, animated: true});
    }, [props.navigation]),
  );

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (productStatus !== STATE_STATUS.FETCHED) {
        fetchData(msn);
        fetchServiceabilityAddress();
      }
    });
    setInit(false);
  }, []);

  useEffect(() => {
    if (wishlistStatus == STATE_STATUS.FETCHED) {
      setIsLiked(
        !!(wishlistData.find(_ => _.idProduct == msn) || {}).idProduct,
      );
    }
  }, [wishlistStatus]);

  useEffect(() => {
    if (!init) {
      // if (isFirstRun.current) {
      //   if (isLiked) {
      //     lottieanimation &&
      //       lottieanimation.current &&
      //       lottieanimation.current.play(52, 52);
      //   } else {
      //     lottieanimation &&
      //       lottieanimation.current &&
      //       lottieanimation.current.play(18, 18);
      //   }
      //   isFirstRun.current = false;
      // } else
      if (isLiked) {
        lottieanimation &&
          lottieanimation.current &&
          lottieanimation.current.play(19, 52);
        if (
          productData.categoryDetails &&
          productData.brandDetails &&
          productData
        ) {
          const productObj = {
            brand:
              productData.brandDetails && productData.brandDetails.brandName,
            category:
              productData.categoryDetails &&
              productData.categoryDetails[0].categoryCode,
            description: productData.desciption,
            idProduct: productData.partNumber,
            idUser: userId,
            productName: productData.productName,
            userType: `business`,
          };
          let IsWishListMsn = (wishlistData.find(_ => _.idProduct == msn) || {})
            .idProduct;
          if (IsWishListMsn != msn) {
            dispatch(updateWishlist(productObj, sessionId, token, 'add'));
          }
        }
      } else {
        lottieanimation &&
          lottieanimation.current &&
          lottieanimation.current.play(0, 18);
        if (
          productData.categoryDetails &&
          productData.brandDetails &&
          productData
        ) {
          const productObj = {
            brand:
              productData.brandDetails && productData.brandDetails.brandName,
            category: productData.categoryDetails[0].categoryCode,
            description: productData.desciption,
            idProduct: productData.partNumber,
            idUser: userId,
            productName: productData.productName,
            userType: `business`,
          };
          dispatch(
            updateWishlist(productObj, sessionId, token, 'remove', true),
          );
        }
      }
    }
  }, [isLiked]);

  useEffect(() => {
    if (productStatus == STATE_STATUS.FETCHED) {
      if (
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.moq
      ) {
        let partDetails =
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn];
        setQuantity(
          productData.productPartDetails[msn].productPriceQuantity.india.moq ||
            1,
        );
        if (authenticated == 'true') {
          // try {
          let data = {
            availability_for_order: productData.outOfStock ? 0 : 1,
            brand_name: productData.brandDetails.brandName,
            category_id: productData.categoryDetails[0].categoryCode,
            category_name: productData.categoryDetails[0].categoryName,
            created_by_source: 'Mobile',
            id_brand: productData.brandDetails.idBrand,
            mrp: productData.productPartDetails[msn].productPriceQuantity.india
              .mrp,
            msn: msn,
            out_of_stock: productData.outOfStock,
            price_with_tax:
              productData.productPartDetails[msn].productPriceQuantity.india
                .mrp,
            price_without_tax:
              productData.productPartDetails[msn].productPriceQuantity.india
                .priceWithoutTax,
            product_image:
              partDetails.images &&
              partDetails.images[0] &&
              partDetails.images[0].links &&
              partDetails.images[0].links.small &&
              partDetails.images[0].links.small.replace(
                'https://img.moglimg.com/',
                '',
              ),
            product_name: productData.productName,
            product_url: productData.defaultCanonicalUrl,
            session_id: sessionId,
            status: true,
            url_link: `https://www.moglix.com/${productData.defaultCanonicalUrl}`,
            user_id: userId,
          };
          dispatch(fetchSetRecentlyViewed(data, userId, token, sessionId));
        }
      }
      clickStreamPageLoad();
    }
  }, [productStatus]);

  const fetchData = newMsn => {
    dispatch(fetchProduct(newMsn));
    getFbtProducts();
    dispatch(fetchProductReview(newMsn));
    dispatch(fetchProductQuestion(newMsn));
    if (authenticated == 'true') {
      if (
        (authenticated == 'true' && !addresses.retail) ||
        (authenticated == 'true' &&
          addresses.retail.status !== STATE_STATUS.FETCHED)
      ) {
        dispatch(fetchAddressByInvoiceType(userId, 'retail', sessionId, token));
      }
      if (
        (authenticated == 'true' && !addresses.tax) ||
        (authenticated == 'true' &&
          addresses.tax.status !== STATE_STATUS.FETCHED)
      ) {
        dispatch(fetchAddressByInvoiceType(userId, 'tax', sessionId, token));
      }
    }
  };

  useEffect(() => {
    if (productStatus == STATE_STATUS.FETCHED) {
      adjustMsnEvent();
      webEngageProductViewed();
      webEngageScreenTracking('ProductScreen', {
        productId: msn,
        price:
          productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .priceWithoutTax,
        category:
          productData.categoryDetails &&
          productData.categoryDetails[0] &&
          productData.categoryDetails[0].taxonomy,
      });
      adobeProductTrackState();
    }
  }, [productData]);

  const adjustMsnEvent = () => {
    var adjustEvent = new AdjustEvent('y6khv6');
    adjustEvent.addPartnerParameter('id', msn);
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
      adjustEvent.addPartnerParameter('quantity', String(quantity)),
      adjustEvent.addPartnerParameter('currency', 'INR'),
    );
    trackAdjust(adjustEvent);
  };

  const webEngageProductViewed = () => {
    let webengageObj = {
      Brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
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
      'Retail Price':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.mrp,
      'SubCategory Name':
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].categoryName,
      URL: 'https://www.moglix.com' + '/' + productData.defaultCanonicalUrl,
      'Stock Status':
        productData && productData.outOfStock ? 'Out of Stock' : 'In Stock',
    };

    webEngageTracking('productViewed', webengageObj);
  };

  const adobeProductTrackState = () => {
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

    trackStateAdobe('' + taxo1 + ':' + taxo2 + ':' + taxo3 + ': pdp', {
      'myapp.pageName': taxo1 + ':' + taxo2 + ':' + taxo3 + ': pdp',
      'myapp.channel': 'pdp',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + ': pdp ' + fromScreen,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber,
      'myapp.stockStatus': productData.outOfStock ? 'Out of Stock' : 'In Stock',
      'myapp.productPrice': String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      'myapp.quantity': String(quantity),
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags,
      '&&products':
        ';' +
          productData.partNumber +
          ';' +
          quantity +
          ';' +
          productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice + ';',
      '&&events': 'prodView',
      fbtVisible:
        fbtProducts && fbtProducts.data && fbtProducts.data.length
          ? 'YES'
          : 'NO',
    });
  };

  const clickStreamPageLoad = () => {
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
      active_tags: null,
      event_type: 'page_load',
      label: 'view',
      // rating:
      //   productReviewData &&
      //   productReviewData.summaryData &&
      //   productReviewData.summaryData.final_average_rating.toFixed(1),
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData.outOfStock,
      channel: 'PDP',
      search_query: null,
      active_promo_codes: '',
      url_complete_load_time: null,
      time_to_interactive: null,
      page_type: 'product_page',
      moq:
        (productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india.moq) ||
        1,
    };
    sendClickStreamData(dataTracking);
  };

  const getFbtProducts = async () => {
    const {data} = await getFbtProductsApi(msn, sessionId, token);
    if (data.data) {
      dispatch(setFbtProducts(msn, data.data));
    }
  };

  const fetchServiceabilityAddress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@pincode');
      const tasksObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (tasksObj) productLogistics(tasksObj);
    } catch (e) {
      // error reading value
      console.log('loading stored data doesnt work');
    }
  };

  const [SPModalVisible, setSPModalVisible] = useState(false);
  const viewSimilarProducts = () => {
    setSPModalVisible(!SPModalVisible);
  };

  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const couponAndOffersModal = offer => {
    setCouponModalVisible(!couponModalVisible);
    if (offer && offer.status) {
      setOffer(offer);
    }
  };

  const [HIWModalVisible, setHWIModalVisible] = useState(false);
  const viewHowItWorks = () => {
    setHWIModalVisible(!HIWModalVisible);
  };

  const refetchWithMsn = newMsn => {
    props.navigation.navigate('Product', {msn: newMsn});
    fetchData(newMsn);
  };

  const emiModal = () => {
    setEMIModalVisible(!EMIModalVisible);
  };

  const download = (image_URL, name) => {
    try {
      const {config, fs} = RNFetchBlob;
      let PictureDir =
        Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
      let options = {
        // fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: PictureDir + `/${name}-${Date.now()}`,
          description: 'PDF',
        },
      };
      config(options)
        .fetch('GET', image_URL, {'Cache-Control': 'no-store'})
        .then(res => {})
        .catch(e => {
          console.log(e, ' errr');
        });
    } catch (e) {
      // console.log(e);
    }
  };

  const downloadPDF = (image_URL, name) => {
    if (Platform.OS == 'android') {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            download(image_URL, name);
          } else {
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }
    } else {
      download(image_URL, name);
    }
  };
  const renderProductDetails = () => {
    return (
      <View style={styles.productDetail}>
        <View style={styles.sectionDetailTitle}>
          <SectionTitle Title={'About This Product'} />
        </View>
        {productData.keyFeatures ? (
          <View style={styles.keyFeaturesView}>
            <KeyFeatures keyFeatures={productData.keyFeatures} />
          </View>
        ) : null}
        <View
          style={{
            padding: Dimension.margin12,
          }}>
          <SectionTitle Title={'Product Specification'} />
        </View>
        <ProductSpecs
          navigation={props.navigation}
          brandName={
            productData.brandDetails && productData.brandDetails.brandName
          }
          productSpecifications={
            ((productData.productPartDetails || {})[msn] || {}).attributes || {}
          }
        />
        {(productData.videosInfo || []).length ? (
          <>
            <View style={{padding: Dimension.padding15}}>
              <SectionTitle
                {...props}
                Title="Product Videos"
                ShowViewAllBtn={false}
              />
            </View>
            <FlatList
              contentContainerStyle={{flex: 1}}
              // horizontal={true}
              data={productData.videosInfo || []}
              renderItem={({item, index}) => (
                <View
                  style={{
                    marginBottom: Dimension.margin15,
                    width: '95%',
                    marginLeft: 5,
                  }}>
                  <Text
                    style={{
                      marginVertical: Dimension.margin8,
                      fontSize: Dimension.font12,
                      fontFamily: Dimension.CustomSemiBoldFont,
                      color: colors.PrimaryTextColor,
                    }}>
                    {item.title}
                  </Text>
                  <YoutubePlayer
                    key={index}
                    webViewProps={{allowsFullscreenVideo: true}}
                    height={200}
                    width={'100%'}
                    videoId={item.link.match(youtubeRegex)[2].toString()}
                  />
                </View>
              )}
              keyExtractor={(item, index) => `${index}-item`}
            />
          </>
        ) : null}

        {(productData.documentInfo || []).length ? (
          <View
            style={{
              backgroundColor: '#fff',
              marginVertical: Dimension.margin10,
            }}>
            <View style={{padding: Dimension.padding15}}>
              <SectionTitle
                {...props}
                Title="Product Specification Document"
                ShowViewAllBtn={false}
              />
            </View>
            <View>
              {(productData.documentInfo || []).map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    downloadPDF(
                      `https://document.moglix.com/${item.path}`,
                      item.name,
                    )
                  }
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: Dimension.padding15,
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: colors.ProductBorderColor,
                    paddingVertical: Dimension.padding10,
                  }}>
                  <Icon
                    name={'download'}
                    color={'grey'}
                    style={{
                      height: Dimension.width24,
                      width: Dimension.width24,
                      fontSize: Dimension.font22,
                      bottom: 3,
                    }}
                  />
                  <View
                    style={{
                      marginLeft: Dimension.margin10,
                    }}>
                    <Text
                      style={{
                        fontSize: Dimension.font12,
                        fontFamily: Dimension.CustomSemiBoldFont,
                        color: colors.PrimaryTextColor,
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: Dimension.font10,
                        fontFamily: Dimension.CustomRegularFont,
                        color: colors.RedThemeColor,
                      }}>
                      {' '}
                      DOWNLOAD NOW{' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  const renderMoreFromItem = (title, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.moreFromTabs}>
      <Text style={styles.MoreTitle}>More from {title}</Text>
      <Icon size={24} color={'#000'} name="chevron-right" />
    </TouchableOpacity>
  );

  const renderMoreFrom = () => {
    return (
      <View style={styles.moreFromItem}>
        {productData.brandDetails && productData.brandDetails.brandName
          ? renderMoreFromItem(
              productData.brandDetails && productData.brandDetails.brandName,
              () =>
                props.navigation.push('Listing', {
                  str:
                    productData.brandDetails &&
                    productData.brandDetails.brandName,
                  type: 'Brand',
                  category: '',
                }),
            )
          : null}
        {productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomy
          ? renderMoreFromItem(
              productData.categoryDetails[0].taxonomy.split('/').pop(),
              () =>
                props.navigation.push('Listing', {
                  str: productData.categoryDetails[0].categoryCode,
                  type: 'Category',
                  category: productData.categoryDetails[0].categoryCode,
                  name: productData.categoryDetails[0].taxonomy
                    .split('/')
                    .pop(),
                }),
            )
          : null}
      </View>
    );
  };

  const renderStar = starCount => {
    let staList = [];
    for (let i = 0; i < starCount; i++) {
      staList.push(<Icon key={i} name="star" style={styles.starIcon} />);
    }
    return staList;
  };

  const openWriteReview = () => {
    if (authenticated == 'true') {
      setWriteReviewModalVisible(true);
    } else {
      setCallbackFn({
        callback: () => setWriteReviewModalVisible(true),
      });
      props.navigation.navigate('Auth');
    }
  };
  const renderReviewRating = () => {
    if (productReviewStatus === STATE_STATUS.FETCHED) {
      if (productReviewData.reviewExist || productReviewData.ratingExist) {
        return (
          <View style={styles.reviewArea}>
            <View style={styles.SectionTitleWrap}>
              <Text style={styles.SectionTitleText}>REVIEWS & RATINGS</Text>

              <TouchableOpacity
                style={styles.ViewAllBtn}
                onPress={openWriteReview}>
                <Text style={styles.ViewAllBtnText}>WRITE A REVIEW</Text>
              </TouchableOpacity>
            </View>
            {productReviewData &&
            productReviewData.summaryData &&
            productReviewData.summaryData.final_average_rating != 0 ? (
              <Text style={styles.normalText}>
                Customer Reviews {productData.productName}
              </Text>
            ) : null}
            <View style={styles.reviewAreaWrap}>
              <View style={styles.halfWidthArea}>
                <View style={styles.greenratingArea}>
                  <Text style={styles.StarRatingText}>
                    {productReviewData &&
                      productReviewData.summaryData &&
                      productReviewData.summaryData.final_average_rating.toFixed(
                        1,
                      )}
                  </Text>
                  <Icon name="star" style={styles.starIconLeft} />
                </View>
              </View>
              <View style={styles.halfWidthArea}>
                {RATINGS.map((ratingVal, ratingKey) => (
                  <View
                    key={ratingKey}
                    style={{flexDirection: 'row', width: '100%'}}>
                    <Text style={styles.ratingText}>{ratingVal.star}</Text>
                    <View style={{marginTop: 4}}>
                      <View style={styles.ratingLine}></View>
                      <View
                        style={[
                          styles.SelectRatingLine,
                          styles[ratingVal.class],
                          {
                            width:
                              (productReviewData.summaryData[ratingVal.key] /
                                productReviewData.summaryData.review_count) *
                              100,
                          },
                        ]}></View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <Text
              style={[styles.grayText, {paddingBottom: Dimension.padding10}]}>
              Average Rating based on{' '}
              {productReviewData.summaryData.review_count}
              {productReviewData.summaryData.review_count > 1
                ? ' ratings'
                : ' rating'}
            </Text>
            {productReviewData.reviewList &&
              productReviewData.reviewList.map((review, reviewKey) =>
                reviewKey < 2 ? (
                  <View
                    key={reviewKey}
                    style={{
                      borderTopColor: '#e7e7e7',
                      borderTopWidth: 0.8,
                      paddingVertical: Dimension.padding12,
                    }}>
                    <View style={styles.row}>
                      {review.rating ? (
                        <Text>{renderStar(review.rating)}</Text>
                      ) : null}
                    </View>
                    {review.user_name ? (
                      <Text style={styles.reviewerName}>
                        {review.user_name}
                      </Text>
                    ) : null}
                    {review.date ? (
                      <Text style={styles.reviewerDate}>{review.date}</Text>
                    ) : null}
                    {review.review_subject ? (
                      <Text style={styles.reviewerTitle}>
                        {review.review_subject}
                      </Text>
                    ) : null}
                    {review.review_text ? (
                      <Text style={styles.reviewerText}>
                        {review.review_text}
                      </Text>
                    ) : null}
                  </View>
                ) : null,
              )}
            {productReviewData.reviewList &&
            productReviewData.reviewList.length > 2 ? (
              <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
                <View style={styles.reviewModal}>
                  <Text style={styles.viewAllReviews}>
                    VIEW ALL ({productReviewData.reviewList.length}) REVIEWS
                  </Text>
                  <Icon name={'chevron-right'} color={'#000'} size={22} />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      } else {
        return (
          <View style={styles.reviewRatingWrap}>
            <View style={styles.SectionTitleWrap}>
              <Text style={styles.SectionTitleText}>REVIEWS & RATINGS</Text>

              <TouchableOpacity
                style={styles.ViewAllBtn}
                onPress={openWriteReview}>
                <Text style={styles.ViewAllBtnText}>WRITE A REVIEW</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.grayText}>Product has not been rated yet.</Text>
          </View>
        );
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (authenticated == 'true' && callbackFn && callbackFn.callback) {
      callbackFn.callback();
      setCallbackFn(null);
    }
  }, [authenticated]);

  const openQaModal = () => {
    if (authenticated == 'true') {
      setQandAModalVisible(true);
    } else {
      setCallbackFn({
        callback: () => setQaModalVisible(true),
      });
      props.navigation.push('Auth');
    }
  };

  const renderQuestion = () => {
    if (productQuestionStatus === STATE_STATUS.FETCHED) {
      if (productQuestionData.totalCount > 0) {
        return (
          <View
            style={{
              padding: Dimension.padding12,
              marginTop: Dimension.margin12,
              backgroundColor: '#fff',
            }}>
            <View style={styles.SectionTitleWrap}>
              <Text style={styles.SectionTitleText}>Questions & Answers</Text>
              <TouchableOpacity
                style={styles.ViewAllBtn}
                onPress={() => openQaModal()}>
                <Text style={styles.ViewAllBtnText}>Ask Now</Text>
              </TouchableOpacity>
            </View>
            {productQuestionData.totalCount ? (
              <Text style={styles.normalText}>
                Displaying Questions 1-
                {productQuestionData.totalCount > 1 ? 2 : 1} of{' '}
                {productQuestionData.totalCount}
              </Text>
            ) : null}
            {productQuestionData.qlist && productQuestionData.qlist.length
              ? productQuestionData.qlist.map((quest, questKey) =>
                  questKey < 2 ? (
                    <View style={styles.ShowReviewWrap} key={'qna_' + questKey}>
                      <View style={styles.ShowReviewInnerWrap}>
                        <Text style={styles.reviewerTitle}>
                          Q{questKey + 1}: {quest.questionText}
                        </Text>
                        <Text style={styles.reviewerText}>
                          {quest.answerText}
                        </Text>
                        <View style={styles.row}></View>
                      </View>
                    </View>
                  ) : null,
                )
              : null}
            {productQuestionData.totalCount > 2 ? (
              <TouchableOpacity onPress={() => setQaModalVisible(true)}>
                <View style={styles.qandA}>
                  <Text style={styles.qandAHeading}>
                    VIEW ALL QUESTION & ANSWERS
                  </Text>
                  <Icon name={'chevron-right'} color={'#000'} size={22} />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      } else {
        return (
          <View style={styles.noQuestWrap}>
            <View style={styles.SectionTitleWrap}>
              <Text style={styles.SectionTitleText}>Questions & Answers</Text>
              <TouchableOpacity
                style={styles.ViewAllBtn}
                onPress={() => openQaModal()}>
                <Text style={styles.ViewAllBtnText}>Ask Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.grayText}>
              No questions asked regarding this product yet.
            </Text>
          </View>
        );
      }
    } else {
      return;
    }
  };

  const submitRfq = () => {
    scrollviewRef?.current.scrollTo({x: 0, y: 450, animated: true});
    if (rfqRef && rfqRef.current && rfqRef.current.createRfq) {
      rfqRef.current.createRfq();
    }
  };

  const checkRfqValidation = () => {
    if (rfqRef && rfqRef.current && rfqRef.current.checkPdpValidation) {
      rfqRef.current.checkPdpValidation();
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'https://www.moglix.com' + '/' + productData.defaultCanonicalUrl,
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

  const clickStreamAddWishlist = () => {
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
      label: 'add_to_wishlist',
      channel: 'PDP',
      page_type: 'product_page',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData && productData.outOfStock,
      quantity: quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  const renderProductBoDetails = () => {
    if (productStatus === STATE_STATUS.FETCHED) {
      return (
        <View style={styles.similarProductsRow}>
          {productData.outOfStock ? (
            <View style={{marginVertical: -5}}>
              <SimilarProducts
                msn={productData.partNumber}
                productName={productData.productName}
                navigation={props.navigation}
                category={productData.categoryDetails[0].categoryCode}
              />
            </View>
          ) : null}
          <View style={styles.mainBannerWrap}>
            {productData.productTags &&
            productData.productTags.find(_ => _.priority == 1) &&
            productData.productTags.find(_ => _.priority == 1).imageUrl ? (
              <View style={styles.productTag}>
                <Image
                  resizeMode={'contain'}
                  style={styles.tag}
                  source={{
                    uri: productData.productTags.find(_ => _.priority == 1)
                      .imageUrl,
                  }}
                />
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.addToWishlist}
              onPress={() => {
                if (authenticated == 'true') {
                  setIsLiked(
                    !!!(wishlistData.find(_ => _.idProduct == msn) || {})
                      .idProduct,
                  );
                  webEngageAddWishlistEvent();
                  adobeWishlistClickEvent();
                  clickStreamAddWishlist();
                } else {
                  props.navigation.navigate('Auth');
                }
              }}>
              {(wishlistData.find(_ => _.idProduct == msn) || {}).idProduct ? (
                <Icon
                  name={'heart'}
                  type="AntDesign"
                  style={styles.redWishlistIcon}
                  size={24}
                />
              ) : (
                <Icon
                  name={'heart'}
                  type="AntDesign"
                  style={styles.wishlistIcon}
                  size={24}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addToWishlist, styles.shareOnSM]}
              onPress={onShare}>
              <MaterialCommunityIcon name="share-variant" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addToWishlist, styles.similarProductIcon]}
              onPress={viewSimilarProducts}>
              <Image
                source={require('../../assets/images/similarPrdIcon.png')}
                style={styles.similarPrdBtnIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.productImageCarousel}>
              <HomeMainCarousel
                fromPdp
                showDisabled={productData.outOfStock}
                data={
                  (productData.productPartDetails &&
                    productData.productPartDetails[msn] &&
                    productData.productPartDetails[msn].images.map(_ => {
                      return {imageLink: _.links.xxlarge};
                    })) ||
                  []
                }
                productData={productData}
                autoplay={true}
                Config={{IMG_PATH: 'https://cdn.moglix.com/'}}
                navigation={props.navigation}
              />
            </View>

            {productReviewStatus === STATE_STATUS.FETCHED &&
            productReviewData &&
            productReviewData.summaryData &&
            productReviewData.summaryData.final_average_rating ? (
              <View style={styles.topratingWrap}>
                <TouchableOpacity
                  onPress={() =>
                    scrollviewRef && scrollviewRef.current
                      ? scrollviewRef.current.scrollTo({
                          x: 0,
                          y: 3250,
                          animated: true,
                        })
                      : null
                  }
                  style={[styles.row, styles.ratingGreenWrap]}>
                  <Text style={styles.starText}>
                    {productReviewData &&
                      productReviewData.summaryData &&
                      productReviewData.summaryData.final_average_rating.toFixed(
                        1,
                      )}
                  </Text>
                  <Icon
                    name={'star'}
                    style={[styles.starIcon, {color: '#fff'}]}
                  />
                </TouchableOpacity>
                {productReviewData.summaryData.review_count ? (
                  <Text style={styles.NooFReviewText}>
                    {productReviewData.summaryData.review_count} Reviews
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
          <View style={styles.PdpDetailWrap}>
            <Text style={styles.PrdName}>{productData.productName}</Text>
            <View style={styles.priceNQty}>
              <View style={styles.priceArea}>
                <ProductPrice
                  {...productData}
                  {...productData.productPartDetails[msn]}
                  {...((
                    productData.productPartDetails[msn].productPriceQuantity ||
                    {}
                  ).india || {})}
                />
              </View>
              {!productData.outOfStock ? (
                <View style={styles.qtyCol}>
                  <Quantity
                    productQuantity={quantity}
                    fromPdp
                    minQuantity={
                      (productData.productPartDetails &&
                        productData.productPartDetails[msn] &&
                        productData.productPartDetails[msn]
                          .productPriceQuantity &&
                        productData.productPartDetails[msn].productPriceQuantity
                          .india &&
                        productData.productPartDetails[msn].productPriceQuantity
                          .india.moq) ||
                      1
                    }
                    setQuantity={setQuantity}
                    productData={productData}
                  />
                </View>
              ) : null}
            </View>
            {!productData.outOfStock ? (
              <ProductBrought
                msn={msn}
                quantity={productData.quantityAvailable}
              />
            ) : null}
          </View>
          {!productData.outOfStock ? (
            <FreeShipping
              categoryCode={productData.categoryDetails[0].categoryCode}
              msn={productData.partNumber}
              taxonomyCode={productData.categoryDetails[0].taxonomyCode}
              price={
                productData?.productPartDetails[msn]?.productPriceQuantity
                  ?.india?.priceWithoutTax
              }
            />
          ) : null}
          {(!productData.outOfStock &&
            productData?.productPartDetails[msn]?.productPriceQuantity?.india
              ?.priceWithoutTax) > 2999 ? (
            <TouchableOpacity onPress={emiModal}>
              <EmiAvailable
                msn={productData.partNumber}
                price={
                  productData?.productPartDetails[msn]?.productPriceQuantity
                    ?.india?.priceWithoutTax
                }
              />
            </TouchableOpacity>
          ) : null}
          {productData.filterAttributesList &&
          productData.filterAttributesList.length ? (
            <Varients
              refetchWithMsn={refetchWithMsn}
              productData={productData}
              styles={styles}
            />
          ) : null}

          {!productData.outOfStock ? (
            <GetQuote
              productData={productData}
              authenticated={authenticated}
              sessionId={sessionId}
              token={token}
              userId={userId}
              navigation={props.navigation}
              minQuantity={
                (productData.productPartDetails &&
                  productData.productPartDetails[msn] &&
                  productData.productPartDetails[msn].productPriceQuantity &&
                  productData.productPartDetails[msn].productPriceQuantity
                    .india &&
                  productData.productPartDetails[msn].productPriceQuantity.india
                    .moq) ||
                1
              }
              user={user}
            />
          ) : null}
          {rfqSuccess && (
            <RFQSuccess
              visible={rfqSuccess}
              onClose={() => setRfqSuccess(false)}
            />
          )}
          {productData.outOfStock ? (
            <RfqRequirement
              user={user}
              showSuccess={() => setRfqSuccess(true)}
              userId={userId}
              sessionId={sessionId}
              token={token}
              fromGetQuote={false}
              minQuantity={
                (productData.productPartDetails &&
                  productData.productPartDetails[msn] &&
                  productData.productPartDetails[msn].productPriceQuantity &&
                  productData.productPartDetails[msn].productPriceQuantity
                    .india &&
                  productData.productPartDetails[msn].productPriceQuantity.india
                    .moq) ||
                1
              }
              ref={rfqRef}
              productData={productData}
              navigation={props.navigation}
              fromScreen="Product"
              fromPdp
              msn={props.route.params.msn}
            />
          ) : null}
          {!productData.outOfStock ? (
            <View style={styles.deliveryCheckWrap}>
              <Text style={styles.deliveryHeadingText}>
                Delivery & Services
              </Text>
              <View style={styles.deliveryCheckInnerArea}>
                <View style={styles.checkText}>
                  <MatIcon
                    name={'location-pin'}
                    size={25}
                    style={styles.locPinIcon}
                  />
                  {selectedPincode.postCode ? (
                    <Text style={styles.checkTitle}>
                      {selectedPincode && selectedPincode.idAddress
                        ? `Deliver to - ${selectedPincode.addressCustomerName} ${selectedPincode.postCode}`
                        : selectedPincode.postCode}
                      {selectedPincode && selectedPincode.idAddress
                        ? '\n'
                        : null}

                      {selectedPincode && selectedPincode.idAddress ? (
                        <Text style={{opacity: 0.4, fontSize: 10}}>
                          {`${selectedPincode.city}, ${selectedPincode.state.name}`}
                        </Text>
                      ) : null}
                    </Text>
                  ) : (
                    <View>
                      <Text style={styles.checkTitle}>
                        Check for Delivery options
                      </Text>
                      <Text style={styles.checkSubTitle}>
                        Enter Pincode to get all details
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => pincodelocationModal()}
                  style={styles.checkbtn}>
                  <Text style={styles.checkbtnText}>
                    {selectedPincode.idAddress ? 'UPDATE' : 'CHECK'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {!productData.outOfStock
            ? deliveryData.aggregate && (
                <DeliveryData deliveryData={deliveryData} />
              )
            : null}

          {!productData.outOfStock ? (
            // <TouchableOpacity>
            <CouponsOffers
              couponAndOffersModal={couponAndOffersModal}
              msn={productData.partNumber}
            />
          ) : // </TouchableOpacity>
          null}
          <ReturnPolicy navigation={props.navigation} />
          {renderProductDetails()}
          {!productData.outOfStock ? (
            <View style={{marginVertical: -10}}>
              <SimilarProducts
                msn={productData.partNumber}
                productName={productData.productName}
                navigation={props.navigation}
                category={productData.categoryDetails[0].categoryCode}
              />
            </View>
          ) : null}
          {!productData.outOfStock && fbtProducts.data ? (
            <Fbt
              productData={productData}
              msn={productData.partNumber}
              sessionId={sessionId}
              token={token}
              navigation={props.navigation}
              quantity={quantity}
              fromPdp
            />
          ) : null}
          {!productData.outOfStock && fbtProducts.data && isModalVisible ? (
            <Modal
              overlayPointerEvents={'auto'}
              coverScreen={true}
              style={styles.fbtModalByATC}
              deviceWidth={deviceWidth}
              hasBackdrop={true}
              isVisible={isModalVisible}
              onRequestClose={() => {
                setIsModalVisible(false);
              }}
              onBackButtonPress={() => {
                setIsModalVisible(false);
              }}
              onDismiss={() => {
                setIsModalVisible(false);
              }}
              onBackdropPress={() => {
                setIsModalVisible(false);
              }}>
              <Fbt
                productData={productData}
                msn={productData.partNumber}
                sessionId={sessionId}
                token={token}
                navigation={props.navigation}
                quantity={quantity}
                isModal
                setIsModalVisible={setIsModalVisible}
                fromPdp
              />
            </Modal>
          ) : null}

          {renderMoreFrom()}
          {renderReviewRating()}
          {renderQuestion()}
          <RelatedCategories
            msn={productData.partNumber}
            navigation={props.navigation}
            category={productData.categoryDetails[0].categoryCode}
          />
          {qaModalVisible && (
            <QAModal
              isVisible={qaModalVisible}
              qlist={productQuestionData.qlist}
              onClose={() => setQaModalVisible(false)}
            />
          )}
          {reviewModalVisible && (
            <ReviewModal
              isVisible={reviewModalVisible}
              productReviewData={productReviewData}
              onClose={() => setReviewModalVisible(false)}
            />
          )}

          {/* Similar products Modal */}
          {SPModalVisible ? (
            <Modal
              onBackButtonPress={viewSimilarProducts}
              onBackdropPress={viewSimilarProducts}
              isVisible={SPModalVisible}
              style={styles.modalWrap}>
              <View style={styles.modalInner}>
                <View style={styles.modalHeaderFlex}>
                  <Text style={styles.modalHeading}>Similar Products</Text>
                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={viewSimilarProducts}>
                    <MaterialCommunityIcon
                      name="close-circle"
                      style={styles.closeIcon}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                {(((similarProducts || {}).data || {}).products || [])
                  .length ? (
                  <ScrollView style={styles.scrollViewWrap} horizontal={true}>
                    {(((similarProducts || {}).data || {}).products || []).map(
                      (product, productKey) => (
                        <ProductGridView
                          key={productKey}
                          closeModal={viewSimilarProducts}
                          parentStyles={{
                            width: Dimensions.get('window').width * 0.4,
                          }}
                          fromViewAll
                          fromPdp
                          item={product}
                          navigation={props.navigation}
                        />
                      ),
                    )}
                  </ScrollView>
                ) : (
                  <Text
                    style={{
                      paddingVertical: 20,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontSize: Dimension.font12,
                      fontFamily: Dimension.CustomRegularFont,
                    }}>
                    No similar products found
                  </Text>
                )}
              </View>
            </Modal>
          ) : null}
          {/* EMI available Modal */}
          {EMIModalVisible && (
            <Modal
              isVisible={EMIModalVisible}
              onRequestClose={() => setEMIModalVisible(false)}
              coverScreen={true}
              style={styles.emiModalWrap}
              deviceWidth={deviceWidth}
              onBackButtonPress={() => setEMIModalVisible(false)}
              hasBackdrop={false}>
              <View style={[styles.emiModalInner]}>
                <View style={styles.emiModalHeaderFlex}>
                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={() => emiModal()}>
                    <MaterialCommunityIcon
                      name="arrow-left"
                      style={styles.backIcon}
                      size={24}
                    />
                  </TouchableOpacity>
                  <Text style={styles.emiModalHeading}>EMI Options</Text>
                </View>
                <ScrollView style={styles.emiScrollViewWrap}>
                  <View style={styles.list}>
                    <FAIcon name="circle" style={styles.dotIcon} size={10} />
                    <Text style={styles.listText}>
                      <Text style={styles.greenListText}>
                        0% interest plans
                      </Text>{' '}
                      available on listed debit/credit cards
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeHIW}
                    onPress={viewHowItWorks}>
                    <View style={styles.seeHIWLeftArea}>
                      <Icon
                        name={'calendar-clock'}
                        style={styles.calenderIcon}
                        size={24}
                        color={colors.BlueText}
                      />
                      <View style={styles.hiwText}>
                        <Text style={styles.hiwTitleText}>
                          See how it works
                        </Text>
                        <Text style={styles.hiwSubTitleText}>
                          You can avail it in 4 simple steps
                        </Text>
                      </View>
                    </View>
                    <Icon
                      name={'chevron-right'}
                      style={styles.dropIcon}
                      color={'#000'}
                      size={28}
                    />
                  </TouchableOpacity>
                  <Text style={styles.suitabletext}>
                    Find a suitable EMI option below and choose the same option
                    at payments step while placing the order.
                  </Text>
                  <EMI
                    price={
                      productData?.productPartDetails[msn]?.productPriceQuantity
                        ?.india?.priceWithoutTax
                    }
                    invoiceType={true}
                    sessionId={sessionId}
                    token={token}
                  />
                  <View style={styles.termsParaView}>
                    <Text style={styles.termsTextPara}>
                      No Cost EMI offer of Moglix enables users to purchase
                      *everything on EMI and experience easy shopping. This
                      special scheme allows customers to purchase expensive
                      products on EMI at the original price of the product that
                      is split equally across the **EMI tenure. The interest a
                      buyer is liable to pay is offered as an upfront discount
                      on checkout. So, there are no addition costs such as
                      interest, down payment or processing fee. Moglix offers No
                      Cost EMI on all products across the site.
                    </Text>
                    <Text style={styles.EmiMediumBoldText}>
                      **Minimum Order placed should be{' '}
                      <Text style={styles.EmiBoldText}> ₹3000</Text>
                    </Text>
                    <Text style={styles.EmiMediumBoldText}>
                      **Applicable on EMI tenure for 3 and 6 months only, across
                      all banks
                    </Text>
                  </View>
                  <View style={styles.termsParaView}>
                    <Text style={styles.termsHeading}>
                      Terms and Conditions Apply
                    </Text>
                    {/* {this.state.status ?  */}
                    <View style={styles.listWrap}>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          Select your preferred EMI option at the time of
                          payment.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          Final EMI is calculated on the total value of your
                          order at the time of payment.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          The Bank charges annual interest rates according to
                          the reducing monthly balance. In the monthly reducing
                          cycle, the principal is reduced with every EMI and the
                          interest is calculated on the outstanding balance.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          The minimum order value to avail the EMI payment
                          option is Rs 3,000.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          In case of any kind of refund in an EMI transaction,
                          interest already billed in a particular transaction
                          will not be refundable under any circumstances.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <Icon
                          name="circle"
                          type="FontAwesome"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          While you will not be charged a processing fee for
                          availing EMI option, the interest charged by the bank
                          shall not be refunded.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          While you will not be charged a processing fee for
                          availing EMI option, the interest charged by the bank
                          shall not be refunded.
                        </Text>
                      </View>
                      <View style={styles.list}>
                        <FAIcon
                          name="circle"
                          style={styles.dotIcon}
                          size={10}
                        />
                        <Text style={styles.listText}>
                          You may check with the respective bank/issuer on how a
                          cancellation, refund or pre-closure could affect the
                          EMI terms, and what interest charges would be levied
                          on you for the same.
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Modal>
          )}
          {/* coupon And Offers Modal */}
          {couponModalVisible && (
            <Modal
              hasBackdrop={true}
              style={{
                // width: Dimensions.get('window').width,
                flex: 1,
                // height: Dimensions.get('window').height,
              }}
              onBackButtonPress={() => setCouponModalVisible(false)}
              onBackdropPress={() => setCouponModalVisible(false)}
              onDismiss={() => setCouponModalVisible(false)}
              isVisible={couponModalVisible}>
              <View style={styles.couponModalInner}>
                <View style={styles.couponModalHeaderFlex}>
                  <Text style={styles.couponModalHeading}>Offer Details</Text>
                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={() => setCouponModalVisible(false)}>
                    <MaterialCommunityIcon
                      name="close-circle"
                      style={styles.closeIcon}
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.couponScrollViewWrap}>
                  <Image
                    source={require('../../assets/images/moglixlogo.png')}
                    style={styles.moglixlogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.offerMediumText}>
                    {offer.block_data.image_block['0'].image_title}
                    {
                      offer.block_data.image_block['0'].image_general['0']
                        .general_url
                    }
                    {
                      offer.block_data.image_block['0'].image_general['1']
                        .general_url
                    }
                  </Text>
                  <Text
                    style={{
                      fontSize: Dimension.font16,
                      fontFamily: 'roboto',
                      fontWeight: 'bold',
                      color: '#303030',
                    }}>
                    {offer.block_data.general_block['0'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['1'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {' '}
                    {offer.block_data.general_block['2'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['3'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {' '}
                    {offer.block_data.general_block['4'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['5'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {' '}
                    {offer.block_data.general_block['6'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['7'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['8'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['9'].element_url}
                  </Text>
                  <Text style={styles.bottomText}>
                    {offer.block_data.general_block['10'].element_url}
                  </Text>
                </ScrollView>
              </View>
            </Modal>
          )}
          {/* View How it works Modal */}
          {HIWModalVisible && (
            <Modal
              isVisible={HIWModalVisible}
              onRequestClose={() => setHWIModalVisible(false)}
              coverScreen={true}
              style={styles.hiwModalWrap}
              deviceWidth={deviceWidth}
              onBackButtonPress={() => setHWIModalVisible(false)}>
              <View style={styles.hiwModalInner}>
                <View style={styles.hiwModalHeaderFlex}>
                  <Text style={styles.hiwModalHeading}>
                    Pay in Installment in 4 easy steps...
                  </Text>
                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={viewHowItWorks}>
                    <MaterialCommunityIcon
                      name="close-circle"
                      style={styles.closeIcon}
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.hiwScrollViewWrap}>
                  <View style={styles.hiwIndexRow}>
                    <View style={styles.hiwLeftText}>
                      <Text style={styles.hiwIndex}>1.</Text>
                      <Text style={styles.hiwIndexContent}>
                        See EMI plans of eligible products on product page.
                      </Text>
                    </View>
                    <FAIcon
                      style={styles.rightdArrow}
                      name={'angle-double-down'}
                      size={24}
                    />
                  </View>
                  <Image
                    source={require('../../assets/images/EmiStep1.png')}
                    style={styles.emistep}
                    resizeMode="contain"
                  />
                  <View style={styles.hiwIndexRow}>
                    <View style={styles.hiwLeftText}>
                      <Text style={styles.hiwIndex}>2.</Text>
                      <Text style={styles.hiwIndexContent}>
                        At the time of checkout select your plan as per your
                        convenience
                      </Text>
                    </View>
                    <FAIcon
                      style={styles.rightdArrow}
                      name={'angle-double-down'}
                      size={24}
                    />
                  </View>
                  <Image
                    source={require('../../assets/images/EmiStep2.png')}
                    style={styles.emistep}
                    resizeMode="contain"
                  />
                  <View style={styles.hiwIndexRow}>
                    <View style={styles.hiwLeftText}>
                      <Text style={styles.hiwIndex}>3.</Text>
                      <Text style={styles.hiwIndexContent}>
                        Continue by filling you debit/credit card detail.
                      </Text>
                    </View>
                    <FAIcon
                      style={styles.rightdArrow}
                      name={'angle-double-down'}
                      size={24}
                    />
                  </View>
                  <Image
                    source={require('../../assets/images/EmiStep3.png')}
                    style={styles.emistep}
                    resizeMode="contain"
                  />
                  <View style={styles.hiwIndexRow}>
                    <View style={styles.hiwLeftText}>
                      <Text style={styles.hiwIndex}>4.</Text>
                      <Text style={styles.hiwIndexContent}>
                        After placing order, you will receive an email
                        confirmation of your order.
                      </Text>
                    </View>
                    <FAIcon
                      style={styles.rightdArrow}
                      name={'angle-double-down'}
                      size={24}
                    />
                  </View>
                  <Image
                    source={require('../../assets/images/EmiStep4.png')}
                    style={styles.emistep}
                    resizeMode="contain"
                  />
                </ScrollView>
              </View>
            </Modal>
          )}
          {/* Write a Review Modal */}
          {writeReviewModalVisible && (
            <WriteReviewModal
              isVisible={writeReviewModalVisible}
              msn={msn}
              onSuccess={() => dispatch(fetchProductReview(msn))}
              auth={auth}
              onClose={() => setWriteReviewModalVisible(false)}
            />
          )}
          {/* Question & Answer  Modal by Ask Now CTA */}
          {QandAModalVisible && (
            <QandAModal
              msn={msn}
              onSuccess={() => dispatch(fetchProductQuestion(msn))}
              auth={auth}
              productData={productData}
              isVisible={QandAModalVisible}
              onClose={() => setQandAModalVisible(false)}
            />
          )}
        </View>
      );
    } else {
      return (
        <View style={{height: 600}}>
          <ActivityIndicator
            size={'large'}
            color={'red'}
            style={styles.activityIndicator}
          />
        </View>
      );
    }
  };

  const pincodelocationModal = () => {
    setPincodeModal(!pincodeModal);
  };

  const productLogistics = async (item, setinAsync) => {
    if (
      item.postCode &&
      (!selectedPincode.idAddress ||
        item.idAddress != selectedPincode.idAddress)
    ) {
      setSelectedPincode(item);
      let body = {
        productId: [msn],
        toPincode: item.postCode,
      };
      try {
        setIsPincodeLoading(true);
        const {data} = await getProductLogistics(body, sessionId, token);
        setPincodeModal(false);
        setDeliveryData(data.data[msn]);
        setIsPincodeLoading(false);
        if (setinAsync) {
          await AsyncStorage.setItem('@pincode', JSON.stringify(item));
        }
        clickStreamCheckPincode();
      } catch (error) {
        setIsPincodeLoading(false);
        setDeliveryData({
          aggregate: {
            codAvailable: false,
            mot: null,
            serviceable: false,
            sourcePincode: null,
          },
        });
        setPincodeModal(false);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(deliveryData).length !== 0) adobePincodeTrackState();
  }, [deliveryData]);

  const adjustAddBuyEvent = () => {
    var adjustEvent = new AdjustEvent('cxcov6');
    adjustEvent.addPartnerParameter('id', msn);
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

  const webEngageAddBuyEvent = () => {
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

  const webEngageupdateCart = () => {
    let webengageUpdateObj = {
      Currency: 'INR',
      'Product Id': '',
      'Product Name': '',
      'Product Array': [],
    };
    let totalPrice = 0;
    let totalQuantity = 0;
    var arrMsn = [];
    var arrName = [];
    let prices = [];
    (itemsList || []).forEach(item => {
      let obj = {
        name: item.productName,
        id: item.productId,
        price: item.totalPayableAmount,
        quantity: item.productQuantity,
        image: item.productImg,
      };
      let msnObj = item.productId;
      let nameObj = item.productName;
      let priceObj = item.totalPayableAmount;
      arrName.push(nameObj);
      arrMsn.push(msnObj);
      prices.push(priceObj);
      webengageUpdateObj['Product Array'].push(obj);
      totalQuantity += item.productQuantity;
      totalPrice += item.totalPayableAmount;
    });
    webengageUpdateObj['Product Id'] = arrMsn.join(',');
    webengageUpdateObj['Product Name'] = arrName.join(',');
    webengageUpdateObj['Total Price'] = totalPrice;
    webengageUpdateObj['Total Quantity'] = totalQuantity;
    webEngageTracking('updateCart', webengageUpdateObj);
  };

  const webEngageAddWishlistEvent = () => {
    let webengageAddWishlistObj = {
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

    webEngageTracking('addedToWishlist', webengageAddWishlistObj);
  };

  const adobeWishlistClickEvent = () => {
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
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'pdp',
      'myapp.ctaname': 'add to wishlist',
      'myapp.channel': 'pdp',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber,
      'myapp.productPrice':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.quantity':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags,
      'myapp.parentID': productData.partNumber,
      '&&products':
        ';' + productData.partNumber + ';' + quantity + ';' + productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice *
          quantity +
          ';',
      '&&events': 'event31',
    };

    trackStateAdobe('myapp.ctaclick', obj);
  };

  const adobePincodeTrackState = () => {
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
      'myapp.channel': 'pdp',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber,
      'myapp.productPrice':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.pincode': selectedPincode.postCode,
      'myapp.stockStatus': productData.outOfStock ? 'Out of Stock' : 'In Stock',
      'myapp.serviceability':
        deliveryData &&
        deliveryData.aggregate &&
        deliveryData.aggregate.serviceable
          ? 'yes'
          : 'no',
      'myapp.codserviceability':
        deliveryData &&
        deliveryData.aggregate &&
        deliveryData.aggregate.codAvailable
          ? 'yes'
          : 'no',
      '&&events': 'event32',
    };

    trackStateAdobe('PDP', obj);
  };

  const clickStreamCheckPincode = () => {
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
      active_tags: null,
      event_type: 'click',
      label: 'check_pincode',
      channel: 'PDP',
      page_type: 'product_page',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
    };
    sendClickStreamData(dataTracking);
  };

  const adobeAddCartTrackEvent = () => {
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
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'pdp',
      'myapp.ctaname': 'add to cart',
      'myapp.channel': 'pdp',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: pdp`,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber,
      'myapp.productPrice':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.quantity': quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags,
      'myapp.parentID': productData.partNumber,
      '&&products':
        ';' + productData.partNumber + ';' + quantity + ';' + productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice *
          quantity +
          ';',
      '&&events': 'scAdd,event7',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const adobeBuyNowTrackEvent = () => {
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
        ':' + taxo1 + ':' + taxo2 + ':' + taxo3 + ':' + 'pdp',
      'myapp.ctaname': 'buy now',
      'myapp.channel': 'pdp',
      'myapp.subSection':
        'moglix:' + taxo1 + ':' + taxo2 + ':' + taxo3 + `: pdp`,
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': productData.partNumber,
      'myapp.productPrice':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice,
      'myapp.quantity': quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags,
      'myapp.parentID': productData.partNumber,
      '&&products':
        ';' + productData.partNumber + ';' + quantity + ';' + productData &&
        productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india
          .sellingPrice *
          quantity +
          ';',
      '&&events': 'event8',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const clickStreamAddCart = () => {
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
      page_type: 'product_page',
      channel: 'PDP',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData.outOfStock,
      quantity: quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  const clickStreamBuyNow = () => {
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
      label: 'buy_now',
      page_type: 'product_page',
      channel: 'PDP',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india
            .sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData.outOfStock,
      quantity: quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  return (
    <View style={styles.prodDetailPage}>
      <Header
        navigation={props.navigation}
        showBack
        showWishlist
        showSearch
        // showLogo
        // showLargeSearch
        showCart
        showBackToHome
        // showName
      />
      <ScrollView ref={scrollviewRef}>{renderProductBoDetails()}</ScrollView>
      <PincodeModal
        pincodelocationModal={pincodelocationModal}
        pincodeModal={pincodeModal}
        addresses={[
          ...(((addresses || {}).retail || {}).data || []),
          ...(((addresses || {}).tax || {}).data || []),
        ].filter(_ => _.addressType.addressType == 'shipping')}
        selectedPincode={selectedPincode}
        setSelectedPincode={setSelectedPincode}
        productLogistics={productLogistics}
        isPincodeLoading={isPincodeLoading}
      />
      <View style={styles.bottomActions}>
        {!productData.outOfStock && productStatus == STATE_STATUS.FETCHED ? (
          <>
            <TouchableOpacity
              disabled={addToCartLoader}
              style={[styles.addtocartbtn, styles.actionBtn]}
              onPress={async () => {
                if (fbtProducts.data) {
                  setIsModalVisible(true);
                } else {
                  setAddToCartLoader(true);
                  await addtoCart(
                    cart,
                    msn,
                    productData,
                    dispatch,
                    sessionId,
                    token,
                    props.navigation,
                    quantity,
                    false,
                    true,
                    false,
                    false,
                    false,
                    () => {
                      webEngageAddBuyEvent();
                      adjustAddBuyEvent();
                      adobeAddCartTrackEvent();
                      clickStreamAddCart();
                    },
                  );
                  webEngageupdateCart();
                  setAddToCartLoader(false);
                }
              }}>
              {addToCartLoader ? (
                <ActivityIndicator
                  color={colors.RedThemeColor}
                  size={'small'}
                />
              ) : (
                <MaterialCommunityIcon name="cart" style={styles.cartIcon} />
              )}
              <Text style={[styles.addtoCartText, styles.actionText]}>
                ADD TO CART
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buynowbtn, styles.actionBtn]}
              disabled={buyNowLoader}
              onPress={async () => {
                setBuyNowLoader(true);
                await addtoCart(
                  cart,
                  msn,
                  productData,
                  dispatch,
                  sessionId,
                  token,
                  props.navigation,
                  quantity,
                  false,
                  true,
                  true,
                  authenticated,
                );
                adjustAddBuyEvent();
                webEngageAddBuyEvent();
                adobeBuyNowTrackEvent();
                clickStreamBuyNow();
                setBuyNowLoader(false);
              }}>
              {buyNowLoader && (
                <ActivityIndicator size={'small'} color={'#fff'} />
              )}
              <Text style={[styles.buyNowText, styles.actionText]}>
                BUY NOW
              </Text>
            </TouchableOpacity>
          </>
        ) : null}

        {productData.outOfStock && productStatus == STATE_STATUS.FETCHED ? (
          <TouchableOpacity
            // disabled={checkRfqValidation()}
            // checkRfqValidation()
            //     ? styles.submitButtonDisabled
            style={styles.submitButton}
            onPress={() => submitRfq()}>
            <Text style={styles.submitButtonText}>SUBMIT YOUR REQUIREMENT</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default ProductScreen;
