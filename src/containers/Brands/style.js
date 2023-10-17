import {StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingTop: Dimension.padding10,
    paddingBottom: Dimension.padding10,
    position: 'relative',
    borderBottomColor: 'transparent',
    borderBottomWidth: Dimension.padding15,
  },
  voiceIconCss: {
    color: Colors.BlueText,
    fontSize: Dimension.font22,
    // position: 'absolute',
    // right: Dimension.margin12,
    // top: Dimension.margin10,
  },
  searcinputText: {
    fontSize: Dimension.font12,
    marginLeft: Dimension.margin15,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.lightGrayText,
    textAlignVertical: 'center',
    // borderRadius: 8,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: '#C9C9C9',
    // width: '100%',
    // flex: 1,
    // position: 'relative',
    // paddingLeft: Dimension.padding40,
    // height: Dimension.height40,
  },
  searcinputTextBold: {
    fontSize: Dimension.font12,
    color: Colors.lightGrayText,
    textAlignVertical: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C9C9C9',
    width: '100%',
    flex: 1,
    position: 'relative',
    paddingLeft: Dimension.padding40,
    height: Dimension.height40,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  searchIconWrap: {
    // position: 'absolute',
    // left: Dimension.margin20,
    // top: Dimension.margin12,
  },
  SearchIcon: {
    width: Dimension.height24,
    height: Dimension.width24,
    tintColor: Colors.PrimaryTextColor,
  },
  allbrmainwrap: {backgroundColor: '#fff', padding: Dimension.padding15},
  allbrheading: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  alphalist: {paddingTop: Dimension.padding10},
  alphatextList: {
    width: Dimension.width130,
    fontSize: Dimension.font14,
    padding: Dimension.padding10,
    paddingLeft: 0,
  },
  alphalistrow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandHeading: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginTop: Dimension.margin10,
  },
  activeFilter: {
    padding: 5,
    paddingLeft: Dimension.padding15,
    paddingRight: Dimension.padding15,
    borderRadius: 4,
    backgroundColor: Colors.RedThemeColor,
    marginRight: 15,
    shadowColor: '#00000029',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0,
    shadowRadius: 3,
    elevation: 6,
    marginBottom: Dimension.margin15,
  },
  activityIndicator: {
    alignSelf: 'center',
  },
  activeFilterText: {
    color: '#fff',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  inactiveFilter: {
    padding: 5,
    paddingLeft: Dimension.padding15,
    paddingRight: Dimension.padding15,
    borderRadius: 4,
    marginRight: 15,
    backgroundColor: '#fff',
    shadowColor: '#00000029',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0,
    shadowRadius: 3,
    elevation: 6,
    marginBottom: Dimension.margin15,
  },
  inactiveFilterText: {
    color: '#3A3A3A',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  searchBar: {
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
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topFullFullWidth: {
    paddingLeft: Dimension.padding12,
    paddingBottom: Dimension.padding15,
  },
  spotlight: {paddingHorizontal: Dimension.padding12},
  spotLightView: {
    paddingTop: Dimension.padding10,
    paddingHorizontal: Dimension.padding12,
   
  },
  catWrap: {
    paddingTop: Dimension.padding10,
    paddingLeft:Dimension.padding10,
    paddingHorizontal: Dimension.padding12

  },
  halfWidthImageRow: {marginTop: -Dimension.padding15},
  halfWidthImageGap: {paddingBottom: Dimension.padding15},
  fullWidthImageGapBottom: {paddingBottom: Dimension.padding10},
  homeOfficeBrands: {
    paddingTop: Dimension.padding10,
    paddingLeft: Dimension.padding15,
  },
  headingimg: {width: '100%', height: Dimension.height60, marginBottom:0},
});

export default styles;