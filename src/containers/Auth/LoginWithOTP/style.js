import {StyleSheet} from 'react-native';
import colors from '../../../redux/constants/colors';
import Dimension from '../../../redux/constants/dimensions';

const styles = StyleSheet.create({
  mainAuthScreenView: {
    backgroundColor: colors.RedThemeColor,
    flex: 1,
    padding: Dimension.padding15,
  },
  signInRedScreen: {
    backgroundColor: colors.RedThemeColor,
    flex: 1,
    marginTop:Dimension.margin30
  },
  backHeader: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    padding: 0,
    paddingHorizontal: 0,
  },
  iconColor: {color: colors.white},
  title: {
    fontSize: Dimension.font16,
    color: colors.white,
    fontFamily: Dimension.CustomBoldFont,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: Dimension.font12,
    color: colors.white,
    marginBottom: Dimension.margin10,
    fontFamily: Dimension.CustomRegularFont,
  },
  whiteBg: {
    backgroundColor: colors.white,
    padding: Dimension.padding15,
    borderRadius: Dimension.borderRadius12,
    marginBottom: Dimension.margin15,
  },
  inputWrap: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    
    alignItems:"flex-start",
    alignContent:"flex-start",
    alignSelf:"flex-start"
    
  },
  textInputStyle: {
    alignItems:"flex-start",
    borderWidth: 1,
    width: '14%',
    color: colors.PrimaryTextColor,
    paddingVertical: Dimension.padding12,
    paddingHorizontal: Dimension.padding5,
    marginRight:Dimension.margin8,
    textAlign: 'center',
    fontSize: Dimension.font14,
    borderColor: colors.ExtralightGrayText,
    borderRadius: Dimension.borderRadius8,
    shadowColor: '#333',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    backgroundColor: colors.white,
  },
  validatetextInputStyle: {
    alignItems:"flex-start",
    borderWidth: 1,
    width: '14%',
    color: colors.PrimaryTextColor,
    paddingVertical: Dimension.padding12,
    paddingHorizontal: Dimension.padding5,
    textAlign: 'center',
    fontSize: Dimension.font14,
    borderColor: colors.ExtralightGrayText,
    borderRadius: Dimension.borderRadius8,
    shadowColor: '#00FF00',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    backgroundColor: colors.white,marginRight:Dimension.margin8,

  },
  errortextInputStyle: {

    borderWidth: 1,
    width: '14%',
    color: colors.PrimaryTextColor,
    paddingVertical: Dimension.padding12,
    paddingHorizontal: Dimension.padding5,
    textAlign: 'center',
    fontSize: Dimension.font14,
    borderColor: colors.ExtralightGrayText,
    borderRadius: Dimension.borderRadius8,
    shadowColor: colors.RedThemeColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    backgroundColor: colors.white,marginRight:Dimension.margin8,

  },
  invisibleTextInput: {
    width: 1, 
    height: 1, 
    opacity: 0,
    marginLeft:0,
    paddingLeft:0,
    marginHorizontal:0,
    paddingHorizontal:0,
  },
  codeReciveWrap: {
    flexDirection: 'row',
    marginBottom: Dimension.margin15,
    paddingTop: Dimension.padding20,
  },
  resendOTP: {marginLeft: 'auto'},
  codeResend: {
    fontSize: Dimension.font10,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  resendotptext: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: Dimension.margin5,
  },
  orView: {
    width: '100%',
    height: 1,
    position: 'relative',
    backgroundColor: colors.ProductBorderColor,
    marginVertical: Dimension.margin20,
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
  BtnText: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  contBtn: {
    height: Dimension.height40,
    width: '100%',
    backgroundColor: colors.PrimaryTextColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius8,
    marginTop: 0,
  },
  errorText: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font10,
    marginTop: Dimension.margin5,
    fontFamily:Dimension.CustomRegularFont
  },
  validText: {
    color: colors.green2,
    fontSize: Dimension.font11,
    marginTop: Dimension.margin5,
    fontFamily:Dimension.CustomRegularFont
  },
  textInputwithErrorStyle: {

    borderWidth: 1,
    width: '14%',
    color: colors.PrimaryTextColor,
    paddingHorizontal: Dimension.padding5,
    textAlign: 'center',
    fontSize: Dimension.font14,
    borderColor: colors.RedThemeColor,
    borderRadius: Dimension.borderRadius8,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    backgroundColor: colors.white,
  },
  textInputwithVerifiedStyle: {
    borderWidth: 1,
    width: '14%',
    color: colors.PrimaryTextColor,
    paddingHorizontal: Dimension.padding5,
    textAlign: 'center',
    fontSize: Dimension.font14,
    borderColor: colors.green2,
    borderRadius: Dimension.borderRadius8,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    backgroundColor: colors.white,
  },
  rbsSubTitle: {
    fontSize: Dimension.font4, 
    color: colors.lightGrayText,
    fontFamily:Dimension.CustomRegularFont,
  },
});

export default styles;
