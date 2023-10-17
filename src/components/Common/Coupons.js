import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  InteractionManager,
  FlatList,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
const deviceWidth = Dimensions.get('window').width;

const Coupons = props => {
  const [couponText, setCouponText] = useState('');
  const [init, setInit] = useState(false);

  useEffect(() => {
    // InteractionManager.runAfterInteractions(() => {
    setInit(true);
    // }, 1000);
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={[styles.card, styles.couponCard]}>
          <View style={styles.couponDetail}>
            <Text style={styles.couponName}>{item.promoCode}</Text>
            <Text style={styles.couponUse}>{item.promoDescription}</Text>
          </View>
          <TouchableOpacity
            onPress={() => props.applyCouponCode(item)}
            style={styles.applyThisCoupon}>
            <Text style={styles.applyCouponText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      overlayPointerEvents={'auto'}
      animationIn={''}
      isVisible={props.couponModalVisible}
      onBackButtonPress={() => props.setCouponModalVisible(false)}
      coverScreen={true}
      deviceWidth={deviceWidth}
      style={styles.modalWrap}>
      <View style={styles.modalInner}>
        <View style={styles.modalHeaderView}>
          <View style={styles.modalHeaderFlex}>
            <TouchableOpacity
              onPress={() => props.setCouponModalVisible(false)}>
              <MaterialCommunityIcon
                name="arrow-left"
                style={styles.headerbackIcon}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.modalHeading}>Apply Coupon</Text>
          </View>
        </View>
        <View style={styles.couponInputFieldBox}>
          <TextInput
            placeholder="Enter Coupon Code"
            placeholderTextColor={colors.lightGrayText}
            style={styles.couponInputField}
            onChangeText={text => setCouponText(text)}
            value={couponText}
          />
          <TouchableOpacity
            onPress={() => {
              if (couponText && couponText.length)
                props.applyCouponCode({promoCode: couponText});
            }}
            style={styles.applyBtn}>
            <Text style={styles.applyCText}>APPLY</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.couponTitleView}>
          <Text style={styles.couponAvHeading}>Available Coupons</Text>
        </View>
        {init && props.coupons.length ? (
          <FlatList
            data={props.coupons}
            contentContainerStyle={styles.scrollInner}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}-key`}
          />
        ) : // <ScrollView style={styles.scrollWrap}>
        //   <View style={styles.scrollInner}>
        //     {props.coupons.map((_, i) => (
        //       <TouchableOpacity>
        //         <View style={[styles.card, styles.couponCard]}>
        //           <View style={styles.couponDetail}>
        //             <Text style={styles.couponName}>{_.promoCode}</Text>
        //             <Text style={styles.couponUse}>{_.promoDescription}</Text>
        //           </View>
        //           <TouchableOpacity
        //             key={i}
        //             onPress={() => props.applyCouponCode(_)}
        //             style={styles.applyThisCoupon}>
        //             <Text style={styles.applyCouponText}>Apply</Text>
        //           </TouchableOpacity>
        //         </View>
        //       </TouchableOpacity>
        //     ))}
        //   </View>
        // </ScrollView>
        null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  //Apply Coupon Modal CSS
  modalWrap: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 0,
  },
  modalInner: {flex: 1, backgroundColor: '#fff'},
  modalHeaderFlex: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding12,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
  },
  modalHeading: {
    marginLeft: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    paddingTop: 5,
    color: colors.PrimaryTextColor,
  },
  couponInputFieldBox: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding20,
    paddingBottom: Dimension.padding15,
    justifyContent: 'space-between',
  },
  couponInputField: {
    height: 55,
    borderColor: colors.lightGrayText,
    borderWidth: 1,
    borderRadius: Dimension.borderRadius8,
    width: '65%',
    color: colors.PrimaryTextColor,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: Dimension.padding10,
  },
  applyBtn: {
    width: '30%',
    backgroundColor: colors.RedThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius8,
  },
  applyCText: {
    color: '#fff',
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomBoldFont,
  },
  couponTitleView: {
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding10,
  },
  couponAvHeading: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
  },
  scrollInner: {
    paddingHorizontal: Dimension.padding15,
    paddingTop: Dimension.padding5,
  },
  couponCard: {
    paddingTop: Dimension.padding12,
    paddingBottom: Dimension.padding12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  couponDetail: {width: '65%'},
  couponName: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: colors.PrimaryTextColor,
    marginBottom: Dimension.margin5,
  },
  couponUse: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.PrimaryTextColor,
  },
  applyThisCoupon: {
    backgroundColor: colors.LightRedThemeColor,
    borderRadius: Dimension.borderRadius4,
    paddingHorizontal: Dimension.padding10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCouponText: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});

export default Coupons;
