import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {applyThousandSeparator, getBrand} from '../../generic';
import KeyFeatures from './KeyFeatures';
import {OrderedMap} from 'immutable';

const ProductGridView = props => {
  const {item, gridstyleFBT} = props;
  const renderFilterAttributes = item => {
    return new OrderedMap(item.filterableAttributes || {})
      .map((_, i) => <Text style={styles.featureType}>{_}</Text>)
      .toList();
  };

  const renderkeyFeatures = item => {
    return ((item && item.keyFeatures) || []).map((_, i) => {
      if (i < 2) {
        return (
          <View style={styles.flist}>
            <View style={styles.greydot}></View>
            <Text style={styles.listText}>{_}</Text>
          </View>
        );
      }
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.cardView,
        gridstyleFBT,
        {...(props.parentStyles || {})},
        props.fromPdp
          ? {marginHorizontal: 0, marginBottom: 0, marginRight: 20}
          : null,
      ]}
      onPress={() => {
        if (props.closeModal) {
          props.closeModal();
        }
        props.navigation.push('Product', {
          msn:
            item.partNumber ||
            item.moglixPartNumber ||
            item.msn ||
            item.idProduct,
        });
      }}>
      <View style={styles.prodAreaTop}>
        <Image
          source={{
            uri:
              'https://cdn.moglix.com/' +
              (Platform.OS == 'android'
                ? item.imageWebp ||
                  item.imageLink ||
                  item.mainImageLink ||
                  item.imageLink_medium ||
                  item.imageLink_small ||
                  (item.productDetail &&
                    item.productDetail.productBO &&
                    item.productDetail.productBO.productPartDetails &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct
                    ] &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct
                    ].images &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct
                    ].images[0] &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct
                    ].images[0].links &&
                    item.productDetail.productBO.productPartDetails[
                      item.idProduct
                    ].images[0].links.medium) ||
                  (item.productPartDetails &&
                    item.productPartDetails[item.partNumber] &&
                    item.productPartDetails[item.partNumber].images &&
                    item.productPartDetails[item.partNumber].images[0] &&
                    item.productPartDetails[item.partNumber].images[0].links &&
                    item.productPartDetails[item.partNumber].images[0].links
                      .medium)
                : item.imageLink ||
                  item.mainImageLink ||
                  item.imageLink_medium ||
                  item.imageLink_small),
          }}
          style={styles.leftProdImage}
          resizeMode="contain"
        />
        <View style={styles.rightArea}>
          <View style={styles.rateProd}>
            {item.avgRating ? (
              <TouchableOpacity style={styles.prodRating}>
                <Text style={styles.ratingCount}>
                  {item.avgRating.toFixed(1)}
                </Text>
                <FAIcon name="star" style={styles.starIcon} />
              </TouchableOpacity>
            ) : null}
            {/* <Text style={styles.reviewCount}>({})</Text> */}
          </View>
          <Text numberOfLines={2} style={styles.prodName}>
            {item.productName}
          </Text>
          <Text style={styles.bybrand}>
            By:{' '}
            {item.brandName ||
              getBrand(item.short_description) ||
              (item &&
                item.productDetail &&
                item.productDetail.productBO.brandDetails.brandName) ||
              (item.brandDetails && item.brandDetails.brandName)}
          </Text>
          {item.oos ||
          item.quantityAvailable == 0 ||
          (item &&
            item.productDetail &&
            item.productDetail.productBO &&
            item.productDetail.productBO.outOfStock) ? null : (
            <View style={styles.percentOff}>
              <Text style={styles.offPrice}>
                ₹
                {applyThousandSeparator(
                  item.mrp ||
                    (item &&
                      item.productDetail &&
                      item.productDetail.productBO &&
                      item.productDetail.productBO.productPartDetails &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ].productPriceQuantity &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ].productPriceQuantity['india'] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ].productPriceQuantity['india'].mrp) ||
                    (item &&
                      item &&
                      item.productPartDetails &&
                      item.productPartDetails[item.partNumber] &&
                      item.productPartDetails[item.partNumber]
                        .productPriceQuantity &&
                      item.productPartDetails[item.partNumber]
                        .productPriceQuantity['india'] &&
                      item.productPartDetails[item.partNumber]
                        .productPriceQuantity['india'].mrp) ||
                    0,
                )}
              </Text>
              <Text style={styles.greenText}>
                {item.discount_percentage ||
                  item.discount ||
                  Math.ceil(
                    (item &&
                      item.productDetail &&
                      item.productDetail.productBO &&
                      item.productDetail.productBO.productPartDetails &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ].productPriceQuantity &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ].productPriceQuantity['india'] &&
                      item.productDetail.productBO.productPartDetails[
                        item.idProduct
                      ].productPriceQuantity['india'].discount) ||
                      (item &&
                        item.productPartDetails &&
                        item.productPartDetails[item.partNumber] &&
                        item.productPartDetails[item.partNumber]
                          .productPriceQuantity &&
                        item.productPartDetails[item.partNumber]
                          .productPriceQuantity['india'] &&
                        item.productPartDetails[item.partNumber]
                          .productPriceQuantity['india'].discount) ||
                      0,
                  )}
                % OFF
              </Text>
            </View>
          )}
          {/* ADD to Cart Area for In Stock product */}
          {item.oos ||
          item.quantityAvailable == 0 ||
          (item &&
            item.productDetail &&
            item.productDetail.productBO &&
            item.productDetail.productBO.outOfStock) ? null : (
            <View style={styles.price}>
              <View style={styles.leftPrice}>
                <Text style={styles.mainPrice}>
                  ₹
                  {applyThousandSeparator(
                    item.priceWithoutTax ||
                      item.pricewithouttax ||
                      (item &&
                        item.productDetail &&
                        item.productDetail.productBO &&
                        item.productDetail.productBO.productPartDetails &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct
                        ] &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct
                        ].productPriceQuantity &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct
                        ].productPriceQuantity['india'] &&
                        item.productDetail.productBO.productPartDetails[
                          item.idProduct
                        ].productPriceQuantity['india'].priceWithoutTax) ||
                      (item &&
                        item.productPartDetails &&
                        item.productPartDetails[item.partNumber] &&
                        item.productPartDetails[item.partNumber]
                          .productPriceQuantity &&
                        item.productPartDetails[item.partNumber]
                          .productPriceQuantity['india'] &&
                        item.productPartDetails[item.partNumber]
                          .productPriceQuantity['india'].priceWithoutTax) ||
                      0,
                  )}
                </Text>
                {item.itemInPack &&
                item.itemInPack != '1 piece' &&
                item.itemInPack != '1 Piece' ? (
                  <Text style={styles.qty}>
                    {item.itemInPack && item.itemInPack.split(' ')[0] > 1
                      ? `Qty/pack - ${item.itemInPack}`
                      : null}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
          {/* Send Query Area for RFQ */}
          {item.oos ||
          (item &&
            item.productDetail &&
            item.productDetail.productBO &&
            item.productDetail.productBO.outOfStock) ? (
            <View style={styles.price}>
              <View style={styles.leftQueryArea}>
                <Text style={styles.availRequest}>Available on Request</Text>
              </View>
              {/* <TouchableOpacity style={styles.sendQueryBtn} onPress={() => {}}>
                <Text style={styles.sendQueryText}>SEND QUERY</Text>
              </TouchableOpacity> */}
            </View>
          ) : null}
        </View>
      </View>
      {!props.fromViewAll && (
        <>
          <View style={styles.feature}>{renderFilterAttributes(item)}</View>
          <View style={styles.featureList}>{renderkeyFeatures(item)}</View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardView: {
    // flex: 1,
    backgroundColor: 'white',
    // marginHorizontal: Dimension.margin15,
    // marginBottom: Dimension.margin15,
    borderRadius: Dimension.borderRadius8,
    // overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    padding: Dimension.padding12,
    paddingTop: Dimension.padding25,
    paddingBottom: Dimension.padding30,
    // width:'50%'
    // maxWidth: Dimensions.get('window').width * 0.95,
  },
  prodName: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  leftProdImage: {
    width: Dimension.width100,
    height: Dimension.width100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  rightArea: {
    // paddingLeft: Dimension.padding15,
    position: 'relative',
    // width: '75%',
  },
  rateProd: {flexDirection: 'row', marginBottom: Dimension.margin5},
  prodRating: {
    flexDirection: 'row',
    backgroundColor: Colors.ratingColor,
    borderRadius: Dimension.borderRadius4,
    paddingHorizontal: Dimension.padding6,
    height: 20,
    alignItems: 'center',
  },
  ratingCount: {
    color: '#fff',
    fontSize: Dimension.font11,
    marginTop: -2,
    fontFamily: Dimension.CustomRobotoBold,
  },
  starIcon: {color: '#fff', fontSize: Dimension.font8, marginLeft: 3},
  reviewCount: {
    marginLeft: 5,
    color: Colors.ExtralightGrayText,
    fontSize: Dimension.font11,
    alignSelf: 'center',
  },
  wishlist: {position: 'absolute', right: 0, top: -5},
  // prodAreaTop: {flex: 1},
  wishlistIcon: {fontSize: Dimension.font18, color: Colors.ExtralightGrayText},
  wishlistIconActive: {fontSize: Dimension.font18, color: Colors.RedThemeColor},
  bybrand: {
    color: '#C9C9C9',
    fontSize: Dimension.font11,
    marginBottom: 1,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  percentOff: {flexDirection: 'row', alignItems: 'center', marginBottom: -5},
  offPrice: {
    fontSize: Dimension.font11,
    color: 'rgba(43, 43, 43, 0.5)',
    fontFamily: Dimension.CustomRobotoRegular,
    marginTop: -4,
    textDecorationLine: 'line-through',
  },
  greenText: {
    fontSize: Dimension.font12,
    color: Colors.ratingColor,
    fontFamily: Dimension.CustomBoldFont,
    paddingLeft: Dimension.padding10,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Dimension.margin8,
  },
  mainPrice: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    color: Colors.PrimaryTextColor,
    marginTop: Dimension.margin8,
  },
  qty: {
    fontSize: Dimension.font10,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomRegularFont,
  },
  addToCartBtn: {
    paddingHorizontal: Dimension.padding15,
    backgroundColor: Colors.RedThemeColor,
    paddingVertical: Dimension.padding8,
    borderRadius: Dimension.borderRadius4,
  },
  addToCartText: {
    fontSize: Dimension.font12,
    color: '#fff',
    fontFamily: Dimension.CustomRobotoBold,
  },
  availRequest: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: Colors.PrimaryTextColor,
  },
  sendQueryBtn: {
    paddingHorizontal: Dimension.padding15,
    borderWidth: 1,
    borderColor: Colors.RedThemeColor,
    paddingVertical: Dimension.padding8,
    borderRadius: Dimension.borderRadius4,
  },
  sendQueryText: {
    fontSize: Dimension.font12,
    color: Colors.RedThemeColor,
    fontFamily: Dimension.CustomRobotoBold,
  },
  feature: {
    flexDirection: 'row',
    marginTop: Dimension.margin10,
    alignItems: 'flex-start',
  },
  featureType: {
    paddingTop: Dimension.padding4,
    paddingBottom: Dimension.padding2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    borderRadius: Dimension.borderRadius4,
    marginRight: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font10,
    color: Colors.ExtralightGrayText,
    paddingHorizontal: Dimension.padding5,
  },
  flist: {flexDirection: 'row', marginBottom: 7, justifyContent: 'flex-start'},
  greydot: {
    width: Dimension.width8,
    height: Dimension.width8,
    borderRadius: Dimension.borderRadius16,
    backgroundColor: Colors.ExtralightGrayText,
    marginRight: 10,
    marginTop: 4,
  },
  listText: {
    fontSize: Dimension.font11,
    width: '90%',
    // flexWrap:'wrap',
    flex: 1,
    lineHeight: Dimension.height16,
    color: Colors.lightGrayText,
    fontFamily: Dimension.CustomMediumFont,
  },
});

export default ProductGridView;
