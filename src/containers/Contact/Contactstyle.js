import {StyleSheet, Dimensions, Platform} from 'react-native';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
    helpHeadingWrap:{backgroundColor:'#fff', borderColor:colors.ProductBorderColor, borderWidth:1,paddingHorizontal:Dimension.padding12,paddingVertical:Dimension.padding15, borderRadius:Dimension.borderRadius8,flexDirection:'row', alignItems:'center',marginBottom:Dimension.margin15},
    contactImg:{width:Dimension.width100,height:Dimension.height80},
    headText:{flex:2,paddingRight:Dimension.padding15},
    helpHeading:{fontSize:Dimension.font12, color:colors.PrimaryTextColor, fontFamily:Dimension.CustomSemiBoldFont, marginBottom:6},
    helpsubText:{fontSize:Dimension.font11,color:colors.PrimaryTextColor,lineHeight:Dimension.height15},
    hcsubText:{fontSize:Dimension.font11,color:colors.PrimaryTextColor,lineHeight:Dimension.height15, marginBottom:Dimension.margin15},
    orderNavigate:{backgroundColor:'#fff', borderColor:colors.ProductBorderColor, borderWidth:1,padding:Dimension.padding12, borderRadius:Dimension.borderRadius8,flexDirection:'row', alignItems:'center',marginBottom:Dimension.margin15, position:'relative'},
    fileicon:{width:Dimension.width18, height:Dimension.height20, tintColor:colors.PrimaryTextColor,marginRight:Dimension.margin10,},
    orderTextWrap:{width:'90%',},
    orderText:{fontSize:Dimension.font12, color:colors.PrimaryTextColor, fontFamily:Dimension.CustomSemiBoldFont},
    ordersubText:{fontSize:Dimension.font11, color:colors.PrimaryTextColor},
    rightarrowicon:{width:Dimension.width18,height:Dimension.width18, position:'absolute',right:10, tintColor:colors.PrimaryTextColor, flex:1, alignSelf:'center',marginTop:Dimension.margin5},
    addrCard:{backgroundColor:'#fff', borderColor:colors.ProductBorderColor, borderWidth:1,paddingHorizontal:Dimension.padding12,paddingVertical:Dimension.padding15, borderRadius:Dimension.borderRadius8,marginBottom:Dimension.margin15, flexDirection:'column'},
    addrTag:{backgroundColor:colors.ProductBorderColor,width:'auto',paddingHorizontal:Dimension.padding8,paddingVertical:2, paddingBottom:1, alignItems:'center', color:colors.lightGrayText, fontSize:Dimension.font11, fontFamily:Dimension.CustomSemiBoldFont, borderRadius:Dimension.borderRadius4, marginBottom:12},
    boldText:{fontFamily:Dimension.CustomBoldFont, marginBottom:0},
    contentWrap:{backgroundColor:'#F7F7FA',padding:Dimension.padding15}
});

export default styles;