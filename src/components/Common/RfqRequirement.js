import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../redux/constants/colors';
import FloatingLabelInputField from '../Common/FloatingInput';
import {emailRegex, gstinRegex} from '../../constants';
import Quantity from '../Common/Quantity';
import {createRfqApi} from '../../services/rfqs';
import {getProduct} from '../../services/products';
import Dimension from '../../redux/constants/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';
import Toast from 'react-native-toast-message';
import {validatePincode, validateGstin} from '../../services/address';
import {getCustomerBusinessDetailsApi} from '../../services/user';

const deviceWidth = Dimensions.get('window').width;

const RfqRequirement = forwardRef((props, ref) => {
  const [quantity, setQuantity] = useState(props.minQuantity || 1);
  const [name, setName] = useState(props.user.userName || '');
  const [email, setEmail] = useState(props.user.email || '');
  const [phone, setPhone] = useState(props.user.phone || '');
  const [postCode, setPostCode] = useState(props.rfqPin || '');
  const [description, setDescription] = useState('');
  const [postCodeError, setPostCodeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [minQuantity, setMinQuantity] = useState(1);
  const [phoneError, setPhoneError] = useState(false);
  const [gstin, setGstin] = useState(props.user.gstin || '');
  const [gstinError, setGstinError] = useState('');
  const [isGstin, setIsGstin] = useState(false);
  const [msnTaxonomy, setMsnTaxonomy] = useState('');
  const [init, setInit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');

  // const productBOData = useSelector(
  //   state => ((state.productsReducer[msn] || {}).productBO || {}).data || {},
  // );

  useEffect(() => {
    if (props.fromListing) {
      fetchData(
        props.rfqData?.moglixPartNumber ||
          props.rfqData?.defaultPartNumber ||
          props.rfqData?.idProduct,
      );
    }
    getBusinessData();
    setInit(true);
    getRfqPin();
    adobeRfqTrackEvent();
  }, []);

  const getBusinessData = async () => {
    try {
      const {data} = await getCustomerBusinessDetailsApi(
        props.userId,
        props.sessionId,
        props.token,
      );
      if (data.data && data.data.gstinVerified) {
        setGstin(data.data.gstin);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRfqPin = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@rfq_pin');
      const tasksObj = jsonValue != null ? jsonValue : '';
      if (tasksObj) {
        setPostCode(tasksObj);
        getCityStateByPincode(tasksObj);
      }
    } catch (e) {
      // error reading value
      console.log('loading stored data doesnt work');
    }
  };

  const getCityStateByPincode = async pincode => {
    const {data} = await validatePincode(pincode, props.sessionId, props.token);
    if (data.dataList && data.dataList.length) {
      setCity(data.dataList[0].city);
      setAddressState(data.dataList[0].state);
    }
  };

  const fetchData = async msn => {
    const {data} = await getProduct(msn);
    if (
      data.productBO.productPartDetails &&
      data.productBO.productPartDetails[msn] &&
      data.productBO.productPartDetails[msn].productPriceQuantity &&
      data.productBO.productPartDetails[msn].productPriceQuantity.india &&
      data.productBO.productPartDetails[msn].productPriceQuantity.india.moq
    ) {
      setQuantity(
        data.productBO.productPartDetails[msn].productPriceQuantity.india.moq ||
          1,
      );
      setMinQuantity(
        data.productBO.productPartDetails[msn].productPriceQuantity.india.moq ||
          1,
      );
    }
    if (data && data.status) {
      let taxonomy = data.productBO?.categoryDetails[0].taxonomy;
      setMsnTaxonomy(taxonomy);
    }
  };

  const adobeRfqTrackEvent = () => {
    trackStateAdobe('moglix:bulk request form', {
      'myapp.pageName': 'moglix:bulk request form',
      'myapp.channel': 'home',
      'myapp.subSection': 'moglix:bulk request form',
    });
  };

  useEffect(() => {
    if (init) {
      if (name && name.length) {
        setNameError(false);
      } else {
        setNameError(true);
      }
    }
  }, [name]);

  useEffect(() => {
    if (init) {
      if (email && email.length && email.match(emailRegex)) {
        setEmailError(false);
      } else {
        setEmailError(false);
      }
    }
  }, [email]);

  useEffect(() => {
    if (init) {
      if (phone && phone.length > 9) {
        setPhoneError(false);
      } else {
        setPhoneError(true);
      }
    }
  }, [phone]);

  useEffect(() => {
    if (init) {
      if (postCode && postCode.length > 5) {
        setPostCodeError(false);
      } else {
        setPostCodeError(true);
      }
    }
  }, [postCode]);

  useEffect(() => {
    if (init) {
      if (gstin && gstin.length > 14 && gstin.match(gstinRegex)) {
        setGstinError(false);
      } else {
        setGstinError('Kindly enter a valid GSTIN of 15-digit');
      }
    }
  }, [gstin]);

  const gstRfqDetails = [
    {
      title: 'Name*',
      state: name,
      disabled: false,
      onChange: text => setName(text),
      errorState: nameError,
      errorText: 'Kindly enter your name',
    },
    {
      title: 'Email*',
      state: email,
      disabled: false,
      onChange: text => setEmail(text),
      errorState: emailError,
      errorText: 'Kindly enter valid email',
    },
    {
      title: 'Mobile Number*',
      state: phone,
      disabled: false,
      onChange: text => setPhone(text),
      keyboardType: 'number-pad',
      errorState: phoneError,
      errorText: 'Kindly enter valid phone number',
      maxLength: 10,
    },
    {
      title: 'Pincode*',
      state: postCode,
      disabled: false,
      onChange: text => setPostCode(text),
      keyboardType: 'number-pad',
      errorState: postCodeError,
      errorText: 'Kindly enter your valid pincode',
      maxLength: 6,
    },

    {
      title: 'Description',
      state: description,
      disabled: false,
      onChange: text => setDescription(text),
      //   errorState: descriptionError,
      //   errorText: 'Kindly enter valid landmark',
    },
    {
      title: 'GSTIN*',
      state: gstin,
      disabled: false,
      onChange: text => setGstin(text),
      maxLength: 15,
      errorState: gstinError,
      errorText: gstinError,
      hasDependentState: true,
      dependentStateName: isGstin,
      toggleDependentState: () => {
        setGstinError(false);
        setIsGstin(!isGstin);
      },
      dependentText: 'Mark if purchasing for business.',
      subdependentText: 'Add GSTIN for verification',
    },
  ];

  const renderInputText = ({
    onChange,
    onBlur,
    disabled,
    title,
    state,
    errorState,
    extra,
    errorText,
    keyboardType,
    maxLength,
    component,
    style,
  }) => {
    return (
      <View style={[styles.newinputfield, style]} key={title}>
        <FloatingLabelInputField
          label={title}
          onChangeText={text => onChange(text)}
          value={state}
          disabled={disabled}
          onBlur={onBlur}
          maxLength={maxLength}
          keyboardType={keyboardType}
          handleFocus={getAuthStatus}
        />
        {errorState ? <Text style={styles.errorText}>{errorText}</Text> : null}
      </View>
    );
  };

  const getAuthStatus = () => {
    if (
      props.navigation &&
      props.navigation.navigate &&
      props.user &&
      props.user.authenticated == 'false'
    ) {
      if (props.setRfqRequirement) {
        props.setRfqRequirement(false);
      }
      props.navigation.navigate('Auth');
    }
  };

  const checkCommonValidation = () => {
    return (
      name &&
      name.length &&
      !nameError &&
      !emailError &&
      email &&
      email.length &&
      email.match(emailRegex) &&
      phone &&
      phone.length > 9 &&
      !phoneError &&
      postCode &&
      postCode.length > 5 &&
      !postCodeError
    );
  };

  // useImperativeHandle(ref, () => ({
  //   checkPdpValidation() {
  //     if (isGstin) {
  //       if (
  //         gstin &&
  //         gstin.length > 14 &&
  //         gstin.match(gstinRegex) &&
  //         !gstinError &&
  //         checkCommonValidation()
  //       ) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     } else {
  //       if (checkCommonValidation()) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   },
  // }));

  const checkValidation = isSubmit => {
    if (isGstin) {
      if (
        gstin &&
        gstin.length > 14 &&
        gstin.match(gstinRegex) &&
        !gstinError &&
        checkCommonValidation()
      ) {
        return false;
      } else {
        if (isSubmit) {
          if (!(gstin && gstin.length > 14 && gstin.match(gstinRegex))) {
            setGstinError('Kindly enter a valid GSTIN of 15-digit');
          }
          if (!(name && name.length)) {
            setNameError(true);
          }
          if (!(email && email.length && email.match(emailRegex))) {
            setEmailError(true);
          }
          if (!(postCode && postCode.length > 5)) {
            setPostCodeError(true);
          }
        }
        return true;
      }
    } else {
      if (checkCommonValidation()) {
        return false;
      } else {
        if (isSubmit) {
          if (!(name && name.length)) {
            setNameError(true);
          }
          if (!(email && email.length && email.match(emailRegex))) {
            setEmailError(true);
          }
          if (!(postCode && postCode.length > 5)) {
            setPostCodeError(true);
          }
        }
        return true;
      }
    }
  };

  const saveRfqPincode = async () => {
    try {
      await AsyncStorage.setItem('@rfq_pin', postCode);
    } catch (e) {
      console.log('storing data doesnt work', e);
    }
  };

  useImperativeHandle(ref, () => ({
    createRfq() {
      if (!checkValidation(true)) {
        let rfqObj = {
          rfqEnquiryCustomer: {
            city: city,
            customerId: props.userId,
            description: '',
            device: 'app',
            email: email,
            firstName: name,
            mobile: phone,
            pincode: postCode,
            rfqValue:
              props.productData &&
              props.productData.productPartDetails &&
              props.productData.productPartDetails[props.msn] &&
              props.productData.productPartDetails[props.msn]
                .productPriceQuantity &&
              props.productData.productPartDetails[props.msn]
                .productPriceQuantity.india &&
              props.productData.productPartDetails[props.msn]
                .productPriceQuantity.india.priceWithoutTax,
            state: addressState,
            tin: isGstin ? gstin : '',
          },
          rfqEnquiryItemsList: [
            {
              brand:
                props.productData.brandDetails.brandName ||
                props.rfqData?.brandDetails?.brandName,
              outOfStock: !props.productData.outOfStock
                ? 'inStock'
                : 'outOfStock',
              prodReference:
                (props.rfqData && props.rfqData.idProduct) ||
                props.idProduct ||
                props.msn ||
                (props.rfqData && props.rfqData.defaultPartNumber),
              productName: props.productData.productName,
              quantity: quantity,
              taxonomyCode: props.productData.categoryDetails[0].taxonomy,
            },
          ],
        };
        if (isGstin) {
          validateGstin(gstin, props.sessionId, props.token).then(({data}) => {
            console.log('data', data);
            if (data && !data.valid) {
              setGstinError(data.message);
              setLoader(false);
              return;
            } else {
              createRfqApi(rfqObj, props.sessionId, props.token)
                .then(({data}) => {
                  if (data.status && data.statusCode == 200) {
                    // setPostCode('');
                    setGstin('');
                    setIsGstin(false);
                    setDescription('');
                    Toast.show({
                      type: 'success',
                      text2: 'Succesfully saved enquiry details',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                    saveRfqPincode();
                    adobeRfqButtonSubmitRequirement(rfqObj);
                    clickStreamSubmitRfqRequirement(rfqObj);
                    props.showSuccess();
                  }
                })
                .catch(e => {
                  console.log(e);
                  Toast.show({
                    type: 'error',
                    text2: 'Something went wrong!',
                    visibilityTime: 2000,
                    autoHide: true,
                  });
                });
            }
          });
        } else {
          createRfqApi(rfqObj, props.sessionId, props.token)
            .then(({data}) => {
              if (data.status && data.statusCode == 200) {
                // setPostCode('');
                setGstin('');
                setIsGstin(false);
                setDescription('');
                Toast.show({
                  type: 'success',
                  text2: 'Succesfully saved enquiry details',
                  visibilityTime: 2000,
                  autoHide: true,
                });
                saveRfqPincode();
                adobeRfqButtonSubmitRequirement(rfqObj);
                clickStreamSubmitRfqRequirement(rfqObj);
                props.showSuccess();
              }
            })
            .catch(e => {
              console.log(e);
              Toast.show({
                type: 'error',
                text2: 'Something went wrong!',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        }
      }
    },
  }));

  useEffect(() => {
    console.log(gstinError);
  });

  const submitRfqModal = async () => {
    let rfqObj = {
      rfqEnquiryCustomer: {
        city: city,
        customerId: props.userId,
        description: '',
        device: 'app',
        email: email,
        firstName: name,
        mobile: phone,
        pincode: postCode,
        state: addressState,
        rfqValue:
          props.productData?.productPartDetails[
            props.productData?.defaultPartNumber
          ]?.productPriceQuantity?.india?.priceWithoutTax ||
          props.rfqData?.priceWithoutTax,
        tin: isGstin ? gstin : '',
      },
      rfqEnquiryItemsList: [
        {
          brand:
            (props.rfqData &&
              props.rfqData.productDetail &&
              props.rfqData.productDetail.productBO &&
              props.rfqData.productDetail.productBO.brandDetails &&
              props.rfqData.productDetail.productBO.brandDetails.brandName) ||
            (props.productData &&
              props.productData.brandDetails &&
              props.productData.brandDetails.brandName) ||
            (props.rfqData && props.rfqData.brandName) ||
            (props.rfqData &&
              props.rfqData.brandDetails &&
              props.rfqData.brandDetails.brandName),
          outOfStock:
            (props.productData && !props.productData.outOfStock) ||
            props.rfqData.quantityAvailable > 0
              ? 'inStock'
              : 'outOfStock',
          prodReference:
            (props.rfqData && props.rfqData.idProduct) ||
            props.productData?.defaultPartNumber ||
            props.rfqData?.moglixPartNumber ||
            props.rfqData?.defaultPartNumber,
          productName:
            props.productData?.productName || props.rfqData.productName,
          quantity: quantity,
          taxonomyCode:
            (props.rfqData &&
              props.rfqData.productDetail &&
              props.rfqData.productDetail.productBO &&
              props.rfqData.productDetail.productBO.categoryDetails &&
              props.rfqData.productDetail.productBO.categoryDetails[0] &&
              props.rfqData.productDetail.productBO.categoryDetails[0]
                .taxonomyCode) ||
            (props.productData &&
              props.productData.categoryDetails &&
              props.productData.categoryDetails[0] &&
              props.productData.categoryDetails[0].taxonomy) ||
            (props.rfqData &&
              props.rfqData.categoryDetails &&
              props.rfqData.categoryDetails[0] &&
              props.rfqData.categoryDetails[0].taxonomy) ||
            msnTaxonomy,
        },
      ],
    };
    try {
      setLoader(true);
      if (isGstin) {
        const {data} = await validateGstin(gstin, props.sessionId, props.token);
        if (data && !data.valid) {
          // Toast.show({
          //   type: 'error',
          //   text2: data.message,
          //   visibilityTime: 4000,
          //   autoHide: true,
          // });
          setGstinError(data.message);
          // setGstinError(true);
          setLoader(false);
          return;
        }
      }
      const {data} = await createRfqApi(rfqObj, props.sessionId, props.token);
      if (data.status && data.statusCode == 200) {
        saveRfqPincode();
        props.setRfqRequirement(false);
        props.showSuccess();
        adobeRfqSubmitTrackEvent();
        clickStreamRfqRequirement();
        setLoader(false);
      } else {
        Toast.show({
          type: 'error',
          text2: 'Something went wrong!',
          visibilityTime: 2000,
          autoHide: true,
        });
        setLoader(false);
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong!',
        visibilityTime: 2000,
        autoHide: true,
      });
      setLoader(false);
    }
  };

  const clickStreamRfqRequirement = () => {
    let taxo1 =
      (props.rfqData &&
        props.rfqData.productDetail &&
        props.rfqData.productDetail.productBO &&
        props.rfqData.productDetail.productBO.categoryDetails &&
        props.rfqData.productDetail.productBO.categoryDetails[0] &&
        props.rfqData.productDetail.productBO.categoryDetails[0].taxonomyCode.split(
          '/',
        )[0]) ||
      (props.productData &&
        props.productData.categoryDetails &&
        props.productData.categoryDetails[0] &&
        props.productData.categoryDetails[0].taxonomy.split('/')[0]) ||
      (props.rfqData &&
        props.rfqData.categoryDetails &&
        props.rfqData.categoryDetails[0] &&
        props.rfqData.categoryDetails[0].taxonomy.split('/')[0]) ||
      msnTaxonomy.split('/')[0] ||
      '';
    let taxo2 =
      (props.rfqData &&
        props.rfqData.productDetail &&
        props.rfqData.productDetail.productBO &&
        props.rfqData.productDetail.productBO.categoryDetails &&
        props.rfqData.productDetail.productBO.categoryDetails[0] &&
        props.rfqData.productDetail.productBO.categoryDetails[0].taxonomyCode.split(
          '/',
        )[1]) ||
      (props.productData &&
        props.productData.categoryDetails &&
        props.productData.categoryDetails[0] &&
        props.productData.categoryDetails[0].taxonomy.split('/')[1]) ||
      (props.rfqData &&
        props.rfqData.categoryDetails &&
        props.rfqData.categoryDetails[0] &&
        props.rfqData.categoryDetails[0].taxonomy.split('/')[1]) ||
      msnTaxonomy.split('/')[1] ||
      '';
    let taxo3 =
      (props.rfqData &&
        props.rfqData.productDetail &&
        props.rfqData.productDetail.productBO &&
        props.rfqData.productDetail.productBO.categoryDetails &&
        props.rfqData.productDetail.productBO.categoryDetails[0] &&
        props.rfqData.productDetail.productBO.categoryDetails[0].taxonomyCode.split(
          '/',
        )[2]) ||
      (props.productData &&
        props.productData.categoryDetails &&
        props.productData.categoryDetails[0] &&
        props.productData.categoryDetails[0].taxonomy.split('/')[2]) ||
      (props.rfqData &&
        props.rfqData.categoryDetails &&
        props.rfqData.categoryDetails[0] &&
        props.rfqData.categoryDetails[0].taxonomy.split('/')[2]) ||
      msnTaxonomy.split('/')[2] ||
      '';

    let dataTracking = {
      event_type: 'click',
      label: 'get_bulk_quote',
      channel:
        props.fromListing && props.paramsType == 'Search'
          ? 'Search'
          : props.fromWishlist
          ? 'Wishlist'
          : props.fromPdp
          ? 'PDP'
          : 'Listing',
      page_type:
        props.fromListing && props.paramsType == 'Category'
          ? 'category_page'
          : props.fromListing && props.paramsType == 'Brand'
          ? 'brand_page'
          : props.fromListing && props.paramsType == 'Search'
          ? 'search_page'
          : props.fromGetQuote
          ? 'product_page'
          : props.fromWishlist
          ? 'wishlist_page'
          : 'brand_category_page',
      product_name:
        props.productData?.productName || props.rfqData?.productName,
      msn:
        props.productData?.defaultPartNumber ||
        props.rfqData?.moglixPartNumber ||
        props.rfqData?.defaultPartNumber,
      price: String(
        props.productData?.productPartDetails[
          props.productData?.defaultPartNumber
        ].productPriceQuantity.india.priceWithoutTax ||
          props.rfqData.priceWithoutTax,
      ),
      brand:
        props.productData?.brandDetails?.brandName ||
        props.rfqData?.brandDetails?.brandName ||
        props.rfqData?.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos:
        (props.productData && !props.productData.outOfStock) ||
        props.rfqData.quantityAvailable > 0
          ? 'false'
          : 'true',
      quantity: quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  const adobeRfqSubmitTrackEvent = () => {
    let taxo1 =
      (props.rfqData &&
        props.rfqData.productDetail &&
        props.rfqData.productDetail.productBO &&
        props.rfqData.productDetail.productBO.categoryDetails &&
        props.rfqData.productDetail.productBO.categoryDetails[0] &&
        props.rfqData.productDetail.productBO.categoryDetails[0].taxonomyCode.split(
          '/',
        )[0]) ||
      (props.productData &&
        props.productData.categoryDetails &&
        props.productData.categoryDetails[0] &&
        props.productData.categoryDetails[0].taxonomy.split('/')[0]) ||
      (props.rfqData &&
        props.rfqData.categoryDetails &&
        props.rfqData.categoryDetails[0] &&
        props.rfqData.categoryDetails[0].taxonomy.split('/')[0]) ||
      msnTaxonomy.split('/')[0] ||
      '';
    let taxo2 =
      (props.rfqData &&
        props.rfqData.productDetail &&
        props.rfqData.productDetail.productBO &&
        props.rfqData.productDetail.productBO.categoryDetails &&
        props.rfqData.productDetail.productBO.categoryDetails[0] &&
        props.rfqData.productDetail.productBO.categoryDetails[0].taxonomyCode.split(
          '/',
        )[1]) ||
      (props.productData &&
        props.productData.categoryDetails &&
        props.productData.categoryDetails[0] &&
        props.productData.categoryDetails[0].taxonomy.split('/')[1]) ||
      (props.rfqData &&
        props.rfqData.categoryDetails &&
        props.rfqData.categoryDetails[0] &&
        props.rfqData.categoryDetails[0].taxonomy.split('/')[1]) ||
      msnTaxonomy.split('/')[1] ||
      '';
    let taxo3 =
      (props.rfqData &&
        props.rfqData.productDetail &&
        props.rfqData.productDetail.productBO &&
        props.rfqData.productDetail.productBO.categoryDetails &&
        props.rfqData.productDetail.productBO.categoryDetails[0] &&
        props.rfqData.productDetail.productBO.categoryDetails[0].taxonomyCode.split(
          '/',
        )[2]) ||
      (props.productData &&
        props.productData.categoryDetails &&
        props.productData.categoryDetails[0] &&
        props.productData.categoryDetails[0].taxonomy.split('/')[2]) ||
      (props.rfqData &&
        props.rfqData.categoryDetails &&
        props.rfqData.categoryDetails[0] &&
        props.rfqData.categoryDetails[0].taxonomy.split('/')[2]) ||
      msnTaxonomy.split('/')[2] ||
      '';
    trackStateAdobe('moglix:bulk request form', {
      'myapp.linkpageName': 'moglix:bulk request form',
      'myapp.channel': `${props.fromScreen}`,
      'myapp.ctaname': 'get bulk quote',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID':
        (props && props.productData && props.productData.defaultPartNumber) ||
        (props && props.rfqData && props.rfqData.moglixPartNumber) ||
        (props && props.rfqData && props.rfqData.defaultPartNumber),
      'myapp.stockStatus':
        (props.productData && !props.productData.outOfStock) ||
        props.rfqData.quantityAvailable > 0
          ? 'inStock'
          : 'outOfStock',
      'myapp.productPrice':
        props.productData?.productPartDetails[
          props.productData?.defaultPartNumber
        ].productPriceQuantity.india.priceWithoutTax ||
        props.rfqData.priceWithoutTax,
      'myapp.brand':
        props.productData?.brandDetails?.brandName ||
        props.rfqData?.brandDetails?.brandName ||
        props.rfqData?.brandName,
      '&&products':
        ';' +
        ((props && props.productData && props.productData.defaultPartNumber) ||
          (props && props.rfqData && props.rfqData.moglixPartNumber) ||
          (props && props.rfqData && props.rfqData.defaultPartNumber)) +
        ';' +
        quantity +
        ';' +
        ((props.rfqData && props.rfqData.priceWithoutTax * quantity + ';') ||
          (props.productData &&
            props.productData.productPartDetails[
              props.productData && props.productData.defaultPartNumber
            ].productPriceQuantity.india.priceWithoutTax)),
      '&&events': 'event17',
    });
  };

  const adobeRfqButtonSubmitRequirement = rfqObj => {
    let taxo1 =
      (rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].taxonomyCode.split('/')[1]) ||
      '';

    let taxo3 =
      (rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].taxonomyCode.split('/')[2]) ||
      '';
    trackStateAdobe('moglix:bulk request form', {
      'myapp.linkpageName': 'moglix:bulk request form',
      'myapp.channel': `pdp`,
      'myapp.ctaname': 'get bulk quote',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID':
        rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].prodReference,
      'myapp.stockStatus':
        rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].outOfStock == 'outOfStock'
          ? 'outOfStock'
          : 'inStock',
      'myapp.productPrice':
        rfqObj.rfqEnquiryCustomer && rfqObj.rfqEnquiryCustomer.rfqValue,
      'myapp.brand':
        rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].brand,
      '&&products':
        ';' +
        (rfqObj &&
          rfqObj.rfqEnquiryItemsList &&
          rfqObj.rfqEnquiryItemsList[0] &&
          rfqObj.rfqEnquiryItemsList[0].prodReference) +
        ';' +
        quantity +
        ';' +
        (rfqObj.rfqEnquiryCustomer &&
          rfqObj.rfqEnquiryCustomer.rfqValue * quantity) +
        ';',
      '&&events': 'event17',
    });
  };

  const clickStreamSubmitRfqRequirement = rfqObj => {
    let taxo1 =
      (rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].taxonomyCode.split('/')[1]) ||
      '';

    let taxo3 =
      (rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].taxonomyCode.split('/')[2]) ||
      '';

    let dataTracking = {
      event_type: 'click',
      label: 'get_bulk_quote',
      channel: 'PDP',
      page_type: 'product_page',
      product_name:
        rfqObj.rfqEnquiryItemsList && rfqObj.rfqEnquiryItemsList[0].productName,
      msn:
        rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].prodReference,
      price: rfqObj.rfqEnquiryCustomer && rfqObj.rfqEnquiryCustomer.rfqValue,
      brand:
        rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].brand,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos:
        rfqObj &&
        rfqObj.rfqEnquiryItemsList &&
        rfqObj.rfqEnquiryItemsList[0] &&
        rfqObj.rfqEnquiryItemsList[0].outOfStock == 'outOfStock'
          ? 'outOfStock'
          : 'inStock',
      quantity: quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  const renderModalContent = () => {
    return (
      <Modal
        overlayPointerEvents={'auto'}
        coverScreen={true}
        style={styles.rfqModalWrap}
        deviceWidth={deviceWidth}
        hasBackdrop={true}
        isVisible={props.rfqRequirement}
        onRequestClose={() => {
          props.setRfqRequirement(false);
        }}>
        <View style={styles.modalHeader}>
          <Text style={styles.headingText}>Get Best Price</Text>
          <TouchableOpacity
            onPress={() => {
              props.setRfqRequirement(false);
            }}>
            <MatIcon
              name={'cancel'}
              size={20}
              color={colors.PrimaryTextColor}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.modalHeadingData}>
            <Text style={styles.prodHeading}>Product Details</Text>
            <Text style={styles.prodDetName}>
              {props.productData?.productName || props.rfqData?.productName}
            </Text>
            <Text style={styles.brand}>
              Brand :{' '}
              {props.productData?.brandDetails?.brandName ||
                props.rfqData?.brandDetails?.brandName ||
                props.rfqData?.brandName}
            </Text>
          </View>
          <View style={styles.enterQtyrow}>
            <Text style={styles.enterqtyText}>Enter the required quantity</Text>
            <Quantity
              productQuantity={quantity}
              setQuantity={setQuantity}
              minQuantity={props.minQuantity || minQuantity || 1}
              productData={props.productData}
              fromRfq
            />
          </View>
          <View style={styles.gbpWhiteBg}>
            {gstRfqDetails.map((_, k) =>
              _.hasDependentState ? (
                <View style={styles.checkAreaforGST}>
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <MaterialCommunityIcon
                      onPress={_.toggleDependentState}
                      name={
                        _.dependentStateName
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      size={24}
                      color={_.dependentStateName ? colors.BlueText : '#000'}
                    />
                    <View style={styles.markGST}>
                      <Text style={styles.markTextTitle}>
                        {_.dependentText}
                      </Text>
                      <Text style={styles.markTextsubTitle}>
                        {_.subdependentText}
                      </Text>
                    </View>
                  </View>
                  {_.dependentStateName ? renderInputText(_) : null}
                </View>
              ) : (
                renderInputText(_)
              ),
            )}
          </View>
        </ScrollView>
        <View style={{padding: Dimension.padding5}}>
          {/* <TouchableOpacity style={styles.submitButton}  */}
          <TouchableOpacity
            style={
              checkValidation() || loader
                ? styles.submitButtonDisabled
                : styles.submitButton
            }
            onPress={submitRfqModal}
            disabled={loader || checkValidation()}>
            {loader && <ActivityIndicator color={'#fff'} size={'small'} />}
            <Text style={styles.submitButtonText}>SUBMIT YOUR REQUIREMENT</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const renderComponent = () => {
    return (
      <View>
        <View style={styles.gbpRow}>
          <MaterialCommunityIcon
            name={'dropbox'}
            size={28}
            color={colors.PrimaryTextColor}
          />
          <View style={styles.gbtHeadText}>
            <Text style={styles.titletext}>
              Available On Request, Get Best Price
            </Text>
            <Text style={styles.SubTitletext}>
              Add more details to get the best deal.
            </Text>
          </View>
        </View>
        <View style={styles.enterQtyrow}>
          <Text style={styles.enterqtyText}>Enter the required Quantity</Text>
          <Quantity
            productQuantity={quantity}
            setQuantity={setQuantity}
            minQuantity={props.minQuantity || minQuantity || 1}
            productData={props.productData}
            fromRfq
          />
        </View>
        <View style={styles.gbpWhiteBg}>
          {gstRfqDetails.map((_, k) =>
            _.hasDependentState ? (
              <View style={styles.checkAreaforGST}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                  <MaterialCommunityIcon
                    onPress={_.toggleDependentState}
                    name={
                      _.dependentStateName
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={_.dependentStateName ? colors.BlueText : '#000'}
                  />

                  <View style={styles.markGST}>
                    <Text style={styles.markTextTitle}>{_.dependentText}</Text>
                    <Text style={styles.markTextsubTitle}>
                      {_.subdependentText}
                    </Text>
                  </View>
                </View>
                {_.dependentStateName ? renderInputText(_) : null}
              </View>
            ) : (
              renderInputText(_)
            ),
          )}
        </View>
      </View>
    );
  };
  if (props.fromGetQuote || props.fromListing || props.fromVariantCart) {
    return renderModalContent();
  } else {
    return renderComponent();
  }
});

const styles = StyleSheet.create({
  newinputfield: {
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  gbpRow: {
    flexDirection: 'row',
    backgroundColor: '#FFEEE5',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding10,
    marginTop: Dimension.margin10,
    alignItems: 'center',
  },
  gbtHeadText: {paddingLeft: Dimension.margin15},
  titletext: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.orangeColor,
  },
  SubTitletext: {
    fontSize: Dimension.font12,
    marginTop: -Dimension.margin4,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.PrimaryTextColor,
  },
  enterQtyrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: Dimension.margin8,
    paddingHorizontal: Dimension.padding15,
  },
  gbpWhiteBg: {backgroundColor: '#fff', paddingHorizontal: Dimension.padding15},
  enterqtyText: {
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font12,
  },
  markGST: {paddingLeft: Dimension.padding10},
  markTextsubTitle: {
    fontSize: Dimension.font12,
    marginTop: -Dimension.margin4,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.lightGrayText,
  },
  markTextTitle: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
  },
  checkAreaforGST: {
    flexDirection: 'column',
    paddingVertical: Dimension.padding20,
  },
  errorText: {
    fontSize: Dimension.font11,
    color: colors.RedThemeColor,
    fontFamily: Dimension.CustomRegularFont,
  },
  // RFQ Modal Style
  rfqModalWrap: {backgroundColor: '#fff', margin: 0, padding: 0},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding15,
  },
  headingText: {
    fontSize: Dimension.font14,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  prodHeading: {
    fontSize: Dimension.font11,
    color: colors.ExtralightGrayText,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  modalHeadingData: {
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding10,
  },
  prodDetName: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
  },
  brand: {
    fontSize: Dimension.font11,
    color: colors.lightGrayText,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  submitButton: {
    height: Dimension.height42,
    backgroundColor: colors.RedThemeColor,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius4,
  },
  submitButtonText: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#fff',
  },
  submitButtonDisabled: {
    backgroundColor: colors.ExtralightGrayText,
    flexDirection: 'row',
    height: Dimension.height42,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius4,
  },
});

export default RfqRequirement;
