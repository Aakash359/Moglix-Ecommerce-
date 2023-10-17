import {StyleSheet} from 'react-native';
import Dimension from '../../../redux/constants/dimensions';
import colors from '../../../redux/constants/colors';

const styles = StyleSheet.create({
  changePassBtn: {
    // backgroundColor: colors.RedThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Dimension.padding10,
    borderRadius: 8,
    height: Dimension.height40,
    marginTop: Dimension.margin15,
  },
  changePassText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.white,
    textAlign: 'center',
  },
  FloatView: {
    paddingHorizontal: Dimension.padding10,
    backgroundColor: colors.white,
  },
  passIcon: {
    position: 'absolute',
    right: 10,
    top: 11,
    zIndex: 11231,
  },
});

export default styles;
