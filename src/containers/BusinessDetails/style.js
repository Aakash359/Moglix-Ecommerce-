import {StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
  newinputfield: {
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  errorText: {
    color: colors.RedThemeColor,
    fontSize: Dimension.font11,
    fontFamily: Dimension.CustomRegularFont,
  },
  gstBtn: {
    width: Dimension.width70,
    height: Dimension.height30,
    position: 'absolute',
    right: 6,
    top: 29,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Dimension.borderRadius4,
  },
  gstText: {
    color: '#fff',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  addrModuleWrap: {flex: 1, backgroundColor: '#fff'},
  scrollViewPage: {flex: 1, paddingHorizontal: Dimension.padding12},
  inputViewWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  checkoutBtn: {
    // backgroundColor: colors.RedThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Dimension.padding5,
    flexDirection: 'row',
    borderRadius: 4,
    height: Dimension.height40,
  },
  checkoutText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    color: colors.white,
    marginLeft: Dimension.margin8,
    textAlign: 'center',
  },
  pickerCss: {
    flex: 1,
    fontSize: Dimension.font12,
    height: Dimension.height40,
    fontFamily: Dimension.CustomRegularFont,
    color: colors.lightGrayText,
  },
  newinputfieldwithpicker: {
    paddingRight: Dimension.padding12,
    borderWidth: 1,
    marginTop: 22,
    borderColor: colors.lightGrayText,
    borderRadius: 8,
  },
  citystateinputfield: {paddingRight: Dimension.padding15, margin: 0},
});

export default styles;
