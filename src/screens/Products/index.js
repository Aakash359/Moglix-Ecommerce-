/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {Text, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchProducts} from '../../redux/actions/products';

const Products = () => {
  const products_state = useSelector(state => state.productsReducer.products);
  const products_status = useSelector(state => state.productsReducer.status);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const renderItem = ({item}) => {
    return (
      <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
        {item.title} 
      </Text>
    );
  };

  const keyExtractor = item => {
    return item.id;
  };

  return (
    <FlatList
      data={products_state}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default Products;
