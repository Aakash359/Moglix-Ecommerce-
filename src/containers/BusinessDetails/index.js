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
  TextInput,
  Picker,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  getCustomerBusinessDetailsApi,
  addUpdateCustomerApi,
} from '../../services/user';
import {validateGstin, validatePincode} from '../../services/address';
import Header from '../../components/Common/Header';
import {
  States,
  emailRegex,
  gstinRegex,
  addressLineRegex,
} from '../../constants';
import styles from './style';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import Toast from 'react-native-toast-message';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

const BusinessDetailsScreen = props => {
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );

  const [loader, setLoader] = useState(false);
  const [customerBusinessDetails, setCustomerBusinessDetails] = useState({});
  const [gstin, setGstin] = useState(
    (customerBusinessDetails && customerBusinessDetails.gstin) || '',
  );
  const [gstinVerified, setGstinVerified] = useState(
    customerBusinessDetails?.gstinVerified || false,
  );
  const [name, setName] = useState(
    (customerBusinessDetails && customerBusinessDetails.companyName) || '',
  );
  const [email, setEmail] = useState(customerBusinessDetails?.email || '');
  const [phone, setPhone] = useState(customerBusinessDetails?.phone || '');
  const [addressLine, setAddressLine] = useState(
    customerBusinessDetails?.address?.addressLine || '',
  );
  const [country, setCountry] = useState({
    idCountry: 110,
    isoCode: 'IN',
    name: 'INDIA',
  });
  const [pinMaperror, setpinMaperror] = useState('');
  const [stateName, setStateName] = useState(
    customerBusinessDetails?.address?.idState || '',
  );
  const [city, setCity] = useState(
    customerBusinessDetails?.address?.city || '',
  );
  const [landmark, setLandmark] = useState(
    customerBusinessDetails?.address?.landmark,
  );
  const [postCode, setPostCode] = useState(
    customerBusinessDetails?.address?.postCode || '',
  );
  const [gstinError, setGstinError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressLineError, setAddressLineError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [stateNameError, setStateNameError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [landmarkError, setLandmarkError] = useState(false);
  const [postCodeError, setPostCodeError] = useState(false);
  const [init, setInit] = useState(false);
  const [disableState, setDisableState] = useState(false);
  const [cityList, setCityList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getCustomerBusinessDetails();
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      if (
        customerBusinessDetails.gstin &&
        customerBusinessDetails.gstin.length > 14 &&
        customerBusinessDetails.gstin.match(gstinRegex)
      ) {
        setGstinError(false);
      } else {
        setGstinError(true);
        setDisableState(true);
        setGstinVerified(false);
      }
    }
  }, [customerBusinessDetails.gstin]);

  const getcityData = async postCode => {
    const {data} = await validatePincode(postCode, sessionId, token);
    setCityList(data.dataList);
  };

  useEffect(() => {
    console.log(cityList, city);
  });

  useEffect(() => {
    if (init) {
      if (
        customerBusinessDetails.companyName &&
        customerBusinessDetails.companyName.length
      ) {
        setNameError(false);
      } else {
        setNameError(true);
      }
    }
  }, [customerBusinessDetails.companyName]);

  useEffect(() => {
    if (init) {
      if (
        customerBusinessDetails.email &&
        customerBusinessDetails.email.length &&
        customerBusinessDetails.email.match(emailRegex)
      ) {
        setEmailError(false);
      } else if (
        customerBusinessDetails.email &&
        customerBusinessDetails.email.length &&
        !customerBusinessDetails.email.match(emailRegex)
      ) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  }, [customerBusinessDetails.email]);

  useEffect(() => {
    if (init) {
      if (
        customerBusinessDetails.phone &&
        customerBusinessDetails.phone.length > 9
      ) {
        setPhoneError(false);
      } else {
        setPhoneError(true);
      }
    }
  }, [customerBusinessDetails.phone]);

  useEffect(() => {
    if (init) {
      if (
        customerBusinessDetails &&
        customerBusinessDetails.address &&
        customerBusinessDetails.address.addressLine &&
        customerBusinessDetails.address.addressLine.length &&
        customerBusinessDetails.address.addressLine
          .replace('|', ',')
          .match(addressLineRegex)
      ) {
        setAddressLineError(false);
      } else {
        setAddressLineError(true);
      }
    }
  }, [customerBusinessDetails?.address?.addressLine]);

  useEffect(() => {
    if (init) {
      if (stateName && stateName.idState && stateName.name) {
        setStateNameError(false);
      } else {
        setStateNameError(true);
      }
    }
  }, [stateName]);

  useEffect(() => {
    if (init) {
      if (city && city.length > 2) {
        setCityError(false);
      } else {
        setCityError(true);
      }
    }
  }, [city]);

  useEffect(() => {
    if (init) {
      if (
        customerBusinessDetails &&
        customerBusinessDetails.address &&
        customerBusinessDetails.address.postCode &&
        customerBusinessDetails.address.postCode.length > 5
      ) {
        setPostCodeError(false);
        onSetPincode(customerBusinessDetails?.address?.postCode);
      } else {
        setPostCodeError(true);
      }
    }
  }, [customerBusinessDetails?.address?.postCode]);

  const getCustomerBusinessDetails = async () => {
    try {
      const {data} = await getCustomerBusinessDetailsApi(
        userId,
        sessionId,
        token,
      );
      setCustomerBusinessDetails({...data.data});
      if (data.data && data.data.gstinVerified) {
        setGstinVerified(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onEnterGstin = async () => {
    // setGstin(gstin);
    if (
      customerBusinessDetails.gstin &&
      customerBusinessDetails.gstin.length > 14 &&
      customerBusinessDetails.gstin.match(gstinRegex)
    ) {
      setGstinError(false);
      const {data} = await validateGstin(
        customerBusinessDetails.gstin,
        sessionId,
        token,
      );
      if (data && data.valid) {
        setGstinVerified(true);
        setDisableState(false);
        let currDetails = {
          ...customerBusinessDetails,
          companyName: data.taxpayerDetails?.legal_name_of_business,
          address: {
            ...customerBusinessDetails.address,
            pncd: data.taxpayerDetails?.billing_address.addr.pncd,
            ['addressLine']: `${data.taxpayerDetails?.billing_address.addr.bno}, ${data.taxpayerDetails?.billing_address.addr.bnm}, ${data.taxpayerDetails?.billing_address.addr.st}, ${data.taxpayerDetails?.billing_address.addr.loc}`,
          },
        };
        onSetPincode(data.taxpayerDetails.billing_address.addr.pncd, {
          ...currDetails,
        });
        setCustomerBusinessDetails({...currDetails});
        //   setName(data.taxpayerDetails.legal_name_of_business);
        //   setAddressLine(
        //     `${data.taxpayerDetails.billing_address.addr.bno}, ${data.taxpayerDetails.billing_address.addr.bnm}, ${data.taxpayerDetails.billing_address.addr.st}, ${data.taxpayerDetails.billing_address.addr.loc}`,
        //   );
        setNameError(false);
        setAddressLineError(false);
      } else {
        Toast.show({
          type: 'error',
          text2: data.message,
          visibilityTime: 4000,
          autoHide: true,
        });
        setGstinVerified(false);
        // setGstinError(true);
      }
    } else {
      setGstinError(true);
    }
  };

  const onSetPincode = async (pincode, currData) => {
    setPostCode(pincode);
    if (pincode && pincode.length > 5) {
      setpinMaperror(false);
      setPostCodeError(false);
      const {data} = await validatePincode(pincode, sessionId, token);
      if (data.dataList && data.dataList.length) {
        let currDetails = {
          ...(currData || customerBusinessDetails),
          address: {
            ...(currData || customerBusinessDetails).address,
            postCode:
              currData?.address?.pncd ||
              customerBusinessDetails.address.postCode,
            city: data.dataList[0].city,
            idState: data.dataList[0].state,
          },
        };

        setCustomerBusinessDetails({...currDetails});
        setCityList(data && data.dataList);

        //   setCity(data.dataList[0].city);
        //   setStateName({
        //     idState: data.dataList[0].state,
        //     name: States.find(_ => _.value == data.dataList[0].state).label,
        //   });
        setStateNameError(false);
        setCityError(false);
      } else {
        setPostCodeError(true);
      }
    } else {
      setPostCodeError(true);
    }
  };

  const setField = (key, value) => {
    let currDetails = {
      ...customerBusinessDetails,
    };

    if (key == 'addressLine') {
      currDetails = {
        ...currDetails,
        address: {
          ...currDetails.address,
          addressLine:
            key == 'addressLine' ? value : currDetails.address.addressLine,
        },
      };
    } else if (key == 'postCode') {
      currDetails = {
        ...currDetails,
        address: {
          ...currDetails.address,
          postCode: key == 'postCode' ? value : currDetails.address.postCode,
        },
      };
    } else if (key == 'landmark') {
      currDetails = {
        ...currDetails,
        address: {
          ...currDetails.address,
          landmark: key == 'landmark' ? value : currDetails.address.landmark,
        },
      };
    } else {
      currDetails = {
        ...currDetails,
        [`${key}`]: value,
      };
    }

    setCustomerBusinessDetails({...currDetails});
  };

  useEffect(() => {
    console.log(customerBusinessDetails);
  });

  const businessDetails = [
    {
      title: 'GSTIN*',
      state: customerBusinessDetails.gstin,
      disabled: false,
      onChange: text => setField('gstin', text),
      maxLength: 15,
      style: {width: '100%'},
      errorState: gstinError,
      errorText: ' Kindly enter a valid GSTIN of 15-digit',
      extra: () => (
        <TouchableOpacity
          onPress={onEnterGstin}
          disabled={gstinVerified || gstinError}
          style={[
            styles.gstBtn,
            {
              padding: 6,
              backgroundColor:
                gstinVerified && !gstinError
                  ? 'green'
                  : ((customerBusinessDetails || {}).gstin || '').length ==
                      15 && !gstinError
                  ? 'red'
                  : 'grey',
            },
          ]}>
          <Text style={styles.gstText}>
            {gstinVerified && !gstinError ? 'VERIFIED' : 'VERIFY'}
          </Text>
        </TouchableOpacity>
      ),
    },
    {
      title: 'Business Name*',
      state: customerBusinessDetails.companyName,
      disabled: disableState,
      onChange: text => setField('companyName', text),
      errorState: nameError,
      style: {width: '100%'},
      errorText: 'Kindly enter your business entity name',
    },
    {
      title: 'Business Email (Optional)',
      state: customerBusinessDetails.email,
      disabled: disableState,
      onChange: text => setField('email', text),
      errorState: emailError,
      style: {width: '100%'},
      errorText: 'Kindly enter valid business email',
    },
    {
      title: 'Business Phone*',
      state: customerBusinessDetails.phone,
      disabled: disableState,
      onChange: text => setField('phone', text),
      keyboardType: 'number-pad',
      errorState: phoneError,
      style: {width: '100%'},
      errorText: 'Kindly enter valid phone number',
      maxLength: 10,
    },
    {
      title: 'Registered Address*',
      state: customerBusinessDetails?.address?.addressLine,
      disabled: disableState,
      onChange: text => setField('addressLine', text),
      errorState: addressLineError,
      style: {width: '100%'},
      errorText: 'Kindly enter your address',
    },
    {
      title: 'Pincode*',
      state: customerBusinessDetails?.address?.postCode,
      disabled: disableState,
      onChange: text => setField('postCode', text),
      keyboardType: 'number-pad',
      errorState: pinMaperror || postCodeError,
      style: {width: '100%'},
      errorText: pinMaperror || 'Kindly enter your valid pincode',
      maxLength: 6,
    },

    // customerBusinessDetails &&
    //         customerBusinessDetails.address &&
    //         customerBusinessDetails.address.idState.toString()
    {
      title: 'City*',
      state: customerBusinessDetails?.address?.city,
      disabled: disableState,
      onChange: text => setField('city', text),
      errorState: cityError,
      style: {width: '48%'},
      errorText: 'Kindly enter valid city',
    },
    {
      title: 'State*',
      state: (
        States.find(
          _ => _.value == customerBusinessDetails?.address?.idState,
        ) || {}
      ).label,
      disabled: true,
      onChange: text => setField('stateName', text),
      errorState: stateNameError,
      style: {width: '48%'},
      errorText: 'Kindly enter valid state',
    },
    {
      title: 'Country*',
      state: country.name,
      disabled: true,
      // onChange: text => setField('country', text),
      errorState: countryError,
      style: {width: '100%'},
      errorText: 'Kindly enter your country',
    },

    {
      title: 'Landmark (Optional)',
      state: customerBusinessDetails?.address?.landmark,
      disabled: disableState,
      onChange: text => setField('landmark', text),
      errorState: landmarkError,
      style: {width: '100%'},
      errorText: 'Kindly enter valid landmark',
    },
  ];

  const onBusinessDetailsUpdate = () => {
    setpinMaperror(false);
    setLoader(true);
    addUpdateCustomerApi(
      {
        ...customerBusinessDetails,
        address: {
          ...customerBusinessDetails.address,
          addressCustomerName: customerBusinessDetails.companyName,
          idCountry: 110,
          idCustomer: userId,
          active: true,
          gstin: customerBusinessDetails.gstin,
          idAddressType: 3,
          landmark: customerBusinessDetails.address.landmark || '',
        },
        postCode: customerBusinessDetails.address.postCode,
        isGstInvoice: 1,
        customerId: userId,
        companyName: customerBusinessDetails.companyName,
        email: customerBusinessDetails.email || '',
        gstin: customerBusinessDetails.gstin,
        phone: customerBusinessDetails.phone,
      },
      sessionId,
      token,
    )
      .then(res => {
        if (
          typeof res.response != 'undefined' &&
          typeof res.response.data != 'undefined' &&
          res.response.data.statusCode == 400 &&
          !res.response.data.status
        ) {
          setpinMaperror(res.response.data.statusDescription);
          return;
        } else if (res.data.statusCode == 200) {
          Toast.show({
            type: 'success',
            text2: 'Business details updated successfully!',
            visibilityTime: 2000,
            autoHide: true,
          });
          props.navigation.navigate('Profile');
        }
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        if (
          typeof e.response != 'undefined' &&
          typeof e.response.data != 'undefined' &&
          e.response.data.statusCode == 400 &&
          !e.response.data.status
        ) {
          if (e.response.data.statusDescription.includes('pincode')) {
            setpinMaperror(e.response.data.statusDescription);
          } else {
            Toast.show({
              type: 'error',
              text2: e.response.data.statusDescription,
              visibilityTime: 2000,
              autoHide: true,
            });
          }
          return;
        }
      });
  };

  const checkCommonValidation = () => {
    return (
      customerBusinessDetails.gstin &&
      customerBusinessDetails.gstin.length > 14 &&
      customerBusinessDetails.gstin.match(gstinRegex) &&
      !gstinError &&
      customerBusinessDetails.companyName &&
      customerBusinessDetails.companyName.length &&
      !nameError &&
      !emailError &&
      customerBusinessDetails.phone &&
      customerBusinessDetails.phone.length > 9 &&
      !phoneError &&
      customerBusinessDetails.address.addressLine &&
      customerBusinessDetails.address.addressLine.length &&
      customerBusinessDetails.address.addressLine
        .replace('|', ',')
        .match(addressLineRegex) &&
      !addressLineError &&
      customerBusinessDetails.address.postCode &&
      customerBusinessDetails.address.postCode.length > 5 &&
      !postCodeError
    );
  };

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
    if (component) {
      return component();
    } else {
      return (
        <View style={[styles.newinputfield, style]} key={title}>
          {title == 'City*' ? (
            <View style={styles.newinputfieldwithpicker}>
              <View style={styles.citystateinputview}>
                <Picker
                  mode="dropdown"
                  placeholder="City"
                  disabled={disabled}
                  iosIcon={<MatIcon name="arrow-down" />}
                  selectedValue={customerBusinessDetails?.address?.city}
                  onValueChange={itemValue => onChange(itemValue)}
                  style={styles.pickerCss}>
                  {[{city: 'City'}, ...cityList].map(item => {
                    return (
                      <Picker.Item
                        label={item.city}
                        value={item.city == 'City' ? '' : item.city}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          ) : (
            <FloatingLabelInputField
              label={title}
              onChangeText={text => onChange(text)}
              value={state}
              disabled={disabled}
              onBlur={onBlur}
              // errorBorder={'#D9232D'}
              maxLength={maxLength}
              keyboardType={keyboardType}
              // hideLabel={''}
            />
          )}

          {/* )} */}
          {extra ? extra() : null}
          {/* </View> */}
          {errorState && <Text style={styles.errorText}>{errorText}</Text>}
        </View>
      );
    }
  };

  return (
    <View style={styles.addrModuleWrap}>
      <Header
        showBack
        showText={`Business Details`}
        navigation={props.navigation}
        showWishlist
        showCart
      />
      <ScrollView style={styles.scrollViewPage}>
        <View style={styles.inputViewWrap}>
          {businessDetails.map((_, k) =>
            renderInputText({
              ..._,
              disabled:
                _.title != 'GSTIN*'
                  ? gstinVerified
                    ? _.disabled
                    : true
                  : false,
              value:
                _.title == 'State*'
                  ? (
                      States.find(
                        _ =>
                          _.value == customerBusinessDetails?.address?.idState,
                      ) || {}
                    ).label
                  : _.value,
            }),
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!checkCommonValidation() || loader}
          onPress={() => onBusinessDetailsUpdate()}
          style={[
            {
              backgroundColor:
                !checkCommonValidation() || loader ? '#C4C4C4' : '#D9232D',
            },
            styles.checkoutBtn,
          ]}>
          {loader && <ActivityIndicator color={'#fff'} />}
          <Text style={styles.checkoutText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BusinessDetailsScreen;
// checkValidation() ||
//             addresses[invoiceType].status === STATE_STATUS.FETCHING
