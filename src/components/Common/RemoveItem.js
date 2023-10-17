import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import Modal from 'react-native-modal';
import {applyThousandSeparator} from '../../generic';

const RemoveItem = props => {
  //     const openPDP = (item) => {
  //     props.navigation.navigate('ProductScreen', {
  //       msn: item.productId.toLowerCase(),
  //       fromCart: true,
  //     });
  //   };

  const deleteProduct = () => {
    props.closePopup();
    props.deleteProduct();
  };

  return (
    <Modal
      onBackButtonPress={props.closePopup}
      onBackdropPress={props.closePopup}
      isVisible={props.visible}
      style={{
        margin: 0,
      }}>
      <View
        style={[
          styles.signUpWrap,
          {
            width: Dimensions.get('window').width,
            bottom: 0,
            position: 'absolute',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: Dimension.padding15,
          }}>
          <View style={{paddingBottom: Dimension.padding15}}>
            <Text style={styles.Title}>Remove Item</Text>
            {/* {!this.props.subTitle == '' ? ( */}
            <Text style={styles.SubTitle}>
              Are you sure you want to remove this item
            </Text>
            {/* ) : null} */}
          </View>
          <View>
            <TouchableOpacity onPress={props.closePopup}>
              <Icon style={styles.closeIcon} name={'close-circle'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.CardWrap}>
          <View style={styles.prdImgWrap}>
            <Image style={styles.prdImage} source={{uri: props.productImg}} />
          </View>

          <View style={{flex: 2.5, marginLeft: Dimension.margin10}}>
            <Text style={styles.PrdName} numberOfLines={2}>
              {props.productName}
            </Text>
            <Text style={styles.PrdBrand}>By : {props.brandName}</Text>
            {!props.oos ? (
              <View>
                <View style={styles.row}>
                  <Text style={styles.PrdOriginalPrice}>
                    ₹
                    {applyThousandSeparator(
                      props.priceMrp || props.mrp || props.productUnitPrice,
                    )}
                  </Text>
                  <Text style={styles.PrdOff}>
                    {Math.floor(
                      ((parseInt(
                        props.priceMrp || props.mrp || props.productUnitPrice,
                      ) -
                        parseInt(
                          props.priceWithoutTax || props.pricewithouttax,
                        )) /
                        parseInt(
                          props.priceMrp || props.mrp || props.productUnitPrice,
                        )) *
                        100,
                    )}
                    % OFF
                  </Text>
                </View>
                <Text style={styles.PrdOfferPrice}>
                  ₹{props.priceWithoutTax}
                </Text>
              </View>
            ) : (
              <Text style={styles.availableReqText}>Available on Request</Text>
            )}
            {props.itemInPack ? (
              <Text style={styles.PrdQtyPack}>
                Qty/pack - {props.itemInPack}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.btnWrap}>
          <TouchableOpacity
            onPress={props.closePopup}
            block
            style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteProduct()}
            block
            style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveItem;

const styles = StyleSheet.create({
  CardWrap: {
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    borderRadius: 8,
    elevation: 0,
    padding: Dimension.padding10,
    flexDirection: 'row',
    marginHorizontal: Dimension.margin15,
  },
  prdImgWrap: {alignItems: 'center', justifyContent: 'center'},
  prdImage: {
    height: Dimension.prdListViewImage,
    width: Dimension.prdListViewImage,
  },
  PrdName: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    maxWidth: 200,
  },
  PrdBrand: {
    color: Colors.lightGrayText,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  PrdOriginalPrice: {
    color: Colors.SecondaryTextColor,
    fontSize: Dimension.font12,
    fontWeight: '400',
    fontFamily: Dimension.CustomRobotoRegular,
    textDecorationLine: 'line-through',
    marginRight: Dimension.margin10,
  },
  PrdOff: {
    color: Colors.GreenColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  PrdOfferPrice: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    fontWeight: 'bold',
    lineHeight: Dimension.font18,
  },

  row: {flexDirection: 'row'},
  suretextWrap: {
    paddingHorizontal: Dimension.padding15,
    marginBottom: Dimension.margin10,
  },
  suretext: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
  },

  PrdQtyPack: {
    fontSize: Dimension.font10,
    color: Colors.lightGrayText,
    fontFamily: Dimension.CustomRegularFont,
  },
  availableReqText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomBoldFont,
    textTransform: 'capitalize',
  },
  btnWrap: {
    height: Dimension.height45,
    marginTop: Dimension.margin15,
    marginHorizontal: Dimension.margin15,
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: Colors.LightRedThemeColor,
    borderRadius: 5,
    flex: 1,
    marginRight: Dimension.margin15,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimension.height40,
  },
  cancelBtnText: {
    color: Colors.RedThemeColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    backgroundColor: Colors.RedThemeColor,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimension.height40,
  },
  removeBtnText: {
    color: Colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  Title: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.PrimaryTextColor,
    paddingBottom: Dimension.padding5,
  },
  SubTitle: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.PrimaryTextColor,
  },
  signUpWrap: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: Dimension.padding15,
  },
  closeIcon: {width: Dimension.width24, height: Dimension.width24,
    fontSize:20,},
});
