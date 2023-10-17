import {StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
  searcinputText: {
    fontSize: Dimension.font12,
    marginLeft: Dimension.margin15,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.lightGrayText,
    textAlignVertical: 'center',
    backgroundColor: '#fff',
  },
  voiceIconCss: {
    color: Colors.BlueText,
    fontSize: Dimension.font22,
  },
  mainWrap: {flexDirection: 'row', backgroundColor: '#fff'},
  leftPart: {
    width: Dimension.width130,
    backgroundColor: '#ddd',
    padding: Dimension.padding10,
    paddingRight: 0,
  },
  leftPartcollapsed: {
    width: Dimension.width80,
    backgroundColor: '#ddd',
    padding: Dimension.padding10,
    paddingRight: 0,
  },
  rightpanel: {
    flexDirection: 'row',
    marginTop: Dimension.margin10,
    backgroundColor: '#fff',
  },
  rightPart: {width: Dimension.width160, paddingRight: Dimension.padding0},
  rightPartCollapsed: {
    width: Dimension.width205,
    paddingRight: Dimension.padding0,
  },

  TopCatWrap: {
    flexDirection: 'row',
    paddingTop: Dimension.padding10,
    paddingBottom: Dimension.padding10,
  },
  ActiveTopCatWrap: {
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: Dimension.padding10,
    paddingBottom: Dimension.padding10,
  },
  TopCatName: {
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font11,
    flex: 2,
    textAlignVertical: 'center',
  },
  ActiveTopCatName: {
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font11,
    flex: 2,
    textAlignVertical: 'center',
  },
  TopCatImg: {height: Dimension.width32, width: Dimension.width32, flex: 1},
  ActiveTopCatImg: {
    height: Dimension.width32,
    width: Dimension.width32,
    flex: 1,
  },
  maintitlearrow: {
    width: Dimension.width20,
    height: Dimension.width20,
    position: 'absolute',
    right: Dimension.margin2,
    top: Dimension.margin8,
  },

  rightInnerPart: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    // paddingRight:Dimension.padding10,
    width: '100%',
    justifyContent: 'space-between',
  },
  rightArrow: {
    fontSize: Dimension.font14,
    paddingTop: Dimension.padding5,
    padding: Dimension.padding6,
  },
  catTitleName: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
    textAlignVertical: 'center',
    width: Dimension.width130,
  },
  Titlename: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
  },
  rightOuterPart: {
    backgroundColor: '#fff',
    // borderRadius: 8,
    // paddingRight:Dimension.padding10,
    // padding
    paddingVertical: Dimension.padding10,
    // marginTop: Dimension.margin10,
    borderTopColor: '#455B6324',
    borderTopWidth: 0.8,
    // paddingLeft: 0,
  },

  rightOpenPart: {
    borderTopColor: Colors.ProductBorderColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-evenly',
    paddingTop: Dimension.padding10,
    alignItems: 'flex-start',
    paddingLeft: 0,
    marginTop: Dimension.margin10,
  },
  ChildcategoryWrapOpen: {
    marginRight: Dimension.margin10,
  },
  ChildcategoryWrap: {
    flexDirection: 'column',
    marginRight: Dimension.margin6,
    marginBottom: Dimension.margin20,
    justifyContent: 'space-between',
    maxWidth: Dimension.width45,
    alignContent: 'center',
  },
  ChildCatIMg: {width: Dimension.width40, height: Dimension.width40},
  ChildCatText: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    marginTop: Dimension.margin10,
    maxWidth: Dimension.width45,
    color: Colors.PrimaryTextColor,
    alignSelf: 'center',
    textAlign: 'center',
  },

  expandIcon: {
    color: '#a1a1a1',
    top:7
  },
  doubleicons: {
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding8,
  },
  maintitleactive: {
    backgroundColor: Colors.LightRedThemeColor,
    // marginRight:Dimension.margin10,
    justifyContent: 'space-between',
    // alignItems: 'center',
    borderRadius: Dimension.borderRadius6,
    marginBottom: Dimension.margin8,
  },
  maintitle: {
    padding: Dimension.padding10,
    fontFamily: Dimension.CustomMediumFont,
    flexDirection: 'column',
    width: '80%',
  },
  collapseIcon: {
    width: Dimension.width20,
    height: Dimension.width20,
    // tintColor: '#3c3c3c',
  },

  dropArrow: {
    width: Dimension.width20,
    height: Dimension.width20,
    tintColor: '#3c3c3c',
  },
  rightsubcatCollapse: {
    borderBottomWidth: 1,
    borderRadius: 0,
    borderBottomColor: Colors.ProductBorderColor,
    paddingTop: Dimension.padding1,
    paddingBottom: Dimension.padding10,
  },
  rightsubcatopenpart: {},
  ChildCatIMgOpen: {width: Dimension.width60, height: Dimension.width60},
  ChildCatTextOpen: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    marginTop: Dimension.margin10,
    maxWidth: Dimension.width45,
    color: Colors.PrimaryTextColor,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: Dimension.margin15,
  },
  mainrightArrow: {
    width: Dimension.width20,
    height: Dimension.width20,
    color: '#a1a1a1',
  },
  updownarrowinsubcat: {
    borderLeftColor: Colors.ProductBorderColor,
    borderLeftWidth: 1,
    color: '#a1a1a1',
    // height: Dimension.height36,
    paddingHorizontal: Dimension.padding8,
    // marginBottom: Dimension.margin5,
  },
  subcatrightArrow: {
    width: Dimension.width20,
    height: Dimension.width20,
    color: '#a1a1a1',
    borderLeftColor: '#e7e7e7',
    borderLeftWidth: 0.8,
  },
  margintop: {marginTop: Dimension.padding8},
  activityIndicator: {
    alignSelf: 'center',
  },
  flatListContainer: {paddingBottom: 150},
  flatListContainerRight: {paddingBottom: 150, paddingTop: 12,paddingRight:Dimension.padding10},
  searchBox: {
    paddingVertical: Dimension.margin10,
    backgroundColor: '#fff',
    margin: 12,
    paddingHorizontal: Dimension.padding12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderColor: '#C9C9C9',
    borderWidth: 1,
    alignItems: 'center',
  },
  searchBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 0.5,
  },
});

export default styles;
