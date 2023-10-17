import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import SectionTitle from './SectionTitle';

const Varients = props => {
  const {productData, styles, refetchWithMsn} = props;

  return (
    <View
      style={{
        marginTop: Dimension.margin10,
        backgroundColor: '#fff',
        paddingHorizontal: Dimension.padding12,
        paddingTop: Dimension.padding10,
        paddingBottom:Dimension.padding8,
      }}>
      {productData.filterAttributesList.map((filter, filterKey) => (
        <View key={filterKey}>
          <SectionTitle Title={`Select `+ filter.name} style={styles.variantTitle} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{marginTop: Dimension.margin6, marginBottom:Dimension.margin10}}>
            {filter.items.map((filterItem, filterItemKey) => (
              <TouchableOpacity
                onPress={() =>
                  !filterItem.selected && refetchWithMsn(filterItem.msn)
                }
                key={filterItemKey}
                style={[
                  filterItem.selected ? styles.btnSelected : styles.sizeBtn,
                  filterItem.active ? {} : styles.inactiveAttrBtn,
                ]}>
                <Text
                  style={[
                    filterItem.selected
                      ? styles.sizetextSelected
                      : styles.sizetext,
                    filterItem.active ? {} : styles.inactiveAttrBtnText,
                  ]}>
                  {filterItem.value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};




export default Varients;
