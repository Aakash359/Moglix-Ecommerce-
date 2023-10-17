import React, {useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchRfq} from '../../redux/actions/rfqs';
import {STATE_STATUS} from '../../redux/constants/index';
import styles from './style';
import Header from '../../components/Common/Header';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';

const RFQScreen = props => {
  const rfqsData = useSelector(state => state.rfqsReducer || {}).data || [];
  const rfqsStatus =
    useSelector(state => state.rfqsReducer || {}).status ||
    STATE_STATUS.FETCHING;
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchRfq(auth.email, auth.userId, auth.phone, auth.sessionId, auth.token),
    );
    trackStateAdobe('moglix:account dashboard-rfq', {
      pageName: 'moglix:account dashboard-rfq',
      channel: 'moglix:home',
      subSection: 'moglix:account dashboard-rfq',
    });
    clickStreamPageLoad();
  }, []);

  const clickStreamPageLoad = () => {
    let dataTracking = {
      event_type: 'page_load',
      label: 'view',
      page_type: 'my_profile',
      channel: 'Dashboard',
    };
    sendClickStreamData(dataTracking);
  };

  const getFormattedDate = mydate => {
    var date = new Date(mydate && mydate.toString().split(' ')[0]);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = (month < 10 ? '0' : '') + month.toString();
    day = (day < 10 ? '0' : '') + day.toString();
    var str = day + '-' + month + '-' + year.toString();
    return str;
  };

  const renderLoader = () => (
    <View style={styles.loaderView}>
      <ActivityIndicator
        // animating={true}
        size={'large'}
        color={'red'}
        style={styles.activityIndicator}
      />
    </View>
  );

  const renderRfq = ({item}) => (
    <TouchableOpacity
      style={styles.rfqListWrap}
      onPress={() =>
        props.navigation.push('Product', {
          msn: item.itemData[0].prodReference,
        })
      }>
      <View style={styles.rfqListBox}>
        <Image
          source={require('../../assets/images/Rfqplaceholder.png')}
          style={styles.rfqPlaceholderImage}
          resizeMode="contain"
        />
        <View style={styles.rfqContent}>
          <Text style={[styles.rfqText, styles.rfqItemName]} numberOfLines={2}>
            {item.itemData[0].productName}
          </Text>
          <Text style={styles.rfqText}>{item.itemData[0].quantity} Qty</Text>
        </View>
      </View>
      <View style={styles.rfqStatus}>
        <Text style={styles.statusType}>{item.statusText}</Text>
        <Text style={styles.statusDate}>
          {getFormattedDate(item.createdDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.noOrders}>
      <View style={styles.whiteBgWithImage}>
        <Image
          source={require('../../assets/images/nosearchillustration.png')}
          style={styles.noOrderImage}
          resizeMode="contain"
        />
        <Text style={styles.noOrderContent}>
          You have not raised any RFQs yet
        </Text>
      </View>
    </View>
  );

  const renderRfqs = () => (
    <FlatList
      data={rfqsData || []}
      keyExtractor={item => item.id}
      renderItem={renderRfq}
      ListEmptyComponent={renderEmptyList}
      contentContainerStyle={{paddingBottom: 90}}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderRfqLayout = () => {
    if (rfqsStatus == STATE_STATUS.FETCHING) {
      return renderLoader();
    } else {
      return renderRfqs();
    }
  };

  return (
    <View>
      <Header
        navigation={props.navigation}
        showBack
        showWishlist
        showCart
        showText={'My RFQs'}
      />
      {/* No RFQs Screen */}
      {/*  */}

      <View style={styles.rfqList}>{renderRfqLayout()}</View>
    </View>
  );
};

export default RFQScreen;
