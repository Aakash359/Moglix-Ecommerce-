import {Dimensions, StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
  modalcoupenImg: {width: Dimension.width38, height: Dimension.width38},
  appliedCpnText: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginVertical: Dimension.margin15,
  },
  appliedCpnText: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginVertical: Dimension.margin15,
  },
  saveAmounttext: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font24,
    fontFamily: Dimension.CustomRobotoBold,
    fontWeight: 'bold',
  },
  greenText: {
    color: Colors.GreenColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: Dimension.margin15,
  },
  normalText: {
    color: Colors.lightGrayText,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
  },
  modalWrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    padding: Dimension.padding25,
    alignItems: 'center',
  },
  emptyCartImgWrap: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    padding: Dimension.padding30,
    alignItems: 'center',
    flexDirection: 'column',
    marginVertical: Dimension.margin10,
  },
  shippingStripWrap: {
    flexDirection: 'row',
    borderWidth: 1.2,
    borderRadius: 8,
    justifyContent: 'center',
    marginVertical: 8,
    height: Dimension.height40,
    borderColor: colors.BoldgreenText,
  },
  wrapView: {
    flexDirection: 'row',
    marginRight: Dimension.margin10,
    marginHorizontal: -Dimension.margin75,
  },
  emptyCartImg: {
    height: Dimension.height180,
    width: Dimension.width224,
    marginBottom: Dimension.margin20,
  },
  emptyText: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
    textAlign: 'center',
    marginBottom: Dimension.margin20,
  },
  continueShoppingBtn: {
    backgroundColor: Colors.RedThemeColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    marginTop: Dimension.margin15,
    height: Dimension.height40,
    width: '100%',
  },
  continueShoppingText: {
    color: Colors.white,
    alignSelf: 'center',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  headerView: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF4',
    paddingHorizontal: Dimension.padding10,
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#fff',
  },
  filtHeading: {
    marginLeft: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    paddingTop: 5,
    color: Colors.PrimaryTextColor,
  },
  headerFlex: {flexDirection: 'row'},
  headTotAmount: {
    marginRight: 10,
    fontFamily: Dimension.CustomRobotoRegular,
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
  },
  infoIcon: {color: Colors.BlueText},
  cartItems: {
    flexDirection: 'row',
    paddingVertical: Dimension.padding10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Dimension.margin15,
  },
  cartItemText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomMediumFont,
  },
  addtoWishlistBtn: {
    backgroundColor: '#fff',
    borderRadius: Dimension.borderRadius6,
    paddingVertical: Dimension.padding6,
    alignSelf: 'flex-end',
    paddingHorizontal: Dimension.padding10,
  },
  addWishlistText: {
    fontSize: Dimension.font12,
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Dimension.borderRadius6,
    paddingHorizontal: Dimension.padding12,
    paddingVertical: Dimension.padding15,
    marginBottom: Dimension.padding10,
    paddingBottom: 0,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  prodImageName: {flexDirection: 'row'},
  leftProdImage: {width: Dimension.width70, height: Dimension.height70},
  prodName: {
    flex: 1,
    paddingLeft: Dimension.padding25,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  qtyPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seePriceWithTax: {flexDirection: 'row', alignItems: 'center'},
  price: {
    fontSize: Dimension.font18,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRobotoBold,
    marginRight: Dimension.margin15,
  },
  arrowIcon: {fontSize: Dimension.font20, color: Colors.PrimaryTextColor},
  collapsedArea: {
    backgroundColor: '#F7F7FA',
    marginHorizontal: -Dimension.padding12,
    borderTopWidth: 1,
    borderTopColor: Colors.ProductBorderColor,
  },
  collapsedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    alignSelf: 'center',
  },
  freeCar: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: Dimension.margin10,
    marginRight: Dimension.margin10,
  },
  shippingStripText2: {
    color: Colors.BoldgreenText,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    alignSelf: 'center',
  },
  shippingStripText3: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    alignSelf: 'center',
  },

  shippingArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: Dimension.height30,
    alignItems: 'center',
  },
  shippingIcon: {
    color: Colors.GreenColor,
    fontSize: Dimension.font14,
    marginRight: Dimension.margin15,
  },
  deliveryText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.GreenColor,
  },
  shippingPrice: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRobotoRegular,
  },
  cardAction: {
    borderTopColor: Colors.ProductBorderColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Dimension.padding10,
  },
  deleteAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movetoWishlistBtn: {
    flex: 1,
    backgroundColor: Colors.brandbg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius6,
    paddingVertical: Dimension.padding8,
  },
  remove: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: Colors.PrimaryTextColor,
    marginLeft: 6,
    paddingTop: 3,
  },
  deleteIcon: {color: Colors.PrimaryTextColor},
  moveWishlistText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomBoldFont,
  },
  mycartView: {flex: 1, position: 'relative'},
  promoAppliedView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: Dimension.margin4,
    marginBottom: Dimension.margin12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: Dimension.padding15,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  promocode: {
    color: Colors.green2,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  applyCouponWrap: {
    backgroundColor: '#fff',
    borderRadius: Dimension.borderRadius6,
    paddingHorizontal: Dimension.padding12,
    marginHorizontal: Dimension.margin15,
    marginBottom: Dimension.padding10,
    flexDirection: 'row',
    paddingVertical: Dimension.padding12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  couponIcon: {
    color: Colors.green2,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  applyText: {
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font16,
    paddingTop: 2,
    marginLeft: 20,
    color: Colors.PrimaryTextColor,
  },
  viewAllOffers: {flexDirection: 'row'},
  arrowrightIcon: {
    fontSize: Dimension.font24,
    marginRight: 10,
    color: Colors.PrimaryTextColor,
  },
  paymentWrap: {paddingVertical: 0, marginHorizontal: Dimension.padding15},
  payHeading: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.PrimaryTextColor,
    paddingHorizontal: Dimension.padding12,
    paddingVertical: Dimension.padding10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ProductBorderColor,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.ProductBorderColor,
    paddingVertical: Dimension.padding8,
    paddingHorizontal: Dimension.padding12,
  },
  amtTextLabel: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.PrimaryTextColor,
  },
  noBorder: {borderBottomWidth: 0},
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.ProductBorderColor,
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding12,
  },
  amtText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRobotoRegular,
  },
  disText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRobotoRegular,
    color: colors.green2,
  },
  totalAmtTextLabel: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.PrimaryTextColor,
  },
  totalAmtText: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    color: Colors.PrimaryTextColor,
  },
  bottomAction: {
    backgroundColor: '#fff',
    padding: Dimension.padding5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  redBtn: {
    backgroundColor: Colors.RedThemeColor,
    height: Dimension.height40,
    borderRadius: Dimension.borderRadius6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redBtnText: {
    color: '#fff',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font16,
    marginTop: Dimension.margin2,
  },
  //Apply Coupon Modal CSS
  modalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
  },
  modalInner: {flex: 1, backgroundColor: '#fff'},
  modalHeaderFlex: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ProductBorderColor,
  },
  modalHeading: {
    marginLeft: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    paddingTop: 5,
    color: Colors.PrimaryTextColor,
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
    borderColor: Colors.lightGrayText,
    borderWidth: 1,
    borderRadius: Dimension.borderRadius8,
    width: '65%',
    color: Colors.PrimaryTextColor,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: Dimension.padding10,
  },
  applyBtn: {
    width: '30%',
    backgroundColor: Colors.RedThemeColor,
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
    color: Colors.PrimaryTextColor,
    marginBottom: Dimension.margin5,
  },
  couponUse: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.PrimaryTextColor,
  },
  applyThisCoupon: {
    backgroundColor: Colors.LightRedThemeColor,
    borderRadius: Dimension.borderRadius4,
    paddingHorizontal: Dimension.padding10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCouponText: {
    color: Colors.RedThemeColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  leftPromoArea: {flexDirection: 'row', alignItems: 'center'},
  ticketIcon: {color: Colors.green2, marginRight: Dimension.margin15},
  promoSubText: {
    color: Colors.lightGrayText,
    fontSize: Dimension.font11,
    marginTop: -Dimension.margin2,
    fontFamily: Dimension.CustomRegularFont,
  },
  cardWarp: {marginTop: Dimension.margin10},
  impUpdateCart: {
    borderColor: Colors.orangeShade,
    borderWidth: 1,

    marginHorizontal: Dimension.margin0,
    marginBottom: Dimension.margin8,
    borderRadius: Dimension.borderRadius6,
    padding: Dimension.padding12,
    backgroundColor: '#FFEBE0',
  },
  impUpdateCartText: {flexDirection: 'row', justifyContent: 'space-between'},
  msgHeading: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: 2,
  },
  cartUpdateMsgList: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    marginRight: 8,
    borderRadius: Dimension.borderRadius16,
    backgroundColor: Colors.PrimaryTextColor,
    marginTop: 5,
  },
  listText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // height: 50,
  },
  listBlueText: {
    fontSize: Dimension.font12,
    color: Colors.BlueText,
    fontFamily: Dimension.CustomRegularFont,
  },
  listGreyText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    // marginLeft:-Dimension.margin8,
    fontFamily: Dimension.CustomRobotoRegular,
  },
  withHorPadding: {paddingHorizontal: Dimension.padding15},
  fbtCartStyle: {backgroundColor: '#fff', paddingBottom: Dimension.height36},
  fbtWrapwithLightRed: {backgroundColor: colors.LightRedThemeColor},
  signInonemptyCrt: {alignItems: 'center'},
  signInNowText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.RedThemeColor,
  },
  signInText: {
    color: colors.lightGrayText,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
});

export default styles;
