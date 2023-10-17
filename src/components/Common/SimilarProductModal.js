import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ProductGridView from './ProductGridView';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../redux/constants/dimensions';
import colors from '../../redux/constants/colors';
import {getSimilarProducts} from '../../services/products';
import Modal from 'react-native-modal';

const SimilarProductModal = props => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getShowSimilarProducts();
  }, []);

  const getShowSimilarProducts = async () => {
    const {data} = await getSimilarProducts({
      str: props.productName,
      category: props.category,
    });
    setLoader(false);
    setSimilarProducts(data);
  };

  return (
    <Modal
      onBackButtonPress={props.onClose}
      onBackdropPress={props.onClose}
      isVisible={props.visible}
      style={styles.modalWrap}>
      <View style={styles.modalInner}>
        <View style={styles.modalHeaderFlex}>
          <Text style={styles.modalHeading}>Similar Products</Text>
          <TouchableOpacity style={styles.closeModal} onPress={props.onClose}>
            <MaterialCommunityIcon
              name="close-circle"
              style={styles.closeIcon}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollViewWrap} horizontal={true}>
          {!loader && !((similarProducts || {}).products || []).length ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Dimension.CustomMediumFont,
                  fontSize: Dimension.font12,
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginVertical: Dimension.margin8,
                }}>
                No similar products found
              </Text>
            </View>
          ) : null}
          {((similarProducts || {}).products || []).map(
            (product, productKey) => (
              <ProductGridView
                key={productKey}
                closeModal={props.onClose}
                parentStyles={{
                  width: Dimensions.get('window').width * 0.4,
                }}
                fromViewAll
                fromPdp
                item={product}
                navigation={props.navigation}
              />
            ),
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrap: {
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    margin: 0,
  },
  modalInner: {
    width: Dimension.SCREEN_WIDTH,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    // borderRadius: Dimension.borderRadius10,
    borderTopRightRadius: Dimension.borderRadius10,
    borderTopLeftRadius: Dimension.borderRadius10,
  },
  modalHeaderFlex: {
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding12,
    justifyContent: 'space-between',
  },
  modalHeading: {
    marginLeft: 10,
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font14,
    paddingTop: 5,
    color: colors.PrimaryTextColor,
  },
  scrollViewWrap: {
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding10,
    flex: 1,
  },
  smproductCard: {
    width: Dimension.width130,
    borderRadius: Dimension.borderRadius6,
    borderColor: colors.ProductBorderColor,
    borderWidth: 1,
    marginRight: Dimension.padding10,
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding12,
  },
});

export default SimilarProductModal;
