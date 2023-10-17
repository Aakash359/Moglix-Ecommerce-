import {Dimensions, StyleSheet} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import Colors from '../../redux/constants/colors';

const styles = StyleSheet.create({
 changeAddressPage: {
    marginHorizontal: Dimension.padding15,
    marginBottom:Dimension.padding15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderColor: Colors.RedThemeColor,
    borderWidth: .5,
 },
 nameTxt:{
   color: colors.PrimaryTextColor,
   fontSize: Dimension.font12,
   fontFamily: Dimension.CustomBoldFont,
   marginBottom: 0,
   marginLeft: Dimension.margin10,
 },
 topDeliveryAddress: {
    padding: 10,
    borderColor: Colors.ProductBorderColor,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: Dimension.borderRadius8,
    flexDirection:'row',
    justifyContent: 'center',
   //  alignItems:'center',
 },
nrmlTxt:{
   color: colors.PrimaryTextColor,  
   // opacity: 0.8,
   fontFamily: Dimension.CustomRegularFont,
   fontSize: Dimension.font11,
   marginBottom: Dimension.margin5,  
},
 topDeliveryAddressTxt: {
    color: 'red',
    alignSelf: 'center',
    color: colors.RedThemeColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    marginLeft:8,
    marginTop:-1,
    textTransform: 'uppercase',
 },
 changeAddressInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:Dimension.margin10,
 },
 editCta: {
    backgroundColor: colors.LightRedThemeColor,
    padding: Dimension.padding8,
    width: '48%',
    borderRadius: 4,
 },
 deliverHereCta: {
    backgroundColor: Colors.RedThemeColor,
    padding: Dimension.padding8,
    width: '48%',
    borderRadius: 4,
  },
 deliverHereCtaTxt: {
    color: colors.white,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    alignSelf: 'center',

 },
 editText:{
   color: colors.RedThemeColor,
   fontSize: Dimension.font12,
   fontFamily: Dimension.CustomSemiBoldFont,
   alignSelf: 'center',
 },
 actionRowInCard:{
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginTop:Dimension.margin10
 },
 flatListView:{marginHorizontal: Dimension.padding15, marginVertical:Dimension.padding10}

});

export default styles;
