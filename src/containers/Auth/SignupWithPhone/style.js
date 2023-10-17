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
    justifyContent: 'flex-start',
  },
  backHeader: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    marginBottom: Dimension.margin20,
    padding: 0,
    paddingHorizontal: 0,
  },
  iconColor: {color: '#fff'},
  title: {
    fontSize: Dimension.font16,
    color: '#fff',
    fontFamily: Dimension.CustomBoldFont,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: Dimension.font12,
    color: '#fff',
    marginBottom: Dimension.margin10,
    fontFamily: Dimension.CustomRegularFont,
  },
  whiteBg: {
    backgroundColor: '#fff',
    paddingTop: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    borderRadius: Dimension.borderRadius12,
    marginBottom: Dimension.margin15,
    paddingBottom: Dimension.padding20,
  },
  redBtn: {
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
    color: '#fff',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  passIcon: {position: 'absolute', right: 10, top: 15},
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
  errorText:{color: colors.RedThemeColor, fontSize: Dimension.font10,fontFamily:Dimension.CustomRegularFont,marginTop:Dimension.margin5}
});

export default styles;
