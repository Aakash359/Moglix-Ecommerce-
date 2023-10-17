import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import {getRelatedCategories} from '../../services/products';
import {setProductRelatedCategories} from '../../redux/actions/products';
import {useDispatch, useSelector} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';
import SectionTitle from './SectionTitle';
import Category from './Category';

const RelatedCategories = props => {
  const dispatch = useDispatch();
  const relatedCategories = useSelector(
    state => state.productsReducer[props.msn].relatedCategories || {},
  );

  const [showRelatedCategories, setShowRelatedCategories] = useState(false);

  useEffect(() => {
    if (
      !relatedCategories ||
      relatedCategories.status !== STATE_STATUS.FETCHED
    ) {
      getShowRelatedCategories();
    } else {
      if (relatedCategories.data) {
        setShowRelatedCategories(true);
      }
    }
  }, []);

  const getShowRelatedCategories = async () => {
    const {data} = await getRelatedCategories({catId: props.category});
    if (data.mostSoledCategories) {
      dispatch(
        setProductRelatedCategories(props.msn, data.mostSoledCategories),
      );
      setShowRelatedCategories(true);
    }
  };

  if (!showRelatedCategories) {
    return null;
  }

  const renderProduct = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.productWrap}
        onPress={() =>
          props.navigation.push(
            'Product',
            {msn: item.moglixPartNumber},
            `${Math.random()}`,
          )
        }>
        <Text numberOfLines={2}>{item.productName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.shippingStripWrap}>
      <SectionTitle Title={'Related Categories'} />
      <Category data={relatedCategories.data} navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  shippingStripWrap: {
    padding: Dimension.padding12,
    // marginTop: Dimension.margin10,
    // flexDirection: 'row',
  },
  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: Dimension.margin12,
    alignSelf: 'center',
  },
  productWrap:{
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: Dimension.padding8,
    marginVertical: Dimension.margin12,
    marginRight: Dimension.margin12,
  },
  catName:{fontSize:Dimension.font12}
});

export default RelatedCategories;
