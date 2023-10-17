import {StyleSheet, Dimensions, Platform} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    padding: Dimension.padding15,
    paddingRight: 0,
    backgroundColor: '#fff',
  },
  FaqItem: {
    borderWidth: 1,
    borderColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding10,
    borderRadius: Dimension.borderRadius8,
    marginRight: Dimension.margin10,
    height: Dimension.height30,
    justifyContent: 'center',
  },
  FaqText: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  selectedFaqItem: {
    borderWidth: 1,
    borderColor: colors.RedThemeColor,
    paddingHorizontal: Dimension.padding10,
    borderRadius: Dimension.borderRadius8,
    marginRight: Dimension.margin10,
    height: Dimension.height30,
    justifyContent: 'center',
    backgroundColor: colors.LightRedThemeColor,
  },
  selectedFaqText: {
    fontSize: Dimension.font12,
    color: colors.RedThemeColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  fileicon: {
    width: Dimension.width18,
    height: Dimension.height20,
    color: colors.PrimaryTextColor,
    marginRight: Dimension.margin10,
  },
  orderNavigate: {
    backgroundColor: '#fff',
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
    padding: Dimension.padding12,
    borderRadius: Dimension.borderRadius8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Dimension.margin15,
    position: 'relative',
  },
  rightarrowicon: {
    width: Dimension.width18,
    height: Dimension.width18,
    color: colors.PrimaryTextColor,
    flex: 1,
    position: 'absolute',
    right: 15,
    alignSelf: 'center',
    marginTop: Dimension.margin5,
  },
  orderTextWrap: {width: '100%'},
  orderText: {
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    paddingRight: Dimension.padding25,
  },
  ordersubText: {fontSize: Dimension.font11, color: colors.PrimaryTextColor},
  collapseHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimension.padding15,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    paddingRight: Dimension.padding10,
  },
  downarrowicon: {
    width: Dimension.width18,
    height: Dimension.width18,
    color: colors.PrimaryTextColor,
    alignSelf: 'center',
    marginTop: 0,
    right: 0,
  },
  uparrowicon: {
    top: 18,
    width: Dimension.width18,
    height: Dimension.width18,
    color: colors.PrimaryTextColor,
    position: 'absolute',
    right: 0,
    alignSelf: 'flex-end',
  },
  expandHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimension.padding15,
    position: 'relative',
  },
  expandView: {
    // paddingBottom: Dimension.margin10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
  },
  onlyText: {
    fontSize: Dimension.font12,
    color: '#303030',
    lineHeight: Dimension.height16,
    marginBottom: Dimension.margin10,
  },
  textWithCreative: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Dimension.margin10,
  },
  textWithCreativeRight: {flexDirection: 'row-reverse'},
  creativeImage: {
    width: Dimension.width100,
    height: Dimension.width80,
    paddingHorizontal: Dimension.padding12,
  },
  creativeText: {
    flex: 2,
    paddingLeft: Dimension.padding12,
    alignSelf: 'center',
    fontSize: Dimension.font12,
    color: '#303030',
    lineHeight: Dimension.height18,
  },
  faqScrollArea: {
    backgroundColor: '#fff',
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
    paddingHorizontal: Dimension.padding12,
    borderRadius: Dimension.borderRadius8,
  },
  creativeTextLeft: {
    flex: 2,
    paddingRight: Dimension.padding12,
    alignSelf: 'center',
    fontSize: Dimension.font12,
    color: '#303030',
    lineHeight: Dimension.height18,
  },
  boldText: {
    flexDirection: 'row',
    flex: 1,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: -Dimension.margin8,
    color: '#303030',
  },
  fullWidthImg: {width: '100%', height: 150, marginBottom: 10},
  list: {flexDirection: 'row', alignItems: 'flex-start', paddingRight: 10},
  dot: {
    width: Dimension.width5,
    height: Dimension.width5,
    marginTop: 9,
    backgroundColor: colors.PrimaryTextColor,
    borderRadius: 30,
    marginRight: 10,
  },
  mainHeading: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginBottom: Dimension.margin10,
  },
  mainGreyBg: {backgroundColor: '#F7F7FA', paddingBottom: 0},
  scrollAreaForContent: {
    backgroundColor: '#F7F7FA',
    paddingHorizontal: Dimension.padding15,
    paddingBottom: Dimension.padding15,
  },
});

export default styles;