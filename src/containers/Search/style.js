import {StyleSheet} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';

const styles = StyleSheet.create({
  activityIndicator: {
    borderRadius: 8,
    width: '100%',
    marginHorizontal: 12,
    marginBottom: 8,
    paddingVertical: 50,
    alignSelf: 'center',
  },
  centerText: {alignSelf: 'center'},
  inputField: {
    height: 45,
    borderWidth: 1,
    borderColor: colors.ExtralightGrayText,
    flex: 1,
    borderRadius: Dimension.borderRadius6,
    paddingHorizontal: Dimension.padding30,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
  
  },
  trendingSearchView: {flexDirection: 'column'},
  suggestionHeading: { marginTop:-Dimension.margin15},
  clearHistory: {color: 'red', fontSize: 16, fontWeight: 'bold'},
  flatlistContainer: {
    // flex: 1,
    width: '100%',
    // paddingTop: 90,
  },
  searchBox: {flexDirection: 'row', position: 'relative'},
  searchIconWrap: {
    position: 'absolute',
    left: 5,
    zIndex: 2,
    top: 0,
    paddingTop: 8,
    height: 45,
  },
  arrowBackIcon: {
    fontSize: Dimension.font15},
  searchArea: {padding: Dimension.padding10, backgroundColor: '#fff'},
  voiceSearch: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: 45,
    paddingTop: 15,
    width: Dimension.width20,
    alignItems: 'center',
  },
  arrowBackIcon: {
    fontSize: Dimension.font20,
     alignSelf:'center',
     marginTop:Dimension.margin4,
    color: colors.PrimaryTextColor
  },
    voiceIconCss: {
    color: colors.BlueText, 
    fontSize: Dimension.font18,
    alignSelf:'center'
  },
  // suggestionHeading: {
  //   color: colors.lightGrayText,
  //   fontSize: Dimension.font11,
  //   paddingVertical: Dimension.padding15,
  //   paddingHorizontal: Dimension.padding10,
  //   fontFamily: Dimension.CustomSemiBoldFont,
  // },
  suggestionList: {
    backgroundColor: '#fff',
    paddingHorizontal: Dimension.padding10,
    width: '100%',
    // paddingBottom:20
  },
  recentSearchHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recSearchHeading: {
    color: colors.lightGrayText,
    fontSize: Dimension.font11,
    paddingVertical: Dimension.padding15,
    paddingBottom:Dimension.padding10,
    paddingHorizontal: Dimension.padding10,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  clearSearch: {marginRight: Dimension.margin10},
  clearHistory: {
    alignContent: 'flex-end',
    color: colors.RedThemeColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  recentSearchList: {
    marginHorizontal: Dimension.margin10,
    borderRadius: Dimension.borderRadius8,
    maxHeight: Dimension.SCREEN_HEIGHT / 1.85,
    width:'95%'
  },
  suggestionScroll: {
    backgroundColor: '#fff',
    zIndex: 1,
    maxHeight: Dimension.SCREEN_HEIGHT - 100,
    // borderWidth:1,
  },
});

export default styles;
