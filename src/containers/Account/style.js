import {StyleSheet} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const styles = StyleSheet.create({
  redStrip: {
    backgroundColor: colors.RedThemeColor,
    borderRadius: 8,
    padding: Dimension.padding15,
    flexDirection: 'row',
  },
  accountView: {padding: Dimension.padding20},
  userDetail: {marginLeft: Dimension.margin15},
  userIconWrap: {
    backgroundColor: '#F7F7FA',
    borderRadius: Dimension.borderRadius10,
    width: Dimension.width70,
    height: Dimension.width70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  UserIconImg: {width: Dimension.width65, height: Dimension.width65},
  nameCol: {marginBottom: Dimension.margin8},
  userData: {
    color: 'rgba(255,255,255,.80)',
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
  },
  userName: {
    color: colors.white,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font14,
  },
  editProfileBtn: {
    backgroundColor: 'rgba(255,255,255,.20)',
    paddingVertical: Dimension.padding6,
    borderRadius: Dimension.borderRadius4,
    alignSelf: 'flex-start',
    padding: Dimension.padding10,
  },
  editProfileBtnText: {
    color: colors.white,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
  },
  userDetData: {
    backgroundColor: colors.white,
    paddingHorizontal: Dimension.padding15,
    borderRadius: Dimension.borderRadius8,
    marginTop: Dimension.margin15,
    borderWidth: 1,
    marginBottom: Dimension.margin15,
    borderColor: colors.ProductBorderColor,
  },
  userdetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimension.padding10,
    justifyContent: 'space-between',
  },
  noteHading: {
    color: colors.ExtralightGrayText,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font11,
  },
  noteText: {
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font11,
  },
  verifyBtn: {
    backgroundColor: colors.LightRedThemeColor,
    paddingHorizontal: Dimension.padding15,
    borderRadius: 4,
    height: Dimension.width26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyBtnText: {
    color: colors.RedThemeColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
  },

  verifiedBtn: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: Dimension.padding15,
    borderRadius: 4,
    height: Dimension.width26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBtnText: {
    color: colors.GreenColor,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
  },
  brdBottom: {
    borderBottomColor: colors.ProductBorderColor,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileBlockWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Dimension.padding15,
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: Dimension.borderRadius8,
    marginBottom: Dimension.margin15,
    paddingHorizontal: Dimension.padding10,
  },
  profileActText: {
    color: colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    marginLeft: Dimension.margin15,
    fontFamily: Dimension.CustomMediumFont,
  },
});

export default styles;
