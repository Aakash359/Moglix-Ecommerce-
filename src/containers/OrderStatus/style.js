import { StyleSheet } from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
  failureView: { backgroundColor: '#F7F7FA', flex: 1 },
  failureInnerView: {
    marginHorizontal: Dimension.margin5,
    marginVertical:  Dimension.margin15,
  },
  topWrap: { backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: colors.ProductBorderColor, alignItems:'center', padding: Dimension.padding20, margin: Dimension.margin10, marginBottom:Dimension.margin10 },
  SuccessText: {  textAlign: "center", color: colors.BoldgreenText, fontSize: Dimension.font18, fontFamily: Dimension.CustomSemiBoldFont, },
  successImg: { width: 200, height: 150, marginTop: Dimension.margin20, marginBottom: Dimension.margin25 },
  failureText: { color: colors.RedThemeColor, marginBottom:Dimension.margin8 },
  FailureBoldtext: { fontSize: Dimension.font14, fontFamily: Dimension.CustomMediumFont, color: colors.PrimaryTextColor, textAlign: "center",marginBottom:Dimension.margin5 },
  FailureSmalltext: { fontSize: Dimension.font11, fontFamily: Dimension.CustomRegularFont, color: colors.PrimaryTextColor, textAlign: "center", },
  FailureNormaltext: { fontSize: Dimension.font12, fontFamily: Dimension.CustomRegularFont, color: colors.PrimaryTextColor, textAlign: "center",},
  failureImg: { width: 170, height: 170, marginTop: Dimension.margin20, marginBottom: Dimension.margin25 },
  OrderDetailWrap: { backgroundColor: "#fff", padding: Dimension.padding15, flex: 1 },
  cartOrderBtn:{
    borderRadius: 8,
    borderColor: colors.RedThemeColor,
    borderWidth: 1,
    height: Dimension.height36,
    justifyContent: "center",
    width:'48%',alignItems:'center'
  },
  viewOrderBtn: {
    backgroundColor: '#FFF',   
  },
  viewOrderBtnText: {
    color: colors.RedThemeColor,
  },
  shopMoreBtn: {
    backgroundColor: colors.RedThemeColor,
  },
  shopMoreBtnText: {
    color: '#FFF',
  },
  btnText:{
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  cartView:{flexDirection:'row', justifyContent:'space-between'},
  cartOrderView:{
    padding: Dimension.padding15,
    borderRadius:Dimension.borderRadius8,
    marginHorizontal:Dimension.margin10,
    marginTop:Dimension.margin10,
    marginBottom:Dimension.margin20,
    backgroundColor:'#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 3,
    backgroundColor:'#fff'
  },
  successWrap:{marginTop:Dimension.margin10, marginHorizontal:Dimension.margin5},
  rateWrap:{backgroundColor:'#fff',borderRadius: 8, borderWidth: 1, borderColor: colors.ProductBorderColor, marginHorizontal:Dimension.margin10, flexDirection:'row',paddingVertical:Dimension.padding10, alignItems:'center', paddingHorizontal:Dimension.padding15, marginBottom:Dimension.margin20},
  rateContent:{flexDirection: 'row', alignItems:'center', flex:2},
  rateusImg:{width:Dimension.width40, height:Dimension.width40},
  rateText:{
    flexDirection: 'column',
    marginLeft: Dimension.margin15, justifyContent:'center'
  },
  shopMoreBtn:{paddingHorizontal:Dimension.padding15, height:Dimension.height30, backgroundColor:colors.RedThemeColor, color:'#fff', borderRadius:Dimension.borderRadius4, alignItems:'center', justifyContent:'center'},
  shopMoreBtnText:{fontSize:Dimension.font12, fontFamily:Dimension.CustomSemiBoldFont, color:'#fff'},
  rateusBoldtext:{color:colors.PrimaryTextColor, fontSize:Dimension.font14, fontFamily:Dimension.CustomBoldFont, marginBottom:-Dimension.margin5},
  rateusSmalltext:{color:colors.PrimaryTextColor, fontSize:Dimension.font12, fontFamily:Dimension.CustomRegularFont},
  prodListHorz:{backgroundColor:'#fff', paddingTop:Dimension.padding15,marginTop:Dimension.margin10},
  orderIdRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingHorizontal:Dimension.padding20, paddingBottom:Dimension.padding10},
  ordId:{fontSize:Dimension.font14, fontFamily:Dimension.CustomSemiBoldFont, color:colors.PrimaryTextColor},
  ordItemCounts:{fontSize:Dimension.font12, fontFamily:Dimension.CustomRegularFont, color:colors.PrimaryTextColor},
  prodListView:{marginRight: 0,width:'60%',maxWidth:Dimension.width250},
  // rating Modal style
  ratingModalInner:{backgroundColor:'#fff', padding:Dimension.padding20, alignItems:'center', borderRadius:Dimension.borderRadius16},
  rateModalHeading:{fontSize:Dimension.font18, fontFamily:Dimension.CustomBoldFont, color:colors.PrimaryTextColor},
  modalcoupenImg:{width:Dimension.width224, marginVertical:Dimension.margin15},
  userText:{fontSize:Dimension.font14, color:colors.PrimaryTextColor, fontFamily:Dimension.CustomRegularFont, textAlign:'center', lineHeight:24,},
  boldName:{fontFamily:Dimension.CustomSemiBoldFont},
  rateUsBtn:{ backgroundColor:colors.RedThemeColor, height:Dimension.height40,paddingHorizontal:Dimension.padding30, justifyContent:'center',borderRadius:Dimension.borderRadius8, marginTop:Dimension.margin20},
  rateUsBtnText:{fontSize:Dimension.font14, fontFamily:Dimension.CustomBoldFont, color:'#fff'},
  rateActions:{flexDirection:'row', justifyContent:'space-between', marginTop:Dimension.margin30},
  actionText:{fontFamily:Dimension.CustomBoldFont, fontSize:Dimension.font14, color:colors.RedThemeColor, marginHorizontal:Dimension.margin20}
});

export default styles;
