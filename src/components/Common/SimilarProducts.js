import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {getSimilarProducts} from '../../services/products';
import {setProductSimilarProducts} from '../../redux/actions/products';
import {useDispatch, useSelector} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';
import SectionTitle from './SectionTitle';
import colors from '../../redux/constants/colors';
import ProductListView from './ProductListView';

const SimilarProducts = props => {
  const dispatch = useDispatch();
  const similarProducts = useSelector(
    state => state.productsReducer[props.msn].similarProducts || {},
  );

  const [showSimilarProducts, setShowSimilarProducts] = useState(false);

  useEffect(() => {
    if (!similarProducts || similarProducts.status !== STATE_STATUS.FETCHED) {
      getShowSimilarProducts();
    } else {
      if (similarProducts.data) {
        setShowSimilarProducts(true);
      }
    }
  }, []);

  const getShowSimilarProducts = async () => {
    const {data} = await getSimilarProducts({
      str: props.productName,
      category: props.category,
    });
    if (data) {
      dispatch(setProductSimilarProducts(props.msn, data));
      setShowSimilarProducts(true);
    }
  };

  if (!showSimilarProducts) {
    return null;
  }

  const renderProduct = ({item, index}) => {
    return (
      <ProductListView
        fromViewAll
        fromPdp
        item={item}
        navigation={props.navigation}
        fromSimilarPdp
      />
    );
  };

  return ((similarProducts.data || {}).products || []).length ? (
    <View style={styles.shippingStripWrap}>
      <SectionTitle Title={'Similar Products'} />
      <FlatList
        horizontal={true}
        data={(similarProducts.data || {}).products || []}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `key-${index}`}
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  shippingStripWrap: {
    padding: Dimension.padding12,
    marginTop: Dimension.margin12,
    // flexDirection: 'row',
  },
});

export default SimilarProducts;
