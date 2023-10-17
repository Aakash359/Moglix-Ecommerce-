import colors from '.././redux/constants/colors';
import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import socketIO from 'socket.io-client';
import {SOCKET_URL} from '../constants';
import Dimension from '../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const applyThousandSeparator = str => {
  str = str + '';
  let index = str.search(/[1-9]/);
  index = index === -1 ? str.length : index;
  return (
    str.substring(0, index) +
    str
      .substring(index, str.length)
      .replace(/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, '$1,')
  );
};

export const getBrand = shortDesc => {
  if (!shortDesc) {
    return false;
  }
  let desc = shortDesc.split('||');
  desc = desc.find(_ => _.includes('Brand:'));
  desc = (desc && desc.replace('Brand: ', '')) || '';
  return desc;
};

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const addMonths = (input, months) => {
  const date = new Date(input);
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  date.setDate(
    Math.min(
      input.getDate(),
      getDaysInMonth(date.getFullYear(), date.getMonth() + 1),
    ),
  );
  return date;
};

export const DATE_RANGES = [
  {
    title: 'Last 30 days',
    fromDate: addMonths(new Date(), -1),
    toDate: new Date(),
  },
  {
    title: 'Last 6 months',
    fromDate: addMonths(new Date(), -6),
    toDate: new Date(),
  },
  {
    title: new Date().getFullYear(),
    fromDate: new Date(`${new Date().getFullYear()}-01-01`),
    toDate: new Date(),
  },
  {
    title: new Date().getFullYear() - 1,
    fromDate: new Date(`${new Date().getFullYear() - 1}-01-01`),
    toDate: new Date(`${new Date().getFullYear() - 1}-12-31`),
  },
  {
    title: new Date().getFullYear() - 2,
    fromDate: new Date(`${new Date().getFullYear() - 2}-01-01`),
    toDate: new Date(`${new Date().getFullYear() - 2}-12-31`),
  },
  {
    title: new Date().getFullYear() - 3,
    fromDate: new Date(`${new Date().getFullYear() - 3}-01-01`),
    toDate: new Date(`${new Date().getFullYear() - 3}-12-31`),
  },
];

// ...other imports like config file containing Server Url, any secrets, and actions...
// Initialize Socket IO:
let socket = socketIO(SOCKET_URL, {
  transports: ['websocket'],
  forceNew: true,
  jsonp: false,
});

// export the function to connect and use socket IO:
const startSocketIO = () => {
  socket.connect();
  // console.log('====================================');
  // console.log('Socket===>');
  // console.log('====================================');

  socket.on('connect', () => {
    console.log('socket connected');
  });

  socket.on('connect_error', error => {
    console.log(error, 'errorrrrrrrrrrrrrrrrr');
  });

  socket.on('disconnect', () => {
    console.log('connection to server lost.');
  });

  socket.on('newMessage', message => {
    console.log('incoming message ', message);
  });
};

const emit = (data, name) => {
  if (!name) {
    name = 'tracking';
  }
  socket.emit(name, data);
};

export const SocketIO = {
  startSocketIO,
  emit,
};

export const ORDER_STATUSES = [
  {
    title: 'All',
    key: 'all',
  },
  {
    title: 'In-Processing',
    key: 'PROCESSING',
  },
  {
    title: 'Delivered',
    key: 'DELIVERED',
  },
  {
    title: 'Cancelled',
    key: 'CANCELLED',
  },
];

export const toastConfig = {
  view_cart_toast: ({text1, text2, onPress, ...rest}) => (
    <View style={styles.cartTstView}>
      <View style={styles.cartInrView}>
        <Text style={styles.text}>{text2}</Text>
        <TouchableOpacity onPress={onPress} style={styles.cartView}>
          <Text style={styles.text3}>VIEW CART</Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
  success: ({text1, text2, onPress, ...rest}) => (
    <View style={styles.successView}>
      <Text style={styles.successText}>{text2}</Text>
    </View>
  ),
  error: ({text1, text2, onPress, ...rest}) => (
    <View style={styles.errorView}>
      <Text style={styles.errorText}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  closeIcon: {
    fontSize: 22,
  },
  cartTstView: {
    height: 55,
    width: '95%',
    backgroundColor: colors.LightTextColor,
    borderRadius: 5,
  },
  cartView: {
    backgroundColor: colors.lightGrayText,
    height: Dimension.height28,
    width: Dimension.width90,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -Dimension.margin8,
  },
  cartInrView: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: Dimension.margin18,
    justifyContent: 'space-between',
    marginHorizontal: Dimension.margin10,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Dimension.CustomBoldFont,
  },
  text3: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: Dimension.margin18,
    marginLeft: Dimension.margin10,
    fontFamily: Dimension.CustomBoldFont,
  },
  errorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: Dimension.margin18,
    marginLeft: Dimension.margin10,
    fontFamily: Dimension.CustomBoldFont,
  },
  successView: {
    height: 53,
    width: '95%',
    backgroundColor: colors.LightTextColor,
    borderRadius: 5,
  },
  errorView: {
    height: 53,
    width: '95%',
    backgroundColor: colors.error,
    borderRadius: 5,
  },
});
