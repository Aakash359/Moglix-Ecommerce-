import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import {applyThousandSeparator, getBrand} from '../../generic';
import Colors from '../../redux/constants/colors';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const Category = props => {
  const renderCards = ({item, index}) => {
    const trackAdobe = productMsn => {
      let code = props.data.componentName + '_' + productMsn;
      var adobeData = {
        'myapp.linkpageName': 'moglix:home',
        'myapp.ctaname': code,
        'myapp.linkName': code,
        '&&products': `;${item.msn};1;${item.sellingPrice}`,
        '&&events': 'event21',
      };
      let dataTracking = {
        event_type: 'click',
        label: `home_page_click_${
          props && props.component && props.component.componentName
        }`,
        channel: 'Home',
        page_type: `home_page`,
      };
      sendClickStreamData(dataTracking);
      trackStateAdobe('moglix.home', adobeData);
    };

    const navigationFn = item => {
      if (props.fromHome) {
        trackAdobe(item.msn.toLowerCase());
      }

      props.navigation.push('Product', {
        ...item,
        fromScreen: props.fromScreen,
      });
    };

    return (
      <TouchableOpacity key={index} onPress={() => navigationFn(item)}>
        <View style={styles.CardWrap}>
          <View style={styles.CardInnerWrap}>
            <View style={styles.prdImgWrap}>
              <Image
                // defaultSource={{uri: 'https://via.placeholder.com/150'}}
                source={{
                  uri:
                    'https://cdn.moglix.com/' +
                    (Platform.OS == 'android'
                      ? item.imageWebp || item.imageLink_medium
                      : item.imageLink_medium),
                }}
                style={styles.prdImage}
                placeholderStyle={styles.prdImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text
                style={styles.PrdName}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.productName}
              </Text>
              <Text style={styles.PrdBrand}>
                {getBrand(item.short_description)}
              </Text>
              {!props.oos ? (
                <View>
                  <View style={styles.row}>
                    <Text style={styles.PrdOriginalPrice}>
                      ₹{applyThousandSeparator(item.mrp)}
                    </Text>
                    <Text style={styles.PrdOff}>
                      {item.discount_percentage}% OFF
                    </Text>
                  </View>
                  <Text style={styles.PrdOfferPrice}>
                    ₹{applyThousandSeparator(item.pricewithouttax)}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.availableReqText}>
                    Available on Request
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal={true}
      style={styles.bestSellerFlatList}
      maxToRenderPerBatch={3}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={3}
      data={(props.data && props.data.data) || []}
      renderItem={renderCards}
      keyExtractor={(item, index) => `${index}-item`}
    />
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1},
  freshInnerWrap: {
    paddingHorizontal: Dimension.padding20,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.ProductBorderColor,
  },
  freshImg: {height: 100, width: 100},
  FreshItemName: {
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
    flex: 1,
  },
  FreshItemText: {
    fontSize: Dimension.font10,
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  row: {flexDirection: 'row'},
  availableReqText: {
    fontSize: Dimension.font12,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomBoldFont,
    textTransform: 'capitalize',
  },
  CardWrap: {
    width: Dimension.HomeBestSellerCardWidth,
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    backgroundColor: Colors.white,
    borderRadius: Dimension.borderRadius8,
    // marginLeft: Dimension.margin15,
    // marginRight:Dimension.margin15
    marginHorizontal: Dimension.margin10,
  },
  CardInnerWrap: {
    padding: Dimension.padding10,
  },
  CardTopWrap: {justifyContent: 'space-between', flexDirection: 'row'},
  prdImgWrap: {alignItems: 'center', justifyContent: 'center'},
  prdImage: {
    height: Dimension.BestSellerPrdImg,
    width: Dimension.BestSellerPrdImg,
  },
  PrdName: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    height: Dimension.height30,
  },
  PrdBrand: {
    color: Colors.lightGrayText,
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  PrdOriginalPrice: {
    color: Colors.SecondaryTextColor,
    fontSize: Dimension.font12,
    fontWeight: '400',
    fontFamily: Dimension.CustomRobotoRegular,
    textDecorationLine: 'line-through',
    marginRight: Dimension.margin10,
  },
  PrdOff: {
    color: Colors.GreenColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
  },
  PrdOfferPrice: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    fontWeight: 'bold',
  },
  PrdQtyPack: {
    fontSize: Dimension.font10,
    color: Colors.lightGrayText,
    fontFamily: Dimension.CustomRegularFont,
  },

  AddToCartBtnWrap: {
    backgroundColor: Colors.RedThemeColor,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: Dimension.padding10,
    alignItems: 'center',
  },
  AddToCartBtnText: {
    color: Colors.white,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },

  row: {flexDirection: 'row'},
  TopOffText: {
    color: Colors.white,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font10,
  },
  TopOffWrap: {
    backgroundColor: Colors.GreenColor,
    justifyContent: 'center',
    borderRadius: 4,
    alignSelf: 'center',
    padding: Dimension.padding5,
    maxHeight: 22,
  },
  bestSellerFlatList: {paddingTop: Dimension.padding15},
});

export default Category;
