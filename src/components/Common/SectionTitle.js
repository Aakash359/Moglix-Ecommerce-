import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../redux/constants/colors';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import ProductListView from '../Common/ProductListView';
import colors from '../../redux/constants/colors';

const SectionTitle = props => {
  const [viewAllModal, setViewAllModal] = useState(false);

  const renderItem = ({item}) => (
    <ProductListView
      fromHome
      fromViewAll={true}
      parentStyles={styles.flatListCard}
      item={item}
      navigation={props.navigation}
    />
  );

  // console.log(props.Title, props, 'cewcweewcw');

  return (
    <View style={styles.SectionTitleWrap}>
      <Text style={styles.SectionTitleText}>{props.Title}</Text>
      {props.goToCart ? (
        <TouchableOpacity
          onPress={() => props.navigation.push('Cart')}
          style={styles.goToCart}>
          <Text style={styles.addToCartText}>GO TO CART</Text>
        </TouchableOpacity>
      ) : null}
      {props.viewAll ? (
        <TouchableOpacity
          style={styles.ViewAllBtn}
          onPress={() => {
            if (
              props.viewAllLazy &&
              props.redirectPageName &&
              props.redirectPageData
            ) {
              NavigationService.navigate(
                props.redirectPageName,
                props.redirectPageData,
                props.redirectPageName + '_' + new Date().getTime(),
              );
            } else {
              setViewAllModal(true);
              // props.titleViewAllPressed();
            }
          }}>
          <TouchableOpacity onPress={() => setViewAllModal(!viewAllModal)}>
            <Text style={styles.ViewAllBtnText}>VIEW ALL</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}
      {viewAllModal && (
        <Modal
          overlayPointerEvents={'auto'}
          coverScreen={true}
          style={styles.viewAllModalWrap}
          deviceWidth={deviceWidth}
          hasBackdrop={true}
          isVisible={viewAllModal}
          onRequestClose={() => {
            setViewAllModal(false);
          }}
          onBackButtonPress={() => {
            setViewAllModal(false);
          }}
          onDismiss={() => {
            setViewAllModal(false);
          }}>
          <View style={styles.modalHeader}>
            <Text style={styles.headText}>All Products</Text>
            <TouchableOpacity onPress={() => setViewAllModal(!viewAllModal)}>
              <Icon size={22} color={'#000'} name={'close-circle'} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={props.data}
            keyExtractor={(item, index) => `${index}-item`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  SectionTitleText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.PrimaryTextColor,
    textTransform: 'capitalize',
  },
  SectionTitleWrap: {justifyContent: 'space-between', flexDirection: 'row'},
  ViewAllBtn: {
    backgroundColor: Colors.LightRedThemeColor,
    paddingHorizontal: Dimension.padding10,
    paddingVertical: Dimension.padding5,
    borderRadius: 4,
  },
  ViewAllBtnText: {
    textTransform: 'uppercase',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.RedThemeColor,
  },
  viewAllModalWrap: {flex: 1, margin: 0, backgroundColor: colors.brandbg},
  // modalInnerView:{position:'relative', paddingTop:15, },
  modalHeader: {
    height: 60,
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: Dimension.padding12,
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 2,
  },
  headText: {
    fontSize: Dimension.font14,
    color: colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  flatListCard: {
    marginBottom: 15,
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 0.5,
  },
  goToCart: {
    paddingHorizontal: Dimension.padding10,
    backgroundColor: colors.RedThemeColor,
    paddingVertical: Dimension.padding8,
    borderRadius: Dimension.borderRadius4,
    flexDirection: 'row',
    // width: 'auto',
    // height: 30,
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: Dimension.font12,
    color: '#fff',
    fontFamily: Dimension.CustomRobotoBold,
  },
});

export default SectionTitle;
