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
    justifyContent: 'flex-end',
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
    paddingVertical: Dimension.padding5,
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
    color: colors.white,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  blueLink: {
    paddingTop: Dimension.padding25,
    alignItems: 'center',
    paddingBottom: Dimension.padding15,
  },
  linkText: {
    fontSize: Dimension.font12,
    color: colors.BlueText,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  errorText:{color: colors.RedThemeColor, fontSize: Dimension.font10,fontFamily:Dimension.CustomRegularFont,marginTop:Dimension.margin5}
});

export default styles;
