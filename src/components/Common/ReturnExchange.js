import React, {useState, useEffect, createRef} from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  Picker,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import RNFetchBlob from 'rn-fetch-blob';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {getTransactionId, returnItem} from '../../services/orders';
import colors from '../../redux/constants/colors';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import Header from '../../components/Common/Header';
import {setOrderedTime} from '../../redux/actions/orders';
import {BASE_URL} from '../../redux/constants';
import ActionSheet from 'react-native-actions-sheet';
import _ from 'lodash';

const deviceWidth = Dimensions.get('window').width;

const ReturnExchange = props => {
  const [reason, setReason] = useState('');
  const [images, setImages] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [comment, setComment] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNameError, setAccountNameError] = useState(false);
  const [accountNo, setAccountNo] = useState('');
  const [accountNoError, setAccountNoError] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankNameError, setBankNameError] = useState(false);
  const [ifsc, setIfsc] = useState('');
  const [ifscError, setIfscError] = useState(false);
  const actionSheetRef = createRef();
  const dispatch = useDispatch();

  const monthArray = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'NOV',
    'DEC',
  ];

  useEffect(() => {
    if (
      accountName &&
      accountName.length &&
      accountName.match('^[a-zA-Z ]{2,30}$')
    ) {
      setAccountNameError(false);
    } else if (
      accountName &&
      accountName.length &&
      !accountName.match('^[a-zA-Z ]{2,30}$')
    ) {
      setAccountNameError(true);
    } else {
      setAccountNameError(false);
    }
  }, [accountName]);

  useEffect(() => {
    if (accountNo && accountNo.length && accountNo.match('^[0-9]{9,18}$')) {
      setAccountNoError(false);
    } else if (
      accountNo &&
      accountNo.length &&
      !accountNo.match('^[0-9]{9,18}$')
    ) {
      setAccountNoError(true);
    } else {
      setAccountNoError(false);
    }
  }, [accountNo]);

  useEffect(() => {
    if (bankName && bankName.length && bankName.match('^[a-zA-Z ]{2,30}$')) {
      setBankNameError(false);
    } else if (
      bankName &&
      bankName.length &&
      !bankName.match('^[a-zA-Z ]{2,30}$')
    ) {
      setBankNameError(true);
    } else {
      setBankNameError(false);
    }
  }, [bankName]);

  useEffect(() => {
    if (ifsc && ifsc.length && ifsc.match('^[A-Za-z]{4}[0][a-zA-Z0-9]{6}$')) {
      setIfscError(false);
    } else if (
      ifsc &&
      ifsc.length &&
      !ifsc.match('^[A-Za-z]{4}[0][a-zA-Z0-9]{6}$')
    ) {
      setIfscError(true);
    } else {
      setIfscError(false);
    }
  }, [ifsc]);

  const bankDetails = [
    {
      title: 'Account Holder Name*',
      state: accountName,
      disabled: false,
      onChange: text => setAccountName(text),
      errorState: accountNameError,
      errorText: 'Kindly enter a valid name',
    },
    {
      title: 'Account Number*',
      state: accountNo,
      disabled: false,
      onChange: text => setAccountNo(text),
      errorState: accountNoError,
      keyboardType: 'number-pad',
      errorText: 'Kindly enter a valid account number',
    },
    {
      title: 'Bank Name*',
      state: bankName,
      disabled: false,
      onChange: text => setBankName(text),
      errorState: bankNameError,
      errorText: 'Kindly enter valid bank name',
      maxLength: 10,
    },
    {
      title: 'IFSC*',
      state: ifsc,
      disabled: false,
      onChange: text => setIfsc(text),
      errorState: ifscError,
      errorText: 'Kindly enter correct ifsc code',
    },
  ];

  const renderInput = ({
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
    style,
  }) => {
    return (
      <View>
        <View style={[styles.newinputfield, style]} key={title}>
          <FloatingLabelInputField
            disabled={disabled}
            onChangeText={text => onChange(text)}
            label={title}
            value={state}
            maxLength={maxLength}
            keyboardType={keyboardType}
            onBlur={onBlur}
          />
        </View>
        {/* <Text>{title}</Text> */}
        {/* <View
          style={{
            marginVertical: 12,
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {disabled ? (
            <Text
              style={{
                padding: 6,
                color: 'grey',
                width: extra ? '80%' : '100%',
              }}>
              {state}
            </Text>
          ) : (
            <TextInput
              style={{ padding: 6, color: 'grey', width: extra ? '80%' : '100%' }}
              disabled={disabled}
              onChangeText={text => onChange(text)}
              value={state}
              maxLength={maxLength}
              keyboardType={keyboardType}
              onBlur={onBlur}
            />
          )}
        </View> */}
        {errorState && (
          <Text style={{color: 'red', fontSize: Dimension.font12}}>
            {errorText}
          </Text>
        )}
      </View>
    );
  };

  const onValueChange = value => {
    setReason(value);
  };

  const uploadImage = cheque => {
    const options = {
      quality: 0.3,
      maxWidth: 400,
      maxHeight: 400,
      mediaType: 'photo',
      noData: true,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        addItemImage(response, cheque);
        return;
      }
    });
  };

  const uploadFromCamera = cheque => {
    const options = {
      quality: 0.3,
      mediaType: 'photo',
      noData: true,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      cameraType: 'back',
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // console.log('launchCamera ka error hai bhai', response);
        addItemImage(response, cheque);

        return;
      }
    });
  };

  const openSelection = selection => {
    switch (selection) {
      case 'Gallery':
        actionSheetRef.current?.setModalVisible(false);
        uploadImage(false);
        break;

      case 'Camera':
        actionSheetRef.current?.setModalVisible(false);
        uploadFromCamera(false);
        break;

      default:
        actionSheetRef.current?.setModalVisible(false);
        break;
    }
  };

  const deleteImage = (image, index, cheque) => {
    // if (cheque) {
    //   this.setState({
    //     chequeImage: [],
    //   });
    //   return false;
    // }
    images.splice(index, 1);
    setImages([...images]);
    // this.setState({
    //   images: this.state.images,
    //   buttonEnabled: this.state.images.length ? true : false,
    // });
  };

  const getImages = cheque => {
    let lastStyle = {
      borderColor: Colors.PrimaryTextColor,
      borderWidth: 1,
      width: Dimension.width70,
      height: Dimension.width70,
      borderRadius: Dimension.borderRadius8,
      overflow: 'hidden',
      position: 'relative',
    };
    let style = {
      marginRight: Dimension.margin10,
      borderColor: Colors.PrimaryTextColor,
      borderWidth: 1,
      width: Dimension.width70,
      height: Dimension.width70,
      position: 'relative',
      borderRadius: Dimension.borderRadius8,
      overflow: 'hidden',
    };
    // let images = [];
    let imagesArr = images;
    // if (cheque) {
    //   imagesArr = this.state.chequeImage;
    // }
    return imagesArr.map((image, index) => (
      <View
        style={[
          styles.uploadedImageWrap,
          index + 1 == productImage.length ? lastStyle : style,
        ]}>
        <Image
          source={{uri: image.url}}
          resizeMode="contain"
          style={styles.uploadedImage}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
          }}
          onPress={() => deleteImage(image, index, cheque)}>
          <AntIcon name={'closecircle'} size={22} />
        </TouchableOpacity>
      </View>
    ));
  };

  const addItemImage = (photos, cheque) => {
    photos.assets.map((photo, i) => {
      if (images.length == 8) {
        return;
      }
      const fData = new FormData();
      if (photo.type == null) {
        photo.type = 'image/jpeg';
      }

      const file = {
        name: photo.fileName,
        type: photo.type,
        uri: photo.uri,
        data: RNFetchBlob.wrap(photo.uri),
      };

      fData.append('productImage', file);
      // EventsManager.dispatchEvent(EventsManager.events.START_LOADER);
      let requestArr = [
        {
          name: 'productImage',
          filename: file.name,
          type: file.type,
          data: RNFetchBlob.wrap(file.uri),
        },
      ];

      const url = `${BASE_URL}payment/uploadImageS`;

      RNFetchBlob.fetch(
        'POST',
        url,
        {
          'Content-Type': 'multipart/form-data',
          'x-access-token': props.token,
          'x-request-id': props.sessionId,
        },
        requestArr,
      )
        .then(res => {
          let imagesArr = images;
          let obj = {buttonEnabled: true};
          if (cheque) {
            // imagesArr = this.state.chequeImage;
            // imagesArr.push({file: photo, url: JSON.parse(res['data']['data'])});
            // obj.chequeImage = images;
          } else {
            let parsedString = JSON.parse(res['data']);
            imagesArr.push({file: photo, url: parsedString.data});
            obj.images = imagesArr;
          }

          setImages([...obj.images]);
        })
        .catch(error => {
          console.log('inCatch!', error);
        });
    });
  };

  const checkCommonValidation = () => {
    return (
      accountName &&
      accountName.length &&
      !accountNameError &&
      accountNo &&
      accountNo.length &&
      !accountNoError &&
      bankName &&
      bankName.length &&
      !bankNameError &&
      ifsc &&
      ifsc.length &&
      !ifscError &&
      images &&
      images.length
    );
  };

  const returnProduct = () => {
    let rData = {};
    rData.requestType = props.fromExchange ? 'exchange' : 'return';
    rData.reason = reason;
    rData.quantity = props.order_params.quantity;
    rData.comment = comment;
    rData.productImage = [];
    if (images && images.length > 0) {
      let i = 0;
      while (i < images.length) {
        rData.productImage.push(images[i]['url']);
        i++;
      }
    }
    rData.itemId = props.order_params.item_id;
    rData.msn = props.order_params.product_msn;
    if (
      !props.fromExchange &&
      ['COD', 'NEFT'].includes(props.order_params.payment_type)
    ) {
      rData.bankDetail = {};
      //   if (this.state.chequeImage && this.state.chequeImage.length) {
      //     rData.bankDetail.chequeUrl = this.state.chequeImage[0]['url'];
      //   }
      rData.bankDetail.bankName = bankName;
      rData.bankDetail.ifscCode = ifsc;
      rData.bankDetail.acountName = accountName;
      rData.bankDetail.acountNo = accountNo;
    }
    rData.reasonId = 0;
    getRefundTransactionId(rData, props.userId);
  };

  const getRefundTransactionId = async (rData, userId) => {
    if (rData && userId) {
      const {data} = await getTransactionId(
        props.userId,
        props.sessionId,
        props.token,
      );
      if (data && data['status']) {
        rData.transactionId = data['data']['transactionId'];
        rData.orderId = props.order_params.order_id;
        rData.quantity = 1;
        returnRefund(rData);
      }
    }
  };

  const returnRefund = async rData => {
    if (rData) {
      const {data} = await returnItem(rData, props.sessionId, props.token);
      if (data['status']) {
        let obj = {};
        obj['item_id'] = rData['itemId'];
        obj['requestType'] = rData.requestType;
        obj.dates = {};
        let crrDate = new Date();
        obj.dates['re_ex_requested'] = {
          date:
            crrDate.getDate() +
            '-' +
            monthArray[crrDate.getMonth()] +
            '-' +
            crrDate.getFullYear(),
          flag: true,
        };
        obj.dates['re_ex_approved'] = {date: '', flag: false};
        obj.dates['re_ex_picked'] = {date: '', flag: false};
        if (rData.requestType == 'return') {
          obj.dates['return_done'] = {date: '', flag: false};
        }

        // if (this.state.quantity) {
        //   obj.Quantity = this.state.quantity;
        // }
        props.toggleModal(obj);
      }
    }
  };

  return (
    <Modal
      overlayPointerEvents={'auto'}
      coverScreen={true}
      //   deviceWidth={deviceWidth}
      hasBackdrop={true}
      style={styles.orderCancel}
      isVisible={props.remodal || props.exModal}
      onRequestClose={() => {
        props.fromExchange ? props.setExModal(false) : props.setReModal(false);
      }}>
      <Header
        navigation={{
          goBack: () =>
            props.fromExchange
              ? props.setExModal(false)
              : props.setReModal(false),
        }}
        showBack
        showText={
          props.fromExchange ? 'Request for Exchange' : 'Request for Return'
        }
      />
      <ScrollView>
        <View style={styles.orderCancelDescInner}>
          <View style={styles.returnExchange}>
            <Image
              source={{
                uri: props.order_params.productImg,
              }}
              style={styles.orderCancelProdImg}
              resizeMode="contain"
            />
            <View style={styles.orderCancelProdName}>
              <Text style={styles.orderCancelProdNameTxt}>
                {props.order_params.product_name}
              </Text>
              <Text style={styles.prodPrice}>
                ₹{props.order_params.price_without_tax}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.reasonCancelMainWrap}>
          <View style={styles.reasonCancelWrap}>
            {props.fromExchange ? (
              <Text style={styles.reasonCancelTxt}>Reason for Exchange</Text>
            ) : (
              <Text style={styles.reasonCancelTxt}>Reason for Return</Text>
            )}
            <View style={styles.reasonCancelInputWrap}>
              <View style={styles.selectionWrap}>
                {/* <FAIcon name="angle-down" style={styles.pickerIcon} /> */}
                <Picker
                  note
                  mode="dropdown"
                  placeholderIconColor={'#000'}
                  placeholder={
                    props.fromExchange
                      ? 'Reason for exchange*'
                      : 'Reason for return*'
                  }
                  
                  selectedValue={reason}
                  onValueChange={onValueChange}>
                  <Picker.Item
                    key={'noKey'}
                    color={colors.lightGrayText}
                    label={
                      props.fromExchange
                        ? 'Reason for exchange*'
                        : 'Reason for return*'
                    }
                    value={false}
                  />
                  {props.returnReasons.map((value, idx) => {
                    return (
                      <Picker.Item
                        key={idx}
                        // color={colors.lightGrayText}
                        label={value.text}
                        value={value.text}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={[styles.newinputfield]}>
                <FloatingLabelInputField
                  label={'Add Comment  (Optional)'}
                  heightStyle={{height: 120}}
                  value={comment}
                  multiline={true}
                  inputHeight={styles.inputBoxStyle}
                  onChangeText={str => {
                    setComment(str);
                  }}
                />
                {/* <TextInput
                /> */}
              </View>
            </View>
          </View>
        </View>
        {reason ? (
          <View style={styles.uploadImage}>
            <View style={styles.uploadedImagesWrap}>
              {images && images.length < 8 ? (
                <>
                  <TouchableOpacity
                    style={styles.imageUploadPlaceholder}
                    onPress={
                      () => actionSheetRef.current?.setModalVisible(true)
                      // uploadImage(false);
                    }>
                    <AntIcon
                      name={'plus'}
                      size={24}
                      color={colors.RedThemeColor}
                    />
                  </TouchableOpacity>
                </>
              ) : null}
              {images && images.length == 0 ? (
                <View style={styles.imageText}>
                  <Text style={styles.addImageTitle}>Add a photo or video</Text>
                  <Text style={styles.addImageSubTitle}>
                    images and videos would be more helpful to understand your
                    problem.
                  </Text>
                </View>
              ) : null}
              {images && images.length >= 1 ? (
                <ScrollView horizontal={true} style={styles.uploadedImageRow}>
                  {getImages()}
                </ScrollView>
              ) : null}
            </View>
            {reason ? (
              <View style={styles.extraInfo}>
                <Text style={styles.infoItem}>
                  Max. 8 images with jpeg, jpg & png formats allowed (Include
                  product packaging images as well) Please include images of
                </Text>
                <Text style={styles.infoItem}>1. Exterior Packaging/Box</Text>
                <Text style={styles.infoItem}>
                  2. Interior Packaging/Box or Bubble Wrap{' '}
                </Text>
                <Text style={styles.infoItem}>3. Complete Product </Text>
                <Text style={styles.infoItem}>4. Shipping label</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {!props.fromExchange &&
        ['COD', 'NEFT'].includes(props.order_params.payment_type) ? (
          <>
            <View style={styles.bankDetailsFields}>
              <Text style={styles.bankDetailsTxt}>
                Please provide your bank details to get refund
              </Text>
              {bankDetails.map((_, k) => renderInput(_))}
            </View>
          </>
        ) : props.fromExchange ? (
          <></>
        ) : (
          <View style={styles.refundStatus}>
            <Text style={styles.refTitle}>Refund Status</Text>
            <Text style={styles.refsubText}>
              Source Payment - Refund will be initiated to its source payment
              mode within 7-10 business days once the product reaches to our
              fulfilment center.
            </Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        disabled={
          !props.fromExchange &&
          ['COD', 'NEFT'].includes(props.order_params.payment_type)
            ? !checkCommonValidation()
            : images && images.length
            ? false
            : true
        }
        // style={styles.bankCtaWrap}
        style={[
          styles.bankCtaWrap,
          {
            backgroundColor:
              !props.fromExchange &&
              ['COD', 'NEFT'].includes(props.order_params.payment_type)
                ? !checkCommonValidation()
                  ? '#C4C4C4'
                  : '#D9232D'
                : images && images.length
                ? '#D9232D'
                : '#C4C4C4',
          },
        ]}
        onPress={() => returnProduct()}>
        <Text style={styles.bankCtaTxt}>SUBMIT REQUEST</Text>
      </TouchableOpacity>
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheet}>
          {['Camera', 'Gallery', 'Cancel'].map(_ => (
            <TouchableOpacity onPress={() => openSelection(_)}>
              <Text style={styles.modalText}>{_}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
    </Modal>
  );
};

export default ReturnExchange;

// !props.fromExchange &&
//               ['COD', 'NEFT'].includes(props.order_params.payment_type)
//                 ? !checkCommonValidation()
//                 : images && images.length
//                 ? 'red'
//                 : 'grey',

const styles = StyleSheet.create({
  orderCancel: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: -Dimension.margin2,
    marginHorizontal: -Dimension.margin1,
  },
  orderCancelDescInner: {
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding15,
  },
  returnExchange: {
    borderWidth: 1,
    borderColor: colors.accborder,
    borderRadius: Dimension.borderRadius8,
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding10,
    paddingVertical: Dimension.padding15,
  },
  orderCancelProdImg: {
    width: Dimension.width74,
    height: Dimension.height74,
  },
  orderCancelProdName: {
    paddingLeft: Dimension.padding25,
    flexDirection: 'column',
    flex: 1.5,
  },
  orderCancelProdNameTxt: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  prodPrice: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    paddingTop: Dimension.margin5,
  },
  reasonCancelTxt: {
    // marginTop: Dimension.margin20,
    marginBottom: Dimension.margin10,
    color: colors.LightTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
  },
  bankDetailsTxt: {
    marginTop: Dimension.margin20,
    color: colors.LightTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
  },
  reasonCancelInputWrap: {
    borderWidth: 1,
    borderColor: colors.accborder,
    borderRadius: Dimension.borderRadius8,
    paddingHorizontal: Dimension.padding10,
    paddingTop: Dimension.padding20,
    paddingBottom: Dimension.padding20,
  },
  selectionWrap: {
    borderWidth: 1,
    borderColor: colors.lightGrayText,
    borderRadius: Dimension.borderRadius8,
    backgroundColor: '#fff',
    position: 'relative',
    marginBottom: Dimension.margin10,
  },
  selectionTxt: {
    color: colors.placeholderGray,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
  },
  selectionPopup: {
    marginTop: Dimension.margin60,
  },
  selectionPopupTxt: {
    fontSize: Dimension.font6,
  },

  reasonCancelMainWrap: {
    paddingHorizontal: Dimension.padding15,
  },
  bankDetailsFields: {
    paddingHorizontal: Dimension.padding15,
    paddingBottom: Dimension.padding20,
  },
  bankCtaWrap: {
    height: Dimension.height40,
    margin: Dimension.margin6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: Dimension.borderRadius8,
  },
  bankCtaTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.white,
  },
  actionSheet:{
    width: '100%', 
    backgroundColor: '#fff', 
    padding: 20,
  },
  modalText:{
    paddingVertical:10,
    fontFamily:Dimension.CustomRegularFont,
    borderBottomWidth:0.5
    
  },
  bankInput: {
    marginBottom: Dimension.margin20,
  },
  inputBoxStyle: {height: 110, textAlignVertical: 'top'},
  pickerIcon: {
    position: 'absolute',
    zIndex: 1,
    fontSize: Dimension.font20,
    color: colors.PrimaryTextColor,
    right: Dimension.padding15,
    top: Dimension.padding10,
  },
  uploadedImagesWrap: {
    backgroundColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding15,
    marginTop: Dimension.margin10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUploadPlaceholder: {
    width: Dimension.width70,
    height: Dimension.height70,
    borderWidth: 1,
    borderColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Dimension.margin10,
    backgroundColor: '#fff',
  },
  imageText: {paddingLeft: Dimension.padding15, flex: 1},
  addImageTitle: {
    fontSize: Dimension.font14,
    color: '#303030',
    fontFamily: Dimension.CustomMediumFont,
  },
  addImageSubTitle: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
  },
  extraInfo: {
    color: colors.PrimaryTextColor,
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    backgroundColor: colors.ProductBorderColor,
    // marginTop: Dimension.margin10,
  },
  infoItem: {
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font11,
    color: colors.PrimaryTextColor,
    lineHeight: Dimension.margin15,
  },
  uploadedImage: {
    width: Dimension.width70,
    height: Dimension.width70,
    borderRadius: Dimension.borderRadius8,
  },
  uploadedImageRow: {flexDirection: 'row', flexWrap: 'nowrap'},
  refundStatus: {
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding10,
  },
  refTitle: {
    fontSize: Dimension.font11,
    color: colors.ExtralightGrayText,
    fontFamily: Dimension.CustomMediumFont,
  },
  refsubText: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
  },
});
