import {StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
  activityIndicator: {
    alignSelf: 'center',
    height:600,
  },
  loaderView:{
    // flex: 1,
    // height: Dimension.SCREEN_HEIGHT - 150,
    height:'100%',
    // alignItems: 'center',
    // backgroundColor:'red',
    // justifyContent: 'center',
  },
  rfqList:{padding:Dimension.padding15},
  noOrders: {paddingHorizontal: Dimension.padding15, marginTop:Dimension.margin20},
  whiteBgWithImage: {
    backgroundColor: '#fff',
    padding: Dimension.padding15,
    paddingHorizontal: Dimension.padding30,
    alignItems: 'center',
    paddingTop: Dimension.padding50,
    paddingBottom: Dimension.padding30,
    borderRadius: Dimension.borderRadius16,
  },
  noOrderImage: {width: Dimension.width185, height: Dimension.width150},
  noOrderContent: {
    color: colors.lightGrayText,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    textAlign: 'center',
    marginTop: Dimension.margin20,
  },
  rfqListWrap:{backgroundColor: '#fff',shadowOpacity: 0.3,
  shadowRadius: 2,  shadowColor: '#000', 
  elevation: 2,shadowOffset: { width: 0, height: 1 },
  borderRadius: Dimension.borderRadius6, marginBottom:Dimension.margin15},
  rfqListBox:{flexDirection:'row', alignItems:'flex-start',padding:Dimension.padding10},
  rfqPlaceholderImage:{width:Dimension.width60, height:Dimension.width60, borderRadius:Dimension.borderRadius4,},
  rfqContent:{paddingLeft:Dimension.padding15,flex:1},
  rfqText:{lineHeight:Dimension.height16, fontSize:Dimension.font12, color:colors.PrimaryTextColor, fontFamily:Dimension.CustomRegularFont},
  rfqItemName:{marginBottom:Dimension.margin10},
  rfqStatus:{borderTopColor:colors.ProductBorderColor, borderTopWidth:1,padding:Dimension.padding10},
  statusType:{color:colors.PrimaryTextColor, fontSize:Dimension.font10, fontFamily:Dimension.CustomBoldFont,marginBottom:-Dimension.margin2},
  statusDate:{color:colors.PrimaryTextColor, fontSize:Dimension.font10, fontFamily:Dimension.CustomRegularFont}
  
});

export default styles;
