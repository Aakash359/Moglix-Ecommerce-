import {StyleSheet} from 'react-native';
import colors from '../../../redux/constants/colors';
import Dimension from '../../../redux/constants/dimensions';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  mainAuthScreenView: {
    backgroundColor: colors.RedThemeColor,
    flex: 1,
    padding: Dimension.padding15,
  },
  skipBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: Dimension.width60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius4,
    height: Dimension.height24,
    alignSelf: 'flex-end',
  },
  skipText: {
    color: colors.white,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  signInRedScreen: {flex: 1, justifyContent: 'flex-end'},
  loginscreen: {
    backgroundColor: colors.white,
    padding: Dimension.padding15,
    paddingVertical: Dimension.padding10,
    borderRadius: Dimension.borderRadius12,
    marginBottom: Dimension.margin15,
  },
  disableBtn: {
    height: Dimension.height40,
    width: '100%',
    backgroundColor: colors.ExtralightGrayText,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin20,
    flexDirection: 'row',
  },
  redBtn: {
    flexDirection: 'row',
    height: Dimension.height40,
    width: '100%',
    backgroundColor: colors.RedThemeColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin20,
  },
  BtnText: {
    alignSelf: 'center',
    color:colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  orView: {
    width: '100%',
    height: 1,
    position: 'relative',
    backgroundColor: colors.ProductBorderColor,
    marginVertical: Dimension.margin25,
    alignItems: 'center',
  },
  orText: {
    color: '#343434',
    position: 'absolute',
    backgroundColor: colors.white,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRegularFont,
    paddingHorizontal: Dimension.padding10,
    top: -8,
  },
  contBtn: {
    height: Dimension.height40,
    width: '100%',
    backgroundColor: colors.PrimaryTextColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Dimension.margin15,
    borderRadius: Dimension.borderRadius8,
    marginTop: 0,
  },
  socialBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Dimension.padding8,
  },
  socialBtn: {
    width: '96%',
    backgroundColor: colors.white,
    shadowColor: colors.PrimaryTextColor,
    borderRadius: Dimension.borderRadius8,
    height: Dimension.height40,
    paddingHorizontal: Dimension.padding10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  socialBtnText: {
    fontSize: Dimension.font14,
    color: '#3E3E3E',
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: 10,
  },
  scImageIcon: {width: Dimension.width18},
  termsRow: {alignItems: 'center', justifyContent: 'flex-start'},
  termsText: {
    fontSize: Dimension.font11,
    color: colors.white,
    fontFamily: Dimension.CustomRegularFont,
  },
  textLink: {alignSelf: 'center'},
  termsTextwithLink: {
    fontSize: Dimension.font11,
    textDecorationLine: 'underline',
    color: colors.white,
    fontFamily: Dimension.CustomRegularFont,
  },
  TextAction: {flexDirection: 'row'},
  errorText:{color: colors.RedThemeColor, fontSize: Dimension.font10,fontFamily:Dimension.CustomRegularFont,marginTop:Dimension.margin5}

});

export default styles;
