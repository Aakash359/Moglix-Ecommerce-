import React, {useEffect, useState} from 'react';
import {
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
  View,
  Dimensions,
  InteractionManager,
} from 'react-native';
import {fetchCategoryByCode} from '../../redux/actions/categories';
import {useSelector, useDispatch} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';
import styles from './style';
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Dimension from '../../redux/constants/dimensions';
import Header from '../../components/Common/Header';
import {
  trackStateAdobe,
  webEngageScreenTracking,
  sendClickStreamData,
} from '../../services/analytics';

const CategoriesScreen = props => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState('');

  const categoriesData = useSelector(
    state => state.categoriesReducer['all'].data,
  );
  const categoriesStatus = useSelector(
    state => state.categoriesReducer['all'].status,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchCategoryByCode('all'));
    });
  }, []);

  useEffect(() => {
    if (categoriesStatus == STATE_STATUS.FETCHED) {
      webEngageScreenTracking('AllCategoriesScreen', {});
      trackStateAdobe('moglix:all categories', {
        'myapp.pageName': 'moglix:all categories',
        'myapp.channel': 'home',
        'myapp.subSection': 'moglix:all categories',
      });
      clickStreamPageLoad();
    }
  }, [categoriesStatus]);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'all_categories',
      channel: 'Home',
    };
    sendClickStreamData(dataTracking);
  };

  const renderLoader = () => (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator
        // animating={true}
        size={'large'}
        color={'red'}
        style={styles.activityIndicator}
      />
    </View>
  );

  const renderLeftCards = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setActiveIndex(index);
          setActiveSubIndex('');
        }}>
        <View
          style={[
            index === activeIndex ? styles.ActiveTopCatWrap : styles.TopCatWrap,
          ]}>
          <Image
            source={{
              uri:
                'https://cdn.moglix.com/' +
                (item.categoryDetails || {}).imageURL,
            }}
            style={[
              index === activeIndex ? styles.ActiveTopCatImg : styles.TopCatImg,
            ]}
            placeholderStyle={[
              index === activeIndex ? styles.ActiveTopCatImg : styles.TopCatImg,
            ]}
            resizeMode="contain"
          />
          {isExpanded ? (
            <Text
              style={[
                index === activeIndex
                  ? styles.ActiveTopCatName
                  : styles.TopCatName,
              ]}>
              {(item.categoryDetails || {}).categoryName}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderLeft = () => (
    <View style={isExpanded ? styles.leftPart : styles.leftPartcollapsed}>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={categoriesData}
        maxToRenderPerBatch={12}
        removeClippedSubviews={true}
        initialNumToRender={12}
        renderItem={renderLeftCards}
        keyExtractor={(item, index) => `${index}-item`}
      />
    </View>
  );

  const renderIcons = () => {
    return (
      <FeatherIcons
        name={isExpanded ? 'chevrons-left' : 'chevrons-right'}
        size={28}
        style={styles.expandIcon}
      />
    );
  };

  const renderListHeader = () => {
    return categoriesData && categoriesData[activeIndex] ? (
      <TouchableOpacity
        onPress={() =>
          props.navigation.push('Listing', {
            str: categoriesData[activeIndex].categoryDetails.categoryId,
            type: 'Category',
            category: categoriesData[activeIndex].categoryDetails.categoryId,
            name: categoriesData[activeIndex].categoryDetails.categoryName,
          })
        }
        style={({flexDirection: 'row'}, styles.maintitleactive)}>
        <Text style={[styles.Titlename, styles.maintitle]}>
          {categoriesData[activeIndex] &&
          categoriesData[activeIndex].categoryDetails
            ? categoriesData[activeIndex].categoryDetails.categoryName
            : null}
        </Text>
        <View style={styles.maintitlearrow}>
          <FeatherIcons
            name={'chevron-right'}
            size={24}
            style={styles.mainrightArrow}
          />
        </View>
      </TouchableOpacity>
    ) : null;
  };

  const renderRightSubImages = (propItem, propIndex) => {
    if (
      propItem.children &&
      propItem.children.length &&
      propIndex === activeSubIndex
    ) {
      return (
        <View style={[styles.rightOpenPart, styles.rightsubcatopenpart]}>
          {propItem.children.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.ChildcategoryWrapOpen}
              onPress={() => {
                props.navigation.push('Listing', {
                  str: item.categoryDetails.categoryId,
                  type: 'Category',
                  category: item.categoryDetails.categoryId,
                  name: item.categoryDetails.categoryName,
                });
              }}>
              <Image
                source={{
                  uri:
                    'https://cdn.moglix.com/' + item.categoryDetails.imageURL,
                }}
                style={styles.ChildCatIMgOpen}
                placeholderStyle={styles.ChildCatIMgOpen}
                resizeMode="contain"
              />
              <Text style={styles.ChildCatTextOpen} numberOfLines={2}>
                {item.categoryDetails.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  const renderRightCards = ({item, index}) => (
    <View style={styles.rightOuterPart}>
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (item.children && item.children.length) {
            setActiveSubIndex(index === activeSubIndex ? '' : index);
          } else {
            props.navigation.push('Listing', {
              str: item.categoryDetails.categoryId,
              type: 'Category',
              category: item.categoryDetails.categoryId,
              name: item.categoryDetails.categoryName,
            });
          }
        }}>
        <View style={styles.rightInnerPart}>
          <Text style={styles.catTitleName}>
            {((item || {}).categoryDetails || {}).categoryName}
          </Text>
          {index === activeSubIndex && item.children.length ? (
            <FeatherIcons
              onPress={() =>
                props.navigation.push('Listing', {
                  str: item.categoryDetails.categoryId,
                  type: 'Category',
                  category: item.categoryDetails.categoryId,
                  name: item.categoryDetails.categoryName,
                })
              }
              name={'chevron-down'}
              size={24}
              style={[styles.updownarrowinsubcat, styles.margintop]}
            />
          ) : (
            <FeatherIcons
              onPress={() =>
                props.navigation.push('Listing', {
                  str: item.categoryDetails.categoryId,
                  type: 'Category',
                  category: item.categoryDetails.categoryId,
                  name: item.categoryDetails.categoryName,
                })
              }
              name={'chevron-right'}
              size={24}
              style={[styles.updownarrowinsubcat, styles.margintop]}
            />
          )}
        </View>
      </TouchableOpacity>
      {renderRightSubImages(item, index)}
    </View>
  );

  const renderRight = () => {
    return (
      <FlatList
        data={
          (categoriesData &&
            categoriesData[activeIndex] &&
            categoriesData[activeIndex].children) ||
          []
        }
        renderItem={renderRightCards}
        keyExtractor={(item, index) => `${index}-item`}
        contentContainerStyle={styles.flatListContainerRight}
        ListHeaderComponent={renderListHeader()}
      />
    );
  };

  const renderAllCategories = () => {
    if (categoriesStatus === STATE_STATUS.FETCHED) {
      return (
        <>
          {renderLeft()}
          <TouchableOpacity
            style={styles.doubleicons}
            onPress={() => setIsExpanded(!isExpanded)}>
            {renderIcons()}
          </TouchableOpacity>
          {renderRight()}
        </>
      );
    }
    return renderLoader();
  };

  const renderHeader = () => (
    <Header
      navigation={props.navigation}
      showWishlist
      showSearch
      showLargeSearch
      showCart
    />
  );

  return (
    <View>
      {renderHeader()}
      <View style={styles.mainWrap}>{renderAllCategories()}</View>
    </View>
  );
};

export default CategoriesScreen;
