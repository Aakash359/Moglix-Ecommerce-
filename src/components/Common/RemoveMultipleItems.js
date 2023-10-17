import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import Modal from 'react-native-modal';
import {applyThousandSeparator} from '../../generic';
import {useSelector, useDispatch} from 'react-redux';

const RemoveMultipleItems = props => {
  const cart = useSelector(state => (state.cartReducer || {}).data || {});

  const deleteProducts = () => {
    props.closePopup();
    props.removeMultipleItems(props.items.map(_ => _.productId));
  };

  const renderItems = (item, key) => {
    return (
      <>
        <View key={key} style={styles.CardWrap}>
          <View style={styles.prdImgWrap}>
            <Image style={styles.prdImage} source={{uri: item.productImg}} />
          </View>

          <View style={{flex: 2.5, marginLeft: Dimension.margin10}}>
            <Text style={styles.PrdName} numberOfLines={5}>
              {item.productName}
            </Text>
            <Text style={styles.PrdBrand}>By : {item.brandName}</Text>
            {!item.oos && (!item.msg || item.msg.type != 'oos') ? (
              <View>
                <View style={styles.row}>
                  <Text style={styles.PrdOriginalPrice}>
                    ₹
                    {applyThousandSeparator(
                      item.priceMrp || item.mrp || item.productUnitPrice,
                    )}
                  </Text>
                  <Text style={styles.PrdOff}>
                    {Math.floor(
                      ((parseInt(
                        item.priceMrp || item.mrp || item.productUnitPrice,
                      ) -
                        parseInt(
                          item.priceWithoutTax || item.pricewithouttax,
                        )) /
                        parseInt(
                          item.priceMrp || item.mrp || item.productUnitPrice,
                        )) *
                        100,
                    )}
                    % OFF
                  </Text>
                </View>
                <Text style={styles.PrdOfferPrice}>
                  ₹{item.priceWithoutTax}
                </Text>
              </View>
            ) : (
              <Text style={styles.availableReqText}>Available on Request</Text>
            )}
            {item.itemInPack ? (
              <Text style={styles.PrdQtyPack}>
                Qty/pack - {item.itemInPack}
              </Text>
            ) : null}
            {props.validationMsgsData
              .filter(
                _ => _.productId == item.productId || _.msnid == item.productId,
              )
              .map(it => (
                <View>
                  <Text
                    style={{
                      color: 'red',
                      marginVertical: 12,
                      fontSize: Dimension.font11,
                    }}>
                    {/* {
                // it.msg.data.productName 
                'Product'
                + ' ' 
                + it.msg.data.text1
                } */}
                    {((it.msg || {}).data || {}).productName +
                      ' ' +
                      ((it.msg || {}).data || {}).text1}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* {props.validationMsgsData
          .filter(_ => _.productId == item.productId)
          .map(it => (
            <View>
              <Text style={{color: 'red', marginVertical: 8}}>
                {it.msg.data.productName + ' ' + it.msg.data.text1}
              </Text>
            </View>
          ))} */}
      </>
    );
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
            paddingHorizontal: Dimension.padding10,
          }}>
          <View style={{paddingBottom: Dimension.padding5}}>
            <Text style={styles.cartNumber}>
              {props.items.length}{' '}
              <Text style={styles.Title}>Item not available</Text>
            </Text>
            {/* {!this.props.subTitle == '' ? ( */}
            {/* <Text style={styles.SubTitle}>
              Are you sure you want to remove this item
            </Text> */}
            {/* ) : null} */}
          </View>
          <View>
            <TouchableOpacity onPress={props.closePopup}>
              <Icon style={styles.closeIcon} name={'close-circle'} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{flex: 1}}>
          {props.items.map((_, key) => renderItems(_, key))}
        </ScrollView>

        <View style={styles.btnWrap}>
          <TouchableOpacity
            onPress={() => deleteProducts()}
            block
            style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>REMOVE UNAVAILABLE ITEMS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveMultipleItems;

const styles = StyleSheet.create({
  CardWrap: {
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    borderRadius: 8,
    elevation: 0,
    padding: Dimension.padding10,
    flexDirection: 'row',
    marginVertical: Dimension.margin8,
    paddingBottom: -20,
    marginHorizontal: Dimension.margin15,
  },
  prdImgWrap: {alignItems: 'center', justifyContent: 'center'},
  prdImage: {
    height: Dimension.prdListViewImage,
    width: Dimension.prdListViewImage,
  },
  PrdName: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    // fontFamily: Dimension.CustomRegularFont,
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
    borderRadius: 7,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimension.height42,
    width: '100%',
    bottom: 10,
  },
  removeBtnText: {
    color: Colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  Title: {
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomRobotoBold,
    color: Colors.PrimaryTextColor,
    paddingBottom: Dimension.padding0,
    marginRight: Dimension.margin150,
    marginLeft: Dimension.margin5,
  },
  cartNumber: {
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomRobotoBold,
    color: Colors.PrimaryTextColor,
    marginLeft: Dimension.margin5,
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
    maxHeight: Dimensions.get('window').height * 0.9,
    paddingVertical: Dimension.padding15,
  },
  closeIcon: {
    width: Dimension.width24,
    height: Dimension.width24,
    fontSize: 20,
  },
});
