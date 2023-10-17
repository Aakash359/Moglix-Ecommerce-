import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import {
  getShipmentTracking,
  cancelReasonsApi,
  cancelItem,
} from '../../services/orders';
import Header from '../../components/Common/Header';
import {trackStatusKeyName} from '../../constants/index';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import ReturnExchange from '../../components/Common/ReturnExchange';
import ReturnExchangeSuccess from '../../components/Common/ReturnExchangeSuccess';
import Cancel from '../../components/Common/Cancel';
import {fetchOrderDetails} from '../../redux/actions/orders';
import {fetchProduct} from '../../redux/actions/products';
const deviceWidth = Dimensions.get('window').width;
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import {applyThousandSeparator, ORDER_STATUSES} from '../../generic';
import {addtoCart} from '../../generic/Cart';
import {getProduct} from '../../services/products';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {
  trackStateAdobe,
  sendClickStreamData,
  webEngageTracking,
} from '../../services/analytics';
import {setOrderedTime} from '../../redux/actions/orders';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
import colors from '../../redux/constants/colors';

const OrderDetailsScreen = props => {
  const order_params = useSelector(
    state =>
      (((state.ordersReducer || {}).activeOrder || []).length &&
        ((state.ordersReducer || {}).activeOrder || []).find(
          _ =>
            _.product_msn == props.route.params.order.productId &&
            _.item_id == props.route.params.order.itemId,
        )) ||
      {},
  );

  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const cart = useSelector(state => (state.cartReducer || {}).data || {});

  const dispatch = useDispatch();
  // order_params.cancel_active = true;
  // order_params.status = 'EXCHANGE REQUESTED';
  // order_params.requestType = 'exchange';
  // order_params.show_return_exchange = false;
  // order_params.dates = {
  //   accepted: {date: '15-Sep-2021', flag: true},
  //   confirmed: {date: '15-Sep-2021', flag: true},
  //   shipped: {date: '20-Sep-2021', flag: true},
  //   delivered: {date: '20-Sep-2021', flag: true},
  // };

  const [orderStatus, setOrderStatus] = useState([]);
  const [shipmentData, setShipmentData] = useState([]);
  const [tracknowModal, setTracknowModal] = useState(false);
  const [remodal, setReModal] = useState(false);
  const [exModal, setExModal] = useState(false);
  const [reSuccessModal, setReSuccessModal] = useState(false);
  const [exSuccessModal, setExSuccessModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [trackStatusdata, setTrackStatusdata] = useState({});
  const [buyAgainLoading, setIsBuyAgainLoading] = useState(false);
  // const [cancelActive, setCancelActive] = useState(true);

  useEffect(() => {
    // orderStatusTransform(order_params);
    getCancelReasons();
    // generateTrackData();
  }, []);

  useEffect(() => {
    orderStatusTransform(order_params);
    // getCancelReasons();
    generateTrackData();
  }, [order_params.status, order_params.requestType]);

  const getCancelReasons = async () => {
    const {data} = await cancelReasonsApi(sessionId, token);
    setCancelReasons(data);
  };

  useEffect(() => {
    console.log('status', order_params);
  });

  const getActiveStatus = detail => {
    let trackOrderBoxDetail = {};
    if (detail.status == 'PAYMENT FAILED') {
      trackOrderBoxDetail.firstDate = detail.dates.accepted.date;
      trackOrderBoxDetail.firstDateLabel = 'Payment Failed';
    }
    if (detail && detail.dates && detail.requestType !== 'cancel') {
      if (detail.requestType === 'forward') {
        if ((((detail || {}).dates || {}).accepted || {}).flag) {
          trackOrderBoxDetail.firstDate = detail.dates.accepted.date;
          trackOrderBoxDetail.firstDateLabel = 'Ordered';
          if ((((detail || {}).dates || {}).confirmed || {}).flag) {
            trackOrderBoxDetail.firstDate = detail.dates.confirmed.date;
            trackOrderBoxDetail.firstDateLabel = 'Processed';
            if (detail.status === 'PACKED') {
              trackOrderBoxDetail.firstDate = '';
              trackOrderBoxDetail.firstDateLabel = 'Packed';
            }
            if ((((detail || {}).dates || {}).shipped || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.shipped.date;
              trackOrderBoxDetail.firstDateLabel = 'Shipped';
            }
            if ((((detail || {}).dates || {}).delivered || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.delivered.date;
              trackOrderBoxDetail.firstDateLabel = 'Delivered';
            }
          }
        }
        if (
          detail.status !== 'RETURN REJECTED' &&
          detail.status !== 'EXCHANGE REJECTED'
        ) {
          if (
            (((detail || {}).dates || {}).delivered || {}).flag &&
            detail.status == 'DELIVERED'
          ) {
            trackOrderBoxDetail.firstDateLabel = 'Delivered';
            trackOrderBoxDetail.firstDate = detail.dates.delivered.date;
            trackOrderBoxDetail.lastDate = detail.dates.delivered.date;
          } else {
            trackOrderBoxDetail.lastDateLabel = 'ETD';
            trackOrderBoxDetail.lastDate = detail.dates.delivered.date;
            trackOrderBoxDetail.lastDateFlag = (
              ((detail || {}).dates || {}).delivered || {}
            ).flag;
          }
        } else {
          trackOrderBoxDetail.lastDateLabel =
            detail.status == 'RETURN REJECTED'
              ? 'Return Rejected:'
              : detail.status == 'EXCHANGE REJECTED'
              ? 'Exchange Rejected'
              : 'Rejected:';
          trackOrderBoxDetail.lastDate = detail.dates.re_ex_rejected.date || '';
          trackOrderBoxDetail.lastDateFlag = true;
        }
      } else {
        if (detail.requestType == 'return') {
          if ((((detail || {}).dates || {}).re_ex_requested || {}).flag) {
            trackOrderBoxDetail.firstDate = detail.dates.re_ex_requested.date;
            trackOrderBoxDetail.firstDateLabel = 'Return Initiated';

            if ((((detail || {}).dates || {}).re_ex_approved || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.re_ex_approved.date;
              trackOrderBoxDetail.firstDateLabel = 'Return Approved';

              if ((((detail || {}).dates || {}).re_ex_picked || {}).flag) {
                trackOrderBoxDetail.firstDate = detail.dates.re_ex_picked.date;
                trackOrderBoxDetail.firstDateLabel = 'Return Picked';
                if ((((detail || {}).dates || {}).return_done || {}).flag) {
                  trackOrderBoxDetail.firstDate = detail.dates.return_done.date;
                  trackOrderBoxDetail.firstDateLabel = 'Return Done';
                }
              }
            }
          }
        } else if (detail.requestType == 'exchange') {
          if ((((detail || {}).dates || {}).re_ex_requested || {}).flag) {
            trackOrderBoxDetail.firstDate = detail.dates.re_ex_requested.date;
            trackOrderBoxDetail.firstDateLabel =
              order_params.status; /* 'Exchange Initiated' */

            if ((((detail || {}).dates || {}).re_ex_approved || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.re_ex_approved.date;
              trackOrderBoxDetail.firstDateLabel = 'Exchange Approved';
              if ((((detail || {}).dates || {}).re_ex_picked || {}).flag) {
                trackOrderBoxDetail.firstDate = detail.dates.re_ex_picked.date;
                trackOrderBoxDetail.firstDateLabel = 'Exchange Picked';
                if ((((detail || {}).dates || {}).exchange_done || {}).flag) {
                  trackOrderBoxDetail.firstDate =
                    detail.dates.exchange_done.date;
                  trackOrderBoxDetail.firstDateLabel = 'Exchange Done';
                }
              }
            }
          }
        }
      }
    } else if (detail && detail.dates && detail.requestType === 'cancel') {
      if ((((detail || {}).dates || {}).accepted || {}).flag) {
        trackOrderBoxDetail.firstDate = detail.dates.accepted.date;
        if ((((detail || {}).dates || {}).confirmed || {}).flag) {
          trackOrderBoxDetail.firstDate = detail.dates.confirmed.date;
          if ((((detail || {}).dates || {}).shipped || {}).flag) {
            trackOrderBoxDetail.firstDate = detail.dates.shipped.date;
          }
        }
      }
    }
    return (
      <View style={styles.oCommonWraper}>
        <View>
          <Text>{trackOrderBoxDetail.firstDateLabel}</Text>
          <Text>{trackOrderBoxDetail.firstDate}</Text>
          <View style={styles.oCommonWraperFst}></View>
        </View>
        <View style={styles.oCommonWraperSec}></View>

        <View
          style={[
            styles.oCommonWraperThrd,
            {
              backgroundColor:
                detail.status === 'DELIVERED' ? 'green' : '#e7e7e7',
            },
          ]}></View>

        <View>
          <Text>{trackOrderBoxDetail.lastDateLabel}</Text>
          <Text>{trackOrderBoxDetail.lastDate}</Text>
          <View
            style={[
              styles.oCommonWraperFrth,
              {
                backgroundColor:
                  detail.status === 'DELIVERED' ? 'green' : '#fff',
              },
            ]}></View>
        </View>
      </View>
    );
  };

  const fetchOrderStatus = () => {
    // if (
    //   order_params.status == 'SHIPPED' ||
    //   order_params.status == 'DELIVERED'
    // ) {
    setTracknowModal(true);
    //   const {data} = await getShipmentTracking(``, sessionId, token);
    // }
  };

  const orderStatusTransform = order_params => {
    const {dates, requestType, status} = order_params;
    let trackStatus = [];
    let i = 0;
    let furtherTrail = true;
    let successStatus =
      status !== 'RETURN REJECTED' && status !== 'EXCHANGE REJECTED';
    for (let key in dates) {
      let date = dates[key]['date'];
      let barStatus = dates[key]['flag'];
      if (key) {
        if (requestType === 'forward' && successStatus) {
          if (i < 4) {
            if (key === 'shipped') {
              trackStatus.push({
                name: 'packed',
                date: '',
                barStatus:
                  status === 'PACKED' ? true : barStatus ? true : false,
              });
            }
            trackStatus.push({
              name: key,
              date,
              barStatus,
            });
          }
        } else if (i > 2) {
          if (successStatus && key !== 're_ex_rejected') {
            trackStatus.push({
              name: successStatus
                ? requestType + '_' + key
                : status === 'RETURN REJECTED'
                ? requestType + 'R_' + key
                : requestType + 'E_' + key,
              date,
              barStatus,
            });
          } else if (
            status === 'RETURN REJECTED' ||
            status === 'EXCHANGE REJECTED'
          ) {
            if (furtherTrail) {
              trackStatus.push({
                name: successStatus
                  ? requestType + '_' + key
                  : status === 'RETURN REJECTED'
                  ? requestType + 'R_' + key
                  : requestType + 'E_' + key,
                date,
                barStatus: true,
              });
            }
            if (key === 're_ex_rejected') {
              furtherTrail = false;
            }
          }
        }
        i++;
      }
    }

    trackStatus = trackStatus.map((item, i) => {
      if (!item['barStatus']) {
        item['cClass'] = 'grdashed';
      } else if (
        ((requestType == 'return' || requestType == 'exchange') &&
          i !== 0 &&
          item['barStatus']) ||
        ((status === 'RETURN REJECTED' || status === 'EXCHANGE REJECTED') &&
          item['name'] !== 'Delivered' &&
          i !== 0)
      ) {
        item['cClass'] = 'yellsolid';
      } else if (
        requestType == 'forward' &&
        item['barStatus'] &&
        successStatus
      ) {
        item['cClass'] = 'grsolid';
      }
      return item;
    });
    setOrderStatus(trackStatus);
  };

  const generateTrackData = () => {
    let detail = order_params;
    let trackOrderBoxDetail = {};
    if (order_params.status == 'PAYMENT FAILED') {
      trackOrderBoxDetail.firstDate = detail?.dates?.accepted?.date;
      trackOrderBoxDetail.firstDateLabel = 'Payment Failed';
    } else {
      if (detail && detail.dates && detail.requestType !== 'cancel') {
        if (detail.requestType === 'forward') {
          if ((((detail || {}).dates || {}).accepted || {}).flag) {
            trackOrderBoxDetail.firstDate = detail.dates.accepted.date;
            trackOrderBoxDetail.firstDateLabel = 'Ordered';
            if ((((detail || {}).dates || {}).confirmed || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.confirmed.date;
              trackOrderBoxDetail.firstDateLabel = 'Processed';
              if (detail.status === 'PACKED') {
                trackOrderBoxDetail.firstDate = '';
                trackOrderBoxDetail.firstDateLabel = 'Packed';
              }
              if ((((detail || {}).dates || {}).shipped || {}).flag) {
                trackOrderBoxDetail.firstDate = detail.dates.shipped.date;
                trackOrderBoxDetail.firstDateLabel = 'Shipped';
              }
              if ((((detail || {}).dates || {}).delivered || {}).flag) {
                trackOrderBoxDetail.firstDate = detail.dates.delivered.date;
                trackOrderBoxDetail.firstDateLabel = 'Delivered';
              }
            }
          }
          if (
            detail.status !== 'RETURN REJECTED' &&
            detail.status !== 'EXCHANGE REJECTED'
          ) {
            if (
              (((detail || {}).dates || {}).delivered || {}).flag &&
              detail.status == 'DELIVERED'
            ) {
              trackOrderBoxDetail.firstDateLabel = 'Delivered';
              trackOrderBoxDetail.firstDate = detail.dates.delivered.date;
              trackOrderBoxDetail.lastDate = detail.dates.delivered.date;
            } else {
              trackOrderBoxDetail.lastDateLabel = 'ETD';
              trackOrderBoxDetail.lastDate = detail.dates.delivered.date;
              trackOrderBoxDetail.lastDateFlag = (
                ((detail || {}).dates || {}).delivered || {}
              ).flag;
            }
          } else {
            trackOrderBoxDetail.lastDateLabel =
              detail.status == 'RETURN REJECTED'
                ? 'Return Rejected:'
                : detail.status == 'EXCHANGE REJECTED'
                ? 'Exchange Rejected'
                : 'Rejected:';
            trackOrderBoxDetail.lastDate =
              detail.dates.re_ex_rejected.date || '';
            trackOrderBoxDetail.lastDateFlag = true;
          }
        } else {
          if (detail.requestType == 'return') {
            if ((((detail || {}).dates || {}).re_ex_requested || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.re_ex_requested.date;
              trackOrderBoxDetail.firstDateLabel = 'Return Initiated';

              if ((((detail || {}).dates || {}).re_ex_approved || {}).flag) {
                trackOrderBoxDetail.firstDate =
                  detail.dates.re_ex_approved.date;
                trackOrderBoxDetail.firstDateLabel = 'Return Approved';
                if ((((detail || {}).dates || {}).re_ex_picked || {}).flag) {
                  trackOrderBoxDetail.firstDate =
                    detail.dates.re_ex_picked.date;
                  trackOrderBoxDetail.firstDateLabel = 'Return Picked';
                  if ((((detail || {}).dates || {}).return_done || {}).flag) {
                    trackOrderBoxDetail.firstDate =
                      detail.dates.return_done.date;
                    trackOrderBoxDetail.firstDateLabel = 'Return Done';
                  }
                }
              }
            }
          } else if (detail.requestType == 'exchange') {
            if ((((detail || {}).dates || {}).re_ex_requested || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.re_ex_requested.date;
              trackOrderBoxDetail.firstDateLabel =
                order_params.status; /* 'Exchange Initiated' */

              if ((((detail || {}).dates || {}).re_ex_approved || {}).flag) {
                trackOrderBoxDetail.firstDate =
                  detail.dates.re_ex_approved.date;
                trackOrderBoxDetail.firstDateLabel = 'Exchange Approved';
                if ((((detail || {}).dates || {}).re_ex_picked || {}).flag) {
                  trackOrderBoxDetail.firstDate =
                    detail.dates.re_ex_picked.date;
                  trackOrderBoxDetail.firstDateLabel = 'Exchange Picked';
                  if ((((detail || {}).dates || {}).exchange_done || {}).flag) {
                    trackOrderBoxDetail.firstDate =
                      detail.dates.exchange_done.date;
                    trackOrderBoxDetail.firstDateLabel = 'Exchange Done';
                  }
                }
              }
            }
          }
        }
      } else if (detail && detail.dates && detail.requestType === 'cancel') {
        if ((((detail || {}).dates || {}).accepted || {}).flag) {
          trackOrderBoxDetail.firstDate = detail.dates.accepted.date;
          if ((((detail || {}).dates || {}).confirmed || {}).flag) {
            trackOrderBoxDetail.firstDate = detail.dates.confirmed.date;
            if ((((detail || {}).dates || {}).shipped || {}).flag) {
              trackOrderBoxDetail.firstDate = detail.dates.shipped.date;
            }
          }
        }
      }
    }
    setTrackStatusdata(trackOrderBoxDetail);
  };

  const getUpdatedFormattedDate = propDate => {
    let day = propDate.split('-')[0];
    let year = propDate.split('-')[2];
    let month = propDate.split('-')[1];
    return `${day} ${month} ${year}`;
  };

  const getFormattedDate = (youdate, removeDash) => {
    const monthNames = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var mydate = JSON.stringify(youdate);
    var res = mydate.split('T')[0];
    var res2 = res.split('-');
    var month = res2[1];
    /* var month = date.getMonth() + 1; */
    if (res2[1] < 10) {
      month = res2[1] % 10;
    }
    if (removeDash) {
      res = res2[2] + ' ' + monthNames[month] + ' ' + res2[0].substring(1);
    } else {
      res = res2[2] + '-' + monthNames[month] + '-' + res2[0].substring(1);
    }
    return res;
  };

  const getStatusModalLeft = () => {
    let trackData = [];

    if (orderStatus.length || shipmentData.length) {
      trackData = [...orderStatus, ...shipmentData];
      return [...trackData].reverse().map((status, i) => {
        if (status.name == 'delivered' && trackData.length > 5) {
          return null;
        }
        let circleClass = styles.grayCircle;
        let lineClass = status.location
          ? styles.greenLineSmall
          : styles.grayLine;
        switch (status.cClass) {
          case 'grsolid':
            circleClass = styles.greenCircle;
            lineClass = status.location
              ? styles.greenLineSmall
              : styles.greenLine;
            break;
          case 'grdashed':
            circleClass = styles.grayCircle;
            break;
          case 'yellsolid':
            circleClass = styles.orangeCircle;
            lineClass = styles.orangeLine;
            break;
        }
        if (
          ['In Transit', 'Delivered', 'Out For Delivery', 'Booked'].includes(
            status.status,
          )
        ) {
          circleClass = styles.greenCircle;
          lineClass = styles.greenLine;
        }
        if (i == 4 && trackData && trackData.length > 6) {
          circleClass = styles.greenCircle;
          lineClass = status.location
            ? styles.greenLineSmall
            : styles.greenLine;
        }
        if (trackData.length <= 5 && i == 5 && status.cClass == 'grdashed') {
          circleClass = styles.greenCircle;
        }
        if (status.location) {
          circleClass =
            status.status == 'Delivered'
              ? styles.greenCircle
              : styles.grayCircle;
          lineClass = styles.greenLineSmall;
        }
        if (
          trackStatusKeyName[status.name] == 'Delivered' &&
          !status.barStatus
        ) {
          circleClass = styles.grayCircle;
        }
        if (i < trackData.length) {
          return (
            <View style={styles.getStatusModalLeftWrap}>
              <Text style={styles.getStatusModalLeftWrapFst}>
                {status.date
                  ? getUpdatedFormattedDate(status.date)
                  : status.statusUpdateTime
                  ? getFormattedDate(status.statusUpdateTime, true)
                  : null}
              </Text>

              <View style={styles.getStatusModalLeftWrapSec}>
                {status.status != 'Delivered' &&
                status.name != 'delivered' &&
                status.name != 'return_return_done' &&
                status.name != 'exchange_re_ex_picked' &&
                status.name != 'forwardR_re_ex_rejected' &&
                status.name != 'forwardE_re_ex_rejected' ? (
                  <View
                    style={[
                      status.location ? styles.smallLine : styles.Line,
                      lineClass,
                    ]}></View>
                ) : null}
                <View style={[styles.cricle, circleClass]}></View>
              </View>

              <View style={styles.getStatusModalLeftWrapThrd}>
                {status.location && status.location != '' ? (
                  <View></View>
                ) : null}
                {status.barStatus || status.name ? (
                  <Text style={styles.getStatusModalLeftWrapThrdF}>
                    {trackStatusKeyName[status.name] == 'Delivered' &&
                    !status.barStatus
                      ? 'ETD'
                      : trackStatusKeyName[status.name]}
                  </Text>
                ) : (
                  <View>
                    <Text style={styles.getStatusModalLeftWrapThrdS}>
                      {status.location}
                    </Text>
                    <Text style={styles.getStatusModalLeftWrapThrdS}>
                      {status.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        } else {
          return <View style={[styles.cricle, circleClass]}></View>;
        }
      });
    }
  };

  const showReturn = inputDate => {
    let months = [
      {l: 'Jan', k: 1, nk: '01'},
      {l: 'Feb', k: 2, nk: '02'},
      {l: 'Mar', k: 3, nk: '03'},
      {l: 'Apr', k: 4, nk: '04'},
      {l: 'May', k: 5, nk: '05'},
      {l: 'Jun', k: 6, nk: '06'},
      {l: 'Jul', k: 7, nk: '07'},
      {l: 'Aug', k: 8, nk: '08'},
      {l: 'Sep', k: 9, nk: '09'},
      {l: 'Oct', k: 10, nk: '10'},
      {l: 'Nov', k: 11, nk: '11'},
      {l: 'Dec', k: 12, nk: '12'},
    ];
    let newYear = inputDate.split('-')[2];
    let newDate = inputDate.split('-')[0];
    let newMonth = months.find(_ => _.l == inputDate.split('-')[1]).k;
    let newMonthKey = months.find(_ => _.l == inputDate.split('-')[1]).nk;

    try {
      let currDate = new Date();
      let deliveryDate = new Date(
        `${inputDate.split('-')[2]}-${newMonthKey}-${inputDate.split('-')[0]}`,
      );
      if (
        currDate &&
        currDate.getTime &&
        deliveryDate &&
        deliveryDate.getTime
      ) {
        const diffTime = Math.abs(currDate.getTime() - deliveryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays && diffDays < 8) {
          return true;
        } else if (diffDays && diffDays >= 8) {
          return false;
        }
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }

    let curr = new Date();

    if (curr.getFullYear() > newYear) {
      return false;
    }

    if (curr.getMonth() + 1 > newMonth) {
      return false;
    }
    if (curr.getDate() - newDate <= 8) {
      return true;
    }
    return false;
  };

  const getReturnReasons = deliveryDate => {
    let months = [
      {l: 'Jan', k: 1, nk: '01'},
      {l: 'Feb', k: 2, nk: '02'},
      {l: 'Mar', k: 3, nk: '03'},
      {l: 'Apr', k: 4, nk: '04'},
      {l: 'May', k: 5, nk: '05'},
      {l: 'Jun', k: 6, nk: '06'},
      {l: 'Jul', k: 7, nk: '07'},
      {l: 'Aug', k: 8, nk: '08'},
      {l: 'Sep', k: 9, nk: '09'},
      {l: 'Oct', k: 10, nk: '10'},
      {l: 'Nov', k: 11, nk: '11'},
      {l: 'Dec', k: 12, nk: '12'},
    ];
    let newMonthKey = months.find(_ => _.l == deliveryDate.split('-')[1]).nk;
    let currDate = new Date();
    deliveryDate = new Date(
      `${deliveryDate.split('-')[2]}-${newMonthKey}-${
        deliveryDate.split('-')[0]
      }`,
    );

    const diffTime = Math.abs(currDate.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) {
      return [
        {id: 1, text: 'Product Damaged/Item Broken'},
        {id: 2, text: 'Wrong Item sent'},
        {id: 3, text: 'Parts or Accessories missing'},
        {id: 4, text: 'Item is defective'},
      ];
    }
    return [
      {id: 3, text: 'Parts or Accessories missing'},
      {id: 4, text: 'Item is defective'},
    ];
  };

  const toggleModal = obj => {
    if (obj.requestType == 'exchange') {
      setExModal(false);
      setExSuccessModal(true);

      if (obj) {
        obj.dates = {...order_params.dates, ...obj.dates};

        dispatch(
          fetchOrderDetails(userId, order_params.order_id, sessionId, token),
        );
        dispatch(setOrderedTime(new Date().getTime()));
        // console.log(obj.dates);
        // getActiveStatus({
        //   ...order_params,
        //   dates: obj.dates,
        // });
        // orderStatusTransform({
        //   ...order_params,
        //   dates: obj.dates,
        // });
      }
    } else {
      setReModal(false);
      setReSuccessModal(true);

      if (obj) {
        obj.dates = {...order_params.dates, ...obj.dates};
        dispatch(
          fetchOrderDetails(userId, order_params.order_id, sessionId, token),
        );
        dispatch(setOrderedTime(new Date().getTime()));
        // console.log(obj.dates);
        // getActiveStatus({
        //   ...order_params,
        //   dates: obj.dates,
        // });
        // orderStatusTransform({
        //   ...order_params,
        //   dates: obj.dates,
        // });
      }
    }
  };

  const cancelOrder = async reason_id => {
    if (!reason_id) {
      return;
    }

    const {data} = await cancelItem(
      {customer_id: userId, item_id: order_params.item_id, reason_id},
      sessionId,
      token,
    );

    if (data.status) {
      dispatch(
        fetchOrderDetails(
          userId,
          order_params && order_params.order_id,
          sessionId,
          token,
        ),
      );
      //comments
      dispatch(setOrderedTime(new Date().getTime()));
    }
  };

  const onBuyAgain = async () => {
    setIsBuyAgainLoading(true);
    const productBoData = await getProduct(order_params.product_msn);
    let productData = {...productBoData.data.productBO};

    await addtoCart(
      cart,
      order_params.product_msn,
      productData,
      dispatch,
      sessionId,
      token,
      props.navigation,
      Number(order_params.Quantity),
      false,
      true,
      true,
      'true',
      false,
      () => {
        adobeBuyAgainTrackEvent(productData);
        clickStreamBuyAgainEvent(productData);
        webEngageBuyAgainEvent(productData);
      },
    );
    setIsBuyAgainLoading(false);
  };

  const webEngageBuyAgainEvent = productData => {
    let webengageAddBuyObj = {
      Brand: productData.brandDetails && productData.brandDetails.brandName,
      'Category Id':
        productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode,
      'Category Name':
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomy,
      Currency: 'INR',
      Discount:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.discount,
      'Image URL': `https://cdn.moglix.com/${
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn].images &&
        productData.productPartDetails[order_params.product_msn].images[0] &&
        productData.productPartDetails[order_params.product_msn].images[0]
          .links &&
        productData.productPartDetails[order_params.product_msn].images[0].links
          .medium
      }`,
      Price:
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.priceWithoutTax,
      'Product Id': order_params.product_msn,
      'Product Name': productData && productData.productName,
      Quantity: order_params.Quantity || 1,
      'Retail Price':
        productData &&
        productData.productPartDetails &&
        productData.productPartDetails[order_params.product_msn] &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india &&
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.mrp,
    };

    webEngageTracking('addedToCart', webengageAddBuyObj);
  };

  const adobeBuyAgainTrackEvent = productData => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';
    let obj = {
      'myapp.linkpagename': 'moglix:account dashboard-myorders',
      'myapp.ctaname': 'add to cart_BUYAGAIN',
      'myapp.channel': 'orderdetails',
      'myapp.subSection': 'moglix:account dashboard-myorders',
      'myapp.productCategoryL1': taxo1,
      'myapp.productCategoryL2': taxo2,
      'myapp.productCategoryL3': taxo3,
      'myapp.productID': order_params.product_msn,
      'myapp.productPrice': order_params.price_without_tax,
      'myapp.quantity': order_params.Quantity,
      'myapp.brand':
        productData.brandDetails && productData.brandDetails.brandName,
      'myapp.tags': productData.productTags,
      'myapp.parentID': productData.partNumber,
      '&&products':
        ';' +
        productData.partNumber +
        ';' +
        order_params.Quantity +
        ';' +
        productData.productPartDetails[order_params.product_msn]
          .productPriceQuantity.india.sellingPrice *
          order_params.Quantity +
        ';',
      '&&events': 'scAdd,event7',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const getMessage = () => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    console.log(order_params.dates.delivered.date);
    if (
      order_params &&
      order_params.dates &&
      order_params.dates.delivered &&
      order_params.dates.delivered.date
    ) {
      let months = [
        {l: 'Jan', k: 1, nk: '01'},
        {l: 'Feb', k: 2, nk: '02'},
        {l: 'Mar', k: 3, nk: '03'},
        {l: 'Apr', k: 4, nk: '04'},
        {l: 'May', k: 5, nk: '05'},
        {l: 'Jun', k: 6, nk: '06'},
        {l: 'Jul', k: 7, nk: '07'},
        {l: 'Aug', k: 8, nk: '08'},
        {l: 'Sep', k: 9, nk: '09'},
        {l: 'Oct', k: 10, nk: '10'},
        {l: 'Nov', k: 11, nk: '11'},
        {l: 'Dec', k: 12, nk: '12'},
      ];
      let newMonthKey = months.find(
        _ => _.l == order_params.dates.delivered.date.split('-')[1],
      ).nk;

      let deliveryDate = new Date(
        `${order_params.dates.delivered.date.split('-')[2]}-${newMonthKey}-${
          order_params.dates.delivered.date.split('-')[0]
        }`,
      );
      let currentDate = new Date();
      let returnDate = deliveryDate.setDate(deliveryDate.getDate() + 7);
      let differenceInTime =
        new Date(returnDate).getTime() - currentDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      if (differenceInDays > 0) {
        return `Return/Exchange policy valid till ${new Date(
          returnDate,
        ).getDate()}-${monthNames[new Date(returnDate).getMonth()]}-${new Date(
          returnDate,
        ).getFullYear()}`;
      } else {
        return `Deadline for Return/Exchange has ended`;
      }
    } else {
      return ' ';
    }
  };

  const clickStreamBuyAgainEvent = productData => {
    let taxo1 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[0]) ||
      '';
    let taxo2 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[1]) ||
      '';
    let taxo3 =
      (productData &&
        productData.categoryDetails &&
        productData.categoryDetails[0] &&
        productData.categoryDetails[0].taxonomyCode &&
        productData.categoryDetails[0].taxonomyCode.split('/')[2]) ||
      '';

    let dataTracking = {
      event_type: 'click',
      label: 'add_to_cart_buyagain',
      page_type: 'order_details_page',
      channel: 'OrderDetails',
      product_name: productData && productData.productName,
      msn: productData.partNumber,
      price: String(
        productData &&
          productData.productPartDetails &&
          productData.productPartDetails[order_params.product_msn] &&
          productData.productPartDetails[order_params.product_msn]
            .productPriceQuantity &&
          productData.productPartDetails[order_params.product_msn]
            .productPriceQuantity.india &&
          productData.productPartDetails[order_params.product_msn]
            .productPriceQuantity.india.sellingPrice,
      ),
      brand:
        productData &&
        productData.brandDetails &&
        productData.brandDetails.brandName,
      category_l1: taxo1,
      category_l2: taxo2,
      category_l3: taxo3,
      oos: productData.outOfStock,
      quantity: order_params.Quantity || 1,
    };
    sendClickStreamData(dataTracking);
  };

  const getInvoice = () => {
    if (Platform.OS == 'android') {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('granted');
            console.log('Storage Permission Granted.');
            downloadPDF();
          } else {
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }
    } else {
      downloadPDF();
    }
  };

  const downloadPDF = () => {
    //Main function to download the image
    let date = new Date(); //To add the time suffix in filename
    //Image URL which we want to download
    let image_URL = order_params.customer_invoice;
    //Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    //Get config and fs from RNFetchBlob
    //config: To pass the downloading related options
    //fs: To get the directory path in which we want our image to download
    const {config, fs} = RNFetchBlob;
    //let PictureDir = fs.dirs.PictureDir;
    let PictureDir =
      Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/PDF_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'PDF',
      },
    };
    config(options)
      .fetch('GET', image_URL, {'Cache-Control': 'no-store'})
      .then(res => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        Toast.show({
          type: 'success',
          text2: 'Invoice Downloaded',
          visibilityTime: 2000,
          autoHide: true,
        });
        //   text: 'Invoice Downloaded',
        //   position: 'bottom',
        //   type: 'success',
        //   onClose: this.onClose.bind(this),
        //   duration: 3000,
        //   buttonTextStyle: ApplicationStyles.ToastCss.ToastBtn,
        //   textStyle: ApplicationStyles.ToastCss.ToastText,
        //   style: ApplicationStyles.ToastCss.SuccessToastWrap,
        // });
      });
  };

  const getExtention = filename => {
    //To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  return (
    <>
      <Header
        navigation={props.navigation}
        showBack
        showCart
        showWishlist
        showText={`Order No. ${
          order_params.order_id || props.route.params.order.orderId
        }`}
      />
      {order_params.item_id ? (
        <ScrollView>
          <View style={styles.oDeatilsWraper}>
            <View style={styles.orderDeatilsCard}>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.push('Product', {
                    msn: order_params.product_msn,
                  })
                }
                style={styles.prodImageName}>
                <View style={styles.prodInnerImageName}>
                  <Image
                    source={{
                      uri: order_params.productImg,
                    }}
                    style={styles.leftProdImage}
                    resizeMode="contain"
                  />
                  <View style={styles.orderProdName}>
                    <Text numberOfLines={2} style={styles.prodName}>
                      {order_params.product_name}
                    </Text>
                    <View style={styles.orderProdPriceQty}>
                      <Text style={styles.prodPrice}>
                        ₹{order_params.price_without_tax}
                      </Text>
                      <Text style={styles.prodQty}>
                        ({order_params.Quantity} Qty)
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              {/* <View style={styles.orderedReviewWrap}>
              <Text style={styles.orderedReviewHead}>
                It’s time to rate your purchase
              </Text>
              <Text style={styles.orderedText}>
                Please share your valuable feedback for the product.
              </Text>
              <View style={styles.orderedStarCta}>
                <View style={styles.orderedStarLft}>
                  <MaterialCommunityIcon
                    name="star"
                    type="AntDesign"
                    style={styles.orderedStar}
                  />
                  <MaterialCommunityIcon
                    name="star"
                    type="AntDesign"
                    style={styles.orderedStar}
                  />
                  <MaterialCommunityIcon
                    name="star"
                    type="AntDesign"
                    style={styles.orderedStar}
                  />
                  <MaterialCommunityIcon
                    name="star"
                    type="AntDesign"
                    style={styles.orderedStar}
                  />
                  <MaterialCommunityIcon
                    name="star"
                    type="AntDesign"
                    style={styles.orderedStar}
                  />
                </View>
                <TouchableOpacity style={styles.orderedReviewCta}>
                  <Text style={styles.orderedReviewCtaTxt}>WRITE A REVIEW</Text>
                </TouchableOpacity>
              </View>
            </View> */}

              {[
                'DELIVERED',
                'RETURN DONE',
                'RETURN INITIATED',
                'RETURN REQUESTED',
                'RETURN APPROVED',
                'EXCHANGE DONE',
                'EXCHANGE REQUESTED',
                'EXCHANGE APPROVED',
                'RETURN PICKED',
                'EXCHANGE PICKED',
                'EXCHANGE REQUESTED',
                'EXCHANGE INITIATED',
              ].includes(order_params.status) ? null : (
                <View style={styles.orderedTrackCardItem}>
                  {order_params.status == 'CANCELLED' ? (
                    <MaterialCommunityIcon
                      style={styles.cancelledDot}
                      name="close-circle"
                      type="AntDesign"
                      color={colors.RedThemeColor}
                    />
                  ) : (
                    <View style={styles.orderedDot}></View>
                  )}

                  {![
                    'RETURN REJECTED',
                    'EXCHANGE REJECTED',
                    // 'DELIVERED',
                    'RETURN INITIATED',
                    'EXCHANGE INITIATED',
                  ].includes(order_params.status) &&
                  trackStatusdata.firstDateLabel &&
                  trackStatusdata.lastDateLabel ? (
                    <View style={styles.Orderedline}></View>
                  ) : null}
                  <View style={styles.orderedCardTractWrap}>
                    <Text
                      style={[
                        styles.orderedCardTracttext,
                        {
                          color:
                            order_params.status == 'CANCELLED'
                              ? '#D9232D'
                              : Colors.PrimaryTextColor,
                        },
                      ]}>
                      {trackStatusdata.lastDateLabel ||
                        trackStatusdata.firstDateLabel ||
                        'Cancelled'}
                    </Text>
                    <Text style={styles.orderedCardTractDate}>
                      {trackStatusdata.lastDateLabel == 'ETD' ? 'by' : 'on'}{' '}
                      {trackStatusdata.lastDate || trackStatusdata.firstDate}
                    </Text>
                  </View>
                </View>
              )}

              {![
                'RETURN REJECTED',
                'EXCHANGE REJECTED',
                // 'DELIVERED',
                'RETURN INITIATED',
                'PAYMENT FAILED',
                'EXCHANGE INITIATED',
              ].includes(order_params.status) &&
              order_params.requestType != 'cancel' ? (
                <View style={styles.orderedGreentrackCardItem}>
                  {[
                    'DELIVERED',
                    'RETURN DONE',
                    'RETURN INITIATED',
                    'RETURN REQUESTED',
                    'RETURN APPROVED',
                    'EXCHANGE DONE',
                    'EXCHANGE REQUESTED',
                    'EXCHANGE APPROVED',
                    'PAYMENT FAILED',
                    'RETURN PICKED',
                    'EXCHANGE PICKED',
                    'EXCHANGE REQUESTED',
                    'EXCHANGE INITIATED',
                  ].includes(order_params.status) ? null : (
                    <View style={styles.greenline}></View>
                  )}
                  <View style={{justifyContent: 'center'}}>
                    <MaterialCommunityIcon
                      name="check-circle"
                      type="AntDesign"
                      style={styles.orderedCheckdot}
                    />

                    <View style={styles.greenStripWrap}>
                      <View style={styles.greenStripLft}>
                        <Text style={styles.orderedcardTracttextWhite}>
                          {trackStatusdata.firstDateLabel}
                        </Text>
                        {order_params.status == 'PACKED' ? null : (
                          <Text style={styles.orderedCardTractDateWhite}>
                            On {trackStatusdata.firstDate}
                          </Text>
                        )}
                      </View>

                      {[
                        'CANCELLED',
                        'PAYMENT FAILED',
                        'RETURN REJECTED',
                        'EXCHANGE REJECTED',
                        'DELIVERED',
                      ].includes(order_params.status) ? null : (
                        <TouchableOpacity
                          onPress={() => setTracknowModal(true)}
                          style={styles.greenStripRht}>
                          <Text style={styles.orderedcardTracttextWhite}>
                            TRACK ORDER
                          </Text>
                          <Image
                            source={require('../../assets/images/RightArrow.png')}
                            style={styles.orderedRightArrImg}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {order_params &&
                  order_params.status !== 'DELIVERED' &&
                  order_params.status != 'EXCHANGE REQUESTED' &&
                  order_params.status != 'EXCHANGE DONE' &&
                  order_params.status != 'EXCHANGE INITIATED' &&
                  order_params.status != 'EXCHANGE REJECTED' &&
                  order_params.status != 'EXCHANGE APPROVED' &&
                  order_params.status != 'RETURN APPROVED' &&
                  order_params.status != 'RETURN REJECTED' &&
                  order_params.status != 'EXCHANGE REQUESTED' &&
                  order_params.status != 'RETURN REQUESTED' &&
                  order_params.status != 'RETURN PICKED' &&
                  order_params.status != 'EXCHANGE PICKED' &&
                  order_params.status != 'RETURN INITIATED' &&
                  order_params.status != 'RETURN DONE' &&
                  ((order_params.shipment_detail &&
                    order_params.shipment_detail.awb) ||
                    (order_params.shipment_detail &&
                      order_params.shipment_detail.shipper_name)) ? (
                    <View
                      style={{
                        marginHorizontal: Dimension.margin15,
                        // flexDirection: 'row',
                        // alignItems: 'center',
                        // justifyContent: 'space-between',
                      }}>
                      {order_params &&
                      order_params.status !== 'DELIVERED' &&
                      order_params.status != 'EXCHANGE REQUESTED' &&
                      order_params.status != 'EXCHANGE DONE' &&
                      order_params.status != 'EXCHANGE INITIATED' &&
                      order_params.status != 'EXCHANGE REQUESTED' &&
                      order_params.status != 'EXCHANGE REJECTED' &&
                      order_params.status != 'EXCHANGE APPROVED' &&
                      order_params.status != 'RETURN APPROVED' &&
                      order_params.status != 'RETURN REJECTED' &&
                      order_params.status != 'RETURN REQUESTED' &&
                      order_params.status != 'RETURN PICKED' &&
                      order_params.status != 'EXCHANGE PICKED' &&
                      order_params.status != 'RETURN INITIATED' &&
                      order_params.status != 'RETURN DONE' &&
                      order_params.shipment_detail &&
                      order_params.shipment_detail.awb ? (
                        <Text style={styles.cardTractDateWhite}>
                          AWB: {order_params.shipment_detail.awb}
                        </Text>
                      ) : null}
                      {order_params &&
                      order_params.status !== 'DELIVERED' &&
                      order_params.status != 'EXCHANGE REQUESTED' &&
                      order_params.status != 'EXCHANGE DONE' &&
                      order_params.status != 'EXCHANGE INITIATED' &&
                      order_params.status != 'EXCHANGE REJECTED' &&
                      order_params.status != 'EXCHANGE APPROVED' &&
                      order_params.status != 'RETURN APPROVED' &&
                      order_params.status != 'RETURN REJECTED' &&
                      order_params.status != 'EXCHANGE REQUESTED' &&
                      order_params.status != 'RETURN REQUESTED' &&
                      order_params.status != 'RETURN PICKED' &&
                      order_params.status != 'EXCHANGE PICKED' &&
                      order_params.status != 'RETURN INITIATED' &&
                      order_params.status != 'RETURN DONE' &&
                      order_params.shipment_detail &&
                      order_params.shipment_detail.shipper_name ? (
                        <>
                          <Text style={[styles.orderDate, {color: '#fff'}]}>
                            Courier partner :{' '}
                            <Text
                              style={[styles.OrderStatusText, {color: '#fff'}]}>
                              {order_params.shipment_detail.shipper_name}
                            </Text>
                          </Text>
                        </>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* For Shipped Items */}
              {/* {<> <View style={styles.shipped}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.cardTracttextWhite}>Shipped</Text>
                <Text style={styles.cardTractDateWhite}>On 21 Mar</Text>
              </View>
              <Text style={styles.cardTractDateWhite}>
                Delhivery Track ID : GDF4568482
              </Text>
            </View>
            {['CANCELLED', 'DELIVERED', 'PAYMENT FAILED'].includes(
              order_params.status,
            ) ? null : (
              <TouchableOpacity style={styles.tractTextItem}>
                <Text style={styles.tractText}>TRACK ORDER</Text>
                <Image
                  source={require('../../assets/images/RightArrow.png')}
                  style={styles.rightArrImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            </>} */}
              {/* </CardItem> */}
              {/* <View style={[styles.trackCardItem, styles.lasttrackCardItem]}>
              <View style={styles.lastdot}></View>
              <View style={styles.lastline}></View>
              <Text style={styles.cardTracttext}>Ordered</Text>
              <Text style={styles.cardTractDate}>On 20 Mar</Text>
            </View> */}
              {/* Delivered status card */}
              {/* <View style={[styles.trackCardItem, styles.deliveredCardItem]}>
              <Icon name="checkcircle" style={styles.greencheckdot} />
              <View style={styles.delivered}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.cardTracttextgreen}>Delivered</Text>
                  <Text style={styles.cardTractDate}>On 21 Mar</Text>
                </View>
                <Text style={styles.cardTractDate}>Tracking Details</Text>
              </View>
            </View> */}
              {[
                'CANCELLED',
                // 'RETURN REJECTED',
                // 'EXCHANGE REJECTED',
                'RETURN DONE',
                'DELIVERED',
              ].includes(order_params.status) &&
              order_params.requestType != 'return' &&
              order_params.requestType != 'exchange' &&
              order_params.dates &&
              order_params.dates.delivered &&
              order_params.dates.delivered.date ? (
                <TouchableOpacity
                  disabled={buyAgainLoading}
                  onPress={onBuyAgain}
                  style={styles.buyagain}>
                  {buyAgainLoading && (
                    <ActivityIndicator
                      style={{marginRight: 8}}
                      size="small"
                      color="#fff"
                    />
                  )}
                  <Text style={styles.buytext}>BUY AGAIN</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* {order_params.status === 'DELIVERED' &&
              order_params.requestType != 'return' &&
              order_params.requestType != 'exchange' &&
              order_params.dates &&
              order_params.dates.delivered &&
              order_params.dates.delivered.date ? (
                <TouchableOpacity
                  disabled={buyAgainLoading}
                  onPress={onBuyAgain}
                  style={styles.buyagain}>
                  {buyAgainLoading && (
                    <ActivityIndicator
                      style={{marginRight: 8}}
                      size="small"
                      color="#fff"
                    />
                  )}
                  <Text style={styles.buytext}>BUY AGAIN</Text>
                </TouchableOpacity>
              ) : null} */}

            {order_params.customer_invoice &&
            order_params.status == 'DELIVERED' ? (
              <View style={styles.cancelItemCtaWrap}>
                {order_params.customer_invoice &&
                order_params.status == 'DELIVERED' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.GetText}>Get your invoice</Text>
                    <TouchableOpacity onPress={getInvoice}>
                      <Text style={styles.helpCta}>DOWNLOAD</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : null}

            <View style={styles.cancelItemCtaWrap}>
              <View style={styles.leftCtas}>
                {order_params.cancel_active &&
                order_params.status != 'PAYMENT FAILED' ? (
                  <TouchableOpacity
                    style={styles.CnclBtn}
                    onPress={() => setCancelModal(true)}>
                    <Text style={styles.GrayBtnText}>CANCEL ITEM</Text>
                  </TouchableOpacity>
                ) : null}
                {order_params.status == 'DELIVERED' ? (
                  <Text style={styles.GetText}>{getMessage()}</Text>
                ) : null}

                {['SHIPPED', 'PACKED'].includes(order_params.status) ? (
                  <Text style={styles.GetText}>
                    Item can’t be cancelled, You can raise return request after
                    delivery.
                  </Text>
                ) : null}
                {[
                  'CANCELLED',
                  'EXCHANGE REJECTED',
                  'RETURN REJECTED',
                  'PAYMENT FAILED',
                ].includes(order_params.status) ||
                order_params.requestType == 'return' ||
                order_params.requestType == 'exchange' ? (
                  <Text style={styles.GetText}>
                    Get in touch with us in case you face any issues
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ContactScreen');
                }}>
                <Text style={styles.helpCta}>NEED HELP?</Text>
              </TouchableOpacity>
            </View>

            {order_params.status == 'DELIVERED' &&
            order_params.requestType != 'return' &&
            order_params.requestType != 'exchange' &&
            ((order_params.dates &&
              order_params.dates.delivered &&
              order_params.dates.delivered.date &&
              showReturn(order_params.dates.delivered.date) &&
              order_params.show_return_exchange) ||
              (order_params.status === 'DELIVERED' &&
                order_params.requestType != 'return' &&
                order_params.requestType != 'exchange' &&
                order_params.dates &&
                order_params.dates.delivered &&
                order_params.dates.delivered.date &&
                showReturn(order_params.dates.delivered.date) &&
                order_params.show_return_exchange)) ? (
              <View style={styles.cancelItemCtaWrap}>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                    flex: 1,
                  }}>
                  {order_params.status === 'DELIVERED' &&
                  order_params.requestType != 'return' &&
                  order_params.requestType != 'exchange' &&
                  order_params.dates &&
                  order_params.dates.delivered &&
                  order_params.dates.delivered.date &&
                  showReturn(order_params.dates.delivered.date) &&
                  order_params.show_return_exchange ? (
                    <TouchableOpacity
                      style={styles.GrayBtn}
                      onPress={() => setReModal(true)}>
                      <Text style={styles.GrayBtnText}>RETURN</Text>
                    </TouchableOpacity>
                  ) : null}
                  {order_params.status === 'DELIVERED' &&
                  order_params.requestType != 'return' &&
                  order_params.requestType != 'exchange' &&
                  order_params.dates &&
                  order_params.dates.delivered &&
                  order_params.dates.delivered.date &&
                  showReturn(order_params.dates.delivered.date) &&
                  order_params.show_return_exchange ? (
                    <TouchableOpacity
                      style={styles.GrayBtn}
                      onPress={() => setExModal(true)}>
                      <Text style={styles.GrayBtnText}>EXCHANGE</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* {order_params.status === 'DELIVERED' &&
            order_params.requestType != 'return' &&
            order_params.requestType != 'exchange' &&
            order_params.dates &&
            order_params.dates.delivered &&
            order_params.dates.delivered.date &&
            showReturn(order_params.dates.delivered.date) &&
            order_params.show_return_exchange ? (
              <TouchableOpacity
                onPress={() => {
                  setReModal(true);
                }}>
                <Text>RETURN</Text>
              </TouchableOpacity>
            ) : null} */}

            {/* {order_params.status === 'DELIVERED' &&
            order_params.requestType != 'return' &&
            order_params.requestType != 'exchange' &&
            order_params.dates &&
            order_params.dates.delivered &&
            order_params.dates.delivered.date &&
            showReturn(order_params.dates.delivered.date) &&
            order_params.show_return_exchange ? (
              <TouchableOpacity
                onPress={() => {
                  setExModal(true);
                }}>
                <Text>EXCHANGE</Text>
              </TouchableOpacity>
            ) : null} */}

            {/* <View style={styles.hScrollHead}>
              <Text style={styles.hScrollHeadTxt}>
                You Might Be Also Interested In
              </Text>
            </View> */}

            <View style={styles.orderedAddressWrap}>
              <Text style={styles.addressTitle}>Shipping Address</Text>
              <View style={styles.cartCardWrap}>
                {/* <TouchableOpacity style={styles.addressBtn}>
                  <Text style={styles.addressBtnText}>Default</Text>
                </TouchableOpacity> */}
                <View style={styles.addressContent}>
                  <Text style={styles.addressName}>
                    {order_params.address.shipping_address.firstname}
                  </Text>
                  <Text style={styles.addressData}>
                    {order_params.address.shipping_address.address},{' '}
                    {order_params.address.shipping_address.address2}{' '}
                    {order_params.address.shipping_address.city},{' '}
                    {order_params.address.shipping_address.state},{'\n'}
                    {order_params.address.shipping_address.pincode}
                  </Text>
                  <Text style={styles.addressData}>
                    Mobile: {order_params.address.shipping_address.phone}
                  </Text>
                </View>
              </View>
            </View>

            {order_params.address.billing_address ? (
              <View style={styles.orderedAddressWrap}>
                <Text style={styles.addressTitle}>Billing Address</Text>
                <View style={styles.cartCardWrap}>
                  {/* <TouchableOpacity
                    style={styles.addressBtn}
                    onPress={() => onDeliverHere()}>
                    <Text style={styles.addressBtnText}>Default</Text>
                  </TouchableOpacity> */}
                  <View style={styles.addressContent}>
                    <Text style={styles.addressName}>
                      {' '}
                      {order_params.address.billing_address.firstname}
                    </Text>
                    <Text style={styles.addressData}>
                      {order_params.address.billing_address.address},{' '}
                      {order_params.address.billing_address.address2}{' '}
                      {order_params.address.billing_address.city},{' '}
                      {order_params.address.billing_address.state},{'\n'}
                      {order_params.address.billing_address.pincode}
                    </Text>
                    <Text style={styles.addressData}>
                      Mobile: {order_params.address.billing_address.phone}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={[styles.card, styles.paymentWrap]}>
              <View style={styles.payHeadingContainer}>
                <Text style={styles.payHeading}>Payment Mode</Text>
                <Text style={styles.payHeadingRht}>
                  {order_params.payment_type}
                </Text>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amtTextLabel}>Amount</Text>
                <Text style={styles.amtText}>
                  ₹
                  {applyThousandSeparator(
                    order_params.Quantity * order_params.price_without_tax,
                  )}
                </Text>
              </View>
              <View style={[styles.amountRow, styles.noBorder]}>
                <Text style={styles.amtTextLabel}>GST</Text>
                <Text style={styles.amtText}>
                  ₹
                  {applyThousandSeparator(
                    Math.ceil(
                      order_params.Quantity *
                        ((order_params.price_without_tax *
                          order_params.purchase_tax) /
                          100),
                    ),
                  )}
                </Text>
              </View>
              <View style={[styles.amountRow, styles.noBorder]}>
                <Text style={styles.amtTextLabel}>Shipping</Text>
                <Text style={styles.amtText}>
                  ₹{applyThousandSeparator(order_params.shipping_charge)}
                </Text>
              </View>
              <View style={[styles.amountRow, styles.noBorder]}>
                <Text style={styles.amtTextLabel}>Coupon Discount</Text>
                <Text style={(styles.amtText, styles.greenAmtText)}>
                  - ₹{applyThousandSeparator(order_params.discount)}
                </Text>
              </View>
              <View style={styles.totalAmountRow}>
                <Text style={styles.totalAmtTextLabel}>Amount Payable</Text>
                <Text style={styles.totalAmtText}>
                  ₹
                  {applyThousandSeparator(
                    Math.ceil(
                      (order_params.Quantity *
                        (order_params.price_without_tax *
                          order_params.purchase_tax)) /
                        100,
                    ) +
                      order_params.Quantity * order_params.price_without_tax -
                      order_params.discount +
                      order_params.shipping_charge,
                  )}
                </Text>
              </View>
            </View>

            {/* <View style={styles.retPolicyHead}>
              <Text style={styles.retPolicyHeadTxt}>Return Policy</Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('WebView', {
                      title: 'FAQs',
                      url: 'https://www.moglix.com/faq?device=app',
                    })
                  }>
                  <View style={styles.orderedTopCatWrap}>
                    <View style={styles.TopCatImgWrap}>
                      <Image
                        source={require('../../assets/images/Return7.png')}
                        style={styles.TopCatImg}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.twoLineCatName}>
                      <Text style={styles.TopCatName}>Upto 7 days </Text>
                      <Text style={styles.TopCatName}>returnable</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('WebView', {
                      title: 'FAQs',
                      url: 'https://www.moglix.com/faq?device=app',
                    })
                  }>
                  <View style={styles.orderedTopCatWrap}>
                    <View style={styles.TopCatImgWrap}>
                      <Image
                        source={require('../../assets/images/WrongPrd.png')}
                        style={styles.TopCatImg}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.twoLineCatName}>
                      <Text style={styles.TopCatName}>Wrong</Text>
                      <Text style={styles.TopCatName}>Products</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('WebView', {
                      title: 'FAQs',
                      url: 'https://www.moglix.com/faq?device=app',
                    })
                  }>
                  <View style={styles.orderedTopCatWrap}>
                    <View style={styles.TopCatImgWrap}>
                      <Image
                        source={require('../../assets/images/faultyPrd.png')}
                        style={styles.TopCatImg}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.twoLineCatName}>
                      <Text style={styles.TopCatName}>Faulty</Text>
                      <Text style={styles.TopCatName}>Products</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('WebView', {
                      title: 'FAQs',
                      url: 'https://www.moglix.com/faq?device=app',
                    })
                  }>
                  <View style={styles.orderedTopCatWrap}>
                    <View style={styles.TopCatImgWrap}>
                      <Image
                        source={require('../../assets/images/QualityIssue.png')}
                        style={styles.TopCatImg}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.twoLineCatName}>
                      <Text style={styles.TopCatName}>Quality</Text>
                      <Text style={styles.TopCatName}>Issue</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView> */}

            {/* 
          <Text style={{ color: '#000', fontSize: 12 }}>Delivery Address</Text>
          {order_params.address &&
            order_params.address.shipping_address &&
            order_params.address.shipping_address[0] ? (
            <>
              <Text style={{ color: '#000', fontSize: 12 }}>
                {order_params.address.shipping_address[0].firstname}
              </Text>
              <Text style={{ color: '#000', fontSize: 12 }}>
                {order_params.address.shipping_address[0].address}
              </Text>
            </>
          ) : null} */}
            {/* 
          {order_params.address &&
            order_params.address.billing_address &&
            order_params.address.billing_address[0] ? (
            <>
              <Text style={{ color: '#000', fontSize: 12 }}>
                {order_params.address.billing_address[0].firstname}
              </Text>
              <Text style={{ color: '#000', fontSize: 12 }}>
                {order_params.address.billing_address[0].address}
              </Text>
            </>
          ) : null} */}
            {/* <Text style={{ color: '#000', fontSize: 12 }}>Payment Mode</Text>
          <Text style={{ color: '#000', fontSize: 8 }}>
            {order_params.payment_type}
          </Text>

          <Text style={{ color: '#000', fontSize: 12 }}>Amount</Text>
          <Text style={{ color: '#000', fontSize: 8 }}>
            {order_params.price_without_tax}
          </Text>

          <Text style={{ color: '#000', fontSize: 12 }}>Payable Amount</Text>
          <Text style={{ color: '#000', fontSize: 8 }}>
            {order_params.price_without_tax}
          </Text>

          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            {order_params.status == 'CANCELLED'
              ? order_params.status
              : getActiveStatus(order_params)}
          </Text> */}

            {/* <TouchableOpacity>
            <Text style={{ color: 'red', fontSize: 14 }}>NEED HELP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              opacity: ['CANCELLED', 'DELIVERED', 'PAYMENT FAILED'].includes(
                order_params.status,
              )
                ? 0.6
                : 1,
            }}
            disabled={['CANCELLED', 'DELIVERED', 'PAYMENT FAILED'].includes(
              order_params.status,
            )}
            onPress={() => fetchOrderStatus()}>
            <Text style={{ color: 'red', fontSize: 18 }}>TRACK NOW</Text>
          </TouchableOpacity> */}

            {/* {order_params.cancel_active ? (
            <TouchableOpacity onPress={() => setCancelModal(true)}>
              <Text>CANCEL</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.lastedupdatedText}>
              Get in touch with us in{'\n'}case you face any issues
            </Text>
          )} */}
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator
          style={{height: '100%'}}
          color={Colors.RedThemeColor}
          style={styles.activityIndicator}
          size={'large'}
        />
      )}

      {tracknowModal && (
        <Modal
          overlayPointerEvents={'auto'}
          coverScreen={true}
          // style={styles.modalWrap}
          deviceWidth={deviceWidth}
          hasBackdrop={true}
          isVisible={tracknowModal}
          onRequestClose={() => {
            setTracknowModal(false);
          }}>
          <View style={styles.TrackKnowModalWrap}>
            <Header
              navigation={{goBack: () => setTracknowModal(false)}}
              showBack
              showText={`Order No. ${order_params.order_id}`}
              showSubText={`Tracking Details`}
            />
            <View style={styles.trackHeadSection}>
              {/* <Text style={styles.trackHeadSectionTxt}>See all updates</Text> */}
            </View>
            {getStatusModalLeft()}
          </View>
        </Modal>
      )}

      {cancelModal && (
        <Cancel
          cancelModal={cancelModal}
          setCancelModal={setCancelModal}
          order_params={order_params}
          cancelReasons={cancelReasons}
          cancelOrder={cancelOrder}
          navigation={props.navigation}
        />
      )}

      {reSuccessModal && (
        <ReturnExchangeSuccess
          setReModal={setReModal}
          reSuccessModal={reSuccessModal}
          setReSuccessModal={setReSuccessModal}
          navigation={props.navigation}
          userId={userId}
          order_params={order_params}
          fromExchange={false}
        />
      )}

      {exSuccessModal && (
        <ReturnExchangeSuccess
          setExModal={setExModal}
          reSuccessModal={exSuccessModal}
          userId={userId}
          navigation={props.navigation}
          setExSuccessModal={setExSuccessModal}
          order_params={order_params}
          fromExchange
        />
      )}

      {remodal && (
        <ReturnExchange
          remodal={remodal}
          setReModal={setReModal}
          returnReasons={getReturnReasons(order_params.dates.delivered.date)}
          order_params={order_params}
          fromExchange={false}
          toggleModal={toggleModal}
          userId={userId}
          navigation={props.navigation}
          sessionId={sessionId}
          token={token}
        />
      )}
      {exModal && (
        <ReturnExchange
          setReModal={setReModal}
          exModal={exModal}
          setExModal={setExModal}
          userId={userId}
          returnReasons={getReturnReasons(order_params.dates.delivered.date)}
          order_params={order_params}
          navigation={props.navigation}
          fromExchange
          toggleModal={toggleModal}
          sessionId={sessionId}
          token={token}
        />
      )}
    </>
  );
};

export default OrderDetailsScreen;
