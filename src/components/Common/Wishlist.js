import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Dimensions,
} from 'react-native';
import ProductGridView from '../Common/ProductGridView';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const deviceWidth = Dimensions.get('window').width;

const WishListCartCard = props => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!props.isLoading) {
      setLoading(false);
    }
  }, [props.isLoading]);

  const {item} = props;

  return (
    <View style={styles.gridViewCard}>
      <ProductGridView item={item} navigation={props.navigation} />

      {!item.oos &&
      !(
        item &&
        item.productDetail &&
        item.productDetail.productBO &&
        item.productDetail.productBO.outOfStock
      ) ? (
        <TouchableOpacity
          style={styles.cartBtnTextForGrid}
          disabled={loading}
          onPress={() => {
            props.addToCartFromWishlist(item);
            setLoading(true);
          }}>
          {loading ? (
            <ActivityIndicator
              size={'small'}
              color={'white'}
              style={{marginRight: 4}}
            />
          ) : null}
          <Text style={styles.cartBtnText}>ADD TO CART</Text>
        </TouchableOpacity>
      ) : null}
      {item.oos ||
      (item &&
        item.productDetail &&
        item.productDetail.productBO &&
        item.productDetail.productBO.outOfStock) ? (
        <TouchableOpacity
          style={[
            styles.cartBtnTextForGrid,
            {
              backgroundColor: '#fff',
              borderTopColor: '#fafafa',
              borderTopWidth: 4,
            },
          ]}
          onPress={() => props.addToCartFromWishlist(item)}>
          <Text style={[styles.cartBtnText, {color: colors.RedThemeColor}]}>
            ASK BEST PRICE
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const WishlistCart = props => {
  const renderItemGrid = ({item}) => (
    <>
      <WishListCartCard {...props} item={item} />
    </>
  );

  return (
    <Modal
      overlayPointerEvents={'auto'}
      isVisible={props.wishList}
      onTouchOutside={() => {
        props.setWishListModal();
      }}
      onDismiss={() => {
        props.setWishListModal();
      }}
      onBackdropPress={() => props.setWishListModal()}
      onBackButtonPress={() => props.setWishListModal()}
      coverScreen={true}
      style={styles.modalWrap}
      deviceWidth={deviceWidth}
      hasBackdrop={true}
      swipeDirection={'down'}
      onSwipeComplete={() => {
        props.setWishListModal();
      }}>
      <View style={styles.modalView}>
        <View style={styles.modalViewInner}>
          <View style={styles.ModalContentWrap}>
            <View style={styles.signUpWrap}>
              <View style={styles.textView}>
                <View style={styles.sortBy}>
                  <Text style={styles.Title}>Add From Wishlist</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      props.setWishListModal();
                    }}>
                    <MaterialCommunityIcon
                      name="close-circle"
                      style={styles.modalClose}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList
                data={props.wishlistData}
                keyExtractor={(item, index) => 'key' + index}
                renderItem={renderItemGrid}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cartBtn: {
    position: 'absolute',
    right: 40,
    zIndex: 2,
    bottom: 35,
    backgroundColor: colors.RedThemeColor,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Dimension.padding15,
    borderRadius: Dimension.borderRadius4,
  },
  modalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    margin: 0,
  },
  modalClose: {
    fontSize: 20,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    position: 'relative',
    width: '100%',
  },
  modalViewInner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  Title: {
    fontSize: Dimension.font14,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Dimension.padding15,
  },
  sortBy: {paddingBottom: Dimension.padding15},
  signUpWrap: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: Dimension.padding15,
  },
  ModalContentWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    backgroundColor: colors.PrimaryTextColor,
  },
  cartBtnText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#fff',
  },
  flatListView: {marginVertical: 15},
  gridViewCard: {
    flexBasis: '50%',
    paddingHorizontal: Dimension.padding20,
    width: Dimension.width185,
    paddingTop: Dimension.padding15,
    position: 'relative',
    marginBottom: Dimension.margin60,
    marginLeft: -Dimension.margin12,
    marginRight: -Dimension.margin18,
  },
  cartBtnTextForGrid: {
    width: '100%',
    backgroundColor: colors.RedThemeColor,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Dimension.padding15,
    borderBottomLeftRadius: Dimension.borderRadius8,
    borderBottomRightRadius: Dimension.borderRadius8,
    bottom: -30,
    position: 'absolute',
    left: 21,
    flexDirection: 'row',
  },
});

export default WishlistCart;
