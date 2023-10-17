import React, {useState} from 'react';
import Modal from 'react-native-modal';
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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
const deviceWidth = Dimensions.get('window').width;

const PincodeModal = props => {
  const [pincode, setPincode] = useState(props.selectedPincode.postCode || '');
  const addressItem = ({item}) => (
    <TouchableOpacity
      style={[styles.addrselectedBox]}
      onPress={() => {
        props.productLogistics(item, true);
        setPincode(item.postCode);
      }}>
      <Icon
        color={colors.RedThemeColor}
        size={20}
        name={
          props.selectedPincode.postCode == item.postCode &&
          props.selectedPincode.idAddress == item.idAddress
            ? 'radiobox-marked'
            : 'radiobox-blank'
        }
      />
      <View style={styles.addrScrollRow}></View>
      <Text style={styles.sylname}>{item.addressCustomerName}</Text>
      <Text style={styles.addfulltext}>{item.addressLine}</Text>
      <Text style={styles.addfulltext}>
        {item.city}
        {', '}
        {item.state.name}
      </Text>
      <Text style={styles.addfulltext}>{item.postCode}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      // overlayPointerEvents={'auto'}
      onBackButtonPress={() => props.pincodelocationModal()}
      isVisible={props.pincodeModal}
      onBackdropPress={() => props.pincodelocationModal()}
      onTouchOutside={() => {
        props.pincodelocationModal();
      }}
      onDismiss={() => {
        props.pincodelocationModal();
      }}
      style={{padding: 0, justifyContent: 'flex-end', margin: 0}}
      hasBackdrop={true}>
      <View style={styles.SYinnerModal}>
        <View style={styles.modalInnerArea}>
          <View style={styles.ModalHeader}> 
            {props.addresses && props.addresses.length ? (
            <Text style={styles.syModalHeading}>Set Your Location</Text>
          ) : 
          <Text style={styles.syModalHeading}>
          Use pincode to check delivery info
        </Text>}
          <TouchableOpacity
            style={styles.closebtn}
            onPress={() => {
              props.pincodelocationModal();
            }}>
            <Icon name="close-circle" style={styles.closeicon} />
          </TouchableOpacity></View>
         
          {props.addresses && props.addresses.length ? (
            <Text style={styles.subtitle}>
              Select a delivery location to see product availability and
              delivery options
            </Text>
          ) : null}
          {props.addresses && props.addresses.length ? (
          <View style={styles.scrollViewinSYL}>
            <FlatList
              data={props.addresses}
              horizontal
              horizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${index}-item`}
              renderItem={addressItem}
            />
          </View>
          ):null}
          <View style={styles.checkDeliveryPin}>
          {props.addresses && props.addresses.length ? (
            <Text style={styles.cdhead}>
              Use pincode to check delivery info
            </Text>
          ):null}
            <View style={styles.deliveryInput}>
              <MatIcon
                name={'location-pin'}
                size={25}
                style={styles.locPinIcon}
              />
              <View style={styles.inputFieldWrap}>
                <TextInput
                  style={styles.inputField}
                  onChangeText={str => {
                    setPincode(str);
                  }}
                  value={pincode}
                  maxLength={6}
                  keyboardType={'number-pad'}
                  blurOnSubmit={true}
                  placeholderTextColor="#979797"
                  placeholder="Enter Pincode"></TextInput>
                <TouchableOpacity
                  style={[
                    styles.checkBtn,
                    {
                      backgroundColor:
                        pincode.length < 6 || props.isPincodeLoading
                          ? colors.lightGrayText
                          : colors.RedThemeColor,
                    },
                  ]}
                  disabled={pincode.length < 6 || props.isPincodeLoading}
                  onPress={() =>
                    props.productLogistics({postCode: pincode}, true)
                  }>
                  {props.isPincodeLoading && (
                    <ActivityIndicator
                      style={{marginRight: 8}}
                      size="small"
                      color="#fff"
                    />
                  )}
                  <Text style={styles.checkBtnText}>CHECK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pincodewrap: {flex: 2, flexDirection: 'column'},
  SYmodal: {padding: 0, justifyContent: 'flex-end', margin: 0},
  SYinnerModal: {
    // height: 470,
    backgroundColor: '#fff',
    borderTopLeftRadius: Dimension.borderRadius16,
    borderTopRightRadius: Dimension.borderRadius16,
    // flex: 1,
  },
  modalInnerArea: {paddingVertical: Dimension.padding15},
  ModalHeader:{justifyContent:"space-between",flexDirection:"row",paddingRight:Dimension.padding15,paddingBottom:Dimension.padding15},
  closebtn: {
   
  },
  closeicon: {fontSize: Dimension.font18},
  syModalHeading: {
    fontSize: Dimension.font14,
    paddingHorizontal: Dimension.padding15,
   // marginBottom: Dimension.margin8,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#303030',
  },
  subtitle: {
    fontSize: Dimension.font12,
    color: '#979797',
    paddingHorizontal: Dimension.padding15,
  },
  scrollViewinSYL: {
    padding: Dimension.padding15,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'scroll',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  addrBox: {
    borderWidth: 1,
    borderColor: '#EFEFF4',
    padding: Dimension.padding10,
    width: Dimension.width135,
    borderRadius: Dimension.borderRadius8,
    marginRight: Dimension.margin15,
    // height: Dimension.height140,
  },
  addrselectedBox: {
    borderWidth: 1,
    borderColor: colors.RedThemeColor,
    padding: Dimension.padding10,
    width: Dimension.width135,
    borderRadius: Dimension.borderRadius8,
    marginRight: Dimension.margin15,
    // height: Dimension.height140,
  },
  radio: {
    width: Dimension.width14,
    height: Dimension.width14,
    borderRadius: Dimension.borderRadius30,
    borderColor: colors.PrimaryTextColor,
    borderWidth: 2,
    marginRight: Dimension.margin10,
  },
  radioselected: {
    width: Dimension.width14,
    height: Dimension.width14,
    borderRadius: Dimension.borderRadius30,
    borderColor: colors.RedThemeColor,
    borderWidth: 2,
    marginRight: Dimension.margin10,
    justifyContent: 'center',
  },
  radioinner: {
    backgroundColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius30,
    width: Dimension.width8,
    height: Dimension.width8,
    alignSelf: 'center',
  },
  locationtag: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: Dimension.padding5,
    paddingVertical: Dimension.padding2,
    color: colors.lightGrayText,
    fontSize: Dimension.font10,
    borderRadius: Dimension.borderRadius4,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  addrScrollRow: {flexDirection: 'row', marginBottom: Dimension.margin15},
  sylname: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomBoldFont,
    marginBottom: Dimension.margin5,
  },
  addfulltext: {
    marginBottom: Dimension.margin2,
    fontSize: Dimension.font12,
    lineHeight: Dimension.font18,
    color: colors.PrimaryTextColor,
  },
  cdhead: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.PrimaryTextColor,
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding10,
    marginBottom: 15,
  },
  locatebtn: {
    flexDirection: 'row',
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
  },
  locicon: {
    color: colors.BlueText,
    fontSize: Dimension.font16,
    marginRight: Dimension.margin5,
  },
  useloctext: {
    color: colors.BlueText,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  deliveryInput: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: Dimension.padding15,
    marginBottom: Dimension.margin10,
  },
  mapIcon: {
    height: Dimension.width22,
    width: Dimension.width22,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: Dimension.margin16,
    marginRight: Dimension.margin10,
    color: colors.RedThemeColor,
    // borderColor:'red',borderWidth:1
  },
  deliNotAvailable: {
    flexDirection: 'row',
    paddingTop: Dimension.padding15,
    paddingBottom: Dimension.padding5,
    borderTopColor: '#EFEFF4',
    borderTopWidth: 1,
    paddingHorizontal: Dimension.padding15,
    marginTop: Dimension.margin15,
  },
  newtextcontainer: {flexDirection: 'column'},
  newinputfield: {
    width: '100%',
    position: 'relative',
    margin: 0,
    padding: 0,
    left: -Dimension.margin10,
  },
  checkBtn: {
    backgroundColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius6,
    justifyContent: 'center',
    width: '28%',
    marginLeft: '3%',
    position: 'absolute',
    right: Dimension.margin6,
    top: Dimension.margin6,
    height: Dimension.height29,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBtnDisable: {
    backgroundColor: '#d3d3d3',
    borderRadius: Dimension.borderRadius6,
    justifyContent: 'center',
    width: '28%',
    marginLeft: '2%',
    position: 'absolute',
    right: Dimension.margin6,
    top: Dimension.margin6,
    height: Dimension.height29,
  },
  checkBtnText: {
    color: colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputFieldWrap: {
    width: '90%',
    borderWidth: 1,
    height: Dimension.height40,
    borderRadius: Dimension.borderRadius6,
    flexDirection: 'row',
    borderColor: '#999',
  },
  inputField: {
    color: '#000',
    padding: 0,
    paddingHorizontal: 10,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    height: Dimension.height40,
    width: '60%',
  },
  locPinIcon: {color: colors.RedThemeColor, marginRight: 10},
});

export default PincodeModal;
